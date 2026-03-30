# Docker MCP Architecture

## Overview

The Docker architecture centers on MCP service containers behind a Caddy path router.

## Core components

- Caddy gateway/router
- MCP service containers (Tier-1 priority and supporting services)
- Shared Docker network for inter-service communication

## Routing model

External requests land on the Caddy gateway and are routed by path prefix to target MCP service containers. See [Caddyfile](Caddyfile) for exact route mappings.

## Health model

- Container liveness and health checks via Docker
- Router liveness via `/health`
- Service readiness validated by orchestrator MCP preflight/smoke checks

## Security model

- Secrets delivered by environment variables or secure host mechanisms
- No secrets committed to repository files
- Security and credential events tracked in `docker/secrets-audit.log`

## Operational model

- Startup, recovery, and backup procedures are documented in [RUNBOOKS.md](RUNBOOKS.md) and [OPERATOR-GUIDE.md](OPERATOR-GUIDE.md)
