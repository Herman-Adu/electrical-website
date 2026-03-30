# Docker MCP Metrics Baseline

This baseline tracks operational health using Docker-native telemetry and service checks.

## Core baseline signals

- Container status and restart counts
- Basic CPU/memory pressure (`docker stats`)
- Router health (`/health`)
- MCP preflight result trends (healthy/degraded/unavailable)
- Service error-rate signals from container logs

## Collection cadence

- During deployments: every 5 minutes for first 30 minutes
- Steady state: daily snapshot + incident-triggered snapshots

## Baseline targets

- No crash loops in Tier-1 services
- Router health remains 200
- Priority MCP services remain preflight healthy
- No sustained error bursts in service logs

## Incident thresholds

- Repeated restarts within 10 minutes
- Sustained timeouts in MCP smoke checks
- Significant memory growth during normal load

## Storage

Retain daily snapshot notes and incident snapshots with timestamp, service name, and summary action.
