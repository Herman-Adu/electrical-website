---
name: health-check
description: >
  Check the health and availability of all Docker MCP gateway servers before
  dispatching other skills. Returns per-server status (healthy/degraded/unavailable),
  latency, and circuit-breaker state. Use this when asked to verify MCP server
  connectivity, check tool availability, diagnose a failing agent skill, or
  run a pre-flight check before a complex multi-skill workflow.
---

# Health Check Skill

A **meta-skill** — uses the internal HealthMonitor, not an external MCP server. Safe to call at any time, including when other servers are unavailable.

## When to use

- "Are all the MCP servers available?"
- "Why is the browser-testing skill not working?"
- "Run a pre-flight check before the deployment workflow"
- "Check if the resend server is healthy"
- "Show me the status of all 16 MCP servers"

## Steps

1. Optionally identify a subset of servers the user cares about (`serverIds`).
2. Execute the `health-check` skill.
3. Present results in a table: server | status | latency | consecutive failures.
4. For `unavailable` servers, explain the circuit-breaker state and recovery window.
5. Recommend which skills are affected by any unavailable servers.

## Output Interpretation

| Status        | Meaning                                                          |
| ------------- | ---------------------------------------------------------------- |
| `healthy`     | Last ping succeeded, circuit is closed                           |
| `degraded`    | 1–2 consecutive failures, circuit is partially open              |
| `unavailable` | ≥3 consecutive failures, circuit is tripped — in recovery window |

## Guidelines

- Present `healthy` servers briefly; focus detail on `degraded` and `unavailable` ones.
- Include latency in milliseconds — values > 2000ms indicate a slow server.
- If all servers are unavailable, advise checking Docker Desktop is running.
- Circuit resets automatically after the `recoveryWindowMs` window (default: 30s).
