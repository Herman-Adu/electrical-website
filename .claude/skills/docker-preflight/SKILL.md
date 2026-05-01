---
name: docker-preflight
description: Use at EVERY session start to validate Docker health, confirm memory rehydration, check lane/branch state, and deliver the 3-bullet status report. Reads from the injected ## Session Memory block — never re-runs Docker commands. Invoked by orchestrator as its FIRST action. Also invoke when the user asks about current state without starting a full orchestrator session. Trigger on: session start, /orchestrator, "what's the status", "load context", "check branch", "where were we", "resume work", "are we on the right branch", "what phase are we in".
argument-hint: "[none required]"
disable-model-invocation: true
---

# Docker Preflight

## What this does

Reads the `## Session Memory` block already injected by the `SessionStart` hook
(`session-start-v2.mjs` → `memory-rehydrate.mjs`). Reports status. Does NOT
execute bash commands or call Docker APIs — the hook already ran them.

## Steps (run in order, then STOP)

### Step 1: Locate the injected block

Find `## Session Memory` in the current session context (it appears in a
`<system-reminder>` block at session start). It has this structure:

> **If the block is not present:** Tell the user: "Session Memory block not found —
> the SessionStart hook may not have run. Run `pnpm docker:mcp:ready` to start
> Docker, then restart the session." Do not proceed further.

```
## Session Memory — YYYY-MM-DD [NNN tokens]

> Branch: <branch> | Lane: <entity> | Docker: online|OFFLINE
> [optional: WARNING: Branch mismatch — ...]

### Project State
...

### Active Lane (<entity>)
...
```

### Step 2: Extract these fields

| Field | Location |
|-------|----------|
| Current branch | `> Branch:` line |
| Lane entity | `> Lane:` line |
| Docker status | `> Docker:` field (online / OFFLINE) |
| Active phase | `### Project State` — look for `Active phase:` observation |
| Build status | `### Project State` — look for `Build status:` observation |
| Next tasks | `### Project State` — look for `Next tasks:` observation |
| Lane status | `### Active Lane` — look for `lane_status:` observation |

### Step 3: Validate

Check for these alert conditions in the injected block:

- `WARNING: Branch mismatch` → tell user: "Run `pnpm lane:activate` to correct the lane."
- `Docker: OFFLINE` → tell user: "Run `pnpm docker:mcp:ready` to restore Docker."
- `lane_status: paused` → tell user: "Run `pnpm lane:activate` to resume lane."

### Step 4: Report — exactly 3 bullets, then STOP

```
- **Branch:** [branch name] | Lane: [entity] ([lane_status])
- **Phase:** [active phase] | Build: [build status]
- **Next:** [top next task from Project State]
```

**Do not proceed. Do not run git commands. Do not run Docker commands.
Wait for user instruction.**
