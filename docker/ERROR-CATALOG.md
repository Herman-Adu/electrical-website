# Docker MCP Error Catalog

## E01: Router Unhealthy

- **Symptoms:** `/health` fails or returns non-200
- **Checks:** `docker compose ps`, `docker compose logs caddy --tail=200`
- **Actions:** restart `caddy`, validate [Caddyfile](Caddyfile)

## E02: MCP Service Unreachable

- **Symptoms:** route returns 502/504
- **Checks:** service status + service logs
- **Actions:** restart target service, verify route prefix and upstream name

## E03: Service Boot Failure

- **Symptoms:** crash loop / restart count increases
- **Checks:** `docker compose logs <service>`
- **Actions:** fix env/config issue, rebuild image if required

## E04: MCP Tool Timeout

- **Symptoms:** orchestrator preflight reports unavailable/degraded
- **Checks:** target service logs, network health, recent deploys
- **Actions:** restart service and rerun preflight

## E05: Credential/Secret Misconfiguration

- **Symptoms:** auth failures against external APIs
- **Checks:** env var presence (names only), service startup logs
- **Actions:** rotate/reload credentials and redeploy service

## E06: High Resource Pressure

- **Symptoms:** slow responses, OOM kills, unstable latency
- **Checks:** `docker stats`, container restart counts
- **Actions:** scale down load, tune limits, restart impacted services
