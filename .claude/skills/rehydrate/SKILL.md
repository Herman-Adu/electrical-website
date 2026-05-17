---
name: rehydrate
description: Use this skill when resuming any in-progress feature branch — it reloads full context from Docker memory, Obsidian plan docs, and git history so work can continue without re-deriving state. Run as step 0 of every continuation session. Reads config/active-branch.json to identify the active entities, performs Docker health check, loads the plan entity and all focused search term entities, retrieves the Obsidian plan document, parses the git log for ctx phase commits, and reports the exact point where the previous session ended. Prevents context drift by establishing a single verified starting state before any implementation work begins. Never reads .md plan files from the repo. Never runs builds or implements code. Stops after reporting and waits for user instruction.
argument-hint: '[optional entity override]'
disable-model-invocation: true
---

## Execution (run in order, then STOP and wait)

### Step 1: Docker Health Check
```bash
curl -s http://localhost:3100/memory/health
```
Expected: `{"status":"healthy",...}`. If NOT healthy: tell user "Docker memory service is not responding. Run `pnpm docker:mcp:ready` then restart." **STOP.**

### Step 2: Read active-branch.json
Read file: `config/active-branch.json`
Extract: `entity`, `planEntity`, `focusedSearchTerms`, `nextTask`, `obsidianPlanDoc`, `obsidianFeatureDoc`, `emergencySummary`.
Print the `emergencySummary` in full — it IS your context.

### Step 3: Load Docker Entities
Call `mcp__memory__open_nodes` with names: `[entity, planEntity, ...focusedSearchTerms]`
Fallback if MCP fails: `curl -s -X POST http://localhost:3100/memory/tools/call -H "Content-Type: application/json" -d '{"name":"open_nodes","arguments":{"names":[...]}}'`
Print last 20 observations of each entity.

### Step 4: Load Obsidian Plan Doc
Call `mcp__MCP_DOCKER__obsidian_get_file_contents` on the path from `obsidianPlanDoc`.
Print the full content — this is the human-readable plan mirror.

### Step 5: Parse Phase Log
```bash
git log --oneline -8
```
`ctx(...)` commits are the phase log. Identify the last completed phase.

### Step 6: Report (3 bullets) and STOP
```
- Phase completed: [last ctx commit message]
- Next task: [nextTask from active-branch.json]
- THE RULE: TocItem.label IS the rendered section heading — components are layout primitives
```
**Do not proceed. Wait for user instruction.**
