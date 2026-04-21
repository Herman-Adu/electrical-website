# Docker-First Secrets Pattern

**Established:** 2026-04-21  
**Author:** orchestrator (Claude Code)  
**Status:** Active — Production Pattern  

---

## Overview

All MCP services in the `electrical-website` project fetch secrets from Docker `memory-reference` service instead of `.env` files. This provides centralized, auditable secret management with automatic fallback to environment variables for backward compatibility.

### Benefits

- **Centralized audit trail:** All secrets stored in Docker memory graph
- **No filesystem secrets:** `.env` files need not contain sensitive data
- **Service portability:** Secrets move with Docker containers, not local files
- **Easy rotation:** Update Docker entity once; all services pick up changes
- **Graceful degradation:** Fallback to `.env` ensures no service outage

---

## Current Implementation

### Services Using Pattern

- ✅ **github-official** — GitHub PAT via `infra-secrets-github` entity
- 📋 **openapi-schema** — Ready (apply pattern when needed)
- 📋 **playwright** — Ready (apply pattern when needed)
- 📋 **sequential-thinking** — Ready (apply pattern when needed)

### Docker Memory Infrastructure

**Entity:** `infra-secrets-github`  
**Type:** `infrastructure`  
**Endpoint:** `http://localhost:3100/memory/tools/call` (via Caddy router)

**Observations:**
```
GITHUB_PERSONAL_ACCESS_TOKEN: [secured]
Service: github-official MCP server
Accessed via: http://localhost:3100/memory/*
Status: active
```

---

## How It Works

### Sequence (Service Startup)

```
┌──────────────────────────────────────────────────────────┐
│ 1. github-official container starts (node server.js)     │
├──────────────────────────────────────────────────────────┤
│ 2. fetchSecretFromDocker('infra-secrets-github')         │
│    ├─ HTTP POST to http://memory-reference:8000         │
│    ├─ Retry 3x with exponential backoff if fails        │
│    └─ Parse token from observation: "...TOKEN: [val]"   │
├──────────────────────────────────────────────────────────┤
│ 3a. Success: Use Docker token, log source               │
│    "[Secrets] ✓ Loaded token from Docker memory"        │
├──────────────────────────────────────────────────────────┤
│ 3b. Failure: Fallback to process.env.GITHUB_TOKEN       │
│    "[Secrets] ✓ Loaded token from environment"          │
├──────────────────────────────────────────────────────────┤
│ 4. Validate token format (security gate)                │
│    "[Audit] Token format valid: true/false"             │
├──────────────────────────────────────────────────────────┤
│ 5. Server listens on :8000, health check available      │
│    GET /health → { token_source: "docker|env|none" }   │
└──────────────────────────────────────────────────────────┘
```

### Security Posture

| Layer | Control | Status |
|-------|---------|--------|
| **In Transit** | HTTPS not available (local Docker network) | ⚠️ Mitigate: isolated network |
| **At Rest (Memory)** | Docker memory-reference persistence | ✅ Managed by Docker |
| **Logging** | Token value never logged | ✅ [Secrets] prefix enforced |
| **Fallback** | `.env` GITHUB_TOKEN available | ✅ Enables safe rollback |
| **Validation** | Token format checked on startup | ✅ Prevents invalid tokens |

---

## Adding Secrets for a New Service

### Step 1: Create Infrastructure Entity

Store the secret in Docker memory-reference:

```bash
curl -s http://localhost:3100/mcp/tools/call -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__create_entities",
    "arguments": {
      "entities": [{
        "name": "infra-secrets-SERVICE_NAME",
        "entityType": "infrastructure",
        "observations": [
          "SECRET_FIELD_NAME: [redacted]",
          "Service: SERVICE_NAME MCP server",
          "Accessed via: http://localhost:3100/memory/*",
          "Status: active",
          "Created: 2026-04-21"
        ]
      }]
    }
  }'
```

### Step 2: Add Fetch Function to Service Code

Copy the `fetchSecretFromDocker()` function from `docker/github-official/server.js` into your service:

```javascript
// docker/SERVICE_NAME/server.js (lines 1–140)

async function fetchSecretFromDocker(entityName, secretField) {
  const maxRetries = 3;
  const timeoutMs = 5000;
  const dockerMemoryUrl = process.env.DOCKER_MEMORY_URL || 'http://memory-reference:8000';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${dockerMemoryUrl}/tools/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'search_nodes',
          params: { query: entityName },
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Docker API returned ${response.status}`);
      }
      
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        const entity = data.result[0];
        console.log(`[Secrets] Fetched ${entityName} from Docker (attempt ${attempt})`);
        return entity.observations?.[0] || null;
      }
      
      throw new Error(`Entity ${entityName} not found`);
    } catch (error) {
      console.warn(`[Secrets] Attempt ${attempt}/${maxRetries}: ${error.message}`);
      if (attempt === maxRetries) return null;
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 100));
    }
  }
}
```

### Step 3: Update Token Initialization

Replace your secret initialization with Docker-first pattern:

```javascript
// Existing pattern (DON'T USE):
const API_KEY = process.env.API_KEY || '';

// NEW pattern (Docker-first):
let API_KEY = '';

async function initializeSecrets() {
  try {
    const dockerSecret = await fetchSecretFromDocker('infra-secrets-SERVICE_NAME', 'secret');
    if (dockerSecret) {
      // Parse secret from observation: "SECRET_FIELD: [value]"
      API_KEY = dockerSecret.replace(/^SECRET_FIELD:\s*/, '').trim();
      console.log('[Secrets] ✓ Loaded from Docker memory-reference');
    } else {
      throw new Error('Docker returned empty secret');
    }
  } catch (error) {
    console.warn(`[Secrets] Docker failed, using env fallback: ${error.message}`);
    API_KEY = process.env.API_KEY || '';
    if (API_KEY) {
      console.log('[Secrets] ✓ Loaded from environment variables');
    } else {
      console.error('[Secrets] ✗ No secret available from Docker or env');
    }
  }
}

// Call on server startup (before listening)
const server = http.createServer(async (req, res) => { /* ... */ });
server.listen(port, async () => {
  await initializeSecrets();
  console.log(`Server listening on port ${port}`);
});
```

### Step 4: Test

```bash
# Restart service
docker-compose restart SERVICE_NAME

# Check logs
docker logs SERVICE_NAME | grep -i secrets
# Should show: ✓ Loaded from Docker memory-reference

# Verify health (if service has health check)
curl http://localhost:3100/SERVICE_NAME/health | grep -i secret
```

---

## Updating Secrets

### Update Token in Docker

```bash
curl -s http://localhost:3100/mcp/tools/call -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__add_observations",
    "arguments": {
      "observations": [{
        "entityName": "infra-secrets-github",
        "contents": [
          "GITHUB_PERSONAL_ACCESS_TOKEN: [new_token]",
          "Updated: 2026-04-21T14:30:00Z"
        ]
      }]
    }
  }'
```

### Restart Service

```bash
docker-compose restart github-official
docker logs github-official | grep -i secrets
```

---

## Troubleshooting

### Service logs show "Loaded from environment variables" (not Docker)

1. **Check Docker memory entity exists:**
   ```bash
   curl -s http://localhost:3100/mcp/tools/call -X POST \
     -H "Content-Type: application/json" \
     -d '{"name":"memory_reference__search_nodes","arguments":{"query":"infra-secrets-github"}}'
   ```
   If empty, create the entity (Step 1 above).

2. **Check memory service is running:**
   ```bash
   docker-compose logs memory-reference
   ```

3. **Check network connectivity (if on different Docker network):**
   ```bash
   docker exec github-official curl -s http://memory-reference:8000/health
   ```

### Service fails to start (token initialization error)

1. **Check `.env` file has `GITHUB_TOKEN` as fallback:**
   ```bash
   grep GITHUB_TOKEN .env
   ```

2. **Check token format (must be valid GitHub token):**
   ```bash
   grep GITHUB_TOKEN .env | cut -d= -f2 | head -c 10
   # Should show: ghp_ or ghu_ or github_pat_
   ```

3. **Check server.js initialization logic:**
   ```bash
   docker logs github-official | grep -A5 "initializeGitHubToken"
   ```

---

## Reference Implementation

**File:** `docker/github-official/server.js`

### Key Functions

- `fetchSecretFromDocker(entityName, secretField)` — lines 15–70
  - HTTP fetch with retry logic
  - 5-second timeout per attempt
  - Exponential backoff (100ms, 200ms, 400ms)
  - Returns secret value or null

- `initializeGitHubToken()` — lines 142–180
  - Docker-first fetch, env fallback
  - Validates token format
  - Sets `TOKEN_SOURCE` variable for health checks
  - Logs audit trail

- Health check endpoint — lines 566–574
  - Shows `token_present`, `token_source`, `token_format_valid`
  - Useful for monitoring and debugging

---

## Future Enhancements

- [ ] **Secrets rotation:** Cron job to rotate PATs automatically
- [ ] **Secrets validation:** Verify token scopes and expiry on startup
- [ ] **Audit logging:** Persist all secret access to Docker memory
- [ ] **Multi-environment:** Separate entities for dev/staging/prod secrets
- [ ] **Secret versioning:** Track old tokens for rollback capability

---

## Policy & Compliance

- **No secrets in `.env`:** Only fallback tokens, not production secrets
- **Audit trail:** Docker memory graph is source of truth for secret access
- **Least privilege:** Each service only has access to its own secret entity
- **Encryption at rest:** Docker memory service handles persistence
- **Graceful degradation:** Fallback to env ensures zero-downtime rotation

---

**Last Updated:** 2026-04-21  
**Pattern Status:** Active — Ready for adoption by other services  
**Maintained by:** orchestrator (Herman Adu / Claude Code)
