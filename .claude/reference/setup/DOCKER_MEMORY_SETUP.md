# Docker Memory Service Setup Guide

**Effective Date:** 2026-04-16  
**Status:** Reference  

---

## Quick Start

This guide walks through setting up the Docker `memory-reference` MCP service for the electrical-website project.

---

## Prerequisites

- Docker daemon running locally
- MCP server binary (provided by Anthropic)
- Network access to `localhost:3100` (Caddy gateway)
- Bash or compatible shell

---

## Installation Steps

### Step 1: Verify Docker is Running

```bash
docker ps
# Expected: Lists running containers (may be empty)

docker --version
# Expected: Docker version [X.Y.Z]
```

If Docker is not running, start the daemon:
- **macOS:** `open /Applications/Docker.app`
- **Windows:** Open Docker Desktop from Start menu
- **Linux:** `sudo systemctl start docker`

---

### Step 2: Create Memory Service Directory

```bash
mkdir -p ~/.claude/docker-memory
cd ~/.claude/docker-memory
```

---

### Step 3: Initialize Memory Graph Database

Create the initial graph schema:

```bash
# Create schema file
cat > schema.json <<'EOF'
{
  "entity_types": [
    "project_state",
    "feature",
    "learning",
    "decision",
    "infrastructure",
    "session",
    "session_archive"
  ],
  "relation_types": [
    "derives_from",
    "depends_on",
    "documents",
    "updates",
    "supersedes",
    "related_to"
  ],
  "observation_categories": [
    "build",
    "blocker",
    "performance",
    "learning",
    "regression",
    "session_end"
  ]
}
EOF
```

---

### Step 4: Start Docker MCP Service

The MCP service should be running as a background process or Docker container. Verify it's listening:

```bash
curl -s http://localhost:3100/health
# Expected: OK

curl -s -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"search_nodes","arguments":{"query":""}}}'
# Expected: JSON array of entities
```

---

### Step 5: Initialize Project Context

Create the initial `project_state` entity:

```bash
cat > init_project_state.sh <<'EOF'
#!/bin/bash

# Initialize electrical-website project state via MCP gateway
curl -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"create_entities","arguments":{"entities":[{
    "type": "project_state",
    "name": "electrical-website-state",
    "properties": {
      "project_name": "electrical-website",
      "current_branch": "main",
      "build_status": "passing",
      "active_phase": null,
      "next_tasks": [],
      "blockers": [],
      "last_updated": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
    }
  }]}}}'
EOF

chmod +x init_project_state.sh
./init_project_state.sh
```

Expected response: JSON object with created entity details

---

## Health Checks

### Verify Service is Running

```bash
# Health endpoint
curl http://localhost:3100/health

# Search all entities via MCP gateway
curl -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"search_nodes","arguments":{"query":"project_state"}}}'
```

### Verify Initial Data

```bash
# Search for project state entity
curl -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"search_nodes","arguments":{"query":"electrical-website-state"}}}'
```

---

## Integration with Claude Code

The orchestrator (main Claude agent) integrates with Docker memory via these tool calls:

### Search Entities

```python
# Search for project state at session start
search_nodes("electrical-website-state")
→ Returns: [entity_id_1, entity_id_2, ...]
```

### Load Entities

```python
# Load entity by ID
open_nodes(["entity_id_1", "entity_id_2"])
→ Returns: [{ type, name, properties, observations }, ...]
```

### Create Entities

```python
# Create new feature, learning, or decision
create_entities([{
  "type": "feature",
  "name": "feat-phase-5-dark-mode",
  "properties": { ... }
}])
→ Returns: [{ id, type, name, properties }]
```

### Add Observations

```python
# Append observations to existing entity
add_observations(entity_id, [{
  "category": "build",
  "status": "passing",
  "timestamp": "2026-04-16T20:15:00Z"
}])
→ Returns: { id, observations: [{ ... }, ...] }
```

### Create Relations

```python
# Link entities
create_relations([{
  "type": "depends_on",
  "source": "feat_id_1",
  "target": "feat_id_2",
  "reason": "..."
}])
→ Returns: [{ type, source, target }]
```

---

## Troubleshooting

### Service Not Responding

**Symptom:** `curl http://localhost:3100/health` times out

**Diagnosis:**
```bash
# Check if Caddy gateway is listening on port 3100
lsof -i :3100  # macOS/Linux
netstat -an | grep 3100  # Windows

# Check Docker logs for memory service
docker logs memory-reference

# Check Caddy logs
docker logs caddy-gateway
```

**Fix:**
1. Restart Docker: `docker restart caddy-gateway && docker restart memory-reference`
2. Or restart the MCP service processes
3. Re-run health check

---

### Entities Not Found

**Symptom:** `search_nodes("electrical-website-state")` returns empty

**Diagnosis:**
```bash
# Verify schema was initialized
curl http://localhost:3100/memory/api/entities

# Check for typos in entity name
curl http://localhost:3100/memory/api/entities?type=project_state
```

**Fix:**
- Re-run initialization step 5
- Verify entity name spelling matches `.claude/rules/memory-policy.md` (naming conventions section)

---

### Port Already in Use

**Symptom:** `curl http://localhost:3100/memory/health` connects to wrong service

**Fix:**
```bash
# Kill process on port 7777
lsof -ti:7777 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :7777 | findstr LISTENING  # Windows

# Or use different port (edit MCP server config)
```

---

## Backup & Recovery

### Backup Memory Graph

```bash
# Export all entities via MCP gateway
curl -X POST http://localhost:3100/memory/tools/call \
  -H "Content-Type: application/json" \
  -d '{"params":{"name":"search_nodes","arguments":{"query":""}}}' \
  > ~/backup_entities_$(date +%Y-%m-%d).json

# Store in Git (optional, if not containing secrets)
git add .claude/backups/
git commit -m "backup: memory graph snapshot"
```

Note: Import/restore capabilities depend on Docker memory service implementation. Contact the Anthropic team for advanced backup/restore procedures.

---

## Performance Tuning

### Optimize Search

The Docker memory service handles indexing automatically. For best performance:
- Use specific search queries (e.g., `feat-phase-5` instead of empty string)
- Consolidate fine-grained entities using `supersedes` relations
- Archive old entities after 90 days

### Monitor Storage

Performance monitoring depends on Docker memory service implementation. Check logs for performance metrics:

```bash
docker logs memory-reference | grep -i "performance\|duration"
```

---

## Current Policy: Docker Memory Only

**As of 2026-04-17:** The project uses Docker `memory-reference` MCP service exclusively for persistent context. No `.md` files are used for memory storage.

**Prohibited:** Creating `.md` files for memory, session state, staging, handoff, rehydration, or seeding purposes in any `.claude/` subdirectory.

**All session context is persisted via Docker entities** (project_state, feature, learning, decision, infrastructure, session) and observations (build, test, blocker, learning, performance).

---

## CI/CD Integration

Add health check to GitHub Actions:

```yaml
# .github/workflows/health-check.yml
name: Memory Service Health

on: [push, workflow_dispatch]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Docker memory service
        run: |
          curl -f http://localhost:3100/health || exit 1
        timeout-minutes: 1
        continue-on-error: true  # Non-blocking for now
```

---

## Security Considerations

### Restrict Access

```bash
# If running on network, restrict to localhost
# In Docker: bind to 127.0.0.1 only
docker run -p 127.0.0.1:3100:3100 memory-reference
```

### Encrypt Sensitive Data

Encryption is handled by the Docker memory service. No additional configuration needed for standard deployments.

---

## Support & Debugging

### Enable Debug Logging

```bash
# Export debug flag
export MCP_DEBUG=true

# Run memory service with debug output
docker run -e MCP_DEBUG=true memory-reference
```

### Check Logs

```bash
# Docker container logs
docker logs memory-reference

# Caddy gateway logs
docker logs caddy-gateway

# Or system logs (if running as service)
journalctl -u docker-memory --follow
```

### Report Issues

If you encounter issues:
1. Capture output: `curl -v http://localhost:3100/health 2>&1 | tee debug.log`
2. Check `.claude/rules/memory-policy.md` Troubleshooting section
3. Review `.claude/reference/ERROR_RECOVERY.md` (if exists)

---

**Last Updated:** 2026-04-16  
**Status:** Ready for Implementation
