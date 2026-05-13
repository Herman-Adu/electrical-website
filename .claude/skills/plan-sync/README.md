# Plan-Sync Skill

Mandatory final step of `writing-plans`: parses a written plan file, creates Docker memory entities (feature + plan), wires relations to project state, and syncs to Obsidian. Plans are not "done" until this skill completes successfully.

## When to Use

This skill runs automatically as the FINAL step of the `writing-plans` skill. It is also invoked manually when:
- The orchestrator detects a `pending_plan_sync` observation on the project state entity
- A plan file was written but the sync step was missed (e.g., session interrupted mid-plan)

**Trigger phrases:**
- "Sync the plan to Docker memory"
- "Save plan to Docker"
- "plan-sync" (explicitly)
- Automatically triggered by `writing-plans` before it reports done
- `/plan-sync [path/to/plan.md]`

## How It Works

```
1. Parse the plan file — extract slug, batch count, task count, decisions
2. Check Docker for existing entities (idempotent — skip if already exists)
3. Create feat-SLUG and plan-SLUG entities in Docker memory
4. Create relations: plan → feature (part_of), feature → project_state (updates)
5. Update project state with plan_synced observation
6. Sync to Obsidian (if online): feature note + plan crosslink
7. Gate check: confirm plan-SLUG exists with status: ready
```

Only after Step 7 passes does `writing-plans` report "done".

## Step-by-Step Details

### Step 1: Parse

From the plan file path (`docs/superpowers/plans/YYYY-MM-DD-SLUG.md`):
- Extract `SLUG` from filename
- Count `## Batch` headings → batch count
- Count `### Task` headings → task count
- Extract `## Decisions` section or inline ADR markers

### Step 2: Idempotent Check

```bash
node scripts/mcp-memory-call.mjs search_nodes "feat-SLUG"
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
```

If either entity already exists, skip `create_entities` for it (use `add_observations` to update instead).

### Steps 3–5: Docker Entities and Relations

Creates two entities:

```json
{
  "name": "feat-SLUG",
  "entityType": "feature",
  "observations": ["status: planned", "batches: N", "tasks: M", "created: ISO_TIMESTAMP"]
}
```

```json
{
  "name": "plan-SLUG",
  "entityType": "plan",
  "observations": ["file: docs/superpowers/plans/YYYY-MM-DD-SLUG.md", "status: ready"]
}
```

Relations wired:
- `plan-SLUG` → `feat-SLUG` (`part_of`)
- `feat-SLUG` → `nexgen-electrical-innovations-state` (`updates`)

Project state observation added:
```
plan_synced: feat-SLUG | file: FILENAME.md | synced: ISO_TIMESTAMP
```

### Step 6: Obsidian Sync

Invokes `obsidian-ops` skill to write:
- `Projects/nexgen-electrical-innovations/SLUG.md` — feature documentation
- `Plans/SLUG-plan.md` — plan note with `[[SLUG]]` backlink

If Obsidian is offline: writes `pending_obsidian_sync: feat-SLUG` observation and skips silently.

### Step 7: Gate Check

```bash
node scripts/mcp-memory-call.mjs search_nodes "plan-SLUG"
# Expected: entity found with status: ready observation
```

## Usage Example

Plan written by `writing-plans` skill:
```
docs/superpowers/plans/2026-05-13-emergency-page-overhaul.md
```

Plan-sync processes this as:
- SLUG: `emergency-page-overhaul`
- Creates: `feat-emergency-page-overhaul`, `plan-emergency-page-overhaul`
- Relations: plan → feat (part_of), feat → project_state (updates)
- Obsidian: writes `Projects/nexgen-electrical-innovations/emergency-page-overhaul.md`

Confirmation output:
```
plan-sync: SUCCESS
- feat-emergency-page-overhaul created (status: planned, batches: 3, tasks: 12)
- plan-emergency-page-overhaul created (status: ready)
- Relations wired: 2
- Obsidian: SYNCED
- Gate check: PASSED
writing-plans: done
```

## Integration

- **Invoked by:** `writing-plans` skill (mandatory last step); orchestrator (when `pending_plan_sync` detected)
- **Calls:** `obsidian-ops` skill for vault sync
- **Writes to:** Docker memory (`feat-*`, `plan-*` entities) and Obsidian vault
- **Does NOT:** Start implementation — that begins only after `plan-sync` confirms success

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Plan file not found | Ask user for correct path; do not proceed without a readable plan file |
| Docker memory unavailable | Log `pending_plan_sync: PATH` in `.claude/CLAUDE.md` fallback; skip entity creation; mark writing-plans done with warning |
| Entity already exists (re-sync) | Use `add_observations` to update status instead of `create_entities`; skip creation |
| Obsidian offline | Write `pending_obsidian_sync: feat-SLUG` to project state; continue; mark done |
| Gate check fails (entity not found) | Retry `create_entities` once; if still failing, check Docker connectivity |

## When NOT to Use

- Do NOT run plan-sync on partially written plans — the plan file must be complete before syncing
- Do NOT run plan-sync before `writing-plans` finishes — it is a dependent step, not independent
- Do NOT skip plan-sync and go straight to implementation — the orchestrator checks for `pending_plan_sync` before dispatching any implementation agent

## Related Files

- **SKILL.md:** `.claude/skills/plan-sync/SKILL.md` — full execution steps with Docker call examples
- **Related skill:** `writing-plans` — calls plan-sync as its mandatory final step
- **Related skill:** `obsidian-ops` — invoked at Step 6 for vault sync
- **Scripts:** `scripts/mcp-memory-call.mjs` — Docker memory Node.js wrapper used in steps 2–7
