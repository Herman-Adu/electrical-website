# Docker MCP Quick Reference

**Status:** Canonical working format | **Last Updated:** 2026-04-28

> For policy details and entity types: [memory-policy.md](../rules/memory-policy.md)

---

## Common Mistakes

> **1. Observations must be an array of strings — NOT an object.**
> **2. Every entity requires `entityType` field.**
> **3. Search before creating — never create duplicate entities.**

---

## 1. Session Start

```bash
pnpm docker:mcp:memory:search "electrical-website-state"
pnpm docker:mcp:memory:open electrical-website-state
# Read: current_branch, active_phase, next_tasks, blockers
```

---

## 2. Create Entity

```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "session-YYYY-MM-DD-001",
      "entityType": "session",
      "observations": [
        "Work completed: [summary]",
        "Build status: passing",
        "Tests: passing",
        "Next: [next task]"
      ]
    }
  ]
}'
```

---

## 3. Add Observations

```bash
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [
    {
      "entityName": "electrical-website-state",
      "contents": [
        "Session end: [date] — [summary]",
        "Build: passing",
        "Next: [next task]"
      ]
    }
  ]
}'
```

---

## 4. Create Relations

```bash
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [
    {
      "from": "session-YYYY-MM-DD-001",
      "to": "electrical-website-state",
      "relationType": "updates"
    }
  ]
}'
```

Relation types: `derives_from`, `depends_on`, `documents`, `updates`, `supersedes`, `related_to`

---

## 5. Session End (Full Sequence)

```bash
# Step 1: Create session entity
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "session-YYYY-MM-DD-seq",
    "entityType": "session",
    "observations": ["Work completed: ...", "Build: passing", "Next: ..."]
  }]
}'

# Step 2: Update project state
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "electrical-website-state",
    "contents": ["Session end update", "Next tasks: ..."]
  }]
}'

# Step 3: Wire relation
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "session-YYYY-MM-DD-seq",
    "to": "electrical-website-state",
    "relationType": "updates"
  }]
}'
```

---

## Pnpm Shortcuts

```bash
pnpm docker:mcp:memory:search "query"
pnpm docker:mcp:memory:open entity-name
pnpm docker:mcp:memory:call create_entities '{...}'
pnpm docker:mcp:memory:call add_observations '{...}'
pnpm docker:mcp:memory:call create_relations '{...}'
```
