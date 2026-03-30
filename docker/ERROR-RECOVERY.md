# Docker MCP Error Recovery

## Recovery principles

- Recover the smallest failing scope first (single service before full stack)
- Validate health after each intervention
- Keep audit trace of actions taken

## Standard recovery sequence

1. Identify failing component (`docker compose ps`)
2. Inspect logs (`docker compose logs <service> --tail=200`)
3. Restart service (`docker compose restart <service>`)
4. Verify route health and orchestrator smoke checks

## Router recovery

- Validate [Caddyfile](Caddyfile)
- Restart router container
- Retest all configured route prefixes

## Service recovery

- Confirm required env vars exist
- Rebuild/restart target service
- Validate at least one safe smoke tool call

## Full-stack recovery

1. `docker compose down`
2. `docker compose up -d --build`
3. Run health + smoke verification

## Escalation

Escalate when repeated failures occur after two controlled recovery attempts or when security/credential failures are suspected.
