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
- `Caddy` router (gateway)

## Not included

The repository does not include bundled Prometheus/Grafana/Loki services.
Tier-2 on-demand services are not enabled in the default runtime stack. If needed for a future workflow, treat [TIER2-USAGE.md](TIER2-USAGE.md) as an optional blueprint and provision a separate compose/scripts layer.

## Standard operations

- Start core app stack: `docker compose up -d`
- Start dev stack: `docker compose -f docker-compose.dev.yml up -d`
- Check health: `docker compose ps`
- Check logs: `docker compose logs -f <service>`
- Router health endpoint: `http://localhost:3100/health`

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
