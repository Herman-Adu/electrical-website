---
title: On-Demand Tool OS — Claude Code Infrastructure Refactor
description: MCP native tool registration, startup token reduction, separation of concerns, repo cleanup
category: playbook
status: active
last-updated: 2026-05-13
---

# On-Demand Tool OS

## Problem Statement

Every new Claude Code session starts at ~22% context usage before the first user message. The root causes are:

1. **MCP tools never register** — `.mcp.json` points `MCP_DOCKER` to a custom REST aggregator. Claude Code sends MCP JSON-RPC (`initialize` → `tools/list`); the aggregator responds to a different format. Handshake fails silently. Every session falls back to `curl` workarounds.
2. **Startup context is bloated** — `additionalDirectories` includes the entire `.claude/` directory, auto-loading archives, rules, and skills metadata that may never be needed.
3. **Per-message overhead** — `orchestrator-enforcement.txt` is `cat`'d into every UserPromptSubmit (~200 tokens/message).
4. **Port conflicts in tests** — Playwright tries to start a second server on port 3000 when dev server is already running.

## Governing Principle

**Load only what the current task needs. Release when done.**

An OS does not load all drivers at boot. This system should not load all tools, rules, and service schemas at session start. On-demand is the policy. Stdio bridges are the mechanism.

---

## Architecture

```
SESSION START
  hook: git status + git log -5       (~8 lines, ~50 tokens)
  mcp:  memory-bridge.mjs (stdio)     (~400 tokens of tool schemas)
  ctx:  CLAUDE.md ~30 lines           (~200 tokens)
  ─────────────────────────────────────────────────────────────
  Total startup: ~3-4% context

FIRST TASK (orchestrator skill)
  → reads task intent
  → triggers targeted memory rehydration (tier 1 or tier 2)
  → loads relevant skill (TDD, frontend-design, qa-sme, etc.)

ON-DEMAND SERVICE (skill invoked)
  github-ops skill   → starts github-official if cold → HTTP call
  playwright-ops     → starts playwright if cold → HTTP call
  obsidian-ops       → starts obsidian if cold → HTTP call
  sequential-ops     → starts sequential-thinking if cold → HTTP call

SESSION END (orchestrator stop)
  → memory sync via mcp__memory__*
  → idle containers auto-stop (no active skill = no keep-alive)
```

---

## Six Deliverables

### D1 — Memory Stdio Bridge

**File:** `.claude/mcp/memory-bridge.mjs`

A Node.js script (~60 lines) that:
- Speaks MCP JSON-RPC to Claude Code via stdin/stdout
- Responds to `initialize` with server info and tool list
- Proxies `tools/call` requests to `http://localhost:3100/memory/tools/call`
- Starts Docker container if unreachable (graceful cold-start)

**Result:** `mcp__memory__*` tools appear natively in the deferred tools list every session. No `ToolSearch` workarounds needed for memory operations.

**`.mcp.json` after:**
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

The `MCP_DOCKER` aggregator entry is removed. `enabledMcpjsonServers` in `settings.json` updated to `["memory", "filesystem", "git"]`.

---

### D2 — On-Demand Service Skills

Three new skills replace direct MCP registration for non-always-on services.

**`github-ops` skill:** Checks if `github-official` container is healthy → starts via `docker compose up --no-deps github-official` if cold → executes the requested GitHub operation via `POST localhost:3100/github/tools/call` → returns structured result.

**`playwright-ops` skill:** Same pattern for `playwright` container. Used by qa-sme agent. Sets `PLAYWRIGHT_REUSE_SERVER=true` if dev server detected on port 3000.

**`obsidian-ops` skill:** Same pattern for `obsidian-vault` container. Used by orchestrator for note sync at session end.

**Container lifecycle:**
- Cold start: ~3-4 seconds (acceptable — happens once per session max)
- Idle timeout: containers not pinged for 10 minutes auto-stop via Docker health check
- The bridge script (D1) does NOT auto-start non-memory containers — that is the skill's responsibility

---

### D3 — Lean CLAUDE.md (Two Files, ~30 Lines Total)

**Root `CLAUDE.md` (~20 lines):**
```markdown
# Nexgen Electrical Innovations
Next.js 16 + React 19, strict TypeScript, Tailwind v4.

## Commands
| pnpm dev | pnpm typecheck | pnpm build | pnpm test |
| pnpm docker:mcp:ready | pnpm docker:mcp:smoke |

## Five Hard Rules
1. Invoke orchestrator skill at the start of every session
2. Build gate before commit: pnpm typecheck && pnpm build
3. Memory: mcp__memory__* only — never write to .md or JSON files
4. React 19 first: useTransition, useActionState, Server Components, no useEffect when React 19 alternative exists
5. Server Components default; "use client" for browser interactivity only

Multi-step forms: docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md
```

**`.claude/CLAUDE.md` (~10 lines):**
```markdown
# Orchestrator Contract
Delegate >50 LOC via Agent(subagent_type="general-purpose").
GitHub ops → github-ops skill | Browser → playwright-ops skill | Notes → obsidian-ops skill
Build gate: pnpm typecheck && pnpm build | Stop at 60% context
Full rules: invoke orchestrator skill
```

**Everything else moves to skills.** Naming conventions, delegation gates, memory policy, frontmatter schema — all become skill content, loaded on-demand.

---

### D4 — Startup Hook v3

**File:** `.claude/hooks/session-start-v3.mjs` (replaces `session-start-v2.mjs`)

```
What it does:
  git log --oneline -5
  git status --short
  Output: branch name + last commit + dirty files (if any)

What it no longer does:
  ✗ memory-rehydrate.mjs (→ orchestrator skill owns this)
  ✗ Docker health check (→ bridge handles its own cold-start)
  ✗ smoke test (→ pnpm docker:mcp:smoke remains as manual command)
  ✗ Playwright bootstrap (→ playwright-ops skill handles this)
```

Output drops from ~200 lines to ~8 lines. The `pnpm startup:new-chat` script is retired; `pnpm docker:mcp:ready` remains as an explicit manual command when needed.

**`settings.json` hook update:**
```json
"SessionStart": [{ "type": "command", "command": "node \".claude/hooks/session-start-v3.mjs\"", "timeout": 5 }]
```

**UserPromptSubmit hooks after:**
```json
"UserPromptSubmit": [
  { "type": "command", "command": "node \".claude/hooks/context-monitor.mjs\"", "timeout": 10 }
]
```
The `cat orchestrator-enforcement.txt` hook is removed entirely.

---

### D5 — Settings and Config Cleanup

**`settings.local.json` permissions:**
Prune from 100+ entries to ~25 essential entries. Retain:
- `mcp__*` permissions (memory, filesystem, git)
- `Bash(pnpm *)` family
- `Bash(git *)`, `Bash(docker compose *)`
- `Bash(curl -s http://localhost:3100/*)` (health checks only)
- `Bash(node .claude/hooks/*)`, `Bash(node scripts/*)`
- Read permissions for project paths

Remove: all one-off session permissions, duplicate patterns, stale path references, Linux paths that don't apply on Windows.

**`additionalDirectories` after:**
```json
"additionalDirectories": [
  "C:\\Users\\herma\\source\\repository\\nexgen-electrical-innovations\\.claude\\skills\\gsap-scrolltrigger",
  "c:\\Users\\herma\\.claude\\memory"
]
```
The `.claude` directory entry is removed. The `.claude/reference/setup` entry is removed. Only the gsap-scrolltrigger skill (used frequently) and the auto-memory system (harness requirement) remain.

**`settings.json`:**
- Remove `orchestrator-enforcement.txt` UserPromptSubmit hook
- Update `enabledMcpjsonServers` to `["memory", "filesystem", "git"]`
- Update SessionStart hook to `session-start-v3.mjs`

---

### D6 — Repo Cleanup

Systematic removal of accumulated test artefacts, stale docs, and misplaced files. Every file reviewed against one question: *is this part of the project, or part of a past session?*

**Root-level screenshots to delete (30+ files):**
All `*.png` files in the project root — these are visual verification screenshots from testing sessions, not project assets.
```
about-*.png  breadcrumb-*.png  buttons-*.png  dark-theme-*.png
emergency-*.png  final-check-*.png  get-quote-*.png  home-*.png
industrial-*.png  light-theme-*.png  navbar-*.png  nexgen-*.png
residential-*.png  test-home-scrolled.png
```

**Root-level stale documents to delete:**
```
emergency-snapshot.md        — session verification artifact
home-page-snapshot.md        — session verification artifact
page-snapshot.md             — session verification artifact
biffa-project-snapshot.md    — stale project snapshot
biffa-full-text.txt          — raw client data file, no longer needed in repo
HANDOFF_SUMMARY.txt          — superseded by Docker memory
PHASE_8_NAVBAR_FIX_TEST_PLAN.md — phase-specific, merged and done
YOUTUBE_TRANSCRIPT_LIMITATION.md — one-off note, belongs in Docker memory if kept
```

**Root-level stale dev files to delete:**
```
bash.exe.stackdump            — Windows crash dump
test-hydration-check.mjs      — one-off test script
spin-test-skills.ts           — one-off test script
```

**`proxy.ts` — DO NOT DELETE.** This is an active Next.js middleware file (IP detection and request enrichment). It belongs in the app layer. Move to `middleware.ts` in root if not already imported, or verify it is used by the Next.js build.

**Malformed directories to delete (path-as-dirname artefacts):**
```
C:Usershermasourcerepositoryelectrical-website__tests__scripts/
C:Usershermasourcerepositorynexgen-electrical-innovationsdocssuperpowersspecs/
```
These were created by a path string being used as a directory name — they contain nothing of value.

**Directories to investigate and clean:**
```
archives/          — contains content/ and diagrams/ subdirs — likely design archives
                     Move to docs/archives/ (cleaner home, still tracked)
brand-assets/      — duplicates public/images/brand-assets/ — verify then remove root copy
context/           — contains brand-voice.md, current-priorities.md, goals.md
                     Used by content-creation skill. Move to docs/context/
.playwright-mcp/   — MCP browser screenshots — add to .gitignore, delete existing files
```

**`AGENTS.md`:** Active Claude Code agent config (`<!-- BEGIN:nextjs-agent-rules -->`). Do NOT delete. With skill-first architecture, audit its contents: rules that duplicate CLAUDE.md → remove; rules unique to agent invocations → migrate to the relevant skill or keep in AGENTS.md.

**Gitignore additions:**
```
*.png (root only — via root-level .gitignore pattern)
playwright-report/
test-results/
coverage/
.playwright-mcp/
*.stackdump
```

**`AGENTS.md`:** Review before delete — this may be a Claude Code agent configuration file. If it contains active agent definitions, migrate to `.claude/agents/`. If it is a stale session handoff, delete.

---

## Token Budget (Before vs After)

| Source | Before | After |
|--------|--------|-------|
| Startup hook output | ~2,000 tokens | ~50 tokens |
| CLAUDE.md (both files) | ~2,500 tokens | ~300 tokens |
| additionalDirectories auto-load | ~4,000 tokens | ~200 tokens |
| MCP tool schemas (all services) | ~3,000 tokens | ~400 tokens (memory only) |
| Per-message enforcement | ~200 tokens/msg | 0 |
| **Session start total** | **~44,000 (22%)** | **~6,000 (3%)** |

---

## Implementation Order

Execute in batches. Validate after each batch before proceeding.

**Batch 1 — MCP Bridge (unblocks tool registration)**
1. Create `.claude/mcp/memory-bridge.mjs`
2. Update `.mcp.json` (remove `MCP_DOCKER`, add `memory`)
3. Update `settings.json` `enabledMcpjsonServers`
4. Validate: restart Claude Code, confirm `mcp__memory__*` appear in deferred tools

**Batch 2 — Startup and Per-Message Cost**
1. Create `.claude/hooks/session-start-v3.mjs`
2. Remove `orchestrator-enforcement.txt` UserPromptSubmit hook from `settings.json`
3. Update `settings.json` SessionStart to use v3
4. Validate: new session starts, context usage ≤ 5%

**Batch 3 — Context Slimming**
1. Rewrite root `CLAUDE.md` to ~20 lines
2. Rewrite `.claude/CLAUDE.md` to ~10 lines
3. Remove `.claude` and `.claude/reference/setup` from `additionalDirectories`
4. Prune `settings.local.json` allow list
5. Validate: pnpm typecheck && pnpm build pass, session context ≤ 4%

**Batch 4 — On-Demand Service Skills**
1. Create `github-ops` skill (container check → HTTP call pattern)
2. Create `playwright-ops` skill (adds `PLAYWRIGHT_REUSE_SERVER=true` logic)
3. Create `obsidian-ops` skill
4. Validate: test each skill against a live task

**Batch 5 — Repo Cleanup**
1. Delete all root `*.png` files
2. Delete stale `.md` and `.txt` files
3. Delete stale dev scripts
4. Delete malformed directory names
5. Investigate and resolve `archives/`, `brand-assets/`, `context/`, `AGENTS.md`
6. Update `.gitignore`
7. Validate: `git status` shows clean, `pnpm typecheck && pnpm build` pass

**Batch 6 — Docker Memory Hygiene**
1. ~~Archive `feat-hub-farnborough-harvey-nichols-content`~~ ✅ done 2026-05-13
2. ~~Archive `plan-harvey-nichols-calcot-content`~~ ✅ done 2026-05-13
3. ~~Archive `feat-the-hub-farnborough-stub`~~ ✅ done 2026-05-13
4. Update `scripts/memory-rehydrate.mjs` — filter entities whose latest lifecycle observation has `status: archived` from the injection block
5. Archive all completed phase feature/plan entities (phases ≤ 8)
6. Archive session entities older than 14 days
7. Update orchestrator skill to mandate immediate archival on merge-to-main
8. Validate: new session rehydration does NOT load archived entities

---

## Validation Criteria

- [ ] `mcp__memory__*` tools appear in deferred tools list on fresh session start
- [ ] Session startup context ≤ 5% on a clean new chat
- [ ] No `ToolSearch` calls needed for memory operations
- [ ] `pnpm typecheck && pnpm build && pnpm test` all pass after every batch
- [ ] `git status` shows clean root (no stale PNGs or snapshot docs)
- [ ] GitHub operations work via `github-ops` skill
- [ ] Playwright E2E tests pass without port 3000 conflict
- [ ] Orchestrator skill successfully triggers memory rehydration on first task
- [ ] Session rehydration skips all archived entities (zero token cost for shipped features)
- [ ] Archiving completed features is a non-negotiable step in every merge-to-main workflow

---

## Port Conflict Fix (Playwright)

Add to `playwright.config.ts`:
```ts
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
}
```

This eliminates the "port already in use" error when running E2E tests with dev server already running.

---

---

### D7 — Docker Memory Hygiene (Completed Feature Archiving)

Completed, live features must be archived in Docker memory so they stop loading into session rehydration. An active feature entity costs tokens every session. An archived one costs zero.

**Policy:** Any feature that is merged to main, confirmed live, and has no open tasks → archive it.

**Immediate archival candidates:**
```
feat-hub-farnborough-*        — live on main, client content complete
feat-harvey-nichols-*         — live on main, client content complete
feat-phase-*                  — any phase-entity for phases ≤ 7 (all shipped)
plan-*                        — any plan entity for completed phases
task-*                        — any task entity with status complete
session-*                     — sessions older than 30 days
```

**Archival process (per entity):**
1. `add_observations` → append `{ "category": "lifecycle", "status": "archived", "reason": "shipped to production", "timestamp": "..." }`
2. Update entity `entityType` tag to include `archived` flag where the memory service supports it
3. Verify `search_nodes("hub-farnborough")` returns the entity but rehydration script skips it (needs `TIER1_ONLY` guard updated to exclude archived entities)

**Rehydration guard update (`scripts/memory-rehydrate.mjs`):**
Filter out entities whose latest observation has `status: "archived"` from the injection block. This means archived features exist in Docker for reference but never burn tokens at session start.

**Ongoing rule (add to orchestrator skill):**
> When a feature is merged and confirmed live: immediately archive its Docker entities and any linked plan/task entities. Do not wait for session end.

---

### D8 — Plan-Sync Skill (Mandatory Final Step of writing-plans)

**Trigger:** `mcp_tool` PostToolUse hook on `Write` matching `docs/superpowers/(specs|plans)/.*\.md` → writes `pending_plan_sync: {filepath}` to Docker project state immediately. Zero scripts.

**Skill responsibilities (invoked as final step of writing-plans, before session returns "done"):**
1. Parse plan file — feature name, batches, tasks, decisions
2. `search_nodes` — check existing entities (idempotent: skip if present)
3. Single `create_entities` call: `feat-{slug}` + `plan-{slug}` + `task-{slug}-b{N}` per batch
4. Single `create_relations` call: full graph (plan `part_of` feat, tasks `part_of` plan, feat `updates` project-state)
5. `obsidian-ops` skill: feature doc + plan doc, cross-linked frontmatter
6. `add_observations` project state: `plan_synced: feat-{slug}` — clears `pending_plan_sync`

**Orchestrator gate:** Before dispatching any implementation agent, confirm `plan_synced` on feature entity. If absent, run plan-sync first. Implementation cannot begin on an unsynced plan.

**Obsidian offline fallback:** Write `pending_obsidian_sync: feat-{slug}` to Docker. Orchestrator retries at next session start when Obsidian comes online.

---

### D9 — Git-Native Lane Management (Replaces config/active-branch.json + config/memory-lanes/)

**Single principle: Docker is the registry. Git branch is the key. Zero config files.**

**Naming convention (deterministic):**
```
main                          → nexgen-electrical-innovations-state
feat/emergency-response       → feat-emergency-response
feat/complex-multi-part       → feat-complex-multi-part
hotfix/1234-description       → hotfix-1234-description
```

**Files deleted:**
```
config/active-branch.json
config/memory-lanes/*.json (47 active files + migration)
scripts/lane-lifecycle.mjs
scripts/load-active-memory-lane.mjs
scripts/memory-lane-staleness-check.mjs
scripts/validate-memory-lanes.mjs
scripts/migration-active-lanes-hydrate.mjs
```

**Files created:**
- `scripts/lane-activate-v2.mjs` (~50 lines): reads `git rev-parse HEAD`, derives entity, health check, `add_observations lane_status:active`, logs to `/tmp/`, never writes config files, always `exit 0`
- `scripts/lane-stop-v2.mjs` (~90 lines): reads branch at runtime, creates session entity, wires relations, Obsidian note — no config file reads or writes
- `scripts/migrate-memory-lanes.mjs` (one-time): for each active manifest, checks `git branch -a`, archives merged branches in Docker, moves manifest to archives/

**GitHub Actions auto-archive** (update `memory-sync.yml`):
```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]
jobs:
  archive:
    if: github.event.pull_request.merged == true
    steps:
      - derive entity: branchToEntity(PR head branch)
      - run: node scripts/memory-lane-merge.mjs $ENTITY_NAME
```

**Concurrent sessions:** Two sessions on same branch → both create session entities with different sequence numbers → both `add_observations` to same feature entity → additive, no conflict.

**Batch 0 (before Batch 1):** Run migration script, validate all active branches have Docker entities, delete config files, reinstall git hooks with v2 scripts.

---

### D10 — Next.js Rendering Decision Skill

Every agent creating a new page invokes `nextjs-pages` skill before writing any code.

**Decision tree:**
```
1. ALL content known at build time, never changes?
   → SSG (default — Server Component, no special config needed)

2. Content updates on a schedule (minutes/hours/days)?
   → ISR: export const revalidate = N  (seconds, at route segment level)

3. Every request needs fresh data? (auth, personalization, search)
   → SSR: export const dynamic = 'force-dynamic'
   NOTE: using cookies(), headers(), or searchParams auto-opts to SSR

4. Page has BOTH static shell AND dynamic sections?
   → PPR: wrap dynamic components in <Suspense fallback={<Skeleton />}>
   REQUIRES: next.config.ts → experimental: { ppr: true }
   CRITICAL: never await dynamic APIs at page root — pass promises DOWN
   to Suspense-wrapped children to preserve the static HTML shell
```

**Commit message gate:** Every new page commit must include rendering strategy in message. Example: `feat: add /services/emergency page (ISR revalidate=3600)`.

---

## Out of Scope

- Security audit (separate initiative, post-OS refactor)
- Lighthouse / performance optimisation (separate initiative)
- Rebuilding the Docker aggregator to speak JSON-RPC (the stdio bridge makes this unnecessary)
