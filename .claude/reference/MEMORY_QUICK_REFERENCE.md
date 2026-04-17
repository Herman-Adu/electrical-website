# Docker Memory Quick Reference

**Last Updated:** 2026-04-16

Fast lookup for memory operations. See `.claude/rules/memory-policy.md` for full details.

---

## Session Lifecycle (At a Glance)

```
SESSION START
  ├─ search_nodes("electrical-website-state")
  ├─ open_nodes([returned_id])
  └─ Read project state (branch, phase, next_tasks)

ACTIVE WORK
  └─ Code normally. No memory updates yet.

SESSION END
  ├─ create_entities([session entity])
  ├─ add_observations(project_state_id, [end-of-session observations])
  ├─ add_observations(feature_id, [build, blockers, learnings])
  ├─ create_entities([learning entities])
  ├─ create_relations([links between entities])
  └─ Commit to git
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Project State | `{project}-state` | `electrical-website-state` |
| Feature | `feat-{phase}-{name}` | `feat-phase-5-scroll-animation` |
| Learning | `learn-{topic}-{descriptor}` | `learn-hooks-conditional-effects` |
| Decision | `decide-{domain}-{choice}` | `decide-memory-docker-over-files` |
| Infrastructure | `infra-{system}-{descriptor}` | `infra-mcp-docker-services` |
| Session | `session-{YYYY}-{MM}-{DD}-{seq}` | `session-2026-04-16-001` |

---

## Common Queries

```bash
# Load current project state
search_nodes("electrical-website-state")
open_nodes([id])

# Find all Phase 5 work
search_nodes("feat-phase-5")

# Find blocked features
search_nodes("status:blocked")

# Find all hook learnings
search_nodes("learn-hooks")

# Find recent sessions
search_nodes("session-2026-04-16")
```

---

## Entity Creation Templates

### Start a Feature

```python
create_entities([{
  "type": "feature",
  "name": "feat-phase-5-dark-mode",
  "properties": {
    "title": "Dark Mode Support",
    "phase": "Phase 5",
    "status": "in-progress",
    "start_date": "2026-04-17",
    "components_touched": ["..."],
    "test_coverage": 0.80,
    "build_passing": True
  }
}])
```

### Document a Blocker

```python
add_observations(feature_id, [{
  "category": "blocker",
  "severity": "high",
  "title": "Scroll not firing on iOS",
  "description": "useScrollTrigger hook timing issue with Safari",
  "workaround": "Disabled on mobile; filed issue #142"
}])
```

### Capture a Learning

```python
create_entities([{
  "type": "learning",
  "name": "learn-scroll-trigger-ios-compatibility",
  "properties": {
    "title": "Safari scroll events have platform-specific timing",
    "category": "Performance",
    "summary": "iOS Safari requires different timing than desktop browsers",
    "source_feature": "feat-phase-5-scroll-animation",
    "confidence": "high",
    "discovery_date": "2026-04-16"
  }
}])
```

### Record a Decision

```python
create_entities([{
  "type": "decision",
  "name": "decide-memory-docker-over-files",
  "properties": {
    "title": "Migrate Project Memory to Docker MCP",
    "choice": "Use Docker memory-reference service",
    "rationale": "60–70% token savings, faster queries",
    "affects_systems": ["Session startup", "Context loading"],
    "migration_status": "in-progress"
  }
}])
```

---

## Observation Categories

Quick reference for what to observe:

| Category | When to Use | Example |
|----------|-----------|---------|
| `build` | After `pnpm build` | `{ "status": "passing", "duration_seconds": 45 }` |
| `blocker` | When stuck | `{ "severity": "high", "title": "...", "workaround": "..." }` |
| `learning` | Pattern discovered | `{ "insight": "...", "confidence": "high" }` |
| `regression` | Bug found & fixed | `{ "issue": "...", "root_cause": "...", "fixed": true }` |
| `performance` | Speed improvement | `{ "metric": "LCP", "before": "2.8s", "after": "1.2s" }` |
| `session_end` | End of session | `{ "branch": "main", "build_status": "passing", "next_tasks": [...] }` |

---

## Relation Types

Link entities:

| Type | Use | Example |
|------|-----|---------|
| `derives_from` | Feature implements decision | `feat-A derives_from decide-B` |
| `depends_on` | Feature needs another first | `feat-A depends_on feat-B` |
| `documents` | Decision documents feature | `decide-A documents feat-B` |
| `updates` | Session updates state | `session-X updates project_state` |
| `supersedes` | Newer learning replaces old | `learn-A supersedes learn-B` |
| `related_to` | Soft link (conceptual) | `learn-hooks related_to learn-effects` |

---

## Fallback: .md Memory (Docker Down)

**Only if Docker is unavailable:**

```markdown
# Session State (Fallback)

2026-04-16 20:15 — Completed Phase 5 hero refactoring.
Next: Test scroll animations. Blocker: iOS Safari compatibility.
```

---

## Docker Health Check

```bash
# Verify service is running
curl http://localhost:3100/health
# Expected: OK

# Query entities via MCP gateway
curl -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"search_nodes","arguments":{"query":""}}}'
```

---

## Session End Checklist

```
□ All work committed
□ Build passing: pnpm build
□ Tests passing: pnpm test
□ Docker available? (curl localhost:3100/health)
  └─ YES: create_entities([session]), add_observations(...)
  └─ NO: Write 1-2 lines to .claude/CLAUDE.md## Session State
□ Git push
```

---

## Pruning Schedule

| Frequency | Action |
|-----------|--------|
| Weekly (Monday) | Archive sessions older than 90 days |
| Quarterly | Archive completed features older than 6 months |
| As-needed | Merge duplicate entities, mark superseded decisions |

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Forgetting to `search_nodes()` before `create_entities()` | Always search first to avoid duplicates |
| Using uppercase in entity names | Use kebab-case: `learn-hooks-timing` not `Learn-Hooks-Timing` |
| Creating too many fine-grained entities | Consolidate related concepts (use `supersedes` relation) |
| Not linking features to decisions | Always `create_relations()` at end of work |
| Bloated observations | Keep observations short; use learnings for patterns |
| Docker down, no fallback note | Add 1-line fallback to `.claude/CLAUDE.md` immediately |

---

## More Information

- **Full policy:** `.claude/rules/memory-policy.md`
- **Setup guide:** `.claude/reference/setup/DOCKER_MEMORY_SETUP.md`
- **Error recovery:** `.claude/reference/ERROR_RECOVERY.md` (if exists)
- **Entity types:** Part 1 of memory-policy.md
- **Observation schema:** Part 2 of memory-policy.md
