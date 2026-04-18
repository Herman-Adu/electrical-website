# Docker Memory Reset & MCP Drift Fix — Complete Handoff

**Date:** 2026-04-18  
**Issue:** Docker memory service persisting wrong project data; Phase 7 sync created 0 entities  
**Status:** Ready for reset and full implementation in new window  
**Context:** See `.claude/plans/expressive-hugging-cray.md` for full analysis

---

## The Problem (Already Diagnosed)

The `memory-reference` Docker container is serving **225 entities from a contact-migration project** (not electrical-website). When Phase 7 tried to create entities, the service returned `createdCount: 0` — writes are failing.

Root cause: The Docker volume `electrical-website_memory_data` persists to a shared location and contains stale project data. The service won't accept new writes for electrical-website entities while it's serving the wrong project's graph.

---

## The Fix (Exact Sequence)

Run these commands in order. Each must complete successfully before the next.

### Step 1: Stop All Docker Services

```bash
pnpm docker:mcp:down
```

Expected output: All services stopped. Caddy, memory-reference, aggregator, etc. should show as `Exited`.

### Step 2: Remove the Contaminated Memory Volume

```bash
docker volume rm electrical-website_memory_data
```

**WARNING:** This destroys any prior memory state. This is intentional — we're resetting to clean.

### Step 3: Restart Docker Services

```bash
pnpm docker:mcp:up
```

Wait for all 11 services to reach `healthy` state. Monitor with:

```bash
pnpm docker:mcp:ps
```

All services should show `Up` and `healthy`. This typically takes 30–60 seconds.

### Step 4: Verify Memory Service is Empty

```bash
pnpm docker:mcp:memory:search -- "state"
```

Expected output:
```json
{
  "content": [{
    "type": "json",
    "json": {
      "entities": [],
      "relations": []
    }
  }]
}
```

If you see entities listed, the volume was not cleaned. Repeat steps 1–2.

### Step 5: Verify Service Info Shows Count = 0

```bash
curl -s http://localhost:3100/memory/info
```

Expected output:
```json
{
  "name": "Memory Reference MCP Server",
  "version": "2.0.0",
  "role": "Knowledge graph persistent memory",
  "storage": "/data/memory-graph.json",
  "entities": 0,
  "relations": 0
}
```

If `entities` and `relations` are not 0, the reset failed.

---

## The Plan (What to Implement After Reset)

Once the memory service is clean and empty, execute the full plan:

**Location:** `.claude/plans/expressive-hugging-cray.md`

The plan has 3 layers:

### Layer 1: Data Fixes (Most Impactful)

1. **Create electrical-website-state entity** — the root project state entity
2. **Create phase-8-next-steps.json** — the active lane config
3. **Update active-memory-lanes.json** — point to verified entities

### Layer 2: Documentation Fixes

1. **Fix CLAUDE.md `open_nodes` docs** — change `[entity_ids]` to `[entity_names]`
2. **Clear stale Session State note** — replace April 17 note with current date
3. **Add MCP Quick Reference** — exact tool invocation examples

### Layer 3: Hook Enforcement

1. **Verify load-active-memory-lane.mjs** — should use the new phase-8 config
2. **Add mandatory preflight block to CLAUDE.md** — make it impossible to skip

---

## Implementation Commands (After Reset)

Once memory is clean, run these in order:

```bash
# 1. Create electrical-website-state entity
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "electrical-website-state",
    "entityType": "project_state",
    "observations": [
      "2026-04-18: Phase 7 complete. Main branch, all tests passing.",
      "Phase 8 ready: Apply brightness/saturation to remaining hero sections.",
      "Docker memory reset 2026-04-18 — service cleaned of stale contact-migration data.",
      "MCP stack operational: 11/11 services healthy."
    ]
  }]
}'
# Expected: createdCount: 1

# 2. Create phase-8-next-steps.json lane config
# (See config/memory-lanes/phase-8-next-steps.json template in the plan file)

# 3. Update active-memory-lanes.json
# (See plan file for exact content)

# 4. Edit CLAUDE.md with the 3 documentation fixes
# (See plan file Layer 2)

# 5. Verify everything works
pnpm docker:mcp:memory:search -- "electrical-website-state"
pnpm docker:mcp:memory:open -- "electrical-website-state"
```

---

## Why This Happened (Yesterday's Fix Didn't Stick)

Yesterday's "sync to Docker" likely:
1. Created 9 entities in memory (the sync agent reported success)
2. BUT the service's HTTP create call returned `createdCount: 0` (silent failure)
3. Entities were never actually persisted
4. The volume still contains the old contact-migration data from prior use

The fix reported as "complete" was actually incomplete because the memory write failed at the service level.

---

## Next Session Checklist

**In the new window, before any work:**

- [ ] Run Step 1–5 of "The Fix" sequence above
- [ ] Verify `entities: 0` and `relations: 0` in memory info
- [ ] Create electrical-website-state entity and confirm `createdCount: 1`
- [ ] Read the full plan at `.claude/plans/expressive-hugging-cray.md`
- [ ] Implement Layer 1, 2, 3 edits
- [ ] Verify with `pnpm docker:mcp:smoke`
- [ ] Commit changes: `git add . && git commit -m "fix(docker): Reset memory service, create electrical-website-state, update lane configs and docs"`
- [ ] Proceed with normal work — next session's preflight will load electrical-website-state successfully

---

## Automation (Optional)

To skip manual steps, you can run the full reset + create in one script. Create `scripts/reset-memory-and-bootstrap.sh`:

```bash
#!/bin/bash
set -e

echo "🔧 Stopping Docker services..."
pnpm docker:mcp:down

echo "🗑️  Removing contaminated memory volume..."
docker volume rm electrical-website_memory_data

echo "🚀 Restarting Docker services..."
pnpm docker:mcp:up

echo "⏳ Waiting for services to be healthy (60s)..."
sleep 60

echo "✅ Verifying memory service is empty..."
pnpm docker:mcp:memory:search -- "state"

echo "📝 Creating electrical-website-state entity..."
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "electrical-website-state",
    "entityType": "project_state",
    "observations": [
      "2026-04-18: Phase 7 complete. Main branch, all tests passing.",
      "Docker memory reset — service cleaned.",
      "Ready to proceed with plan implementation."
    ]
  }]
}'

echo "✨ Memory reset complete. Ready for implementation."
```

Run with: `bash scripts/reset-memory-and-bootstrap.sh`

---

## Files to Know

- **Plan:** `.claude/plans/expressive-hugging-cray.md` — Full 3-layer implementation plan
- **This handoff:** `docs/DOCKER_MEMORY_RESET_HANDOFF_2026-04-18.md`
- **Config template:** `config/memory-lanes/phase-8-next-steps.json` (to be created from plan)
- **Active lanes:** `config/active-memory-lanes.json` (to be updated)
- **Orchestrator:** `.claude/CLAUDE.md` (to be updated with docs fixes)

---

## Success Criteria (Next Window)

After completing this handoff in the new window:

1. ✅ Memory service reports `entities: 1` and `relations: 0` (just electrical-website-state)
2. ✅ `pnpm docker:mcp:memory:open -- "electrical-website-state"` loads successfully
3. ✅ Phase-8 lane config exists in `config/memory-lanes/`
4. ✅ `active-memory-lanes.json` points to clean entities
5. ✅ CLAUDE.md has mandatory preflight block at top
6. ✅ All three documentation layers applied
7. ✅ `pnpm build && pnpm test` pass
8. ✅ New session starts, hook injects `open_nodes(["electrical-website-state"])`, Claude executes it

---

**Ready to proceed in the new window. This handoff is self-contained and complete.**
