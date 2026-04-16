# Orchestrator Memory Rehydration from Docker

Guide for setting up Docker-based memory persistence for orchestrator sessions. Enables efficient memory rehydration across new sessions without re-reading markdown files.

## Architecture

```
Session 1                       Docker Memory Service            Session 2
┌──────────────┐               ┌──────────────────────┐         ┌──────────────┐
│ Orchestrator │ ──save───→    │ memory-reference     │ ←─load── │ Orchestrator │
│ (Phase 2)    │               │ (graph DB in volume) │         │ (Phase 3)    │
└──────────────┘               └──────────────────────┘         └──────────────┘
     writes                       persists data                    reads
```

- **Memory Backend:** Docker `memory-reference` service (graph-based, persistent)
- **Storage:** Docker named volume `memory_data` (survives container restarts)
- **API Gateway:** Caddy router at `http://localhost:3100/memory/*`
- **Orchestrator Access:** via `mcp__MCP_DOCKER__*` tools

## Setup (One-Time)

### Quick Setup (Recommended)

One command initializes everything:

```bash
# macOS/Linux
pnpm orchestrator:bootstrap

# Windows
pnpm orchestrator:bootstrap:win
```

This command:
1. ✅ Starts Docker Compose stack
2. ✅ Verifies all services healthy
3. ✅ Bootstraps animation memory lanes
4. ✅ Verifies Caddy gateway

### Manual Setup (Advanced)

If you prefer to run steps individually:

**Step 1: Start Docker Compose**

```bash
pnpm docker:mcp:up
```

**Step 2: Verify Services**

```bash
pnpm docker:mcp:ps
```

Expected: All services show as `healthy` or `running`

**Step 3: Bootstrap Memory**

```bash
pnpm docker:mcp:memory:bootstrap
```

Output:
```
✓ Created entity: Animation Phase 2 - Complete
✓ Created entity: Animation Phase 3 - Queued Tasks
✓ Created entity: Animation Audit - Baseline & Inventory
```

**Step 4: Verify Memory Access**

```bash
curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"read_graph","arguments":{}}'
```

Expected: Returns JSON graph with entities

## Using in New Sessions

### Session Entry Point

When starting a new session, orchestrator automatically loads memory from Docker:

**Prompt for Next Session:**

```
Resume animation optimization project from Phase 3.

**Rehydrate from Docker Memory:**
- Query memory lanes: "animation_phase2_complete", "animation_phase3_queue"
- Branch: feat/animation-optimization
- Last commit: 7b1cd46

**Docker MCP Tools Available:**
- mcp__MCP_DOCKER__search_nodes(query, limit)
- mcp__MCP_DOCKER__open_nodes(ids)
- mcp__MCP_DOCKER__read_graph()
- mcp__MCP_DOCKER__create_entities(entities)
- mcp__MCP_DOCKER__add_observations(entity_id, observations)

**Phase 3 Execution:**
1. Search memory for animation phase 3 queue
2. Dispatch gsap-scrolltrigger agent for illumination brightness optimization
3. Continue with remaining Phase 3 tasks

**Ready:** Docker memory is configured and persistent across sessions.
```

### Code Pattern in New Session

```typescript
// Search for animation memory lanes
const result = await fetch('http://localhost:3100/memory/tools/call', {
  method: 'POST',
  body: JSON.stringify({
    tool: 'search_nodes',
    params: { query: 'animation_phase', limit: 10 }
  })
});

const entities = await result.json();
// Load entities into orchestrator context
```

## Memory Lane Structure

### Lane: `animation_phase2_complete`
- **Type:** `project_phase`
- **Status:** Complete
- **Commit:** 7b1cd46
- **Changes:** Filter → opacity overlay optimizations
- **Performance:** 60fps desktop, 45fps+ mobile targets

### Lane: `animation_phase3_queue`
- **Type:** `project_queue`
- **Status:** Queued
- **Tasks:** 4 prioritized optimization tasks
- **Pattern:** Same as Phase 2 approach

### Lane: `animation_audit_baseline`
- **Type:** `project_reference`
- **Content:** Complete audit with 20+ animations, baselines, priorities

## Maintenance

### View Current Memory State

```bash
docker compose logs memory-reference | grep -E "load|save|persist"
```

### Update Memory Lanes (Add New Data)

Edit `config/memory-lanes-animation.json`, then:

```bash
node scripts/bootstrap-memory-animation.mjs
```

### Reset Memory (Clear All Data)

```bash
docker volume rm electrical-website_memory_data
pnpm docker:mcp:down
pnpm docker:mcp:up
```

### Backup Memory Graph

```bash
docker compose exec memory-reference cat /data/memory-graph.json > backups/memory-graph.$(date +%s).json
```

## Token Efficiency Gains

| Scenario | Traditional (Markdown) | Docker Memory |
|----------|------------------------|---------------|
| Rehydrate context in new session | Read 3-5 markdown files (2-3KB each) | Query Docker graph (100 bytes) |
| Token cost per rehydration | ~1,500 tokens | ~150 tokens |
| Savings per session | — | **90% reduction** |

## Troubleshooting

### Memory Service Not Responding

```bash
curl http://localhost:3100/health
```

If 404, start services:

```bash
pnpm docker:mcp:up
pnpm docker:mcp:ready
```

### Bootstrap Script Fails

Ensure Docker Compose is running and healthy:

```bash
pnpm docker:mcp:ps
pnpm docker:mcp:smoke
```

### View Memory Service Logs

```bash
docker compose logs -f memory-reference
```

### Verify Graph Structure

```bash
docker compose exec memory-reference ls -la /data/
docker compose exec memory-reference cat /data/memory-graph.json | jq '.entities | length'
```

## Related Docs

- [docker/README.md](../docker/README.md) — Docker MCP services
- [docker/ARCHITECTURE.md](../docker/ARCHITECTURE.md) — System architecture
- [config/memory-lanes-animation.json](../config/memory-lanes-animation.json) — Animation memory structure
- [scripts/bootstrap-memory-animation.mjs](../scripts/bootstrap-memory-animation.mjs) — Bootstrap script

## Next Steps

1. ✅ Docker Compose configured with memory-reference service
2. ✅ Animation memory lanes defined in config
3. ✅ Bootstrap script created
4. **→ Run bootstrap:** `node scripts/bootstrap-memory-animation.mjs`
5. **→ New session:** Use the provided prompt to rehydrate and continue Phase 3
