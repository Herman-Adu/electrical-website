# Docker Preflight Skill

Session startup health check: reads the injected `## Session Memory` block and reports branch, lane, phase, and next task in exactly 3 bullets. Invoked by the orchestrator as its very first action — executes zero bash or Docker commands.

## When to Use

This skill runs automatically as the FIRST action of the `orchestrator` skill at every session start. Also invoke it directly when:
- The user asks "what's the status?" or "where were we?"
- Resuming work after a break
- Checking current branch and phase without starting a full orchestrator session
- Verifying Docker memory rehydration succeeded

**Trigger phrases:**
- "What's the status?"
- "Load context"
- "Check branch"
- "Where were we?"
- "Resume work"
- "Are we on the right branch?"
- "What phase are we in?"
- `/docker-preflight` (or invoked by `/orchestrator`)

## How It Works

```
1. Find the ## Session Memory block in the current context (injected by SessionStart hook)
2. Extract: branch, lane entity, Docker status, active phase, build status, next tasks
3. Validate for alert conditions (branch mismatch, Docker offline, lane paused)
4. Report exactly 3 bullets, then STOP
```

This skill does NOT run bash commands. It does NOT call Docker APIs. The SessionStart hook (`session-start-v2.mjs`) already ran those — this skill just reads and reports.

## The 3-Bullet Report

```
- **Branch:** [branch name] | Lane: [entity] ([lane_status])
- **Phase:** [active phase] | Build: [build status]
- **Next:** [top next task from Project State]
```

After reporting, the skill stops and waits for user instruction.

## Session Memory Block Structure

The `## Session Memory` block is injected by `session-start-v2.mjs` → `memory-rehydrate.mjs` and appears in the session context as:

```
## Session Memory — YYYY-MM-DD [NNN tokens]

> Branch: <branch> | Lane: <entity> | Docker: online|OFFLINE
> [optional: WARNING: Branch mismatch — ...]

### Project State
...

### Active Lane (<entity>)
...
```

## Alert Conditions

| Condition | Message |
|-----------|---------|
| `WARNING: Branch mismatch` | "Run `pnpm lane:activate` to correct the lane." |
| `Docker: OFFLINE` | "Run `pnpm docker:mcp:ready` to restore Docker." |
| `lane_status: paused` | "Run `pnpm lane:activate` to resume lane." |

## What to Do If Session Memory Block Is Missing

If the `## Session Memory` block is not found in the current context:

> "Session Memory block not found — the SessionStart hook may not have run. Run `pnpm docker:mcp:ready` to start Docker, then restart the session."

Do not proceed. Do not run git commands. Wait for user.

## Usage Examples

### Example 1: Normal Session Start

Session memory block present and healthy:

```
- **Branch:** feat/emergency-hero-copy | Lane: feat-emergency-hero-copy (active)
- **Phase:** Phase 5 — Emergency Page | Build: passing
- **Next:** Implement hero headline A/B variant component
```

### Example 2: Branch Mismatch Alert

```
- **Branch:** main | Lane: feat-emergency-hero-copy (active)
  WARNING: Branch mismatch — current branch is main, lane expects feat/emergency-hero-copy.
  Run `pnpm lane:activate` to correct the lane.
- **Phase:** Phase 5 — Emergency Page | Build: passing
- **Next:** Implement hero headline A/B variant component
```

### Example 3: Docker Offline

```
- **Branch:** feat/emergency-hero-copy | Lane: feat-emergency-hero-copy (unknown — Docker OFFLINE)
  Run `pnpm docker:mcp:ready` to restore Docker.
- **Phase:** unknown | Build: unknown
- **Next:** unknown
```

## Integration

- **Invoked by:** `orchestrator` skill (first action, every session), user directly for quick status
- **Source of data:** `## Session Memory` block injected by `session-start-v2.mjs`
- **After this skill:** Orchestrator runs git state check and waits for user instruction

## Why Zero Commands?

The hook already ran Docker queries, memory rehydration, and branch validation before the session started. Re-running those commands wastes ~50 tokens and adds 5–10 seconds to session startup. This skill reads the result, not the source.

## Related Files

- **SKILL.md:** `.claude/skills/docker-preflight/SKILL.md` — full extraction logic and field locations
- **Hook:** `session-start-v2.mjs` — injects the `## Session Memory` block before preflight runs
- **Related skill:** `orchestrator` — runs docker-preflight as its Step 1
- **Related skill:** `session-lifecycle` — manual override for full session state management
