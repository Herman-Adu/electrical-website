---
name: session-lifecycle
description: Use this skill WHENEVER you need manual control over session state synchronization — at session start, during long work, or when wrapping up. Trigger on phrases like "sync session", "save context", "wrap up", "pause and sync", or when context approaches 70%. Provides three modes: start (load Docker state), sync (persist work-in-progress), end (full session handoff with continuation prompt).
argument-hint: "[start|sync|end]"
disable-model-invocation: true
compatibility: Requires Docker memory-reference service (http://localhost:3100/health), Node.js 18+, git CLI
---

# Session-Lifecycle Skill

## Purpose

Provides manual control over the **Docker-first session lifecycle** without waiting for hooks to fire. Use this skill when:

- **Starting work** (`start`) — explicitly load project state from Docker memory
- **Mid-session** (`sync`) — pause work, persist progress, generate continuation prompt
- **Wrapping up** (`end`) — full session handoff with everything stored in Docker + continuation prompt ready
- **Recovery** — if hooks failed or session interrupted unexpectedly

This skill is the **orchestrator's manual override** for session state management.

---

## Three Modes

### Mode 1: `start` — Load Docker State

```bash
/session-lifecycle start
```

**What it does:**
1. Searches Docker for `electrical-website-state` entity
2. Loads current branch, active phase, next tasks, blockers
3. Runs `git status && git log --oneline -5`
4. Reports: "[Session ready — Branch: X | Phase: Y | Next: Z | Blockers: N]"
5. Returns to user ready to work

**When to use:**
- At session start to explicitly sync with Docker (instead of relying on SessionStart hook)
- After recovering from a session interrupt or timeout
- To confirm current state before making decisions

**Cost:** ~50 tokens

**Memory Lane Filtering:**
- Reads `config/active-memory-lanes.json` to identify active lane
- Searches for only project_state + active feature entity (not all observations)
- Saves ~2-3K tokens vs loading entire Docker history

---

### Mode 2: `sync` — Mid-Session Checkpoint

```bash
/session-lifecycle sync
```

**What it does:**
1. Checks Docker availability
2. Searches for active feature entity (if in-progress work)
3. Appends observations (build status, blockers, learnings discovered so far)
4. Updates project state with current phase + next tasks
5. Commits any uncommitted work with `WIP: context-sync` message
6. Returns context % and confirms sync completed
7. **Does NOT** trigger full session end — work continues in current session

**When to use:**
- After 2+ hours of work as a checkpoint
- After discovering a blocker or learning
- When context approaches 60% and full end is premature
- Before switching to a different task within the same session

**Cost:** ~150–200 tokens

**Output example:**
```
✅ Sync complete
- Project state updated: main | Phase 5
- Features: 36 files modified, 412 lines added
- Blockers: 0
- Build: passing
- Context at sync: 45%
- Continuation available if needed
```

---

### Mode 3: `end` — Full Session Handoff

```bash
/session-lifecycle end
```

**What it does:**
1. Creates session entity with all work summary
2. Updates project state with final branch, build status, next tasks
3. Updates active feature entity with final observations
4. Creates `learning` entities for any patterns discovered
5. Creates `decision` entities for any architectural choices made
6. Wires relations (links features to decisions/learnings)
7. Commits final state: `git commit -m "session-end: [summary]"`
8. Pushes to remote: `git push`
9. **Generates inline continuation prompt** (copy-paste ready)
10. Reports: "Session synced. Continuation prompt ready. You can paste it into the next session."

**When to use:**
- Wrapping up for the day
- Completing a major feature or phase
- Before extended break (context preserved for hours/days later)
- When context reaches 70% and work is paused anyway

**Cost:** ~300–400 tokens

**Output example:**
```
✅ Session end complete
- Session entity: session-2026-04-16-001 (created)
- Project state: electrical-website-state (updated)
- Features: 3 completed, 9 in-progress
- Build status: passing
- Tests: passing
- Coverage: 95%
- Learnings captured: 2
- Relations: 5 new links created
- Commits pushed: 6
- Context at end: 75%

---CONTINUATION PROMPT (paste into next session)---
[full 200+ line prompt with all context embedded]
---END CONTINUATION PROMPT---

Ready for next session!
```

---

## Implementation Details

### Mode: `start`

```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
→ mcp__MCP_DOCKER__open_nodes([entity_id])
→ Extract: branch, phase, next_tasks, blockers
→ git status && git log --oneline -5
→ Report state
```

### Mode: `sync`

```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
→ Get project_state_id
→ mcp__MCP_DOCKER__add_observations(
    project_state_id,
    [{ category: "context_checkpoint", timestamp, context_pct, ... }]
  )
→ git status → if uncommitted: git commit -m "WIP: context-sync at X%"
→ Report checkpoint saved
```

### Mode: `end`

```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
→ mcp__MCP_DOCKER__create_entities([
    { type: "session", name: "session-YYYY-MM-DD-SEQ", properties: {...} }
  ])
→ mcp__MCP_DOCKER__add_observations(
    project_state_id,
    [{ category: "session_end", timestamp, branch, build_status, ... }]
  )
→ [create feature, learning, decision entities if applicable]
→ mcp__MCP_DOCKER__create_relations([...])
→ git add . && git commit -m "session-end: [summary]"
→ git push
→ Build continuation prompt
→ Return prompt to user
```

---

## Fallback Behavior (Docker Down)

If Docker is unavailable (`localhost:3100/health` unreachable):

- **start**: Attempts Docker; if fails, reads `.claude/CLAUDE.md` section and reports fallback state
- **sync**: Reports "Docker unavailable; writing fallback note to .claude/CLAUDE.md"
- **end**: Reports "Docker unavailable; fall back to .claude/CLAUDE.md for session notes"

In all cases, the skill still succeeds (exit code 0) — it never blocks work.

---

## Usage Patterns

### Pattern 1: Explicit Session Start

```
User: I'm starting work on Phase 5. Can you load the project state?

Claude: Using /session-lifecycle to load Docker state.

[Command runs, reports current state]

Orchestrator: Session ready — Branch: main | Phase: 5 | Next: refactor hero components | Blockers: none
```

### Pattern 2: Mid-Session Checkpoint (Approaching 60% Context)

```
User: I've been working for 2 hours. Should I save state?

Claude: Yes, context is at 58%. Using /session-lifecycle to checkpoint progress without ending the session.

[Sync runs]

Orchestrator: ✅ Checkpoint saved. Context now resets to ~15%. You can continue working.
```

### Pattern 3: Wrapping Up (Context Near 70%)

```
User: Context window warning — I need to wrap up.

Claude: Using /session-lifecycle end to complete the session and generate a continuation prompt.

[End runs, commits, pushes, generates prompt]

Orchestrator: Session synced to Docker. Here's your continuation prompt for the next session...
```

### Pattern 4: Emergency Recovery (Session Interrupted)

```
[Session interrupted mid-task; user reconnects next day]

User: I was working on something yesterday. Can you find where I left off?

Claude: Using /session-lifecycle start to load the last saved session.

[Start runs, loads Docker state]

Orchestrator: Last session ended at Phase 5 animation optimization. Next tasks: refactor 9 remaining hero components.
```

---

## Integration with Hooks

This skill is **not a replacement for hooks** — it's a **manual override**:

| Trigger | Hook | Manual Override |
|---------|------|-----------------|
| Session starts | SessionStart hook fires automatically | `/session-lifecycle start` (explicit control) |
| User submits message | UserPromptSubmit hook fires automatically (if 70%+) | — |
| Context compaction | PreCompact hook fires automatically | — |
| Work pauses | (no automatic trigger) | `/session-lifecycle sync` (checkpoint) |
| Session ends | (no automatic trigger) | `/session-lifecycle end` (handoff) |

**Use the skill when:**
- You want explicit control over state timing
- Hooks failed or were skipped
- You need a checkpoint that's not a full session end
- You're testing the orchestrator system

---

## Checklist for Users

Before invoking this skill:

- [ ] Know which mode you need: `start`, `sync`, or `end`
- [ ] For `end`: confirm all work is committed (or willing to auto-commit via WIP)
- [ ] For `end`: be ready for the session to wrap up + continuation prompt generation

---

## See Also

- [Docker Memory Policy](./../rules/memory-policy.md) — Entity types, observation schema, fallback policy
- [CLAUDE.md](./../CLAUDE.md) — Orchestrator contract and lifecycle overview
- [session-start.sh](./../hooks/session-start.sh) — SessionStart hook (automatic preflight)
- [context-monitor.mjs](./../hooks/context-monitor.mjs) — UserPromptSubmit hook (automatic 70% warning)
- [precompact-safety.sh](./../hooks/precompact-safety.sh) — PreCompact hook (automatic safety)

---

**Last Updated:** 2026-04-16
**Status:** Ready for use
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
