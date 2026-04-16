# Docker MCP Services Stack

The `electrical-website` project uses a **Docker-based Model Context Protocol (MCP) services stack** as the single source of truth for persistent session context, code intelligence, and workflow automation.

## 🎯 Purpose

This Docker stack provides:

- **Memory Reference Service** (port 7777 via Caddy 3100) — Persistent entity graph for session context, decisions, learnings, and project state
- **AI & Analysis Tools** — Sequential thinking for complex problem decomposition
- **Web & Code Tools** — Playwright (browser automation), Next.js DevTools, GitHub API integration
- **Infrastructure Tools** — Caddy reverse proxy, OpenAPI schema validation, Wikipedia, YouTube transcript extraction
- **Orchestrator Automation** — Session lifecycle hooks coordinating MCP service calls

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│      Caddy Reverse Proxy (port 3100)       │
│  Routes all MCP service calls via gateway   │
└────────────────────────────────────────────┬┘
        │
        ├─ /memory          → memory-reference:8000
        ├─ /github          → github-official:8000
        ├─ /openapi         → openapi-schema:8000
        ├─ /playwright      → playwright:8000
        ├─ /sequential      → sequential-thinking:8000
        ├─ /nextjs          → nextjs-devtools:8000
        ├─ /executor        → executor-playwright:8000
        ├─ /wikipedia       → wikipedia:8000
        ├─ /youtube         → youtube-transcript:8000
        └─ /aggregator      → mcp-aggregator:8000
```

## 📦 MCP Services

| Service | Purpose | Technology |
|---------|---------|-----------|
| **memory-reference** | Persistent entity graph (session state, decisions, learnings) | Node.js + SQLite/in-memory |
| **github-official** | GitHub API integration (issues, PRs, code search) | Node.js + github SDK |
| **openapi-schema** | OpenAPI specification validation & documentation | Node.js |
| **playwright** | Browser automation (E2E testing, screenshots, web scraping) | Node.js + Playwright |
| **sequential-thinking** | Extended thinking for complex problem decomposition | Node.js |
| **nextjs-devtools** | Next.js diagnostics (build info, page analysis) | Node.js |
| **executor-playwright** | Playwright execution engine for automated workflows | Node.js + Playwright |
| **wikipedia** | Wikipedia content retrieval & summarization | Node.js |
| **youtube-transcript** | YouTube video transcript extraction | Node.js (Dockerized) |
| **mcp-aggregator** | Aggregates multiple MCP services for unified queries | Node.js (Dockerized) |
| **caddy** | HTTP/HTTPS reverse proxy & gateway | Caddy 2.x |

## 🚀 Quick Start

### Start the MCP Stack

```bash
pnpm docker:mcp:up
```

This command:
1. Starts all 11 MCP services in parallel
2. Waits for all containers to become healthy
3. Bootstraps Playwright runtime (Chromium installation)
4. Reports when fully ready

### Verify All Services Are Healthy

```bash
pnpm docker:mcp:ready
```

This runs the full startup and readiness checks. Output shows:
- Container status (Running/Healthy)
- Health check results for each service
- Smoke test results (all endpoints responding correctly)
- Final status: `✅ All MCP services are healthy`

### Detailed Status Checks

```bash
# List all MCP service containers with status
pnpm docker:mcp:ps

# Stream live logs from all MCP services
pnpm docker:mcp:logs

# Run comprehensive health & endpoint connectivity test
pnpm docker:mcp:smoke
```

### Stop the MCP Stack

```bash
pnpm docker:mcp:down
```

## 🔑 Memory-Reference Service

The `memory-reference` service is the **single source of truth** for all persistent context across sessions.

### What It Does

- **Stores entities:** features, decisions, learnings, sessions, infrastructure, project state
- **Maintains relations:** depends_on, derives_from, documents, updates, supersedes, related_to
- **Tracks observations:** build status, blockers, learnings, performance metrics, test results
- **Enables search:** find entities by name, phase, status, category using `search_nodes()`
- **Provides access:** load entity content and relations using `open_nodes()`

### Session Lifecycle via Memory Service

**Session Start (5 seconds, ~50 tokens):**
```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
# Returns: entity_id (e.g., "state-abc123")

mcp__MCP_DOCKER__open_nodes([entity_id])
# Returns: { current_branch, active_phase, next_tasks, blockers }
```

**Session End (2–3 minutes, ~200–300 tokens):**
```bash
mcp__MCP_DOCKER__create_entities([new_session, learnings, decisions])
mcp__MCP_DOCKER__add_observations(project_state_id, [build, session_end])
mcp__MCP_DOCKER__create_relations([new_links])
```

### Entity Types

| Type | Purpose | Example |
|------|---------|---------|
| `project_state` | Current branch, build status, phase, tasks | `electrical-website-state` |
| `feature` | Deliverable work (spec, implementation, tests) | `feat-phase-5-animation-optimization` |
| `learning` | Technical patterns and insights | `learn-gpu-transform-compositing` |
| `decision` | Architectural choices with rationale | `decide-memory-docker-over-files` |
| `infrastructure` | Docker services, CI/CD pipelines | `infra-mcp-docker-services` |
| `session` | Handoff context between sessions | `session-2026-04-17-001` |

For full schema and naming conventions: see [../. claude/rules/memory-policy.md](../.claude/rules/memory-policy.md)

## 🎯 Session Automation via Hooks

Three hooks (in `.claude/settings.json`) automate the session lifecycle:

### SessionStart Hook (Automatic)

Runs `bash .claude/hooks/session-start.sh` at session start:
1. Confirms Docker health (verifies containers running)
2. Loads project state from memory-reference
3. Reads current branch, active phase, blockers
4. Reports orchestrator readiness

### UserPromptSubmit Hook (Automatic)

Runs `node .claude/hooks/context-monitor.mjs` before each response:
- Monitors context window usage
- At 70% context: offers memory sync option
- Updates Docker entities with WIP progress
- Writes temporary commit to preserve work

### PreCompact Hook (Automatic)

Runs `bash .claude/hooks/precompact-safety.sh` before compression:
- Ensures all work is safely staged
- Confirms Docker sync completed
- Prevents data loss during context compression

## 🔧 Common Memory Operations

### Load Project State at Session Start

```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
# Returns: { entity_id: "state-abc123" }

mcp__MCP_DOCKER__open_nodes(["state-abc123"])
# Returns: {
#   current_branch: "main",
#   active_phase: "Phase 6",
#   next_tasks: ["Implement dark mode"],
#   blockers: []
# }
```

### Create a New Feature

```bash
mcp__MCP_DOCKER__create_entities([{
  type: "feature",
  name: "feat-phase-6-dark-mode-support",
  properties: {
    title: "Dark Mode Support",
    phase: "Phase 6",
    status: "in-progress",
    test_coverage: 0.85
  }
}])
```

### Record a Blocker

```bash
mcp__MCP_DOCKER__add_observations(feature_id, [{
  category: "blocker",
  timestamp: "2026-04-17T10:30:00Z",
  severity: "high",
  title: "iOS Safari scroll timing issue",
  affected_component: "ServicesHero"
}])
```

### End of Session Sync

```bash
mcp__MCP_DOCKER__create_entities([{ type: "session", ... }])
mcp__MCP_DOCKER__add_observations(state_id, [{ category: "session_end", ... }])
mcp__MCP_DOCKER__create_relations([{ type: "derives_from", ... }])
```

## 📋 Standard Operations

| Command | Purpose |
|---------|---------|
| `pnpm docker:mcp:up` | Start MCP gateway + all 11 services |
| `pnpm docker:mcp:down` | Stop MCP services (containers remain) |
| `pnpm docker:mcp:ps` | List service containers and status |
| `pnpm docker:mcp:logs` | Stream live logs from all services |
| `pnpm docker:mcp:smoke` | Run health & endpoint connectivity tests |
| `pnpm docker:mcp:ready` | Full startup + health + smoke test |

## 🔌 Router Paths & Gateway

The Caddy reverse proxy (port 3100) maps service routes:

- `http://localhost:3100/memory/tools/call` → memory-reference service
- `http://localhost:3100/github/tools/call` → github-official service
- `http://localhost:3100/playwright/tools/call` → playwright service
- `http://localhost:3100/sequential/tools/call` → sequential-thinking service
- etc.

All MCP tools are accessible via the unified gateway endpoint.

## 🐛 Troubleshooting

### Check Docker Health

```bash
pnpm docker:mcp:ps
# All services should show: Status = "Healthy"
```

### View Service Logs

```bash
pnpm docker:mcp:logs
# Shows real-time output from all 11 services
```

### Restart a Service

```bash
docker compose restart memory-reference
# or any other service name
```

### Memory Service Not Responding

```bash
curl http://127.0.0.1:3100/memory/health
# Should return: { "status": "ok" }
```

### Reset Memory Data

```bash
docker compose down -v  # Remove all volumes including memory_data
pnpm docker:mcp:up     # Restart with fresh memory database
```

## 📚 Reference

- **Orchestrator Contract:** [../.claude/CLAUDE.md](../.claude/CLAUDE.md)
- **Memory Policy:** [../.claude/rules/memory-policy.md](../.claude/rules/memory-policy.md)
- **Docker Compose Stack:** [../docker-compose.yml](../docker-compose.yml)
- **Caddy Configuration:** [./Caddyfile](./Caddyfile)
- **Local Configuration:** [./Caddyfile.local](./Caddyfile.local)

## 🔐 Security

- All services run in isolated Docker containers
- No secrets hardcoded — use environment variables only
- Memory data persists to `memory_data/` Docker volume
- GitHub token optional (higher rate limits with auth)
- Caddy enforces HTTPS in production, HTTP in local dev

---

**Last Updated:** 2026-04-17  
**Status:** Current (4th implementation, MCP services stack — final clean version)  
**Maintained by:** Orchestrator (Herman Adu / Claude Code)
