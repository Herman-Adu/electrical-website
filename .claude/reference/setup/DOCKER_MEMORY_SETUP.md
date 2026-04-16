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
- Network access to `localhost:7777`
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
curl -s http://localhost:7777/health
# Expected: { "status": "healthy" }

curl -s http://localhost:7777/api/entities
# Expected: { "entities": [] } or similar
```

---

### Step 5: Initialize Project Context

Create the initial `project_state` entity:

```bash
cat > init_project_state.sh <<'EOF'
#!/bin/bash

# Initialize electrical-website project state
curl -X POST http://localhost:7777/api/entities \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project_state",
    "name": "electrical-website-state",
    "properties": {
      "project_name": "electrical-website",
      "current_branch": "main",
      "build_status": "passing",
      "last_build_time": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
      "active_phase": null,
      "next_tasks": [],
      "blockers": [],
      "last_updated": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
    }
  }'
EOF

chmod +x init_project_state.sh
./init_project_state.sh
```

Expected response:
```json
{
  "id": "state-xyz",
  "type": "project_state",
  "name": "electrical-website-state",
  "properties": { ... }
}
```

---

## Health Checks

### Verify Service is Running

```bash
# Health endpoint
curl http://localhost:7777/health

# List all entities
curl http://localhost:7777/api/entities

# Search for project state
curl http://localhost:7777/api/entities?type=project_state
```

### Verify Initial Data

```bash
# Should return the electrical-website-state entity
curl http://localhost:7777/api/entities?name=electrical-website-state
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

**Symptom:** `curl http://localhost:7777/health` times out

**Diagnosis:**
```bash
# Check if process is listening on port 7777
lsof -i :7777  # macOS/Linux
netstat -an | grep 7777  # Windows

# Check Docker logs
docker logs [memory-service-container-id]
```

**Fix:**
1. Restart Docker: `docker restart [container_id]`
2. Or restart the MCP service process
3. Re-run health check

---

### Entities Not Found

**Symptom:** `search_nodes("electrical-website-state")` returns empty

**Diagnosis:**
```bash
# Verify schema was initialized
curl http://localhost:7777/api/entities

# Check for typos in entity name
curl http://localhost:7777/api/entities?type=project_state
```

**Fix:**
- Re-run initialization step 5
- Verify entity name spelling matches `.claude/rules/docker-memory-policy.md`

---

### Port Already in Use

**Symptom:** `curl http://localhost:7777/health` connects to wrong service

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
# Export all entities
curl http://localhost:7777/api/entities > ~/backup_entities_$(date +%Y-%m-%d).json

# Store in Git (optional, if not containing secrets)
git add .claude/backups/
git commit -m "backup: memory graph snapshot"
```

### Restore from Backup

```bash
# Clear all entities (careful!)
curl -X DELETE http://localhost:7777/api/entities/all

# Re-import entities
curl -X POST http://localhost:7777/api/import \
  -H "Content-Type: application/json" \
  -d @backup_entities_2026-04-16.json
```

---

## Performance Tuning

### Optimize Search

For large graphs (100+ entities), optimize search:

```bash
# Create index on commonly searched fields
curl -X POST http://localhost:7777/api/indices \
  -d '{"field": "type", "index_type": "hash"}' \
  -d '{"field": "name", "index_type": "trie"}' \
  -d '{"field": "status", "index_type": "hash"}'
```

### Monitor Storage

```bash
# Check memory graph size
curl http://localhost:7777/api/stats
→ { "entity_count": 42, "relation_count": 18, "total_observations": 156 }
```

---

## Migration from .md Files

If migrating from existing `.claude/memory/*.md` files:

1. **Export existing memory:**
   ```bash
   # Read existing .md files
   cat .claude/memory/project_*.md
   cat .claude/memory/decisions/*.md
   ```

2. **Parse and convert to entities:**
   ```bash
   # Use script: .claude/scripts/migrate-memory-to-docker.sh
   ./scripts/migrate-memory-to-docker.sh
   ```

3. **Verify migration:**
   ```bash
   # Check entity count matches prior files
   curl http://localhost:7777/api/stats
   ```

4. **Archive old files:**
   ```bash
   mv .claude/memory .claude/archives/memory-backup-$(date +%Y-%m-%d)
   git add .claude/archives/
   git commit -m "chore: archive old .md memory files"
   ```

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
          curl -f http://localhost:7777/health || exit 1
        timeout-minutes: 1
        continue-on-error: true  # Non-blocking for now
```

---

## Security Considerations

### Restrict Access

```bash
# If running on network, restrict to localhost
# In Docker: bind to 127.0.0.1 only
docker run -p 127.0.0.1:7777:7777 memory-reference
```

### Encrypt Sensitive Data

```bash
# If storing sensitive learnings/blockers, enable encryption
curl -X POST http://localhost:7777/api/config \
  -d '{"encryption_enabled": true, "key": "..."}' \
  -H "Authorization: Bearer $MCP_TOKEN"
```

### Audit Access

```bash
# Enable audit logging
curl -X POST http://localhost:7777/api/audit \
  -d '{"enabled": true, "log_file": "/var/log/memory-access.log"}'
```

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

# Or system logs (if running as service)
journalctl -u docker-memory --follow
```

### Report Issues

If you encounter issues:
1. Capture output: `curl -v http://localhost:7777/health 2>&1 | tee debug.log`
2. Check `.claude/rules/docker-memory-policy.md` Troubleshooting section
3. Review `.claude/reference/ERROR_RECOVERY.md` (if exists)

---

**Last Updated:** 2026-04-16  
**Status:** Ready for Implementation
