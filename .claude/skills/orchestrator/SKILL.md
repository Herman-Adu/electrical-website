---
name: orchestrator
description: Use at the start of EVERY new session to load project state, report status, and await instruction. Also invoke when: starting a new feature, returning from a break, resuming work from a different machine. This skill IS the session startup — never paste a large prompt, just run /orchestrator. Triggers: "start session", "new session", "what were we doing", "resume work", "where were we", "what's the status", "load project state".
argument-hint: "[optional: feature name or context to focus on]"
disable-model-invocation: true
---

# Orchestrator — Session Startup & Delegation

## Execution (run in order, then STOP)

### Step 1: Session Startup
Invoke the `docker-preflight` skill. It reads the already-injected `## Session Memory`
context — delivered by `session-start-v2.mjs` at session start — and reports the
3-bullet status. **Do not execute any Docker or git commands here.**

### Step 2: Git State
```bash
git log --oneline -5
git status
```

### Step 3: Report and STOP
Report to user — exactly 3 bullets, then stop:
- **Branch:** [branch name] | Last commit: [hash] [message]
- **Build:** [passing/failing] | Tests: [N/N passing]
- **Next:** [top task from Docker state or git history]

**Do not proceed. Wait for user instruction.**

---

## Orchestrator Rules (always active after startup)

**Never implement code directly** (>50 LOC). Always delegate:
```
Agent(subagent_type="general-purpose", prompt="[full context + task]")
```
The general-purpose agent spawns specialised sub-agents (architecture-sme, code-generation, security-sme, qa-sme, planning).

**MCP first — always:**
| Task | Use | Not |
|------|-----|-----|
| GitHub PRs, merges, CI | `mcp__MCP_DOCKER__github_official__*` | `gh` CLI |
| Session memory | `mcp__MCP_DOCKER__memory_reference__*` | .md files |
| Browser testing | `mcp__MCP_DOCKER__playwright__*` with `PLAYWRIGHT_REUSE_SERVER=true` | Manual |

**Context limit:**
- At 60%: Stop. Tell user. Wait for decision.
- At 80%: Emergency — commit WIP, sync Docker memory, then stop.

**Session end (always):**
1. `add_observations` to `electrical-website-state` — branch, build, next tasks
2. `create_entities` — `session-YYYY-MM-DD-seq` entity
3. `create_relations` — session `updates` project_state

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
