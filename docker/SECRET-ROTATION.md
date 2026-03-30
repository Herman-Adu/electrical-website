# Secret Rotation Procedures

Phase 22 Week 4, Batch 4.3: Secrets Management & Rotation

**Last Updated:** 2026-03-18
**Status:** Active for Tier-1 runtime; Tier-2 procedures are optional and require separate provisioning

> **Repository scope note:** This repository does not include a default `compose.tier2.yml` stack or `scripts/start-tier2.sh`.
> Use Tier-2 sections only after you intentionally provision a separate Tier-2 compose/scripts layer.

## Table of Contents

- [Overview](#overview)
- [Rotation Schedule](#rotation-schedule)
- [GitHub Token Rotation](#github-token-rotation)
- [API Key Rotation](#api-key-rotation)
- [Database Credentials Rotation](#database-credentials-rotation)
- [Certificate Rotation](#certificate-rotation)
- [Audit Logging](#audit-logging)
- [Zero-Downtime Strategies](#zero-downtime-strategies)
- [Rollback Procedures](#rollback-procedures)
- [Testing Checklist](#testing-checklist)

---

## Overview

Secrets rotation is critical for security. This document provides step-by-step procedures for rotating each secret type used in the Docker MCP infrastructure.

### Why Rotate Secrets?

1. **Limit exposure window** — If a secret is compromised, rotation limits the attacker's access
2. **Compliance** — Most security frameworks require regular rotation (e.g., every 30-90 days)
3. **Access control** — Old secrets may have been shared with contractors or former team members
4. **Detection** — Rotation can reveal unauthorized access if old tokens are still being used

### Rotation Tiers

| Secret Type               | Recommended Frequency          | Risk Level | Downtime |
| ------------------------- | ------------------------------ | ---------- | -------- |
| GitHub Token              | Every 30 days                  | HIGH       | 0-30 sec |
| API Keys (Resend, Kie.ai) | Every 60-90 days               | MEDIUM     | 0-30 sec |
| Database Credentials      | Every 90 days                  | HIGH       | 1-2 min  |
| Certificates (TLS)        | Every 90 days or before expiry | LOW        | 0-30 sec |

### Services Using Each Secret

| Secret            | Services                    | Tier   | Impact of Leak                                |
| ----------------- | --------------------------- | ------ | --------------------------------------------- |
| GITHUB_TOKEN      | github-official (8001)      | Tier-1 | Code access, API abuse, rate limit exhaustion |
| RESEND_API_KEY    | resend (on-demand)          | Tier-2 | Email sending abuse, cost overruns            |
| DATABASE_URL      | prisma-postgres (on-demand) | Tier-2 | Data access, modification, deletion           |
| POSTGRES_PASSWORD | prisma-postgres (on-demand) | Tier-2 | Database compromise                           |
| KIE_AI_API_KEY    | Skills (local)              | N/A    | Image generation abuse, cost overruns         |

---

## Rotation Schedule

Recommended rotation calendar:

```
Week 1:   GitHub Token (Monday 9 AM)
Week 2:   (No rotation)
Week 3:   Database Credentials (if running Tier-2 services)
Week 4:   API Keys (Resend, Kie.ai)

Month 3:  Certificates (if using TLS)
Month 6:  Full audit of all secrets + unneeded credentials revocation
```

### Calendar Template

```bash
# Add to crontab for automated reminders
0 9 * * MON [ $(date +%W) -eq 1 ] && echo "REMINDER: Rotate GitHub Token"
0 9 * * MON [ $(date +%W) -eq 3 ] && echo "REMINDER: Rotate Database Credentials"
0 9 * * MON [ $(date +%W) -eq 4 ] && echo "REMINDER: Rotate API Keys"
```

---

## GitHub Token Rotation

### Step 1: Generate New Token

1. Navigate to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `mcp-docker-infrastructure-[DATE]` (e.g., mcp-docker-2026-03-18)
4. Set expiration: 30 days from now
5. Select scopes (minimum required):
   - `repo` — Full control of private repositories
   - `read:user` — Read public user data
   - `read:org` — Read organization data
   - `gist` — GIST access (for research workflows)
   - `workflow` — Manage GitHub Actions workflows
   - `project` — Manage projects

6. Click "Generate token"
7. **Copy immediately** — You won't see it again!

**Expected token format:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (36+ chars)

### Step 2: Verify New Token Works

```bash
# Test the new token
export GITHUB_TOKEN="ghp_new_token_here"

# Make a simple API request
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Expected response: Your GitHub user info (200 OK)
# If 401 Unauthorized: Token is invalid or expired
```

If the test fails, **do NOT proceed**. Revoke the new token and try again.

### Step 3: Update .env File

```bash
# Edit .env file
nano .env

# Find GITHUB_TOKEN and update to new value
GITHUB_TOKEN=ghp_new_token_here

# Save and close (Ctrl+O, Enter, Ctrl+X in nano)
```

**Verification:**

```bash
# Confirm the new token is loaded
bash scripts/docker-validate-env.sh
# Should show: ✓ GITHUB_TOKEN: Valid GitHub token
```

### Step 4: Restart Service

The github-official service needs to reload the new token:

```bash
# Option A: Restart just the GitHub service (faster, 0 downtime)
docker-compose restart github-official

# Option B: Restart all services (if you want full system refresh)
docker-compose restart

# Wait for health check to pass
sleep 15
docker-compose ps | grep github-official
# Should show "Up" status
```

**Verification:**

```bash
# Test the service is working
curl http://localhost:3000/github/health

# Expected response: {"status":"healthy","service":"github-official"}
```

### Step 5: Revoke Old Token

Go back to https://github.com/settings/tokens and revoke the old token by clicking the trash icon.

This immediately invalidates the old token (prevents unauthorized access if it was compromised).

### Step 6: Log Rotation Event

```bash
# Add entry to audit log
bash -c 'echo "[$(date "+%Y-%m-%d %H:%M:%S")] ROTATED: GITHUB_TOKEN | old_hash=sha256(old_token)[:8]... | new_hash=sha256(new_token)[:8]... | status=success" >> docker/secrets-audit.log'

# View the log
tail docker/secrets-audit.log
```

### GitHub Token Rotation Timeline

| Time      | Action                                 | Duration         |
| --------- | -------------------------------------- | ---------------- |
| T+0       | Generate new token on GitHub.com       | ~1 min           |
| T+1       | Verify token works with curl test      | ~10 sec          |
| T+2       | Update .env file                       | ~1 min           |
| T+3       | Restart docker-compose github-official | ~5-10 sec        |
| T+4       | Verify service is healthy              | ~10 sec          |
| T+5       | Revoke old token on GitHub             | ~30 sec          |
| T+6       | Log rotation event                     | ~30 sec          |
| **Total** |                                        | **~3-5 minutes** |

### Rollback (If New Token Doesn't Work)

```bash
# Immediate rollback: Use old token (if not yet revoked)
nano .env
GITHUB_TOKEN=ghp_old_token_here

# Restart service
docker-compose restart github-official

# Wait for health check
sleep 15

# Verify
curl http://localhost:3000/github/health

# If this works, you have time to figure out what went wrong with new token
# If you already revoked old token and need it back:
# 1. Go to GitHub.com settings
# 2. Check "Personal access tokens" (deleted tokens can sometimes be recovered)
# 3. If not available, generate a new token again
```

---

## API Key Rotation

API keys for Resend (email) and Kie.ai (image generation) follow similar patterns.

### Step 1: Generate New API Key

**For Resend (email API):**

1. Go to https://resend.com/api-keys
2. Click "Create new API key"
3. Give it a name: `mcp-docker-[DATE]`
4. Copy the new key (starts with `re_`)

**For Kie.ai (image generation):**

1. Go to https://kie.ai/dashboard
2. Find "API Keys" section
3. Click "Create new API key"
4. Copy the new key

### Step 2: Verify New Key Works

**Resend example:**

```bash
export RESEND_API_KEY="re_new_key_here"

# Test sending a test email
curl -X POST https://api.resend.com/emails \
  -H 'Authorization: Bearer '$RESEND_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@mcp.local",
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'

# Expected response: 200 OK with email ID
```

**Kie.ai example:**

```bash
export KIE_AI_API_KEY="kie_new_key_here"

# Call a simple kie.ai endpoint
curl https://api.kie.ai/v1/health \
  -H "Authorization: Bearer $KIE_AI_API_KEY"

# Expected response: 200 OK
```

### Step 3: Update .env File

```bash
# Edit .env
nano .env

# Update the API key
RESEND_API_KEY=re_new_key_here
# or
KIE_AI_API_KEY=kie_new_key_here

# Save
```

### Step 4: Restart Service (if Tier-2)

```bash
# For Resend (on-demand service)
docker compose -f <tier2-compose-file> restart resend

# For Kie.ai (no Docker service, used by skills)
# No restart needed - skills will use new key on next run
```

### Step 5: Revoke Old Key

Go back to the provider's dashboard and revoke/delete the old key.

### Step 6: Log Rotation Event

```bash
echo "[$(date "+%Y-%m-%d %H:%M:%S")] ROTATED: RESEND_API_KEY | status=success" >> docker/secrets-audit.log
```

---

## Database Credentials Rotation

Rotating database credentials requires coordinating the Prisma service and any connected applications.

### Warning: Database Rotation

⚠️ **Database credential rotation requires more careful coordination than API keys.**

- **Applications must be restarted** to pick up new credentials
- **Downtime:** 1-2 minutes for Tier-2 services
- **Risk:** If new credentials are invalid, database operations fail

### Step 1: Connect to PostgreSQL

```bash
# Start the Prisma service (if not already running)
docker compose -f <tier2-compose-file> up -d prisma-postgres

# Wait for service to start
sleep 5

# Connect to PostgreSQL
docker exec -it prisma-postgres psql -U mcp_user -d mcp_db -h localhost

# If you get a prompt like "mcp_db=>"
# Database is accessible with current credentials
\q  # Quit psql
```

### Step 2: Create New Database User

```bash
# Connect as superuser (default password for dev)
docker exec -it prisma-postgres psql -U postgres -d postgres -h localhost

# In psql prompt:
CREATE USER mcp_user_new WITH PASSWORD 'new_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE mcp_db TO mcp_user_new;

# Verify new user can connect
\q  # Quit
```

### Step 3: Test New Credentials

```bash
# Test that new user can connect
docker exec -it prisma-postgres psql -U mcp_user_new -d mcp_db \
  -h localhost -c "SELECT 1;"

# Expected response:
#  ?column?
# ----------
#        1
# (1 row)
```

### Step 4: Update .env File

```bash
# Edit .env
nano .env

# Update credentials
DATABASE_URL=postgresql://mcp_user_new:new_secure_password_here@prisma-postgres:5432/mcp_db
POSTGRES_USER=mcp_user_new
POSTGRES_PASSWORD=new_secure_password_here

# Save
```

### Step 5: Restart Prisma Service

```bash
# Restart Prisma service to pick up new credentials
docker compose -f <tier2-compose-file> restart prisma-postgres

# Wait for service to start and health check to pass
sleep 10

# Verify service is healthy
docker compose -f <tier2-compose-file> ps | grep prisma-postgres
# Should show "Up" status

# Test database access through service
docker compose -f <tier2-compose-file> exec prisma-postgres \
  psql -U mcp_user_new -d mcp_db -h localhost -c "SELECT 1;"

# Expected response: (1 row) with value 1
```

### Step 6: Drop Old User

```bash
# Connect as postgres superuser
docker exec -it prisma-postgres psql -U postgres -d postgres -h localhost

# In psql:
DROP USER IF EXISTS mcp_user;

# Verify
\du  # List users

# Quit
\q
```

### Step 7: Log Rotation Event

```bash
echo "[$(date "+%Y-%m-%d %H:%M:%S")] ROTATED: DATABASE CREDENTIALS | user=mcp_user_new | status=success" >> docker/secrets-audit.log
```

### Rollback: Restore Old Credentials

If the new credentials don't work:

```bash
# Quick rollback: Update .env back to old credentials
nano .env
DATABASE_URL=postgresql://mcp_user:old_password@prisma-postgres:5432/mcp_db
POSTGRES_USER=mcp_user
POSTGRES_PASSWORD=old_password

# Restart service
docker-compose -f compose.tier2.yml restart prisma-postgres

# Wait and verify
sleep 10
curl http://localhost:3000/prisma/health
```

---

## Certificate Rotation

If using TLS certificates (for production):

### Step 1: Check Certificate Expiry

```bash
# List certificates
ls -la docker/certs/

# Check expiry
openssl x509 -in docker/certs/mcp.crt -text -noout | grep -A 2 "Not After"
```

### Step 2: Generate New Certificate

```bash
# Self-signed certificate (dev/staging)
openssl req -x509 -newkey rsa:4096 -keyout docker/certs/mcp.key \
  -out docker/certs/mcp.crt -days 365 -nodes

# Or use Let's Encrypt for production (see Caddy documentation)
```

### Step 3: Update Caddyfile

```bash
# Edit docker/Caddyfile and point to new certificate
nano docker/Caddyfile

# Update tls block:
# tls /etc/caddy/certs/mcp.crt /etc/caddy/certs/mcp.key
```

### Step 4: Restart Caddy

```bash
docker-compose restart caddy

# Verify TLS works
curl -k https://localhost:3000/health
```

---

## Audit Logging

All secret rotations are logged to `docker/secrets-audit.log` for compliance and debugging.

### Log Format

```
[YYYY-MM-DD HH:MM:SS] EVENT_TYPE: SECRET_NAME | field1=value1 | field2=value2 | status=success|failed
```

### Log Examples

```
[2026-03-18 14:23:45] ROTATED: GITHUB_TOKEN | old_hash=abc123... | new_hash=xyz789... | status=success
[2026-03-18 14:25:00] VALIDATION_FAILED: RESEND_API_KEY | reason=empty | status=failed
[2026-03-18 14:26:15] USED: GITHUB_TOKEN | service=github-official | result=success
[2026-03-18 14:27:30] ROTATED: DATABASE_CREDENTIALS | user=mcp_user_new | status=success
```

### Log Cleanup

Logs can grow large. Rotate old logs monthly:

```bash
# Archive old logs
mv docker/secrets-audit.log docker/secrets-audit.log.$(date +%Y-%m-%d)

# Compress archived logs
gzip docker/secrets-audit.log.*

# Delete logs older than 90 days
find docker/ -name "secrets-audit.log.*" -mtime +90 -delete

# Or add to crontab for automatic cleanup:
# 0 0 1 * * (cd /path/to/project && mv docker/secrets-audit.log docker/secrets-audit.log.$(date +\%Y-\%m-\%d) && gzip docker/secrets-audit.log.* 2>/dev/null; find docker/ -name "secrets-audit.log.*" -mtime +90 -delete)
```

---

## Zero-Downtime Strategies

### Tier-1 Services (Always Running)

**Problem:** Restarting Tier-1 services causes brief downtime (30-60 sec)

**Solution:** Use rolling restarts

```bash
# For each Tier-1 service, restart individually with 30-second interval
docker-compose restart github-official
sleep 30

docker-compose restart playwright
sleep 30

# Services restart one at a time; clients can use other services
```

### Tier-2 Services (On-Demand)

**Problem:** Tier-2 services start/stop on demand; rotation has no impact on running workflows

**Solution:** Rotate when services are idle

```bash
# Check if service is running
docker ps | grep resend

# If not running, rotation is safe (no downtime)
# If running, wait for current workflows to complete, then rotate

# Restart only when needed
docker compose -f <tier2-compose-file> restart resend
```

### Database Credentials (Tier-2)

**Problem:** Database rotation causes all connected clients to fail temporarily

**Solution:** Coordinate rotation with minimal active workflows

```bash
# 1. Check if Prisma service is running
docker ps | grep prisma-postgres

# 2. If running, wait for workflows to complete
# (or manually stop: docker compose -f <tier2-compose-file> stop prisma-postgres)

# 3. Update credentials in .env

# 4. Restart service with new credentials
docker compose -f <tier2-compose-file> restart prisma-postgres

# 5. Verify database is healthy before next workflow uses it
docker exec -it prisma-postgres psql -U mcp_user_new -d mcp_db -c "SELECT 1;"
```

---

## Rollback Procedures

### Quick Rollback (Within 5 Minutes)

```bash
# Edit .env and revert to old secret
nano .env
GITHUB_TOKEN=ghp_old_token_here

# Restart service immediately
docker-compose restart github-official

# Verify
curl http://localhost:3000/github/health
```

### If Old Secret Already Revoked

**GitHub tokens:**

- Go to https://github.com/settings/tokens
- Check "Deleted tokens" (recent deletions can be recovered within 30 days)
- Or generate a new token

**API keys (Resend, Kie.ai):**

- Contact provider support if key was revoked by accident
- Or generate a new key

**Database credentials:**

- If old user was dropped: Create new user with different credentials
- Update .env and restart

### Full Recovery

```bash
# If services are in a bad state
docker-compose down
docker volume prune  # WARNING: Deletes data!
cp .env.example .env
# Fill in .env with known-good secrets
docker-compose up -d
```

---

## Testing Checklist

Use this checklist to verify rotation was successful:

### Before Rotation

- [ ] Service is running and healthy: `docker-compose ps | grep [service]`
- [ ] Service responds to health checks: `curl http://localhost:3000/[service]/health`
- [ ] Audit log is writable: `touch docker/secrets-audit.log`
- [ ] Current secret is known and backed up (if needed)

### During Rotation

- [ ] New secret generated and copied
- [ ] New secret format validated (starts with correct prefix)
- [ ] New secret tested independently (curl test, etc.)
- [ ] .env file updated with new secret
- [ ] Validation script passes: `bash scripts/docker-validate-env.sh`
- [ ] Service restarted: `docker-compose restart [service]`

### After Rotation

- [ ] Service is healthy: `docker-compose ps | grep [service]` shows "Up"
- [ ] Health check passes: `curl http://localhost:3000/[service]/health` returns 200
- [ ] Service responds to requests (test with actual workflow if possible)
- [ ] Old secret revoked (if applicable)
- [ ] Audit log entry created: `grep ROTATED docker/secrets-audit.log | tail -1`

### Verification Examples

```bash
# Test GitHub service
curl -X GET http://localhost:3000/github/user \
  -H "Authorization: Bearer $GITHUB_TOKEN"
# Expected: 200 OK with user data

# Test Resend service (if running)
curl http://localhost:3000/resend/health
# Expected: 200 OK with health status

# Test database service (if running)
curl http://localhost:3000/prisma/health
# Expected: 200 OK with database status
```

---

## Emergency: Secret Compromise

If you suspect a secret has been compromised:

### Immediate Actions (Next 10 Minutes)

1. **Revoke immediately:**

   ```bash
   # GitHub: https://github.com/settings/tokens → Delete token
   # Resend: https://resend.com/api-keys → Delete key
   # Kie.ai: https://kie.ai/dashboard → Delete key
   ```

2. **Stop affected services:**

   ```bash
   docker-compose stop github-official  # or whichever service uses compromised secret
   ```

3. **Generate new secret:**
   - Follow the rotation procedure above
   - Use a unique, non-guessable password/token

4. **Log the incident:**
   ```bash
   echo "[$(date "+%Y-%m-%d %H:%M:%S")] INCIDENT: SECRET_COMPROMISED | secret=GITHUB_TOKEN | action=revoked_and_rotated" >> docker/secrets-audit.log
   ```

### Follow-Up (Next 24 Hours)

1. **Review logs for unauthorized access:**

   ```bash
   # Check Docker logs for failed auth attempts
   docker-compose logs github-official | grep -i "error\|unauthorized\|401"
   ```

2. **Check GitHub audit log (if using GitHub token):**
   - Go to https://github.com/settings/security-log
   - Look for unusual activity after compromise time

3. **Monitor for abuse:**
   - Resend: Check sent emails, costs, quotas
   - GitHub: Check API usage, rate limits
   - Database: Check access logs, unexpected queries

4. **Document the incident:**
   ```bash
   cat >> docker/secrets-audit.log << EOF
   [2026-03-18 15:30:00] INCIDENT_REVIEW: GITHUB_TOKEN | findings=no_unusual_activity | action=continue_monitoring
   EOF
   ```

---

## FAQ

**Q: How often should I rotate secrets?**
A: GITHUB_TOKEN every 30 days, API keys every 60-90 days, database credentials every 90 days.

**Q: Will rotating secrets cause downtime?**
A: Tier-1 services: 30-60 seconds to restart. Tier-2 services: Only if they're running. Database: 1-2 minutes.

**Q: Can I rotate multiple secrets at once?**
A: Not recommended. Rotate one secret at a time, test, then move to the next. This makes debugging easier if something goes wrong.

**Q: What if I lose the old secret before revoking it?**
A: It's fine — just revoke it immediately. If it was already deleted, check the provider's recovery options (usually 30 days).

**Q: How do I know if a secret was compromised?**
A: Check provider audit logs, Docker logs, and watch for unusual API usage or rate limiting.

**Q: Where do I store the audit log for compliance?**
A: `docker/secrets-audit.log` is in the project root. Archive it monthly for compliance records.

---

## See Also

- **Setup:** `.env.example` — All secrets with documentation
- **Validation:** `scripts/docker-validate-env.sh` — Automated secret validation
- **Docker README:** `docker/README.md` — Secrets Management section
- **Error Recovery:** `docker/ERROR-RECOVERY.md` — How to recover from secret-related errors
