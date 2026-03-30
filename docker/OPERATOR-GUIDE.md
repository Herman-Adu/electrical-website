# Docker MCP Operator Guide

## Quick start

1. `docker compose up -d --build`
2. `docker compose ps`
3. `curl http://localhost:3000/health`

## Daily operator workflow

- Confirm all required containers are running
- Check recent logs for each Tier-1 service
- Validate gateway route behavior for core paths
- Run orchestrator health/smoke checks for priority MCP services

## Primary commands

- `docker compose ps`
- `docker compose logs -f <service>`
- `docker compose restart <service>`
- `docker stats`

## Backup/restore focus

- Backup required runtime volumes and gateway config
- Restore only affected components, then verify health

## Safety rules

- Never expose real secret values in logs or reports
- Rotate credentials immediately if exposure is suspected
- Prefer dry-run-safe calls for operational smoke tests

## References

- [RUNBOOKS.md](RUNBOOKS.md)
- [ERROR-CATALOG.md](ERROR-CATALOG.md)
- [ERROR-RECOVERY.md](ERROR-RECOVERY.md)
