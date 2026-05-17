---
name: docker-preflight
description: Use when starting any session, resuming work, or checking current project status. Also invoke when the user asks "where were we", "what's the status", "what phase are we in", "check branch", "load context", "what were we doing", or types "session start". Invoke before any implementation work begins — reads Docker memory directly to confirm the service is live and returns branch, phase, and next-task status from the knowledge graph. Do not substitute git log or memory injection for this skill. Works without arguments.
argument-hint: "[none required]"
disable-model-invocation: true
---

# Docker Preflight

## What this does

Calls the Docker memory-reference service **live** via `curl http://localhost:3100` to read project state and report session status. Does NOT rely on any injected block from the session hook — it always goes to the source of truth directly.

## Steps (run in order, then STOP)

### Step 1: Health check

```bash
curl -s http://localhost:3100/memory/health
```

Expected response: `{"status":"healthy","service":"memory-reference",...}`

> **If health check fails or returns non-200:** Stop immediately. Tell the user:
> "Docker memory service is not responding at localhost:3100. Run `pnpm docker:mcp:ready` to start Docker, then restart the session."
> Do not proceed. Do not try alternative tools.

### Step 2: Read project state

Use `open_nodes` piped through python to extract the last 10 observations only.
- `search_nodes` returns 150K+ chars (full graph) — never use it for this
- `open_nodes` raw also returns 100K+ (entity has hundreds of historical obs) — pipe it
- Last 10 observations = current state; all prior = historical noise

```bash
curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"open_nodes","arguments":{"names":["nexgen-electrical-innovations-state"]}}' | \
  python3 -c "
import json, sys
raw = json.load(sys.stdin)
obs = json.loads(raw['content'][0]['text'])['entities'][0]['observations']
for o in obs[-10:]:
    print(o)
"
```

This returns the 10 most recent observations from `nexgen-electrical-innovations-state`.

### Step 3: Extract these fields from the response

| Field | Look for in observations |
|-------|--------------------------|
| Active branch | `"Branch: ..."` observation |
| Active phase | `"Active phase: ..."` observation |
| Build status | `"Build status: ..."` observation |
| Next tasks | `"Next tasks: ..."` observation |
| Active lane | `"lane_status: ..."` or `"Active lane: ..."` |

> **If entity not found or observations empty:** Tell the user:
> "Project state entity not found in Docker memory. Run `pnpm docker:mcp:smoke` to verify services, then check if `nexgen-electrical-innovations-state` entity exists."
> Do not invent status — report exactly what was returned.

### Step 4: Report — exactly 3 bullets, then STOP

```
- **Branch:** [current branch] | Docker: healthy | Lane: [active lane or "none"]
- **Phase:** [active phase] | Build: [build status]
- **Next:** [top next task]
```

**Do not proceed further. Wait for user instruction.**

Follows the fail-fast rule in `.claude/rules/mcp-invocation.md`: one call per step, stop on failure, no retries with alternative namespaces. Never read an injected `## Session Memory` block — the v3 hook does not write one.
