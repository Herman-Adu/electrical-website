---
name: knowledge-memory
description: Use this skill to capture learnings, decisions, and project state to Docker memory. Trigger on: "remember this", "save this", "capture this pattern", "update project state", "session end sync". NEVER write to .md files — Docker memory is the ONLY store.
argument-hint: "[what to capture: learning | decision | session-end | project-state]"
disable-model-invocation: true
---

# Knowledge Memory Skill

## Core Rule

(Memory: see CLAUDE.md rule 3) Docker graph DB is the sole persistent store. Never write `.md` or JSON files.

---

## Invocation — Primary and Fallback

**Primary:** Use `mcp__memory__*` tools directly:
- `mcp__memory__create_entities` — create new entities
- `mcp__memory__add_observations` — add to existing entities
- `mcp__memory__create_relations` — wire entity relations
- `mcp__memory__search_nodes` — search by name/keyword
- `mcp__memory__open_nodes` — load specific entities by name

**If any `mcp__memory__*` call returns an error — go here immediately, do not retry with other namespaces:**
```bash
# Health check first — if non-200, stop and tell user
curl -s http://localhost:3100/memory/health

# Create entities
curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"create_entities","arguments":{"entities":[{"name":"...","entityType":"...","observations":["..."]}]}}'

# Add observations
curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"add_observations","arguments":{"observations":[{"entityName":"...","contents":["..."]}]}}'

# Create relations
curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"create_relations","arguments":{"relations":[{"from":"...","to":"...","relationType":"..."}]}}'

# Search
curl -s -X POST http://localhost:3100/memory/search_nodes \
  -H "Content-Type: application/json" \
  -d '{"query":"nexgen-electrical-innovations-state"}'
```

**If curl also fails:** Stop. Tell the user: "Memory service unavailable. Options: (1) run `pnpm docker:mcp:ready` and retry, (2) skip memory sync for now." Do not write to `.md` files.

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
  "observations": [{ "entityName": "nexgen-electrical-innovations-state",
    "contents": ["Branch: ...", "Build status: passing", "Active phase: ...", "Next tasks: ..."] }]
}'
```

---

## Session-End Checklist

1. `pnpm docker:mcp:memory:search "nexgen-electrical-innovations-state"` — confirm entity exists
2. `add_observations` to project state — branch, build status, next tasks
3. `create_entities` — session entity (`session-YYYY-MM-DD-seq`)
4. `create_entities` — learning entities for any non-obvious patterns discovered
5. `create_entities` — decision entities for any architectural choices made
6. `create_relations` — `from: "session-YYYY-MM-DD-seq"`, `to: "nexgen-electrical-innovations-state"`, `relationType: "updates"`

**Step 5a — Update active lane entity with session work:**
```bash
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "REPLACE_WITH_active_lane_entity_name",
    "contents": [
      "session_summary: REPLACE_WITH_work_completed | next: REPLACE_WITH_next_tasks | at: REPLACE_WITH_ISO8601",
      "last_accessed_at: REPLACE_WITH_ISO8601"
    ]
  }]
}'
```
Replace REPLACE_WITH_* with actual values. Get lane entity name from `config/active-branch.json` (`.entity` field).

**Step 5b — Trigger local file sync (updates lastSyncedAt + emergencySummary):**
```bash
node scripts/memory-lane-stop.mjs --manual
```

**Step 5c — Verify session entity linked to lane:**
```bash
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "REPLACE_WITH_session_entity_name",
    "to": "REPLACE_WITH_lane_entity_name",
    "relationType": "documents"
  }]
}'
```

---

## Search and Retrieval

```
pnpm docker:mcp:memory:search "query"    # find entities by name or keyword
pnpm docker:mcp:memory:open entity-name  # load entity and read observations
```

Always search before creating — never duplicate entities. If a close match exists, use `add_observations`.

---

## Prohibitions

- Never write `.md` or JSON files for memory (Memory: see CLAUDE.md rule 3)
- Never create entities for implementation details — those live in the code
- Observations must be arrays of strings — never objects
- Never create duplicate session entities — search `session-{YYYY-MM-DD}` before creating, increment SEQ
- Always include `"last_accessed_at: {ISO8601}"` when manually accessing any `learn-*` or `decide-*` entity
- Never call `read_graph` manually — only `memory-lane-staleness-check.mjs` should do this
