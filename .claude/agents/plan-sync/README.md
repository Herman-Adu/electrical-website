# Plan-Sync Agent

Leaf-worker sub-agent for the `plan-sync` skill: parses implementation plan files, extracts structured metadata (slug, batch count, task count, decisions), and formats Docker memory entity payloads ready for the parent skill to persist.

## When to Use

The `plan-sync` skill invokes this agent automatically at Steps 1 and 3 of its workflow. You would invoke it directly only when:
- Debugging plan-sync failures and need to isolate the parse step
- Testing extraction logic on a new plan file format
- The parent skill needs entity payloads without running the full sync

**This agent is invoked by the `plan-sync` skill — not by the user directly.**

## How It Works

```
1. Receive plan_file_path + plan_content from parent skill
2. Extract slug from filename (strip YYYY-MM-DD- prefix)
3. Count ## Batch and ### Task headings in content
4. Extract ## Decisions section or inline ADR markers
5. Format feat-SLUG and plan-SLUG entity payloads (JSON)
6. Format part_of and updates relation payloads (JSON)
7. Return structured output — parent skill handles all Docker persistence
```

This agent does NOT call MCP tools, does NOT write to Docker, and does NOT write to Obsidian. It is a pure transformation agent: markdown in, JSON out.

## Subtasks

| Subtask | Purpose |
|---------|---------|
| `parse` | Extract slug, batch count, task count, decisions from plan content |
| `format-entities` | Produce `feat-SLUG` and `plan-SLUG` JSON for `create_entities` |
| `format-relations` | Produce `part_of` and `updates` relation JSON for `create_relations` |
| `validate` | Check slug format, confirm counts are non-zero, verify entity name conventions |

## Input Schema

```json
{
  "subtask": "parse | format-entities | format-relations | validate",
  "plan_file_path": "docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md",
  "plan_content": "# Emergency Page Overhaul\n\n## Batch 1...",
  "timestamp": "2026-05-13T10:00:00Z"
}
```

## Output Schema

### Extraction Result

```json
{
  "slug": "emergency-page-overhaul",
  "plan_file_path": "docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md",
  "batch_count": 3,
  "task_count": 12,
  "decisions": "Chose ISR over SSR for emergency page; standardised hero headline pattern."
}
```

### Entity Payloads

```json
{
  "entities": [
    {
      "name": "feat-emergency-page-overhaul",
      "entityType": "feature",
      "observations": [
        "status: planned",
        "plan_file: docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md",
        "batches: 3",
        "tasks: 12",
        "created: 2026-05-13T10:00:00Z"
      ]
    },
    {
      "name": "plan-emergency-page-overhaul",
      "entityType": "plan",
      "observations": [
        "file: docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md",
        "status: ready",
        "created: 2026-05-13T10:00:00Z"
      ]
    }
  ]
}
```

### Relation Payloads

```json
{
  "relations": [
    { "from": "plan-emergency-page-overhaul", "to": "feat-emergency-page-overhaul", "relationType": "part_of" },
    { "from": "feat-emergency-page-overhaul", "to": "nexgen-electrical-innovations-state", "relationType": "updates" }
  ]
}
```

## Usage Example

The `plan-sync` skill invokes this agent as follows:

```
Agent(
  subagent_type="general-purpose",
  prompt="[plan-sync AGENT.md content]\n\nsubtask: parse\nplan_file_path: docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md\nplan_content: [raw file content]\ntimestamp: 2026-05-13T10:00:00Z"
)
```

The parent skill then uses the returned entity and relation payloads to call:

```typescript
mcp__memory__create_entities(entities)
mcp__memory__create_relations(relations)
mcp__memory__add_observations(project_state_id, [plan_synced_observation])
```

## Naming Conventions

All entity names produced by this agent must follow Docker naming rules:

- `feat-{slug}` — feature entity (e.g., `feat-emergency-page-overhaul`)
- `plan-{slug}` — plan entity (e.g., `plan-emergency-page-overhaul`)
- Slug must be `kebab-case`: lowercase letters and hyphens only
- Agent auto-normalises slugs with uppercase or underscores and notes the change

## Error Handling

| Scenario | Recovery |
|----------|----------|
| `plan_file_path` not provided | Returns error: expected format `YYYY-MM-DD-{slug}.md` |
| Filename missing date prefix | Returns error with actual filename so parent skill can correct |
| `plan_content` empty | Returns error: parent skill must read and pass file content before invoking |
| Zero batches in plan | Warning only — entity payloads still produced; parent skill decides whether to proceed |
| Zero tasks in plan | Same as zero batches — warning, not a blocking error |
| Decisions section absent | Returns `decisions: null`; continues without blocking |
| Slug contains invalid characters | Auto-normalises to `kebab-case`; documents change in output |

## Integration

- **Invoked by:** `plan-sync` skill (Steps 1 and 3 of the 7-step workflow)
- **Returns to:** `plan-sync` skill — which executes all Docker MCP persistence calls
- **Does NOT call:** `mcp__memory__*` tools, `obsidian-ops` skill, or any external services
- **Related agent:** `knowledge-memory` — handles generic Docker entity formatting; this agent is plan-specific

## Related Files

- **AGENT.md:** `.claude/agents/plan-sync/AGENT.md` — full second-person invocation spec
- **Parent skill:** `.claude/skills/plan-sync/SKILL.md` — 7-step sync workflow that invokes this agent
- **Parent skill README:** `.claude/skills/plan-sync/README.md` — full skill documentation
- **Scripts:** `scripts/mcp-memory-call.mjs` — used by parent skill for idempotent checks (Steps 2 and 7)
