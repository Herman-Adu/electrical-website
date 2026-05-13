---
name: plan-sync
description: Use this skill as the MANDATORY final step of writing-plans, before reporting "done". Also invoke when the orchestrator detects pending_plan_sync on the project state entity. Syncs a written plan document to Docker memory and Obsidian. Trigger phrases: "sync the plan", "save plan to Docker", "plan-sync", invoked automatically by writing-plans and by the pending_plan_sync observation.
argument-hint: "[path/to/plan.md]"
disable-model-invocation: true
---

# Plan-Sync

Parses a written plan file and creates Docker memory entities for it. This is the MANDATORY final step of `writing-plans`. Do not return "done" from writing-plans until plan-sync completes.

## Step 1: Parse the plan file

Read the plan file. Extract:
- Feature slug: from the filename (`YYYY-MM-DD-{slug}.md`)
- Batch count: count lines matching `^## Batch`
- Task count: count lines matching `^### Task`
- Key decisions: any section titled `## Decisions` or inline ADR markers

## Step 2: Check for existing entities (idempotent)

```bash
node scripts/mcp-memory-call.mjs search_nodes "feat-SLUG"
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
```

If `feat-SLUG` already exists: skip `create_entities` for it (use `add_observations` instead).
If `plan-SLUG` already exists: skip creation.

## Step 3: Create entities

Using `mcp__memory__create_entities`:

```json
{
  "entities": [
    {
      "name": "feat-SLUG",
      "entityType": "feature",
      "observations": [
        "status: planned",
        "plan_file: docs/superpowers/plans/YYYY-MM-DD-SLUG.md",
        "batches: N",
        "tasks: M",
        "created: ISO_TIMESTAMP"
      ]
    },
    {
      "name": "plan-SLUG",
      "entityType": "plan",
      "observations": [
        "file: docs/superpowers/plans/YYYY-MM-DD-SLUG.md",
        "status: ready",
        "created: ISO_TIMESTAMP"
      ]
    }
  ]
}
```

## Step 4: Create relations

Using `mcp__memory__create_relations`:

```json
{
  "relations": [
    { "from": "plan-SLUG", "to": "feat-SLUG", "relationType": "part_of" },
    { "from": "feat-SLUG", "to": "nexgen-electrical-innovations-state", "relationType": "updates" }
  ]
}
```

## Step 5: Update project state

Using `mcp__memory__add_observations`:

```json
{
  "observations": [{
    "entityName": "nexgen-electrical-innovations-state",
    "contents": ["plan_synced: feat-SLUG | file: docs/superpowers/plans/FILENAME.md | synced: ISO_TIMESTAMP"]
  }]
}
```

## Step 6: Obsidian sync (if online)

Invoke `obsidian-ops` skill:
- Write feature doc to `Projects/nexgen-electrical-innovations/SLUG.md`
- Write plan doc to `Plans/SLUG-plan.md` with `[[SLUG]]` backlink

If Obsidian is offline: write `pending_obsidian_sync: feat-SLUG` observation to project state. Skip silently.

## Gate check

Confirm sync succeeded:
```bash
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
```

Expected: entity found with `status: ready` observation.

Only report writing-plans as "done" after this check passes.
