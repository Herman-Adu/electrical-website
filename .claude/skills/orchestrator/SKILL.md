---
name: orchestrator
description: Use at the start of EVERY new session to load project state, report status, and await instruction. Also invoke when: starting a new feature, returning from a break, resuming work from a different machine. This skill IS the session startup — never paste a large prompt, just run /orchestrator. Triggers: "start session", "new session", "what were we doing", "resume work", "where were we", "what's the status", "load project state".
argument-hint: "[optional: feature name or context to focus on]"
disable-model-invocation: true
---

# Orchestrator — Session Startup & Delegation

## Execution (run in order, then STOP)

### Step 1: Session Startup
Invoke the `docker-preflight` skill. It calls Docker memory live via curl and reports
the 3-bullet status (branch, phase, next tasks). **Do not execute any Docker or git
commands here — docker-preflight handles it.**

### Step 2: Git State
```bash
git log --oneline -5
git status
```

### Step 3: Report and STOP
Report to user — git state summary (docker-preflight already reported next tasks):
- **Branch:** [branch name] | Last commit: [hash] [message]
- **Build:** [passing/failing] | Tests: [N/N passing]

**Do not proceed. Wait for user instruction.**

---

## Orchestrator Rules (always active after startup)

**Never implement code directly** (>50 LOC). Always delegate:
```
Agent(subagent_type="general-purpose", prompt="[full context + task]")
```
The general-purpose agent spawns specialised sub-agents (architecture-sme, code-generation, security-sme, qa-sme, planning).

**MCP first — always:**
| Task | Primary tool | Fallback | Never |
|------|-------------|---------|-------|
| GitHub PRs, merges, CI | `mcp__MCP_DOCKER__github_official__*` | — | `gh` CLI |
| Session memory read/write | `mcp__memory__*` | `curl localhost:3100/memory/tools/call` | `.md` files, `mcp__MCP_DOCKER__memory_reference__*` (does not exist) |
| Browser testing | `mcp__MCP_DOCKER__playwright__*` | — | Manual, set `PLAYWRIGHT_REUSE_SERVER=true` |
| Obsidian notes | `mcp__MCP_DOCKER__obsidian_*` | `curl localhost:3100/obsidian/tools/call` | `.md` files in vault root |

**If any `mcp__memory__*` call returns an error:** go immediately to the curl fallback — do not retry with a different MCP namespace. Report the error to user if curl also fails.

**Port map — never confuse these:**
- `localhost:3100` — Caddy gateway to all Docker MCP services
- `localhost:3000` — Next.js dev server (no MCP services here)

**Context limit:**
- At 60%: Stop. Tell user. Wait for decision.
- At 80%: Emergency — commit WIP, sync Docker memory, then stop.

**Session end (always) — invoke `knowledge-memory` skill:**
1. `mcp__memory__add_observations` to `nexgen-electrical-innovations-state` — branch, build, next tasks
2. `mcp__memory__create_entities` — `session-YYYY-MM-DD-seq` entity
3. `mcp__memory__create_relations` — session `updates` project_state
4. If any `mcp__memory__*` call fails: use `curl localhost:3100/memory/tools/call` immediately — do not try other namespaces

---

## Code Standards (enforced for all dispatched sub-agents)

Every agent prompt dispatched via `Agent(subagent_type=...)` **must** include these constraints:

**React 19 + Next.js 16:**
- Use React 19 features first: `useTransition`, `useOptimistic`, `useActionState`, `useFormStatus`, `use()`, Server Components, Server Actions, Suspense, Error Boundaries, PPR, ISR
- Never use `useEffect` when a React 19 alternative exists — add comment if truly required
- Default to Server Components; `"use client"` only for browser interactivity

**Superpowers mandatory:**
- All code generation uses: brainstorm → plan (TDD) → execute → verify
- Tests written before implementation

**Verification gate before reporting done:**
```bash
pnpm typecheck && pnpm build && pnpm test
```

---

## Delegation Reference

| Need | Agent type |
|------|-----------|
| Architecture / component design | `architecture-sme` |
| Code (>50 LOC) | `code-generation` via general-purpose |
| Security / auth | `security-sme` |
| QA / E2E testing | `qa-sme` |
| Planning (2hr+ features) | `planning` first, then `code-generation` |
| Skills audit | `skill-builder` |
| Docker memory capture | `knowledge-memory` |

## Plan-Sync Gate

Before dispatching any implementation agent, check:
```bash
cat C:\tmp\pending-plan-sync.txt 2>/dev/null || cat /tmp/pending-plan-sync.txt 2>/dev/null
```

If a path is returned: run `plan-sync` skill with that path before proceeding. Clear the file after sync:
```bash
rm C:\tmp\pending-plan-sync.txt 2>/dev/null; rm /tmp/pending-plan-sync.txt 2>/dev/null
```

Implementation cannot begin on an unsynced plan.
