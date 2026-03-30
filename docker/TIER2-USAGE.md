# Tier-2 On-Demand Services: Usage Guide

> **Status (this repository):** Optional reference/blueprint, **not part of the default runtime**.
> The current operational stack is the Tier-1 MCP core described in `docker/README.md`.
> This repo currently does **not** ship `compose.tier2.yml` or Tier-2 helper scripts (for example `scripts/start-tier2.sh`).
> Use this document only if you intentionally introduce a separate Tier-2 stack.

## Overview

Tier-2 services are specialized, resource-intensive services that start on-demand when workflows need them, then automatically stop after 5 minutes of inactivity. This approach balances instant availability with cost efficiency.

**Key Principle:** Tier-1 (always-on) + Tier-2 (on-demand) = instant responsiveness without idle overhead

## When to Use Tier-2 Services

### Prisma PostgreSQL

**When:** Code generation with database schema validation

**Example Workflows:**

- Generate TypeScript models from database schema
- Scaffold API endpoints with ORM bindings
- Validate schema migrations

**How to Use:**

```bash
# Option 1: Auto-start via MCP-Automation
# Run any code-generation workflow → Prisma starts automatically

# Option 2: Manual startup
bash scripts/start-tier2.sh prisma-postgres

# Connection string from other containers:
# postgresql://mcp_user:changeme@prisma-postgres:5432/mcp
```

**Expected Performance:**

- Startup: 2-3 seconds
- Health check: pg_isready
- Auto-stop: 5 minutes after last use

### Resend (Email API)

**When:** Client management workflows sending proposals or notifications

**Example Workflows:**

- Send project proposals to clients
- Email project updates
- Batch send newsletters

**How to Use:**

```bash
# Auto-start via /client-management skill
# Or manual start:
bash scripts/start-tier2.sh resend

# API endpoint from other containers:
# http://resend:8000
```

**Expected Performance:**

- Startup: 1 second
- Response time: <500ms per request
- Auto-stop: 5 minutes after last use

### astgrep (AST Pattern Matcher)

**When:** Code analysis and transformation during code generation

**Example Workflows:**

- Analyze codebase structure
- Find patterns and refactor
- Generate boilerplate based on existing code

**How to Use:**

```bash
# Auto-start via /code-generation skill
# Or manual start:
bash scripts/start-tier2.sh astgrep

# Mounted internally to code volume for analysis
```

**Expected Performance:**

- Startup: 1 second
- Scan time: Depends on codebase size
- Auto-stop: 5 minutes after last use

### Context7 (Context Aggregation)

**When:** Planning workflows requiring context synthesis

**Example Workflows:**

- Synthesize research into actionable plans
- Aggregate multiple research topics
- Create comprehensive project briefs

**How to Use:**

```bash
# Auto-start via /planning skill
bash scripts/start-tier2.sh context7

# API endpoint:
# http://context7:8000
```

**Expected Performance:**

- Startup: 2 seconds
- Synthesis: <2s per aggregation
- Auto-stop: 5 minutes after last use

### Fetch (Reference) - HTTP Fetching

**When:** Research workflows as alternative to WebFetch tool

**Example Workflows:**

- Fetch content from multiple URLs
- Alternative to WebFetch when network issues occur
- Reference data fetching

**How to Use:**

```bash
# Auto-start via /research skill if needed
bash scripts/start-tier2.sh fetch-reference

# API endpoint:
# http://fetch-reference:8000
```

**Expected Performance:**

- Startup: 1 second
- Fetch: <5s per URL
- Auto-stop: 5 minutes after last use

### Excalidraw (Reference) - Diagram Generation

**When:** Visualization workflows rendering diagrams

**Example Workflows:**

- Generate architecture diagrams
- Create system flowcharts
- Render Mermaid as Excalidraw JSON

**How to Use:**

```bash
# Auto-start via /visualization skill
bash scripts/start-tier2.sh excalidraw-reference

# API endpoint:
# http://excalidraw-reference:8000
```

**Expected Performance:**

- Startup: 1 second
- Render: <1s per diagram
- Auto-stop: 5 minutes after last use

## Workflow Patterns

### Pattern 1: Pre-Check + Auto-Start (Recommended)

**In MCP-Automation or skill:**

```bash
# 1. Pre-flight validation
bash scripts/pre-workflow-validation.sh code-scaffold
# Output: "Validation PASSED. Tier-2 services that will start on-demand: prisma-postgres, astgrep"

# 2. Run workflow
# MCP-Automation automatically starts Prisma + astgrep
# When workflow completes, countdown to 5-min idle timeout starts

# 3. Idle cleanup happens automatically in background
# (managed by tier2-idle-cleanup.sh daemon)
```

### Pattern 2: Manual Workflow with Explicit Tier-2 Start

```bash
# 1. Validate requirements
bash scripts/pre-workflow-validation.sh planning-sprint --verbose

# 2. Start Tier-2 services explicitly
bash scripts/start-tier2.sh context7

# 3. Run your planning workflow
/planning [goal]

# 4. Cleanup (can be automatic or manual)
docker-compose -f compose.tier2.yml stop context7
```

### Pattern 3: Concurrent Workflows

```bash
# Two workflows running in parallel, each using different Tier-2
# Workflow 1: /code-generation → starts Prisma + astgrep
# Workflow 2: /client-management → starts Resend

# Result:
# - Prisma: Running (used by Workflow 1)
# - astgrep: Running (used by Workflow 1)
# - Resend: Running (used by Workflow 2)
# - Context7: Not running (not needed)
# - Fetch: Not running (not needed)
# - Excalidraw: Not running (not needed)

# After 5 min idle from each workflow: auto-stop
```

## Validation Gates (Pre-Workflow Checks)

Before executing a workflow, MCP-Automation runs:

```bash
bash scripts/pre-workflow-validation.sh <workflow-name>
```

### Available Workflows

```
research-competitors       - GitHub, Wikipedia, Memory
blog-generation           - All Tier-1 services
code-scaffold             - GitHub, OpenAPI, Prisma, astgrep
email-proposal            - Memory, Resend
planning-sprint           - GitHub, Sequential Thinking, Memory, Context7
visualization-diagram     - Sequential Thinking, Excalidraw
social-repurpose          - All Tier-1 services
```

### Validation Example

```bash
$ bash scripts/pre-workflow-validation.sh code-scaffold
Validating prerequisites for workflow: code-scaffold

Tier-1 Services (Required):
✓ github-official is healthy
✓ openapi-schema is healthy

Tier-2 Services (On-Demand):
  ℹ prisma-postgres not running; will start on-demand
  ℹ astgrep not running; will start on-demand

✓ Validation PASSED

Tier-2 services that will start on-demand:
  - prisma-postgres
  - astgrep
```

Exit codes:

- `0` = Ready to execute (all required services healthy)
- `1` = Cannot execute (missing/unhealthy required services)

## Idle Timeout & Automatic Cleanup

### How It Works

1. **Tier-2 service starts:** Timestamp recorded
2. **Workflow uses service:** Timestamp updated
3. **No activity for 5 min:** Service marked idle
4. **Cleanup daemon:** Stops service gracefully
   - Sends SIGTERM (10s grace period)
   - If no response: SIGKILL
   - Logs action to `logs/docker-tier2-cleanup.log`

### Monitoring Cleanup

```bash
# Watch cleanup in real-time
tail -f logs/docker-tier2-cleanup.log

# Check which services are running
docker-compose -f compose.tier2.yml ps

# Manual stop (if needed)
docker-compose -f compose.tier2.yml stop prisma-postgres
```

### Cleanup Daemon

The daemon should run continuously (via cron or systemd):

```bash
# Start daemon in background
nohup bash scripts/tier2-idle-cleanup.sh > /dev/null 2>&1 &

# Or add to crontab (runs every minute)
*/1 * * * * /full/path/to/scripts/tier2-idle-cleanup.sh

# Or systemd service (see OPERATOR-PLAYBOOK.md for setup)
```

## Performance Expectations

### Startup Times

| Service    | Time | Note              |
| ---------- | ---- | ----------------- |
| Prisma     | 2-3s | DB initialization |
| Resend     | 1s   | Fast startup      |
| astgrep    | 1s   | Fast startup      |
| Context7   | 2s   | Fast startup      |
| Fetch      | 1s   | Minimal setup     |
| Excalidraw | 1s   | Minimal setup     |

### Memory Usage

| Service    | Peak  | Idle (if left running) |
| ---------- | ----- | ---------------------- |
| Prisma     | 512MB | ~300MB                 |
| Resend     | 256MB | ~50MB                  |
| astgrep    | 256MB | ~80MB                  |
| Context7   | 256MB | ~60MB                  |
| Fetch      | 128MB | ~40MB                  |
| Excalidraw | 256MB | ~70MB                  |

### Network Behavior

All Tier-2 services communicate via internal `mcp-core` Docker network:

- No external port exposure (except Caddy router)
- <1ms latency between containers
- No rate limiting (internal only)

## Troubleshooting

### Tier-2 Service Won't Start

**Symptom:** `bash scripts/start-tier2.sh prisma-postgres` fails

**Debug:**

```bash
# Check error message
docker-compose -f compose.tier2.yml logs prisma-postgres

# Check resource availability
docker stats

# Check disk space
docker system df
```

**Common Causes:**

1. **Out of disk:** Run `docker system prune` to clean up
2. **Port conflict (Prisma only):** Another service on 5432
   - Solution: Service is already containerized, shouldn't expose port
3. **Network not available:** Run main docker-compose first
   - Solution: `docker-compose up -d` (Tier-1)

### Service Health Check Failing

**Symptom:** Service shows `unhealthy` status

**Debug:**

```bash
docker-compose -f compose.tier2.yml ps prisma-postgres
docker-compose -f compose.tier2.yml logs prisma-postgres | tail -10
```

**Solutions:**

- Wait longer: Health checks have `start_period: 5-10s`
- Restart: `docker-compose -f compose.tier2.yml restart prisma-postgres`
- Check logs: `docker-compose -f compose.tier2.yml logs prisma-postgres`

### Idle Cleanup Not Working

**Symptom:** Tier-2 services stay running after 5 min

**Debug:**

```bash
# Check if daemon is running
ps aux | grep tier2-idle-cleanup

# Check cleanup log
tail -f logs/docker-tier2-cleanup.log

# Manual cleanup test
bash scripts/tier2-idle-cleanup.sh
```

**Solutions:**

- Start daemon: `nohup bash scripts/tier2-idle-cleanup.sh &`
- Check logs for errors
- Restart daemon if hung

## Best Practices

### ✅ Do

1. **Use validation gates** before workflows

   ```bash
   bash scripts/pre-workflow-validation.sh [workflow]
   ```

2. **Let MCP-Automation manage Tier-2** (auto-start/stop)
   - Defined in `.claude/skills/mcp-automation/SKILL.md`

3. **Monitor cleanup logs**

   ```bash
   tail -f logs/docker-tier2-cleanup.log
   ```

4. **Run health checks periodically**
   ```bash
   bash scripts/docker-health-check.sh --all
   ```

### ❌ Don't

1. **Don't manually start Tier-2 for every workflow** — Use validation gates instead

2. **Don't leave cleanup daemon off** — Services won't auto-stop (resource leak)

3. **Don't port-forward Tier-2 externally** — They're internal-only for security

4. **Don't modify `compose.tier2.yml` restart policies** — On-demand = no restart

## Integration with MCP-Automation

### Auto-Detection

MCP-Automation (Phase 22 Week 2+) automatically:

1. Detects which Tier-2 services a workflow needs
2. Starts required services before executing
3. Waits for health checks to pass
4. Executes workflow
5. Starts idle countdown after completion

### Example Workflow Execution

```
User: "Generate a TypeScript API scaffold"
↓
MCP-Automation detects:
  - Requires: GitHub (Tier-1), OpenAPI (Tier-1), Prisma (Tier-2), astgrep (Tier-2)
↓
Validation:
  - GitHub: ✓ Healthy
  - OpenAPI: ✓ Healthy
  - Prisma: Starting...
  - astgrep: Starting...
↓
Workflow executes (both services ready within 3s)
↓
Workflow complete
↓
Tier-2 countdown starts (5 min idle)
↓
(If idle 5 min) Auto-stop Prisma + astgrep
↓
Log: "Stopped idle services: prisma-postgres, astgrep"
```

## See Also

- **Full Phase Plan:** `plans/phases/phase-22-docker-mcp-infrastructure.md`
- **Docker README:** `docker/README.md`
- **Operator Playbook:** `docker/OPERATOR-PLAYBOOK.md` (Phase 22 Week 4)
- **MCP-Automation Skill:** `.claude/skills/mcp-automation/SKILL.md`
