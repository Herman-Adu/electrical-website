# Session-Lifecycle Skill

## Overview

The **Session-Lifecycle Skill** provides manual control over Docker-first session state management. Use it to explicitly load Docker state, checkpoint progress, or wrap up work with full persistence.

## What It Does

Provides three modes:

| Mode | Purpose | When to Use |
|------|---------|------------|
| **start** | Load Docker project state | Explicit session start, after interruption |
| **sync** | Checkpoint progress mid-session | After 2+ hours, when context approaches 60% |
| **end** | Full session handoff | Wrapping up, before extended break |

## When to Use

### Use `/session-lifecycle start`

- **Explicitly load** current project state from Docker memory
- **After session interruption** to see where you left off
- **Before major decisions** to confirm context
- **Instead of relying on hooks** (explicit control)

**Example:**
```
User: I'm starting work. Can you load the project state?
Response: /session-lifecycle start
→ Reports: Branch: main | Phase: 5 | Next: refactor hero components
```

---

### Use `/session-lifecycle sync`

- **After 2+ hours** of uninterrupted work (checkpoint progress)
- **When context approaches 60%** (save before hitting 70% warning)
- **When switching tasks** within same session (save current state)
- **When discovering important learnings** (capture and persist)

**Example:**
```
User: I've been working for 2 hours. Should I save state?
Response: /session-lifecycle sync
→ Commits WIP, updates Docker, confirms: "Context reset to 15%, you can continue"
```

---

### Use `/session-lifecycle end`

- **Wrapping up for the day** (full handoff)
- **Completing a major feature** (final commit + continuation prompt)
- **Before extended break** (hours/days away from work)
- **When context reaches 70%** and work is paused anyway

**Example:**
```
User: Time to wrap up. Generate continuation prompt?
Response: /session-lifecycle end
→ Commits everything, pushes, generates continuation prompt
→ "Ready for next session. Here's your continuation prompt..."
```

---

## How It Works

### Mode: `start`

```
1. Searches Docker for electrical-website-state
2. Loads: branch, active phase, next tasks, blockers
3. Runs: git status && git log --oneline -5
4. Reports: "[Session ready — Branch: X | Phase: Y | Next: Z]"
```

**Cost:** ~50 tokens  
**Duration:** ~5 seconds

---

### Mode: `sync`

```
1. Checks Docker availability
2. Appends observations (build status, learnings, blockers)
3. Updates project state with current branch + phase
4. Commits any uncommitted work: WIP: context-sync
5. Reports: "Checkpoint saved. Context reset. Continue working."
```

**Cost:** ~150–200 tokens  
**Duration:** ~30 seconds  
**Note:** Does NOT end session — work continues in current session

---

### Mode: `end`

```
1. Creates session entity (session-YYYY-MM-DD-SEQ)
2. Updates project state with final branch, build, phase
3. Creates learning + decision entities (if discovered)
4. Commits final state: session-end: [summary]
5. Pushes to remote: git push
6. Generates inline continuation prompt (copy-paste ready)
7. Reports: "Session complete. Continuation prompt ready."
```

**Cost:** ~300–400 tokens  
**Duration:** ~1–2 minutes  
**Note:** ENDS current session; generates continuation for next

---

## Integration with Hooks

This skill is **manual override** for automatic hooks:

| Event | Hook (Automatic) | Manual Override (This Skill) |
|-------|------------------|------------------------------|
| Session start | SessionStart hook (auto) | `/session-lifecycle start` |
| User submits | UserPromptSubmit hook (auto 70% warning) | — |
| Context compaction | PreCompact hook (auto) | — |
| Mid-session work | (no automatic trigger) | `/session-lifecycle sync` |
| Session end | (no automatic trigger) | `/session-lifecycle end` |

Use this skill when you want **explicit control** over timing, not relying on hooks to fire.

---

## Usage Examples

### Example 1: Explicit Start (No Hook Waiting)

```
Me: I'm ready to start work on Phase 5 components.
Claude: Using /session-lifecycle start to load state.
→ Reports project state immediately
→ I can continue without waiting for SessionStart hook
```

---

### Example 2: Checkpoint After 2 Hours

```
Me: I've been working for 2 hours refactoring hero components.
Claude: Using /session-lifecycle sync to checkpoint.
→ Commits WIP, updates Docker
→ Context resets from 55% to 15%
→ I continue work in same session
```

---

### Example 3: Wrap-Up with Continuation Prompt

```
Me: Time to wrap up for the day. Can you generate a continuation prompt?
Claude: Using /session-lifecycle end to complete session.
→ Commits all changes
→ Pushes to remote
→ Generates continuation prompt (200+ lines)
→ Reports: "Ready for next session!"

[Next day, user pastes continuation prompt into new session]

New Claude: Loaded continuation, resuming Phase 5 refactoring...
```

---

## What You Get

### From `start`

```
✅ Session ready
- Branch: main
- Phase: 5 (Animation Optimization)
- Next tasks: refactor 9 remaining hero components
- Blockers: 0
- Build status: passing
- Last commit: 67bc34e (Phase 6 complete)
```

---

### From `sync`

```
✅ Checkpoint saved
- Files modified: 36
- Commits created: 6
- Build: passing
- Tests: passing
- Context at checkpoint: 55%
- Context after sync: 15% (reset)
- Continue working in this session
```

---

### From `end`

```
✅ Session complete
- Session entity: session-2026-04-16-001 (created)
- Project state: electrical-website-state (updated)
- Features completed: 3
- Build status: passing
- Tests: passing
- Commits pushed: 6
- Context at end: 72%

---CONTINUATION PROMPT (copy-paste ready)---
[full 200+ line prompt with all context]
---END CONTINUATION PROMPT---

Ready for next session!
```

---

## Best Practices

### Do

- ✅ Use `sync` as a checkpoint (don't wait for 70% warning)
- ✅ Use `end` before extended breaks (full context captured)
- ✅ Use `start` after unexpected interruption (explicit recovery)
- ✅ Commit work frequently (before `sync` or `end`)
- ✅ Review continuation prompt before pasting into next session

### Don't

- ❌ Only use when hooks fail (hooks work fine; this is optional)
- ❌ Use `sync` then `end` in quick succession (wastes tokens)
- ❌ Ignore context warnings at 70% (use `sync` at 60% instead)
- ❌ Generate continuation prompt then not use it (wastes effort)

---

## Fallback Behavior (Docker Down)

If Docker is unavailable:

- **start:** Reads `.claude/CLAUDE.md ## Session State` fallback section, reports state
- **sync:** Writes fallback note to `.claude/CLAUDE.md`, confirms saved
- **end:** Writes fallback note, reports "Docker unavailable; fallback recorded"

In all cases, the skill succeeds (never blocks work).

---

## Related Skills & Hooks

- **SessionStart hook** (`.claude/hooks/session-start.sh`) — Automatic preflight at session start
- **UserPromptSubmit hook** (`.claude/hooks/context-monitor.mjs`) — Automatic 70% warning
- **PreCompact hook** (`.claude/hooks/precompact-safety.sh`) — Automatic safety during compaction
- **Docker Memory Policy** (`.claude/rules/memory-policy.md`) — Entity types, observation schema

---

## Success Criteria

You'll know this skill is working when:

- ✅ `start` loads Docker state instantly (~5 sec)
- ✅ `sync` checkpoints mid-session without ending it
- ✅ `end` generates a complete continuation prompt
- ✅ Continuation prompt is copy-paste ready for next session
- ✅ Next session can resume from continuation without re-explaining

---

**Type:** User-invocable skill  
**Modes:** start | sync | end  
**Status:** Ready to use  
**Last Updated:** 2026-04-16  
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
