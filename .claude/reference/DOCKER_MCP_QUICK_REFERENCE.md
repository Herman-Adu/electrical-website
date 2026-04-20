# Docker MCP Quick Reference

**Last Updated:** 2026-04-20 | **Status:** CORRECTED — Real working format

This document provides the **correct working format** for all Docker memory operations. Use these examples as templates for every session.

---

## Quick Start (Copy-Paste Ready)

### Create a Session Entity

```bash
# Using the correct MCP call format
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "session-2026-04-20-001",
      "entityType": "session",
      "observations": [
        "Work completed: Phase 8 SectionValues refactoring",
        "Tests: 267/270 passing",
        "Build: 58/58 pages passing",
        "Branch: feat/phase-8-scrollreveal-production (17 commits ahead)"
      ]
    }
  ]
}'

# Or via pnpm shortcut
pnpm docker:mcp:memory:call create_entities '{
  "entities": [
    {
      "name": "session-2026-04-20-001",
      "entityType": "session",
      "observations": [
        "Work completed: Phase 8 SectionValues refactoring",
        "Tests: 267/270 passing",
        "Build: 58/58 pages passing"
      ]
    }
  ]
}'
```

### Add Observations to Existing Entity

```bash
# Add notes to the project state entity
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [
    {
      "entityName": "electrical-website-state",
      "contents": [
        "Session 2026-04-20 completed: Phase 8 refactoring done",
        "Build status: passing",
        "Next: Deploy to main",
        "Blocker: none"
      ]
    }
  ]
}'
```

### Create Relations Between Entities

```bash
# Link a feature to a decision
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [
    {
      "from": "feat-phase-8-scrollreveal",
      "to": "decide-reveal-animation-removal",
      "relationType": "derives_from"
    }
  ]
}'
```

### Search for Entities

```bash
# Find all entities matching a query
node scripts/mcp-memory-call.mjs search_nodes '{"query":"electrical-website-state"}'

# Via shortcut
pnpm docker:mcp:memory:search "electrical-website-state"
```

### Open Entities to Read Them

```bash
# Load entity content by name
node scripts/mcp-memory-call.mjs open_nodes '["electrical-website-state"]'

# Via shortcut
pnpm docker:mcp:memory:open electrical-website-state session-2026-04-20-001
```

---

## Schema Reference

### Entity Types (Required for every create_entities call)

| Type | Purpose | Naming Pattern | When to Use |
|------|---------|---|---|
| `project_state` | Current branch, build, phase, next tasks (ONE per project) | `{project}-state` | Once at project start, then append observations |
| `session` | Session summary, work completed, next steps | `session-YYYY-MM-DD-seq` | Session end — summarize work |
| `feature` | Deliverable unit: spec, implementation, tests, files | `feat-{phase}-{name}` | After completing a feature |
| `learning` | Technical pattern, gotcha, insight discovered | `learn-{topic}-{descriptor}` | When discovering non-obvious patterns |
| `decision` | Architectural choice with full rationale | `decide-{domain}-{choice}` | When making trade-off decisions |
| `infrastructure` | Docker services, MCP tools, CI/CD, deployment | `infra-{subsystem}-{descriptor}` | Setup/infrastructure work |
| `task` | Atomic work item with status | `task-{area}-{descriptor}` | Tracking small, bounded work |
| `plan` | Implementation roadmap with phases | `plan-{domain}-{goal}` | Multi-week/month planning |

### Observation Array Format (Required for observations field)

**CORRECT:** Array of strings

```json
{
  "name": "session-2026-04-20-001",
  "entityType": "session",
  "observations": [
    "Work completed: Feature X, Feature Y",
    "Build status: passing",
    "Test status: 267/270 passing",
    "Next: Deploy and verify"
  ]
}
```

**WRONG:** Object format (will fail)

```json
{
  "name": "session-2026-04-20-001",
  "entityType": "session",
  "observations": {
    "work_completed": "Feature X",
    "build_status": "passing"
  }
}
```

### Relation Types (Required for create_relations)

| Type | Meaning | Example Use |
|------|---------|---|
| `derives_from` | Source implements or is informed by target | `feat-X` derives_from `decide-Y` |
| `depends_on` | Source cannot complete without target | `feat-X` depends_on `feat-Y` |
| `documents` | Source explains rationale for target | `decide-X` documents `feat-Y` |
| `updates` | Source modifies state tracked in target | `session-X` updates `project_state` |
| `supersedes` | Source replaces target (target deprecated) | `learn-v2` supersedes `learn-v1` |
| `related_to` | Soft conceptual link (not a dependency) | `learn-X` related_to `learn-Y` |

---

## Common Mistakes (and How to Fix Them)

### Mistake 1: Wrong Observations Format

**WRONG:**
```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "session-2026-04-20-001",
      "entityType": "session",
      "observations": {
        "work": "Phase 8 refactoring",
        "tests": "267/270"
      }
    }
  ]
}'
```

**RIGHT:**
```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "session-2026-04-20-001",
      "entityType": "session",
      "observations": [
        "Work completed: Phase 8 refactoring",
        "Tests: 267/270 passing"
      ]
    }
  ]
}'
```

**Fix:** Observations MUST be an array of strings, not an object.

---

### Mistake 2: Using curl Instead of Node Script

**WRONG:**
```bash
curl -X POST http://localhost:3100/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"create_entities","args":{...}}'
```

**RIGHT:**
```bash
node scripts/mcp-memory-call.mjs create_entities '{...}'
```

**Fix:** Use the MCP call script or pnpm shortcuts. Direct curl doesn't work with the MCP aggregator gateway.

---

### Mistake 3: Missing Required Fields

**WRONG:**
```json
{
  "name": "session-2026-04-20-001",
  "observations": ["work done"]
}
```

**RIGHT:**
```json
{
  "name": "session-2026-04-20-001",
  "entityType": "session",
  "observations": ["work done"]
}
```

**Fix:** Always include `entityType`. It tells Docker how to classify the entity.

---

### Mistake 4: Forgetting to Wrap JSON in Quotes

**WRONG:**
```bash
node scripts/mcp-memory-call.mjs create_entities {
  "entities": [{...}]
}
```

**RIGHT:**
```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{...}]
}'
```

**Fix:** JSON argument must be a quoted string. Bash expands unquoted braces.

---

### Mistake 5: Creating Duplicate Entities

**WRONG:**
```bash
# Without searching first
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "feat-phase-8-refactoring",
    "entityType": "feature",
    "observations": ["completed"]
  }]
}'
# Then later:
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "feat-phase-8-refactoring",
    "entityType": "feature",
    "observations": ["more work"]
  }]
}'
```

**RIGHT:**
```bash
# SEARCH FIRST
pnpm docker:mcp:memory:search "feat-phase-8-refactoring"

# If it exists, use add_observations instead
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "feat-phase-8-refactoring",
    "contents": ["more work"]
  }]
}'

# If it doesn't exist, create it
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "feat-phase-8-refactoring",
    "entityType": "feature",
    "observations": ["completed"]
  }]
}'
```

**Fix:** Search before creating to prevent duplicates. Use `add_observations` to append to existing entities.

---

## All Operations (Complete Reference)

### 1. Create Entities

**When to use:** Create new project state, feature, learning, decision, session, etc.

**Correct Format:**
```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "entity-name",
      "entityType": "session|feature|learning|decision|infrastructure|task|plan|project_state",
      "observations": ["observation 1", "observation 2"]
    }
  ]
}'
```

**Real Example (Session End):**
```bash
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [
    {
      "name": "session-2026-04-20-005",
      "entityType": "session",
      "observations": [
        "Phase 8 SectionValues refactoring completed",
        "CSS Grid minmax layout implemented (320px/380px responsive)",
        "Equal-height cards with content-driven sizing",
        "Tests: 267/270 passing (4 skipped)",
        "Build: 58/58 pages passing",
        "Commits: 4 (b7f9a4f, 3c00b5b, 5137b0b, e146894)",
        "Branch: feat/phase-8-scrollreveal-production (17 commits ahead)",
        "Next: Deploy to main with brightness/saturation updates"
      ]
    }
  ]
}'
```

---

### 2. Add Observations

**When to use:** Append findings, build status, test results to an existing entity.

**Correct Format:**
```bash
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [
    {
      "entityName": "existing-entity-name",
      "contents": ["new observation 1", "new observation 2"]
    }
  ]
}'
```

**Real Example (Update Project State):**
```bash
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [
    {
      "entityName": "electrical-website-state",
      "contents": [
        "Session 2026-04-20 completed Phase 8 refactoring",
        "Build status: passing (all 58 pages)",
        "Test status: 267/270 passing",
        "Next: brightness/saturation on hero components",
        "Blocker: none"
      ]
    }
  ]
}'
```

---

### 3. Create Relations

**When to use:** Link entities to preserve dependencies and context.

**Correct Format:**
```bash
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [
    {
      "from": "entity-name-1",
      "to": "entity-name-2",
      "relationType": "derives_from|depends_on|documents|updates|supersedes|related_to"
    }
  ]
}'
```

**Real Example:**
```bash
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [
    {
      "from": "feat-phase-8-scrollreveal",
      "to": "decide-reveal-animation-removal",
      "relationType": "derives_from"
    },
    {
      "from": "session-2026-04-20-005",
      "to": "electrical-website-state",
      "relationType": "updates"
    }
  ]
}'
```

---

### 4. Search Nodes

**When to use:** Find entities by name prefix or query.

**Correct Format:**
```bash
node scripts/mcp-memory-call.mjs search_nodes '{"query":"search-term"}'

# Via shortcut
pnpm docker:mcp:memory:search "search-term"
```

**Real Examples:**
```bash
# Find all session entities
pnpm docker:mcp:memory:search "session-"

# Find project state
pnpm docker:mcp:memory:search "electrical-website-state"

# Find all phase 8 features
pnpm docker:mcp:memory:search "feat-phase-8"
```

---

### 5. Open Nodes

**When to use:** Load entity content by name to read observations and relations.

**Correct Format:**
```bash
node scripts/mcp-memory-call.mjs open_nodes '["entity-name-1", "entity-name-2"]'

# Via shortcut
pnpm docker:mcp:memory:open entity-name-1 entity-name-2
```

**Real Example:**
```bash
# Load project state and latest session
pnpm docker:mcp:memory:open electrical-website-state session-2026-04-20-005
```

---

## Execution Checklist

Use this checklist at **session start** and **session end**:

### Session Start (Preflight)

- [ ] Docker health check: `curl http://localhost:3100/health` returns 200
- [ ] Search for project state: `pnpm docker:mcp:memory:search "electrical-website-state"`
- [ ] Open project state: `pnpm docker:mcp:memory:open electrical-website-state`
- [ ] Read observations for next tasks
- [ ] Check `.claude/CLAUDE.md` section `## Session State` for fallback notes (if any)
- [ ] Confirm current branch matches expected state: `git status`

### Session End (Persistence)

- [ ] All work committed: `git status` shows clean working tree
- [ ] Build passing: `pnpm build` exits 0
- [ ] Tests passing: `pnpm test` exits 0
- [ ] Create session entity: `node scripts/mcp-memory-call.mjs create_entities '{...}'`
- [ ] Update project state: `node scripts/mcp-memory-call.mjs add_observations '{...}'`
- [ ] Update feature entities with build/learning observations
- [ ] Create learning entities for non-obvious patterns
- [ ] Wire relations: `node scripts/mcp-memory-call.mjs create_relations '{...}'`
- [ ] Verify entities created: `pnpm docker:mcp:memory:search "session-2026-04-20"`
- [ ] Commit: `git add . && git commit -m "session-end: [summary]" && git push`

---

## Pnpm Shortcuts

These aliases are defined in `package.json` for faster access:

```bash
# Memory search
pnpm docker:mcp:memory:search "query"

# Memory open (load entities)
pnpm docker:mcp:memory:open entity-name-1 entity-name-2

# Direct MCP call (for any operation)
pnpm docker:mcp:memory:call create_entities '{...}'
pnpm docker:mcp:memory:call add_observations '{...}'
pnpm docker:mcp:memory:call create_relations '{...}'
pnpm docker:mcp:memory:call search_nodes '{"query":"..."}'
pnpm docker:mcp:memory:call open_nodes '["entity1","entity2"]'
```

If shortcuts are missing from `package.json`, add them:

```json
{
  "scripts": {
    "docker:mcp:memory:search": "node scripts/mcp-memory-call.mjs search_nodes '{\"query\":\"$*\"}'",
    "docker:mcp:memory:open": "node scripts/mcp-memory-call.mjs open_nodes",
    "docker:mcp:memory:call": "node scripts/mcp-memory-call.mjs"
  }
}
```

---

## Troubleshooting

### "Connection refused" on docker call

**Problem:** Docker service is down.

**Solution:**
1. Verify Docker is running: `docker ps` should return container list
2. Check MCP health: `curl http://localhost:3100/health`
3. If down: Write fallback note to `.claude/CLAUDE.md` `## Session State`
4. Continue work normally; sync on next session when Docker is back

### "Unknown command" error

**Problem:** Typo in entityType or relationType.

**Solution:** Check spelling against canonical lists in this doc:
- Entity types: project_state, session, feature, learning, decision, infrastructure, task, plan
- Relation types: derives_from, depends_on, documents, updates, supersedes, related_to

### "Invalid JSON" error

**Problem:** Malformed JSON string or missing quotes.

**Solution:**
1. Ensure JSON is wrapped in single quotes: `'{...}'`
2. Test JSON validity: `node -e "console.log(JSON.parse('...'))"`
3. Use a JSON formatter if complex: https://jsoncrack.com/

### Duplicate entity created

**Problem:** Created entity with same name as existing entity.

**Solution:**
1. Search first: `pnpm docker:mcp:memory:search "entity-name"`
2. Use `add_observations` to append, not `create_entities`
3. If duplicate exists, use the existing entity and delete the duplicate (contact DevOps)

---

## When to Use Each Operation

| Goal | Operation | Example |
|------|-----------|---------|
| Start session | `search_nodes` + `open_nodes` | Find "electrical-website-state" |
| Record work done | `add_observations` on `session-*` | Append work summary to session |
| Record findings | `create_entities` with `learning` | New technical pattern discovered |
| Record decision | `create_entities` with `decision` | Architectural choice made |
| Link work | `create_relations` | Feature derives_from decision |
| End session | `create_entities` + `add_observations` + `create_relations` | Full session persistence |

---

**Document Version:** 1.0 (2026-04-20)
**Status:** CORRECTED — Real working format with pnpm shortcuts
**Last Updated:** 2026-04-20 after discovering correct MCP call format
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
