---
name: knowledge-memory
description: Use this skill to capture learnings, decisions, and project state to Docker memory. Trigger on: "remember this", "save this", "capture this pattern", "update project state", "session end sync". NEVER write to .md files — Docker memory is the ONLY store.
argument-hint: "[what to capture: learning | decision | session-end | project-state]"
disable-model-invocation: true
---

# Knowledge Memory Skill

## Core Rule

Docker memory is the ONLY persistent store. Never write session state, learnings, or decisions to .md files, JSON files, or any file in `.claude/`. Use the Docker graph DB exclusively.

---

## Entity Creation Patterns

**Learning** — non-obvious pattern or gotcha discovered during development:
```
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{ "name": "learn-[topic]-[descriptor]", "entityType": "learning",
    "observations": ["Insight: ...", "Context: ...", "References: ..."] }]
}'
```

**Decision** — architectural or strategic choice future sessions must know:
```
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{ "name": "decide-[domain]-[choice]", "entityType": "decision",
    "observations": ["Choice: ...", "Rationale: ...", "Alternatives considered: ..."] }]
}'
```

**Session** — handoff context; create at every session end:
```
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{ "name": "session-YYYY-MM-DD-001", "entityType": "session",
    "observations": ["Work completed: ...", "Build status: passing", "Next tasks: ...", "Blockers: none"] }]
}'
```

**Feature** — significant work unit started or completed:
```
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{ "name": "feat-[phase]-[kebab-name]", "entityType": "feature",
    "observations": ["Status: in-progress | completed", "Files affected: ...", "Commits: ..."] }]
}'
```

**Project state update** — add to existing entity, never recreate it:
```
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{ "entityName": "electrical-website-state",
    "contents": ["Branch: ...", "Build status: passing", "Active phase: ...", "Next tasks: ..."] }]
}'
```

---

## Session-End Checklist

1. `pnpm docker:mcp:memory:search "electrical-website-state"` — confirm entity exists
2. `add_observations` to project state — branch, build status, next tasks
3. `create_entities` — session entity (`session-YYYY-MM-DD-seq`)
4. `create_entities` — learning entities for any non-obvious patterns discovered
5. `create_entities` — decision entities for any architectural choices made
6. `create_relations` — `from: "session-YYYY-MM-DD-seq"`, `to: "electrical-website-state"`, `relationType: "updates"`

---

## Search and Retrieval

```
pnpm docker:mcp:memory:search "query"    # find entities by name or keyword
pnpm docker:mcp:memory:open entity-name  # load entity and read observations
```

Always search before creating — never duplicate entities. If a close match exists, use `add_observations`.

---

## Prohibitions

- Never write `archives/*.md` or `context/*.md` files for memory purposes
- Never use .md files as memory — the only exception is the one-line Docker-down fallback in `.claude/CLAUDE.md`
- Never create entities for implementation details — those live in the code
- Observations must be arrays of strings — never objects
