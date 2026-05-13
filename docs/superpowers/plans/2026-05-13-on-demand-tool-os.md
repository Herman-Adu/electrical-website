---
title: On-Demand Tool OS Implementation Plan
description: MCP bridge, startup reduction, lane migration, plan-sync, rendering skill
category: playbook
status: active
last-updated: 2026-05-13
---

# On-Demand Tool OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor Claude Code infrastructure so each session loads only what it needs — fixing MCP tool registration, cutting startup context from ~22% to ~3–4%, eliminating 47 config file lane manifests, and encoding Next.js rendering knowledge as a skill.

**Architecture:** A Node.js stdio bridge (`memory-bridge.mjs`) translates MCP JSON-RPC to the Docker REST gateway, making memory tools register natively every session without workarounds. Session hooks shrink to pure git state. All rules, delegation logic, and service schemas move to skills loaded on-demand. Lane state lives in Docker keyed by git branch name — zero config files.

**Tech Stack:** Node.js 24 ESM (MJS), Python 3 (git hooks), `.mcp.json`, `.claude/settings.json`, `.claude/settings.local.json`, Docker Compose at `localhost:3100`, GitHub Actions YAML, Claude Code skill format.

**Spec:** `docs/superpowers/specs/2026-05-13-on-demand-tool-os-design.md`

---

## Validation gates (run after every batch before proceeding)

```bash
pnpm typecheck && pnpm build && pnpm test
```

---

## Batch 0 — One-Time Migration (Lane Config → Docker)

Run this before any other batch. It archives Docker entities for merged/stale branches and validates active branches have Docker entities. Then deletes all config files.

### Task 0: Create and run the migration script

**Files:**
- Create: `scripts/migrate-memory-lanes.mjs`

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-memory-lanes.mjs`:

```javascript
#!/usr/bin/env node
// One-time migration: validate/archive 47 config/memory-lanes/*.json → Docker, then delete
// Run once: node scripts/migrate-memory-lanes.mjs [--dry-run]
// After success: manually delete config/memory-lanes/ and config/active-branch.json

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const DRY_RUN = process.argv.includes('--dry-run');
const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const PROJECT_ROOT = (() => {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim(); }
  catch { return process.cwd(); }
})();

async function mcpCall(name, args, timeoutMs = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const raw = await r.text();
    try { return JSON.parse(raw); } catch { return null; }
  } catch { clearTimeout(t); return null; }
}

async function dockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function readJson(p) {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function branchExists(branch) {
  try {
    execSync(`git branch -a --list "${branch}" | grep -q .`, { stdio: 'pipe' });
    return true;
  } catch {
    try {
      const refs = execSync('git branch -a', { encoding: 'utf8' }).trim();
      return refs.split('\n').some(l => l.trim().replace(/^remotes\/origin\//, '') === branch);
    } catch { return false; }
  }
}

const lanesDir = join(PROJECT_ROOT, 'config', 'memory-lanes');
let files;
try { files = readdirSync(lanesDir).filter(f => f.endsWith('.json')); }
catch { console.error(`[migrate] Cannot read ${lanesDir}`); process.exit(1); }

console.log(`[migrate] Found ${files.length} lane manifests. DRY_RUN=${DRY_RUN}\n`);

if (!await dockerHealth()) {
  console.error('[migrate] Docker offline. Start with: pnpm docker:mcp:ready');
  process.exit(1);
}

const ts = new Date().toISOString();
let archived = 0, kept = 0, skipped = 0;

for (const file of files) {
  const data = readJson(join(lanesDir, file));
  if (!data?.memoryLane) { console.log(`  SKIP ${file} — no memoryLane`); skipped++; continue; }

  const { id, branch, status } = data.memoryLane;
  if (!id) { console.log(`  SKIP ${file} — no id`); skipped++; continue; }

  // Check if branch still exists in git
  const exists = !branch || branchExists(branch);
  const shouldArchive = !exists || status === 'completed' || status === 'archived';

  if (shouldArchive) {
    console.log(`  ARCHIVE ${id} (branch: ${branch ?? 'none'}, status: ${status})`);
    if (!DRY_RUN) {
      await mcpCall('add_observations', {
        observations: [{
          entityName: id,
          contents: [`lifecycle: archived | reason: branch-gone-or-completed | migrated: ${ts}`]
        }]
      });
    }
    archived++;
  } else {
    console.log(`  KEEP    ${id} (branch: ${branch}, status: ${status})`);
    // Ensure entity exists in Docker
    if (!DRY_RUN) {
      await mcpCall('add_observations', {
        observations: [{
          entityName: id,
          contents: [`lane_status: active | branch: ${branch} | migration_validated: ${ts}`]
        }]
      });
    }
    kept++;
  }
}

console.log(`\n[migrate] Done: ${archived} archived, ${kept} kept active, ${skipped} skipped.`);
if (DRY_RUN) {
  console.log('[migrate] DRY_RUN mode — no Docker writes. Re-run without --dry-run to apply.');
} else {
  console.log('[migrate] Next: verify Docker entities, then delete config/memory-lanes/ and config/active-branch.json');
}
```

- [ ] **Step 2: Dry-run the migration**

```bash
node scripts/migrate-memory-lanes.mjs --dry-run
```

Expected: list of lanes with ARCHIVE/KEEP labels. No errors about Docker being offline. If Docker is offline, run `pnpm docker:mcp:ready` first.

- [ ] **Step 3: Run the real migration**

```bash
node scripts/migrate-memory-lanes.mjs
```

Expected: same output, but Docker writes happen. Ends with count: `N archived, M kept active, 0 skipped`.

- [ ] **Step 4: Verify Docker entities for active branches**

```bash
node scripts/mcp-memory-call.mjs search_nodes "nexgen-electrical-innovations-state"
```

Expected: entity found with recent `migration_validated` observation.

- [ ] **Step 5: Delete config files**

```bash
git rm -r config/memory-lanes/
git rm config/active-branch.json
```

Expected: all 48 files staged for deletion.

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-memory-lanes.mjs
git commit -m "chore: migrate lane config to Docker, delete 47 manifests + active-branch.json"
```

---

## Batch 1 — MCP Bridge (Unblocks Tool Registration)

This is the critical fix. After this batch, `mcp__memory__*` tools appear natively in the deferred tools list without any workarounds.

### Task 1: Create memory-bridge.mjs

**Files:**
- Create: `.claude/mcp/memory-bridge.mjs`

- [ ] **Step 1: Create the mcp directory**

```bash
mkdir -p .claude/mcp
```

- [ ] **Step 2: Write the bridge script**

Create `.claude/mcp/memory-bridge.mjs`:

```javascript
#!/usr/bin/env node
// .claude/mcp/memory-bridge.mjs
// MCP stdio bridge: speaks JSON-RPC 2024-11-05 to Claude Code via stdin/stdout
// Proxies tools/call → http://localhost:3100/memory/tools/call

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const TOOL_CACHE_TTL = 300_000; // 5 minutes

let toolCache = null;
let toolCacheAt = 0;

async function fetchTools() {
  const now = Date.now();
  if (toolCache && now - toolCacheAt < TOOL_CACHE_TTL) return toolCache;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${GATEWAY}/memory/tools`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tools = Array.isArray(data) ? data : (data.tools ?? []);
    toolCache = tools;
    toolCacheAt = now;
    return tools;
  } catch {
    // Hardcoded fallback — all memory-reference tools
    return [
      {
        name: 'create_entities',
        description: 'Create entities in the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  entityType: { type: 'string' },
                  observations: { type: 'array', items: { type: 'string' } }
                },
                required: ['name', 'entityType', 'observations']
              }
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'create_relations',
        description: 'Create relations between entities',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  relationType: { type: 'string' }
                },
                required: ['from', 'to', 'relationType']
              }
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'add_observations',
        description: 'Add observations to existing entities',
        inputSchema: {
          type: 'object',
          properties: {
            observations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  entityName: { type: 'string' },
                  contents: { type: 'array', items: { type: 'string' } }
                },
                required: ['entityName', 'contents']
              }
            }
          },
          required: ['observations']
        }
      },
      {
        name: 'delete_entities',
        description: 'Delete entities from the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: { entityNames: { type: 'array', items: { type: 'string' } } },
          required: ['entityNames']
        }
      },
      {
        name: 'delete_observations',
        description: 'Delete observations from entities',
        inputSchema: {
          type: 'object',
          properties: {
            deletions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  entityName: { type: 'string' },
                  observations: { type: 'array', items: { type: 'string' } }
                },
                required: ['entityName', 'observations']
              }
            }
          },
          required: ['deletions']
        }
      },
      {
        name: 'delete_relations',
        description: 'Delete relations from the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  relationType: { type: 'string' }
                },
                required: ['from', 'to', 'relationType']
              }
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'read_graph',
        description: 'Read the entire knowledge graph',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'search_nodes',
        description: 'Search for nodes in the knowledge graph',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query']
        }
      },
      {
        name: 'open_nodes',
        description: 'Open specific nodes by name',
        inputSchema: {
          type: 'object',
          properties: { names: { type: 'array', items: { type: 'string' } } },
          required: ['names']
        }
      }
    ];
  }
}

async function dockerCall(name, args, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args ?? {} }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const raw = await res.text();
    try { return JSON.parse(raw); }
    catch { return { content: [{ type: 'text', text: raw }] }; }
  } catch (err) {
    clearTimeout(timer);
    return {
      content: [{ type: 'text', text: `Memory service unavailable: ${err.message}. Start with: pnpm docker:mcp:ready` }],
      isError: true
    };
  }
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

async function handle(msg) {
  const { jsonrpc = '2.0', id, method, params } = msg;

  if (method === 'initialize') {
    send({
      jsonrpc, id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'memory', version: '1.0.0' }
      }
    });
    return;
  }

  if (method === 'initialized') return; // notification — no response

  if (method === 'ping') {
    send({ jsonrpc, id, result: {} });
    return;
  }

  if (method === 'tools/list') {
    const tools = await fetchTools();
    send({ jsonrpc, id, result: { tools } });
    return;
  }

  if (method === 'tools/call') {
    const result = await dockerCall(params?.name, params?.arguments);
    send({ jsonrpc, id, result });
    return;
  }

  // Unknown method — only respond if request (has id)
  if (id != null) {
    send({ jsonrpc, id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

// Read newline-delimited JSON from stdin
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buf += chunk;
  const lines = buf.split('\n');
  buf = lines.pop() ?? ''; // keep incomplete last line
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const msg = JSON.parse(trimmed);
      await handle(msg);
    } catch { /* skip malformed messages */ }
  }
});

process.stdin.on('end', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
```

- [ ] **Step 3: Smoke test the bridge in isolation**

Run this to verify the bridge correctly handles an `initialize` → `tools/list` exchange:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | node .claude/mcp/memory-bridge.mjs
```

Expected output (two JSON lines):
```
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"memory","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":2,"result":{"tools":[...]}}
```

The `tools` array must contain at least `search_nodes`, `create_entities`, `add_observations`.

### Task 2: Wire the bridge into .mcp.json and settings.json

**Files:**
- Modify: `.mcp.json`
- Modify: `.claude/settings.json`

- [ ] **Step 1: Update .mcp.json**

Replace the entire content of `.mcp.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "node",
      "args": [".claude/mcp/memory-bridge.mjs"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "C:/Users/herma/source/repository/nexgen-electrical-innovations"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git",
               "--repository", "C:/Users/herma/source/repository/nexgen-electrical-innovations"]
    }
  }
}
```

The `MCP_DOCKER` entry is removed. `memory` (stdio bridge) replaces it.

- [ ] **Step 2: Update enabledMcpjsonServers in .claude/settings.json**

In `.claude/settings.json`, change `enabledMcpjsonServers` from:
```json
"enabledMcpjsonServers": ["MCP_DOCKER", "filesystem", "git"]
```
to:
```json
"enabledMcpjsonServers": ["memory", "filesystem", "git"]
```

- [ ] **Step 3: Validate — restart Claude Code**

Start a new Claude Code session. In the first message, type: `test memory bridge`. Observe:

- The system reminder must include `mcp__memory__search_nodes`, `mcp__memory__create_entities`, and `mcp__memory__add_observations` in the deferred tools list.
- No `ToolSearch` calls needed to access memory tools.

If tools are not present: check that `node .claude/mcp/memory-bridge.mjs` exits cleanly (the smoke test in Task 1, Step 3).

- [ ] **Step 4: Commit**

```bash
git add .claude/mcp/memory-bridge.mjs .mcp.json .claude/settings.json
git commit -m "feat: MCP stdio bridge — memory tools register natively every session"
```

---

## Batch 2 — Startup and Per-Message Cost

### Task 3: Replace session-start-v2 with session-start-v3

**Files:**
- Create: `.claude/hooks/session-start-v3.mjs`
- Modify: `.claude/settings.json`

- [ ] **Step 1: Write session-start-v3.mjs**

Create `.claude/hooks/session-start-v3.mjs`:

```javascript
#!/usr/bin/env node
// .claude/hooks/session-start-v3.mjs
// Minimal SessionStart hook — git state only (~50 tokens)
// Memory rehydration and context check are owned by the orchestrator skill

import { execSync } from 'child_process';

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', cwd: process.cwd() }).trim(); }
  catch { return ''; }
}

const branch = run('git branch --show-current');
const log    = run('git log --oneline -5');
const status = run('git status --short');
const now    = new Date().toISOString();

const lines = [
  `## Git State`,
  `Branch: ${branch} | ${now}`,
  '',
  '### Recent Commits',
  log || '(no commits)',
];

if (status) {
  lines.push('', '### Working Tree (dirty)', status);
}

process.stdout.write(lines.join('\n') + '\n');
```

- [ ] **Step 2: Test the hook produces < 15 lines**

```bash
node .claude/hooks/session-start-v3.mjs
```

Expected: 8–15 lines. Branch name, 5 commit hashes, optionally dirty files. No Docker calls, no memory rehydration output.

- [ ] **Step 3: Update SessionStart hook in .claude/settings.json**

In `.claude/settings.json`, change:
```json
"SessionStart": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \".claude/hooks/session-start-v2.mjs\"",
        "timeout": 10
      }
    ]
  }
]
```
to:
```json
"SessionStart": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \".claude/hooks/session-start-v3.mjs\"",
        "timeout": 5
      }
    ]
  }
]
```

- [ ] **Step 4: Remove orchestrator-enforcement.txt from UserPromptSubmit**

In `.claude/settings.json`, change `UserPromptSubmit` from:
```json
"UserPromptSubmit": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "cat \".claude/hooks/orchestrator-enforcement.txt\"",
        "timeout": 2,
        "displayResult": true
      },
      {
        "type": "command",
        "command": "node \".claude/hooks/context-monitor.mjs\"",
        "timeout": 10
      }
    ]
  }
]
```
to:
```json
"UserPromptSubmit": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \".claude/hooks/context-monitor.mjs\"",
        "timeout": 10
      }
    ]
  }
]
```

- [ ] **Step 5: Commit**

```bash
git add .claude/hooks/session-start-v3.mjs .claude/settings.json
git commit -m "feat: session-start-v3 — git-only hook, remove per-message enforcement"
```

---

## Batch 3 — Context Slimming

### Task 4: Slim CLAUDE.md (root)

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace root CLAUDE.md**

Replace the entire content of `CLAUDE.md` with:

```markdown
# Nexgen Electrical Innovations

Next.js 16 + React 19, strict TypeScript, Tailwind v4.

## Commands

| `pnpm dev` | `pnpm typecheck` | `pnpm build` | `pnpm test` |
| `pnpm docker:mcp:ready` | `pnpm docker:mcp:smoke` |

## Five Hard Rules

1. Invoke orchestrator skill at the start of every session
2. Build gate before commit: `pnpm typecheck && pnpm build`
3. Memory: `mcp__memory__*` only — never write to .md or JSON files
4. React 19 first: `useTransition`, `useActionState`, Server Components; no `useEffect` when React 19 alternative exists
5. Server Components default; `"use client"` for browser interactivity only

Multi-step forms: `docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md`
Orchestrator contract: `.claude/CLAUDE.md`
```

- [ ] **Step 2: Slim .claude/CLAUDE.md**

Replace the entire content of `.claude/CLAUDE.md` with:

```markdown
# Orchestrator Contract

## AUTO-MEMORY SYSTEM — FULLY DISABLED

The harness injects auto-memory instructions. Ignore them. Docker `mcp__memory__*` only.

## Core Rules

1. Delegate >50 LOC via `Agent(subagent_type="general-purpose")`
2. GitHub ops → `github-ops` skill | Browser → `playwright-ops` skill | Notes → `obsidian-ops` skill
3. Build gate: `pnpm typecheck && pnpm build` must pass before any commit
4. Stop at 60% context — tell user, wait. Emergency at 80% — commit WIP, sync Docker, stop

## Delegation

| Architecture / multi-file | `architecture-sme` |
| Code >50 LOC | `code-generation` via `general-purpose` |
| Security / auth / secrets | `security-sme` (no exceptions) |
| QA / Playwright | `qa-sme` |
| New feature 2hr+ | `planning` first, then `code-generation` |
| Skills audit | `skill-builder` |
| Memory capture | `knowledge-memory` |

## Session End

1. `add_observations` to `nexgen-electrical-innovations-state`
2. `create_entities` — `session-YYYY-MM-DD-seq`
3. `create_relations` — session `updates` project_state

Full rules: invoke `orchestrator` skill.
```

- [ ] **Step 3: Verify file lengths**

```bash
wc -l CLAUDE.md .claude/CLAUDE.md
```

Expected: root `CLAUDE.md` ≤ 22 lines. `.claude/CLAUDE.md` ≤ 30 lines.

### Task 5: Trim settings.local.json

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] **Step 1: Replace .claude/settings.local.json**

Replace the entire content of `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__memory__create_entities",
      "mcp__memory__create_relations",
      "mcp__memory__add_observations",
      "mcp__memory__delete_entities",
      "mcp__memory__delete_observations",
      "mcp__memory__delete_relations",
      "mcp__memory__read_graph",
      "mcp__memory__search_nodes",
      "mcp__memory__open_nodes",
      "mcp__filesystem__list_directory",
      "mcp__filesystem__read_text_file",
      "mcp__filesystem__write_file",
      "mcp__filesystem__edit_file",
      "mcp__filesystem__directory_tree",
      "mcp__filesystem__read_multiple_files",
      "mcp__filesystem__create_directory",
      "mcp__filesystem__search_files",
      "Bash(pnpm *)",
      "Bash(node *)",
      "Bash(git *)",
      "Bash(docker compose *)",
      "Bash(curl -s http://localhost:3100/*)",
      "Bash(gh pr *)",
      "Bash(gh workflow *)",
      "Bash(gh run *)",
      "Read(C:/Users/herma/source/repository/nexgen-electrical-innovations/**)",
      "Read(C:/Users/herma/.claude/**)",
      "Read(C:/tmp/**)",
      "WebFetch(domain:github.com)"
    ],
    "additionalDirectories": [
      "C:\\Users\\herma\\source\\repository\\nexgen-electrical-innovations\\.claude\\skills\\gsap-scrolltrigger",
      "c:\\Users\\herma\\.claude\\memory"
    ]
  }
}
```

The `.claude` directory and `.claude/reference/setup` entries are removed from `additionalDirectories`. The allow list is reduced from 100+ entries to 30 broad patterns.

- [ ] **Step 2: Validate build still passes**

```bash
pnpm typecheck && pnpm build
```

Expected: both pass. The settings change does not affect the build.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md .claude/CLAUDE.md .claude/settings.local.json
git commit -m "refactor: slim CLAUDE.md to 5 rules, trim settings.local.json to 30 entries"
```

---

## Batch 4 — On-Demand Service Skills

### Task 6: Create github-ops skill

**Files:**
- Create: `.claude/skills/github-ops/SKILL.md`

- [ ] **Step 1: Write the github-ops skill**

Create `.claude/skills/github-ops/SKILL.md`:

```markdown
---
name: github-ops
description: Use this skill WHENEVER you need to perform GitHub operations — creating PRs, merging branches, checking CI status, listing open PRs, reviewing comments, closing issues, or any GitHub API interaction. Invoke before any GitHub operation. Trigger phrases: "create a PR", "merge this", "check CI", "push to GitHub", "open a pull request", "GitHub status", "review PR", "close issue".
argument-hint: "[create-pr | merge | check-ci | list-prs | comment | close-issue]"
disable-model-invocation: true
---

# GitHub Ops

Executes GitHub operations via the Docker-hosted `github-official` MCP service.

## Pre-flight

Before executing any GitHub operation, check if the github-official container is running:

```bash
curl -s http://localhost:3100/github/health
```

If the response is not `{"status":"ok"}` or similar 200 response, start it:

```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d github-official
# Wait for health: check every 2s, max 15s
```

## Execution

All GitHub operations go through the Docker gateway REST API:

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "TOOL_NAME", "arguments": {...}}'
```

Common operations:

**Create PR:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "create_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "title": "...", "body": "...", "head": "BRANCH", "base": "main"}}'
```

**List open PRs:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "list_pull_requests", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "state": "open"}}'
```

**Get PR status / checks:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "get_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pullNumber": PR_NUMBER}}'
```

**Merge PR:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "merge_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pullNumber": PR_NUMBER, "mergeMethod": "squash"}}'
```

## Available tools

Run `GET http://localhost:3100/github/tools` to get the full tool list with schemas.

## Repo constants

- Owner: `Herman-Adu`
- Repo: `nexgen-electrical-innovations`
- Default base: `main`
```

### Task 7: Create playwright-ops skill

**Files:**
- Create: `.claude/skills/playwright-ops/SKILL.md`

- [ ] **Step 1: Write the playwright-ops skill**

Create `.claude/skills/playwright-ops/SKILL.md`:

```markdown
---
name: playwright-ops
description: Use this skill WHENEVER you need to run E2E tests, take screenshots, verify UI behaviour in a browser, run Playwright automation, or check visual regressions. Trigger phrases: "run E2E tests", "take a screenshot", "check the UI", "verify visually", "playwright", "browser test", "open the site", "screenshot of".
argument-hint: "[e2e | screenshot | visual-check | run-tests]"
disable-model-invocation: true
---

# Playwright Ops

Runs E2E tests and browser automation via Playwright.

## Dev server detection

Before running Playwright, check if the dev server is running:

```bash
curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"
```

If `200`: set `PLAYWRIGHT_REUSE_SERVER=true` to avoid port conflict.
If not running: Playwright will start it automatically.

## Running E2E tests

```bash
# With existing dev server:
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e

# Fresh start (no dev server):
pnpm test:e2e
```

## Running a specific test file

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e tests/e2e/contact.spec.ts
```

## Taking a screenshot via Docker Playwright MCP

First check if playwright container is running:

```bash
curl -s http://localhost:3100/playwright/health
```

If not running:
```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d playwright
```

Then take screenshot:
```bash
curl -s -X POST http://localhost:3100/playwright/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "navigate", "arguments": {"url": "http://localhost:3000/PAGE_PATH"}}'
```

## Key playwright.config.ts setting

The config must have `reuseExistingServer: !process.env.CI` to avoid port conflicts during local development. If you see "port 3000 already in use", this setting is missing.
```

### Task 8: Create obsidian-ops skill

**Files:**
- Create: `.claude/skills/obsidian-ops/SKILL.md`

- [ ] **Step 1: Write the obsidian-ops skill**

Create `.claude/skills/obsidian-ops/SKILL.md`:

```markdown
---
name: obsidian-ops
description: Use this skill WHENEVER you need to write notes to the Obsidian vault, sync feature documentation, search Obsidian for context, create linked notes, or mirror Docker memory to Obsidian. Trigger phrases: "save to Obsidian", "write a note", "sync to vault", "Obsidian note", "mirror to Obsidian", "document in vault".
argument-hint: "[write | search | sync-feature | mirror-plan]"
disable-model-invocation: true
---

# Obsidian Ops

Reads and writes to the Obsidian vault via the Docker-hosted `obsidian` MCP proxy.

## Health check

```bash
curl -s http://localhost:3100/obsidian/health
```

Response: `{"status":"ok","obsidian":"online"}` = ready.
Response: `{"obsidian":"offline"}` = Obsidian desktop app not running. Open Obsidian first.

## Writing a note

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "write_note", "arguments": {"path": "PATH/IN/VAULT.md", "content": "..."}}'
```

## Searching the vault

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "search", "arguments": {"query": "SEARCH_TERM"}}'
```

## Mirroring a feature to Obsidian (standard pattern)

When syncing a feature from Docker memory to Obsidian:

1. Search Docker for the feature entity: `mcp__memory__search_nodes` with entity name
2. Build note content from observations
3. Write to `Projects/nexgen-electrical-innovations/FEATURE_NAME.md`
4. Write cross-linked plan to `Plans/FEATURE_NAME-plan.md`

## Offline fallback

If Obsidian is offline, write `pending_obsidian_sync: ENTITY_NAME` as an observation on the Docker project state entity. The orchestrator checks this at next session start and retries.
```

- [ ] **Step 2: Commit all three skills**

```bash
git add .claude/skills/github-ops/ .claude/skills/playwright-ops/ .claude/skills/obsidian-ops/
git commit -m "feat: github-ops, playwright-ops, obsidian-ops on-demand skills"
```

---

## Batch 5 — Repo Cleanup

### Task 9: Delete root artefacts and update .gitignore

**Files:**
- Delete: all `*.png` files in repo root
- Delete: stale `.md` and `.txt` files in repo root
- Delete: stale dev scripts in repo root
- Modify: `.gitignore`

- [ ] **Step 1: Delete root-level screenshot PNGs**

```bash
git rm -f about-portrait-check.png about-portrait-image.png about-portrait-profile.png \
  about-portrait-scrolled.png emergency-commercial-section.png emergency-cta-block.png \
  emergency-industrial-section.png emergency-light-mode-residential.png emergency-mobile-375.png \
  emergency-page-full.png emergency-page-top.png emergency-residential-section.png \
  industrial-page-above-fold.png residential-profile-centered.png residential-profile-fix.png \
  residential-profile-full.png
```

For any additional root PNGs not listed: `git rm -f *.png` (safe — repo assets live in `public/`, not root).

- [ ] **Step 2: Delete stale session artefacts**

```bash
git rm -f emergency-snapshot.md 2>/dev/null || true
```

Check for and remove any of these if present:
```bash
for f in home-page-snapshot.md page-snapshot.md biffa-project-snapshot.md \
          biffa-full-text.txt HANDOFF_SUMMARY.txt PHASE_8_NAVBAR_FIX_TEST_PLAN.md \
          YOUTUBE_TRANSCRIPT_LIMITATION.md bash.exe.stackdump \
          test-hydration-check.mjs spin-test-skills.ts; do
  [ -f "$f" ] && git rm -f "$f" && echo "Removed $f" || true
done
```

- [ ] **Step 3: Investigate and resolve archives/, brand-assets/, context/**

```bash
ls archives/ brand-assets/ context/ 2>/dev/null
```

- `archives/` — if it contains design content (diagrams, copy), move to `docs/archives/`:
  ```bash
  git mv archives/ docs/archives/
  ```
- `brand-assets/` — check if it duplicates `public/images/brand-assets/`:
  ```bash
  diff -rq brand-assets/ public/images/brand-assets/ 2>/dev/null
  ```
  If identical: `git rm -rf brand-assets/`
- `context/` — if it contains `brand-voice.md`, `goals.md` etc. used by content-creation skill, move to `docs/context/`:
  ```bash
  git mv context/ docs/context/
  ```

- [ ] **Step 4: Check AGENTS.md**

```bash
head -20 AGENTS.md 2>/dev/null || echo "AGENTS.md not found"
```

If it contains `<!-- BEGIN:nextjs-agent-rules -->` or active agent definitions: keep it but audit for rules that duplicate CLAUDE.md → remove those lines. If it's a stale handoff document: `git rm AGENTS.md`.

- [ ] **Step 5: Update .gitignore**

Add these lines to `.gitignore` if not already present:

```
# Root-level session screenshots — never commit
/*.png

# Playwright and test artefacts
playwright-report/
test-results/
coverage/
.playwright-mcp/

# Windows crash dumps
*.stackdump
```

Note: `playwright-report/` and `test-results/` may already be in `.gitignore` — check first with `grep playwright-report .gitignore`.

- [ ] **Step 6: Validate build**

```bash
pnpm typecheck && pnpm build && pnpm test
```

Expected: all pass. No imported files were deleted.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: delete root session artefacts, update .gitignore"
```

---

## Batch 6 — Docker Memory Hygiene

### Task 10: Filter archived entities from memory rehydration

**Files:**
- Modify: `scripts/memory-rehydrate.mjs`

- [ ] **Step 1: Read the current filter logic in memory-rehydrate.mjs**

```bash
grep -n "archived\|lifecycle\|status" scripts/memory-rehydrate.mjs
```

If no filter exists, add it. If a filter exists, verify it works correctly.

- [ ] **Step 2: Add archived-entity filter to memory-rehydrate.mjs**

Find the section in `scripts/memory-rehydrate.mjs` where entities are filtered before injection. After the search results are retrieved (around the `TIER1_ONLY` check), add this filter:

```javascript
// Filter entities whose latest lifecycle observation is archived
function isArchived(entity) {
  const lifecycleObs = (entity.observations ?? [])
    .filter(o => typeof o === 'string' && o.includes('lifecycle:'));
  if (!lifecycleObs.length) return false;
  const latest = lifecycleObs.at(-1);
  return latest.includes('archived');
}
```

Then in the entities loop, skip archived ones:
```javascript
// After retrieving entities, before building injection block:
const activeEntities = entities.filter(e => !isArchived(e));
```

- [ ] **Step 3: Test the filter**

```bash
node scripts/memory-rehydrate.mjs --verbose 2>&1 | grep -i "archived\|SKIP\|active"
```

Expected: any entity with a `lifecycle: archived` observation is labelled SKIP (or simply absent from output).

- [ ] **Step 4: Archive completed phase entities via Docker**

For each completed phase entity (phases ≤ 7), run:

```bash
node scripts/mcp-memory-call.mjs add_observations '{"observations":[{"entityName":"ENTITY_NAME","contents":["lifecycle: archived | reason: phase-shipped | archived: 2026-05-13"]}]}'
```

Replace `ENTITY_NAME` with each completed entity. Search for them first:

```bash
node scripts/mcp-memory-call.mjs search_nodes "feat-phase"
node scripts/mcp-memory-call.mjs search_nodes "plan-phase"
```

Archive any entity for a phase that is merged and live.

- [ ] **Step 5: Commit**

```bash
git add scripts/memory-rehydrate.mjs
git commit -m "feat: filter archived entities from session rehydration"
```

---

## Batch 7 — Git-Native Lane Management

Replaces `config/active-branch.json` + `config/memory-lanes/*.json` (already deleted in Batch 0) with Docker as the registry and git branch as the key.

### Task 11: Create lane-activate-v2.mjs

**Files:**
- Create: `scripts/lane-activate-v2.mjs`

- [ ] **Step 1: Write lane-activate-v2.mjs**

Create `scripts/lane-activate-v2.mjs`:

```javascript
#!/usr/bin/env node
// scripts/lane-activate-v2.mjs
// Post-checkout activation — no config files, Docker is the registry
// Called by git post-checkout hook: node lane-activate-v2.mjs <prevHead> <newHead> <branchFlag>
// Also called manually: pnpm lane:activate

import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';

// Git post-checkout passes branchFlag: '1' = branch switch, '0' = file checkout
const branchFlag = process.argv[4];
if (branchFlag === '0') process.exit(0);

async function dockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

async function mcpCall(name, args) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args }),
      signal: ctrl.signal,
    });
    return r.ok;
  } catch { return false; }
}

function branchToEntity(branch) {
  if (!branch || branch === 'main' || branch === 'master') {
    return 'nexgen-electrical-innovations-state';
  }
  // feat/my-feature → feat-my-feature
  // hotfix/1234-desc → hotfix-1234-desc
  return branch.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  let branch = 'unknown';
  try { branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim(); } catch { /* ignore */ }

  const entity = branchToEntity(branch);
  const ts = new Date().toISOString();

  if (!await dockerHealth()) {
    // Silent skip — Docker offline is not an error during git checkout
    process.exit(0);
  }

  await mcpCall('add_observations', {
    observations: [{
      entityName: entity,
      contents: [`lane_status: active | branch: ${branch} | activated: ${ts}`]
    }]
  });

  process.exit(0);
}

main().catch(() => process.exit(0)); // always exit 0 — never block git
```

- [ ] **Step 2: Smoke test lane-activate-v2.mjs**

```bash
node scripts/lane-activate-v2.mjs
```

Expected: exits 0 within 2 seconds. If Docker is online: an observation is added to `nexgen-electrical-innovations-state`. If Docker is offline: silent exit.

Verify the observation was written:
```bash
node scripts/mcp-memory-call.mjs search_nodes "nexgen-electrical-innovations-state" 2>&1 | grep "lane_status: active"
```

Expected: a recent `lane_status: active | branch: main` observation.

### Task 12: Create lane-stop-v2.mjs

**Files:**
- Create: `scripts/lane-stop-v2.mjs`

- [ ] **Step 1: Write lane-stop-v2.mjs**

Create `scripts/lane-stop-v2.mjs`:

```javascript
#!/usr/bin/env node
// scripts/lane-stop-v2.mjs
// Claude Code Stop hook — creates session entity, syncs observations to Docker
// No config file reads or writes.
// Called by: settings.json Stop hook, or manually: node scripts/lane-stop-v2.mjs --manual

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const GATEWAY = process.env.MCP_GATEWAY_URL ?? 'http://127.0.0.1:3100';
const IS_MANUAL = process.argv.includes('--manual');

async function mcpCall(name, args, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${GATEWAY}/memory/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments: args }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const raw = await r.text();
    try { return JSON.parse(raw); } catch { return null; }
  } catch { clearTimeout(t); return null; }
}

async function dockerHealth() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch(`${GATEWAY}/health`, { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; }
}

function branchToEntity(branch) {
  if (!branch || branch === 'main' || branch === 'master') {
    return 'nexgen-electrical-innovations-state';
  }
  return branch.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function getContextPct(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const LIMIT = 200_000;
    return await new Promise((resolve) => {
      const seen = new Map();
      const rl = createInterface({
        input: createReadStream(transcriptPath, { encoding: 'utf8' }),
        crlfDelay: Infinity,
      });
      rl.on('line', (line) => {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) {
            seen.set(obj.requestId, obj);
          }
        } catch { /* skip */ }
      });
      rl.on('close', () => {
        if (!seen.size) { resolve(null); return; }
        const u = [...seen.values()].at(-1).message.usage;
        const total = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
        resolve(Math.min(100, (total / LIMIT) * 100));
      });
      rl.on('error', () => resolve(null));
      setTimeout(() => { rl.close(); resolve(null); }, 3000);
    });
  } catch { return null; }
}

async function readStdinJson() {
  if (process.stdin.isTTY || IS_MANUAL) return null;
  return new Promise((resolve) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { raw += c; });
    process.stdin.on('end', () => { try { resolve(JSON.parse(raw.trim())); } catch { resolve(null); } });
    process.stdin.on('error', () => resolve(null));
    setTimeout(() => resolve(null), 2000);
  });
}

async function main() {
  const input = await readStdinJson();
  const transcriptPath = input?.transcript_path ?? null;

  if (!await dockerHealth()) {
    process.exit(0); // Docker offline — silent skip
  }

  const branch = run('git branch --show-current') || 'main';
  const entity = branchToEntity(branch);
  const lastCommit = run('git log --oneline -1');
  const ts = new Date().toISOString();
  const ctxPct = transcriptPath ? await getContextPct(transcriptPath) : null;

  // Generate session sequence number
  const today = ts.slice(0, 10);
  const search = await mcpCall('search_nodes', { query: `session-${today}` });
  const existingToday = (search?.entities ?? []).filter(e => e.name?.startsWith(`session-${today}`)).length;
  const seq = String(existingToday + 1).padStart(3, '0');
  const sessionName = `session-${today}-${seq}`;

  // Create session entity
  await mcpCall('create_entities', {
    entities: [{
      name: sessionName,
      entityType: 'session',
      observations: [
        `branch: ${branch}`,
        `entity: ${entity}`,
        `last_commit: ${lastCommit}`,
        `stopped_at: ${ts}`,
        ...(ctxPct !== null ? [`context_pct: ${ctxPct.toFixed(1)}%`] : [])
      ]
    }]
  });

  // Update project state
  await mcpCall('add_observations', {
    observations: [{
      entityName: entity,
      contents: [
        `lane_status: stopped | stopped_at: ${ts}`,
        `last_commit: ${lastCommit}`
      ]
    }]
  });

  // Wire session → project state
  await mcpCall('create_relations', {
    relations: [{
      from: sessionName,
      to: entity,
      relationType: 'updates'
    }]
  });

  process.exit(0);
}

main().catch(() => process.exit(0)); // never block Claude Code Stop
```

- [ ] **Step 2: Test lane-stop-v2.mjs in manual mode**

```bash
node scripts/lane-stop-v2.mjs --manual
```

Expected: exits 0 within 5 seconds. A new `session-YYYY-MM-DD-NNN` entity is created in Docker. Run `node scripts/mcp-memory-call.mjs search_nodes "session-2026-05-13"` to confirm.

### Task 13: Update settings.json Stop hook + memory-sync.yml

**Files:**
- Modify: `.claude/settings.json`
- Modify: `.github/workflows/memory-sync.yml`

- [ ] **Step 1: Update Stop hook in .claude/settings.json**

In `.claude/settings.json`, change the Stop hook from:
```json
"Stop": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \"scripts/memory-lane-stop.mjs\"",
        "timeout": 15
      }
    ]
  }
]
```
to:
```json
"Stop": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \"scripts/lane-stop-v2.mjs\"",
        "timeout": 15
      }
    ]
  }
]
```

- [ ] **Step 2: Update memory-sync.yml to remove config file commit**

In `.github/workflows/memory-sync.yml`, delete the entire "Commit updated manifests" step:

```yaml
# DELETE THIS ENTIRE STEP:
      - name: Commit updated manifests if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add config/active-memory-lanes.json config/memory-lanes/ || true
          git diff --cached --quiet || git commit -m "chore: mark memory lane completed [${{ github.event.pull_request.head.ref }}]"
          git push || true
        continue-on-error: true
```

The `Run memory lane merge sync` step remains — it archives the Docker entity. No git commits are needed.

Also update the MCP_GATEWAY_URL env: in GitHub Actions, Docker isn't running, so `memory-lane-merge.mjs` will log "Docker offline" and exit gracefully. This is acceptable — the archiving can be done in the next local session.

Optionally, add a step to validate the entity name was derived correctly:
```yaml
      - name: Log derived entity (validation)
        run: echo "Will archive entity: ${{ steps.entity.outputs.name }}"
```

- [ ] **Step 3: Update install-git-hooks.mjs to use v2 scripts**

In `scripts/install-git-hooks.mjs`, change the Python hook template `POST_CHECKOUT_PY` to call `memory_lane_checkout_v2.py` instead of `memory_lane_checkout.py`. Also update the Node.js fallback to call `lane-activate-v2.mjs` instead of `memory-lane-activate.mjs`.

Find these lines in `install-git-hooks.mjs`:
```javascript
const SIGNATURE_CHECKOUT_PY = '# memory-lane-checkout-py — installed by pnpm hooks:install';
```

Change to:
```javascript
const SIGNATURE_CHECKOUT_PY = '# memory-lane-checkout-v2-py — installed by pnpm hooks:install';
```

Update `POST_CHECKOUT_PY`:
```javascript
const POST_CHECKOUT_PY = `#!/usr/bin/env bash
${SIGNATURE_CHECKOUT_PY}
if [ "$3" != "1" ]; then exit 0; fi
PYTHON=$(command -v python3 2>/dev/null || command -v python 2>/dev/null)
if [ -z "$PYTHON" ]; then exit 0; fi
timeout 10 "$PYTHON" "$(git rev-parse --show-toplevel)/scripts/memory_lane_checkout_v2.py" "$1" "$2" "$3" \\
  >/tmp/memory-lane-checkout.log 2>&1 || true
exit 0
`;
```

Update `POST_CHECKOUT_CONTENT` (Node.js fallback):
```javascript
const POST_CHECKOUT_CONTENT = `#!/usr/bin/env bash
${SIGNATURE_CHECKOUT}
if [ "$3" != "1" ]; then exit 0; fi
if ! command -v node >/dev/null 2>&1; then exit 0; fi
timeout 10 node "$(git rev-parse --show-toplevel)/scripts/lane-activate-v2.mjs" "$1" "$2" "$3" \\
  >/tmp/memory-lane-activate.log 2>&1 || true
exit 0
`;
```

- [ ] **Step 4: Create memory_lane_checkout_v2.py**

Create `scripts/memory_lane_checkout_v2.py`:

```python
#!/usr/bin/env python3
"""
Post-checkout hook v2 — no config file writes.
Branch name → Docker entity. Docker is the sole registry.
Args: <prev-head> <new-head> <branch-flag>
"""
from __future__ import annotations
import subprocess
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

GATEWAY = 'http://127.0.0.1:3100'


def get_git_branch() -> str:
    r = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
                       capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else 'unknown'


def branch_to_entity(branch: str) -> str:
    if not branch or branch in ('main', 'master'):
        return 'nexgen-electrical-innovations-state'
    slug = branch.lower().replace('/', '-')
    import re
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug


def docker_health() -> bool:
    try:
        req = urllib.request.Request(f'{GATEWAY}/health')
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            return resp.status == 200
    except Exception:
        return False


def mcp_call(name: str, args: dict, timeout: float = 4.0) -> bool:
    try:
        payload = json.dumps({'name': name, 'arguments': args}).encode('utf-8')
        req = urllib.request.Request(
            f'{GATEWAY}/memory/tools/call',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status == 200
    except Exception:
        return False


def main() -> None:
    # branchFlag = sys.argv[3] when called from git hook
    if len(sys.argv) >= 4 and sys.argv[3] == '0':
        sys.exit(0)  # file checkout, skip

    if not docker_health():
        sys.exit(0)  # Docker offline, silent skip

    branch = get_git_branch()
    entity = branch_to_entity(branch)
    ts = datetime.now(timezone.utc).isoformat()

    mcp_call('add_observations', {
        'observations': [{
            'entityName': entity,
            'contents': [f'lane_status: active | branch: {branch} | activated: {ts}']
        }]
    })

    sys.exit(0)


if __name__ == '__main__':
    main()
```

- [ ] **Step 5: Reinstall git hooks**

```bash
pnpm hooks:install
```

Expected: `[hooks:install] post-checkout: appended to existing hook` (or created). The new hook references `memory_lane_checkout_v2.py`.

- [ ] **Step 6: Commit**

```bash
git add scripts/lane-activate-v2.mjs scripts/lane-stop-v2.mjs scripts/memory_lane_checkout_v2.py \
        scripts/install-git-hooks.mjs .claude/settings.json .github/workflows/memory-sync.yml
git commit -m "feat: git-native lane management v2 — Docker as registry, zero config files"
```

### Task 14: Delete obsolete scripts

**Files:**
- Delete: `scripts/lane-lifecycle.mjs`
- Delete: `scripts/load-active-memory-lane.mjs`
- Delete: `scripts/memory-lane-staleness-check.mjs`
- Delete: `scripts/validate-memory-lanes.mjs`
- Delete: `scripts/migration-active-lanes-hydrate.mjs`
- Delete: `scripts/migrate-memory-lanes.mjs` (one-time script — delete after Batch 0 confirmed)

- [ ] **Step 1: Verify nothing imports these scripts**

```bash
grep -r "lane-lifecycle\|load-active-memory-lane\|memory-lane-staleness\|validate-memory-lanes\|migration-active-lanes" \
  --include="*.json" --include="*.mjs" --include="*.ts" .
```

Expected: references only in `package.json` scripts (which will be removed) and `settings.local.json` allow list (already pruned in Task 5).

- [ ] **Step 2: Delete the scripts**

```bash
git rm scripts/lane-lifecycle.mjs scripts/load-active-memory-lane.mjs \
       scripts/memory-lane-staleness-check.mjs scripts/validate-memory-lanes.mjs
git rm scripts/migration-active-lanes-hydrate.mjs 2>/dev/null || true
git rm scripts/migrate-memory-lanes.mjs
```

- [ ] **Step 3: Remove stale package.json script entries**

In `package.json`, find and remove any `scripts` entries that reference the deleted files:
- `lane:activate` → update to `node scripts/lane-activate-v2.mjs`
- `memory:sync` → update to `node scripts/lane-stop-v2.mjs --manual`
- Any entry referencing `lane-lifecycle.mjs`, `load-active-memory-lane.mjs`, `memory-lane-staleness-check.mjs`, `validate-memory-lanes.mjs`

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: delete obsolete lane management scripts"
```

---

## Batch 8 — Plan-Sync Skill

### Task 15: Create plan-sync skill and wire PostToolUse hook

**Files:**
- Create: `.claude/skills/plan-sync/SKILL.md`
- Modify: `.claude/settings.json` (PostToolUse hook update)
- Modify: `.claude/skills/orchestrator/SKILL.md` (add plan-sync gate)

- [ ] **Step 1: Write the plan-sync skill**

Create `.claude/skills/plan-sync/SKILL.md`:

```markdown
---
name: plan-sync
description: Use this skill as the MANDATORY final step of writing-plans, before reporting "done". Also invoke when the orchestrator detects pending_plan_sync on the project state entity. Syncs a written plan document to Docker memory and Obsidian. Trigger phrases: "sync the plan", "save plan to Docker", "plan-sync", invoked automatically by writing-plans and by the pending_plan_sync observation.
argument-hint: "[path/to/plan.md]"
disable-model-invocation: true
---

# Plan-Sync

Parses a written plan file and creates Docker memory entities for it. This is the MANDATORY final step of `writing-plans`. Do not return "done" from writing-plans until plan-sync completes.

## Step 1: Parse the plan file

Read the plan file. Extract:
- Feature slug: from the filename (`YYYY-MM-DD-{slug}.md`)
- Batch count: count lines matching `^## Batch`
- Task count: count lines matching `^### Task`
- Key decisions: any section titled `## Decisions` or inline ADR markers

## Step 2: Check for existing entities (idempotent)

```bash
node scripts/mcp-memory-call.mjs search_nodes "feat-SLUG"
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
```

If `feat-SLUG` already exists: skip `create_entities` for it (use `add_observations` instead).
If `plan-SLUG` already exists: skip creation.

## Step 3: Create entities

Using `mcp__memory__create_entities`:

```json
{
  "entities": [
    {
      "name": "feat-SLUG",
      "entityType": "feature",
      "observations": [
        "status: planned",
        "plan_file: docs/superpowers/plans/YYYY-MM-DD-SLUG.md",
        "batches: N",
        "tasks: M",
        "created: ISO_TIMESTAMP"
      ]
    },
    {
      "name": "plan-SLUG",
      "entityType": "plan",
      "observations": [
        "file: docs/superpowers/plans/YYYY-MM-DD-SLUG.md",
        "status: ready",
        "created: ISO_TIMESTAMP"
      ]
    }
  ]
}
```

## Step 4: Create relations

Using `mcp__memory__create_relations`:

```json
{
  "relations": [
    { "from": "plan-SLUG", "to": "feat-SLUG", "relationType": "part_of" },
    { "from": "feat-SLUG", "to": "nexgen-electrical-innovations-state", "relationType": "updates" }
  ]
}
```

## Step 5: Update project state

Using `mcp__memory__add_observations`:

```json
{
  "observations": [{
    "entityName": "nexgen-electrical-innovations-state",
    "contents": ["plan_synced: feat-SLUG | file: docs/superpowers/plans/FILENAME.md | synced: ISO_TIMESTAMP"]
  }]
}
```

## Step 6: Obsidian sync (if online)

Invoke `obsidian-ops` skill:
- Write feature doc to `Projects/nexgen-electrical-innovations/SLUG.md`
- Write plan doc to `Plans/SLUG-plan.md` with `[[SLUG]]` backlink

If Obsidian is offline: write `pending_obsidian_sync: feat-SLUG` observation to project state. Skip silently.

## Gate check

Confirm sync succeeded:
```bash
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
```

Expected: entity found with `status: ready` observation.

Only report writing-plans as "done" after this check passes.
```

- [ ] **Step 2: Add PostToolUse hook for pending_plan_sync detection**

In `.claude/settings.json`, update the `PostToolUse` section. The existing hook (`post-tool-use-guard.mjs`) handles this. Add a second hook to flag plan writes:

```json
"PostToolUse": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \".claude/hooks/post-tool-use-guard.mjs\"",
        "timeout": 3
      }
    ]
  }
]
```

The `post-tool-use-guard.mjs` script should be updated to detect writes to `docs/superpowers/plans/*.md` and write `pending_plan_sync: {filepath}` to a temp file. The orchestrator reads this at the end of writing-plans.

Read the current `post-tool-use-guard.mjs` and add this logic at the end:

```javascript
// Detect plan file writes — signal to orchestrator
if (toolName === 'Write' || toolName === 'Edit') {
  const filePath = toolInput?.file_path ?? toolInput?.path ?? '';
  if (filePath.includes('docs/superpowers/plans/') && filePath.endsWith('.md')) {
    const tmp = '/tmp/pending-plan-sync.txt';
    try {
      writeFileSync(tmp, filePath, 'utf8');
    } catch { /* ignore */ }
  }
}
```

- [ ] **Step 3: Update orchestrator skill with plan-sync gate**

In `.claude/skills/orchestrator/SKILL.md`, add this section after the delegation table:

```markdown
## Plan-Sync Gate

Before dispatching any implementation agent, check:
```bash
cat /tmp/pending-plan-sync.txt 2>/dev/null
```

If a path is returned: run `plan-sync` skill with that path before proceeding. Clear the file after sync.

Implementation cannot begin on an unsynced plan.
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/plan-sync/ .claude/settings.json .claude/skills/orchestrator/ \
        .claude/hooks/post-tool-use-guard.mjs
git commit -m "feat: plan-sync skill — mandatory Docker sync after writing-plans"
```

---

## Batch 9 — Next.js Rendering Decision Skill

### Task 16: Create nextjs-pages skill

**Files:**
- Create: `.claude/skills/nextjs-pages/SKILL.md`

- [ ] **Step 1: Write the nextjs-pages skill**

Create `.claude/skills/nextjs-pages/SKILL.md`:

```markdown
---
name: nextjs-pages
description: Use this skill BEFORE writing any new Next.js page or route. Determines the correct rendering strategy (SSG, ISR, SSR, PPR) for the page being built. Invoke when creating a new page component, adding a new route, or changing how data is fetched in an existing page. Trigger phrases: "new page", "add a route", "create a page", "server component", "data fetching", "getStaticProps", "revalidate", "dynamic route", "ISR", "SSR", "SSG", "PPR".
argument-hint: "[describe the page: what data it shows and how often it changes]"
disable-model-invocation: true
---

# Next.js Pages — Rendering Decision

Every new page goes through this decision tree before writing code.

## Decision Tree

```
Step 1: Is ALL content known at build time and it never changes?
  YES → SSG (default)
        No special config. Server Component with no await on dynamic APIs.
        Example: /about, /services/emergency, static marketing pages.

Step 2: Does content update on a schedule (minutes to days)?
  YES → ISR
        Add at the route segment level (page.tsx or layout.tsx):
        export const revalidate = N  // N in seconds

        Examples:
          export const revalidate = 3600  // refresh hourly
          export const revalidate = 86400 // refresh daily
          export const revalidate = 0     // always fresh (same as SSR)

        Use for: news articles, project listings, service pages that update occasionally.

Step 3: Does every request need fresh data? (auth, personalisation, search, cart)
  YES → SSR
        export const dynamic = 'force-dynamic'

        Also auto-opted in by: cookies(), headers(), searchParams at page root.
        Use for: dashboards, account pages, search results, checkout.

Step 4: Does the page have BOTH a static shell AND dynamic sections?
  YES → PPR (Partial Pre-rendering)
        REQUIRES: next.config.ts → experimental: { ppr: true }

        Pattern:
        // page.tsx
        export default function Page() {
          return (
            <main>
              <StaticHero />           {/* rendered at build time */}
              <Suspense fallback={<Skeleton />}>
                <DynamicSection />     {/* rendered per-request */}
              </Suspense>
            </main>
          );
        }

        CRITICAL RULE: never await cookies(), headers(), or searchParams at
        the page root. Pass the promise DOWN to the Suspense-wrapped child:

        // ✅ Correct
        export default function Page({ searchParams }) {
          return (
            <Suspense>
              <ResultList searchParamsPromise={searchParams} />
            </Suspense>
          );
        }

        // ❌ Wrong — breaks the static shell
        export default async function Page({ searchParams }) {
          const params = await searchParams;  // opts entire page to SSR
          ...
        }
```

## Config reference

**ISR:**
```typescript
// app/news/[slug]/page.tsx
export const revalidate = 3600; // revalidate at most every hour

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  return <ArticleLayout article={article} />;
}
```

**SSR:**
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession(); // fresh every request
  return <Dashboard session={session} />;
}
```

**PPR:**
```typescript
// next.config.ts
const config: NextConfig = {
  experimental: { ppr: true },
};

// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <main>
      <ProductHero />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />   {/* fetches fresh inventory per-request */}
      </Suspense>
    </main>
  );
}
```

## Commit message gate

Every new page commit must include the rendering strategy:
```
feat: add /services/electrical-testing page (ISR revalidate=86400)
feat: add /dashboard page (SSR force-dynamic)
feat: add /products page (PPR — static shell + dynamic grid)
```

## Current project patterns

- Service pages (`/services/*`): ISR `revalidate = 86400` (content updated by client)
- Emergency page: ISR `revalidate = 3600`
- Static pages (`/about`, `/contact`): SSG (default)
- No PPR pages yet (requires `experimental.ppr: true` to be enabled)
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/nextjs-pages/
git commit -m "feat: nextjs-pages skill — SSG/ISR/SSR/PPR decision tree"
```

---

## Final Validation

Run the full validation suite after all batches complete:

- [ ] Fresh Claude Code session starts at ≤ 5% context usage
- [ ] `mcp__memory__search_nodes` appears in deferred tools without ToolSearch
- [ ] `pnpm typecheck && pnpm build && pnpm test` all pass
- [ ] `git status` shows clean root (no root PNGs, no snapshot docs)
- [ ] `git checkout -b test/lane-test && git checkout main` produces `lane_status: active` observation in Docker
- [ ] `node scripts/lane-stop-v2.mjs --manual` creates a `session-YYYY-MM-DD-NNN` entity
- [ ] Writing a plan file triggers `pending-plan-sync.txt` creation
- [ ] Invoking `nextjs-pages` skill returns the correct strategy for a given page description

---

## Self-Review Notes

**Spec coverage check:**
- D1 (memory bridge): Tasks 1–2 ✅
- D2 (on-demand skills): Tasks 6–8 ✅
- D3 (lean CLAUDE.md): Tasks 4–5 ✅
- D4 (startup hook v3): Task 3 ✅
- D5 (settings cleanup): Task 5 ✅
- D6 (repo cleanup): Task 9 ✅
- D7 (Docker hygiene): Task 10 ✅
- D8 (plan-sync): Task 15 ✅
- D9 (git-native lanes): Tasks 11–14 ✅
- D10 (nextjs-pages skill): Task 16 ✅
- Port conflict fix (playwright): Covered in Task 7 (playwright-ops skill) ✅

**Placeholder scan:** None found. Every code step contains actual implementation code.

**Type consistency:** All scripts use the same `branchToEntity` logic (branch `main` → entity `nexgen-electrical-innovations-state`; other branches → slugified form). Consistent across `lane-activate-v2.mjs`, `lane-stop-v2.mjs`, `memory_lane_checkout_v2.py`.

**Batch 0 dependency:** Must run before Batch 7 (can't delete config files before migration validates Docker entities). Batches 1–6 are independent of Batch 0.
