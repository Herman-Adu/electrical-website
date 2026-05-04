---
name: session-lifecycle
description: Use this skill WHENEVER you need manual control over session state synchronization — at session start, during long work, or when wrapping up. Trigger on phrases like "sync session", "save context", "wrap up", "pause and sync", or when context approaches 60%. Provides three modes: start (load Docker state), sync (persist work-in-progress), end (full session handoff with continuation prompt).
argument-hint: "[start|sync|end]"
disable-model-invocation: true
compatibility: Requires Docker memory-reference service (http://localhost:3100/health), Node.js 18+, git CLI
---

# Session-Lifecycle Skill

## Purpose

Provides manual control over the **Docker-first session lifecycle** without waiting for hooks to fire. Use this skill when:

- **Starting work** (`start`) — explicitly load project state from Docker memory
- **Mid-session** (`sync`) — pause work, persist progress
- **Wrapping up** (`end`) — full session handoff with everything stored in Docker + continuation prompt ready
- **Recovery** — if hooks failed or session interrupted unexpectedly

**Agent dispatch:** `Agent(subagent_type="general-purpose")` — never implement code changes from within this skill. Session lifecycle is state management only.

---

## Three Modes

### Mode 1: `start` — Load Docker State

**What it does:**
1. Searches Docker for `nexgen-electrical-innovations-state` entity
2. Loads current branch, active phase, next tasks, blockers
3. Runs `git status && git log --oneline -5`
4. Reports: "[Session ready — Branch: X | Phase: Y | Next: Z | Blockers: N]"
5. Returns to user ready to work

**Cost:** ~50 tokens

---

### Mode 2: `sync` — Mid-Session Checkpoint

**What it does:**
1. Checks Docker availability
2. Appends observations to project state (build status, blockers, learnings discovered so far)
3. Updates project state with current phase + next tasks
4. Commits any uncommitted work with `WIP: context-sync` message
5. Confirms sync completed — **does NOT** end the session

Note: the context window does not reset after sync; sync preserves state for the next session.

**When to use:**
- After 2+ hours of work
- After discovering a blocker or learning
- When context approaches 60% and full end is premature

**Cost:** ~150–200 tokens

**Output:**
```
Sync complete
- Project state updated: [branch] | [active phase]
- Blockers: [N] | Build: [passing/failing]
- Continuation available if needed
```

---

### Mode 3: `end` — Full Session Handoff

**What it does:**
1. Creates session entity (`session-YYYY-MM-DD-SEQ`) with all work summary
2. Updates project state with final branch, build status, next tasks
3. Creates `learning` entities for any patterns discovered
4. Creates `decision` entities for any architectural choices made
5. Wires relations (features → decisions/learnings, session → project_state)
6. Commits: `git commit -m "session-end: [summary]"` and pushes
7. Generates inline continuation prompt (copy-paste ready)

**Cost:** ~300–400 tokens

**Output:**
```
Session end complete
- Session entity: session-YYYY-MM-DD-SEQ (created)
- Project state: nexgen-electrical-innovations-state (updated)
- Build: [passing/failing] | Tests: [passing/failing]
- Learnings captured: [N] | Relations: [N] new links
- Commits pushed: [N]

---CONTINUATION PROMPT (paste into next session)---
[full context embedded]
---END CONTINUATION PROMPT---
```

---

## Implementation Details

### Mode: `start`

```bash
pnpm docker:mcp:memory:search "nexgen-electrical-innovations-state"
pnpm docker:mcp:memory:open nexgen-electrical-innovations-state
# Extract: branch, phase, next_tasks, blockers
git status && git log --oneline -5
# Report state
```

### Mode: `sync`

```bash
pnpm docker:mcp:memory:search "nexgen-electrical-innovations-state"
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "nexgen-electrical-innovations-state",
    "contents": ["context_checkpoint: branch [X], build [Y], next: [task]"]
  }]
}'
# git status → if uncommitted: git commit -m "WIP: context-sync"
```

### Mode: `end`

```bash
pnpm docker:mcp:memory:search "nexgen-electrical-innovations-state"
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "session-YYYY-MM-DD-SEQ",
    "entityType": "session",
    "observations": ["Work: [summary]", "Build: passing", "Next: [tasks]"]
  }]
}'
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "nexgen-electrical-innovations-state",
    "contents": ["session_end: branch [X], build [Y], next tasks: [Z]"]
  }]
}'
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "session-YYYY-MM-DD-SEQ",
    "to": "nexgen-electrical-innovations-state",
    "relationType": "updates"
  }]
}'
# [create learning/decision entities if applicable]

# Link session to active lane entity:
# Get lane entity name from config/active-branch.json (.entity field)
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "session-YYYY-MM-DD-SEQ",
    "to": "LANE_ENTITY_NAME",
    "relationType": "documents"
  }]
}'

# Flush local config (updates lastSyncedAt + emergencySummary)
node scripts/memory-lane-stop.mjs --manual

git add . && git commit -m "session-end: [summary]" && git push
# Build continuation prompt → return to user
```

---

## Fallback Behavior (Docker Down)

For Docker-down fallback: see `.claude/CLAUDE.md` § Session State.

In all cases the skill still succeeds — it never blocks work.

---

## Hook Integration

This skill is the **manual override** — hooks fire automatically but this skill gives explicit control:

| Trigger | Hook | Manual Override |
|---------|------|-----------------|
| Session starts | SessionStart hook (auto) | `/session-lifecycle start` |
| Context 60%+ | UserPromptSubmit hook (auto) | — |
| Work pauses | (no automatic trigger) | `/session-lifecycle sync` |
| Session ends | (no automatic trigger) | `/session-lifecycle end` |

---

## Session End Checklist

- [ ] All work committed and pushed
- [ ] `pnpm typecheck && pnpm build` passing
- [ ] Session entity created in Docker (`session-YYYY-MM-DD-SEQ`)
- [ ] Project state updated with branch, build, next tasks
- [ ] Learning and decision entities created for non-obvious patterns
- [ ] Relations wired between new entities and existing context
- [ ] No .md memory files written during this session
- [ ] Active lane entity linked to session via `documents` relation
- [ ] `active-branch.json` `updatedAt` updated (check via `pnpm memory:status`)
- [ ] `emergencySummary` is ≤150 words and reflects current work

---

## See Also

- [Docker Memory Policy](./../rules/memory-policy.md) — Entity types, observation schema, fallback policy
- [CLAUDE.md](./../CLAUDE.md) — Orchestrator contract and lifecycle overview

**Last Updated:** 2026-04-28
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
