# Docker Runtime (MCP Core)

This Docker folder contains the runtime used by the project’s MCP gateway and MCP-backed services.

## Included services

- `github-official`
- `memory-reference`
- `nextjs-devtools`
- `openapi-schema`
- `sequential-thinking`
- `playwright`
- `executor-playwright`
- `wikipedia`
- `youtube-transcript`
- `Caddy` router (gateway)

## Memory backend contract

The `memory-reference` service is a graph-capable persistent memory backend.

Required tool contract exposed through the gateway route `http://localhost:3100/memory/tools/call`:

- `open_nodes`
- `search_nodes`
- `create_entities`
- `create_relations`
- `add_observations`
- `delete_observations`
- `delete_relations`
- `delete_entities`
- `read_graph`

Persistence is backed by a Docker named volume (`memory_data`).

## Not included

The repository does not include bundled Prometheus/Grafana/Loki services.
Tier-2 on-demand services are not enabled in the default runtime stack. If needed for a future workflow, treat [TIER2-USAGE.md](TIER2-USAGE.md) as an optional blueprint and provision a separate compose/scripts layer.

## Standard operations

- Start core app stack: `docker compose up -d`
- Start dev stack: `docker compose -f docker-compose.dev.yml up -d`
- Check health: `docker compose ps`
- Check logs: `docker compose logs -f <service>`
- Router health endpoint: `http://localhost:3100/health`

## MCP quick start (orchestrator default)

Use the package scripts as the default MCP lifecycle entrypoint. This avoids ad-hoc package installs and keeps startup consistent across sessions.

1. Start MCP gateway + services:
   - `pnpm docker:mcp:up`
   - This also runs `scripts/bootstrap-mcp-playwright.mjs` to install Chromium binaries in Playwright MCP containers.

2. Confirm containers are healthy:
   - `pnpm docker:mcp:ps`

3. Run end-to-end MCP endpoint checks:
   - `pnpm docker:mcp:smoke`
   - This now includes protocol checks for `search_nodes`, `open_nodes`, and `read_graph` via `/memory/tools/call`.

4. One-command readiness check:
   - `pnpm docker:mcp:ready`

5. Stop MCP services:
   - `pnpm docker:mcp:down`

## Local port model

- Next.js app: `http://localhost:3000`
- MCP gateway (Caddy): `http://localhost:3100`

Local compose mounts [Caddyfile.local](Caddyfile.local) to avoid the plugin-specific
rate limiting directives used by [Caddyfile](Caddyfile).

## Router paths

The Caddy router maps service routes under path prefixes:

- `/github/*`
- `/openapi/*`
- `/playwright/*`
- `/sequential/*`
- `/memory/*`
- `/nextjs/*`
- `/executor/*`
- `/wikipedia/*`
- `/youtube/*`

See [Caddyfile](Caddyfile) for authoritative routing.

## Troubleshooting baseline

1. Confirm containers are running: `docker compose ps`
2. Confirm router responds: `curl http://localhost:3100/health`
3. Check service logs for failures: `docker compose logs <service>`
4. Validate MCP integration through orchestrator health checks

## Related docs

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [OPERATOR-GUIDE.md](OPERATOR-GUIDE.md)
- [RUNBOOKS.md](RUNBOOKS.md)
- [ERROR-CATALOG.md](ERROR-CATALOG.md)
- [ERROR-RECOVERY.md](ERROR-RECOVERY.md)
- [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- [../docs/LOCAL_TESTING_SETUP.md](../docs/LOCAL_TESTING_SETUP.md)
- [../docs/ORCHESTRATOR_MEMORY_FIRST_PLAYBOOK.md](../docs/ORCHESTRATOR_MEMORY_FIRST_PLAYBOOK.md)
