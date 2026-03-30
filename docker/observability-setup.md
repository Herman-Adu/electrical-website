# Docker Observability Stack — Decommission Notice

This repository no longer ships Docker-native observability services for metrics/log dashboards.

## Removed components

- `docker/grafana/`
- `docker/loki-config.yml`
- `docker/prometheus.yml`
- `docker/prometheus-alerts.yml`

## Current operational visibility

Use the active operational path below:

- Container health and status: `docker compose ps`, `docker stats`
- Service diagnostics: `docker compose logs <service>`, `docker compose logs -f`
- Router liveness: `GET /health` on Caddy router
- MCP readiness: orchestrator health checks and skill smoke calls
- Security/audit trail: `docker/secrets-audit.log`

## Reintroduction policy

If observability is reintroduced later, add it as an optional module with isolated compose overlays and dedicated docs. Do not couple it to baseline Docker startup or deployment checklists.
