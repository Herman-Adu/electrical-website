# Docker Deployment Checklist

## Pre-deploy

- `docker compose config` validates successfully
- Required environment variables are present
- Router configuration is reviewed ([Caddyfile](Caddyfile))

## Deploy

1. `docker compose pull` (if using published images)
2. `docker compose up -d --build`
3. `docker compose ps`

## Verification

- Router health: `curl http://localhost:3000/health`
- Service logs are clean for startup errors
- Priority MCP services respond to smoke checks

## Post-deploy

- Record deployment timestamp and version
- Monitor logs for first 15 minutes
- Confirm no repeated container restarts

## Rollback

- Revert compose/image version
- Restart affected services
- Re-run verification checklist
