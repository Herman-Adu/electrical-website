# Docker MCP Runbooks

## Daily health check

1. `docker compose ps`
2. `curl http://localhost:3000/health`
3. `docker compose logs --since=10m`
4. Verify no repeated restarts or fatal errors

## Service degradation

1. Identify failing container in `docker compose ps`
2. Inspect logs: `docker compose logs <service> --tail=200`
3. Restart target service: `docker compose restart <service>`
4. Re-run gateway health and smoke checks

## Gateway routing incident

1. Check Caddy health and logs:
   - `docker compose logs caddy --tail=200`
2. Validate route behavior against [Caddyfile](Caddyfile)
3. Confirm upstream service is reachable from container network

## Backup

Backup volumes and key docker docs used in runtime operations.

```bash
mkdir -p /backup/docker-$(date +%Y-%m-%d)
for vol in memory-kb; do
  docker run --rm \
    -v ${vol}:/source \
    -v /backup/docker-$(date +%Y-%m-%d):/backup \
    alpine tar czf /backup/${vol}.tar.gz -C /source .
done
cp docker/Caddyfile /backup/docker-$(date +%Y-%m-%d)/
cp docker/README.md /backup/docker-$(date +%Y-%m-%d)/
```

## Restore

1. Stop affected services
2. Restore required volume archive(s)
3. Start services and verify health
4. Execute smoke checks for priority MCP services

## Incident response references

- Runtime troubleshooting: [ERROR-CATALOG.md](ERROR-CATALOG.md)
- Recovery procedure: [ERROR-RECOVERY.md](ERROR-RECOVERY.md)
- Operator workflow: [OPERATOR-GUIDE.md](OPERATOR-GUIDE.md)
