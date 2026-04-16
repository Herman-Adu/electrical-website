# Secrets & Security Policy

**Effective Date:** 2026-04-15  
**Last Reviewed:** 2026-04-15

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| **Question about .env file?** | Check file → report `present`/`missing` (NEVER output values) |
| **Secret exposed in console/log?** | STOP — treat as compromised, instruct rotation |
| **Unsure if content is sensitive?** | Mask it. Err on side of caution. |
| **About to commit code with secrets?** | Check with `git diff` — never commit .env files |

---

## Restricted Files

These files contain secrets and are **always restricted**, regardless of context:

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local
```

Also treat as restricted:
- Database credentials or URLs
- API keys and tokens (Auth0, Stripe, SendGrid, etc.)
- Private encryption keys
- OAuth secrets and refresh tokens
- SSH keys and deploy credentials

---

## The Policy

### ✅ What You CAN Do

- **Check for presence:** "I checked `.env.local` — DATABASE_URL is present"
- **Reference variable names:** "Set the `API_KEY` environment variable"
- **Document structure:** "Expected variables: `DATABASE_URL`, `API_KEY`, `SMTP_PASSWORD`"
- **Validate format (masked):** "DATABASE_URL format is correct (mysql://user:***@host:3306/db)"
- **Link to secrets manager:** "Secrets are stored in 1Password — ask team for access"

### ❌ What You CANNOT Do

- **Output values:** Never `"DATABASE_URL is mysql://user:password@host"`
- **Quote from .env files:** Never copy content into markdown or comments
- **Include in screenshots:** If a secret appears in an IDE screenshot, don't share it
- **Persist in memory:** Never save secret values to `.claude/memory/`
- **Summarize secrets:** Never say "I read the env file and here's what I found..."
- **Log secrets to terminal:** Redirect stderr to `/dev/null` if secrets might appear

---

## Handling Exposed Secrets

If credentials are exposed during a session:

1. **STOP immediately** — Do not continue using the exposed secret
2. **Alert:** "⚠️ Credentials exposed in [location]. Treat as compromised."
3. **Instruct rotation:** "Please rotate immediately:
   ```bash
   # Example: If AWS credentials exposed
   aws iam create-access-key --user-name <username>  # Create new key
   aws iam delete-access-key --access-key-id <old-id> # Delete exposed key
   ```
4. **Document:** Note exposure in memory or issue tracker for team review
5. **Verify non-propagation:** Check git history, logs, and branch history for leaks

---

## Example Interactions

### ✅ Correct

```
User: "Can you check if the database is configured?"
Response: "I checked .env.local — DATABASE_URL is present and properly formatted."

User: "What API keys do we need?"
Response: "You'll need to set these environment variables:
- STRIPE_API_KEY (from Stripe dashboard)
- SENDGRID_API_KEY (from SendGrid account)
- AUTH0_CLIENT_SECRET (from Auth0 app settings)"

User: "Deploy is failing. What's wrong?"
Response: "The deploy log shows: Error: Missing STRIPE_API_KEY environment variable"
(Report the issue, not the value)
```

### ❌ Incorrect

```
User: "Check the database connection"
Response: "Your DATABASE_URL is mysql://user:mypassword123@prod-db.us-east-1.rds.amazonaws.com:3306/electric_db"
(WRONG: Exposed credentials)

User: "What's in the env file?"
Response: "I see STRIPE_API_KEY=[REDACTED_STRIPE_KEY] and..."
(WRONG: Quoted values)

Response: "Here's a screenshot of the .env file"
(WRONG: Even if no secrets visible, don't attach env file screenshots)
```

---

## In Context of Tools & Features

### File Handling

- **Read:** OK to read .env files internally, but report masked
- **Write:** Never write secrets to files you'll attach/share
- **Edit:** When editing config, preserve existing secrets (don't recreate)
- **Diff:** When showing diffs, sanitize any secret values

**Example Safe Diff:**
```diff
- DATABASE_URL=mysql://old-user:***@old-host
+ DATABASE_URL=mysql://new-user:***@new-host
  API_KEY=***  # unchanged
```

### Build & Deployment

- **Env injection:** Report what's needed, not what's present
- **Build logs:** If build output includes secrets, use `2>&1 | grep -v "secret_pattern"` to redact
- **Deploy logs:** Sanitize before sharing (many platforms log env variables)

### Error Messages & Debugging

- **Stack traces:** Safe to share (usually don't contain secrets)
- **Error context:** Mask variable values if they came from .env
- **Connection errors:** Safe to report "Cannot connect to database" without sharing URL

---

## Integration with Development Workflow

### Before Committing

Always check:
```bash
# See what you're about to commit
git diff --cached

# Make sure no .env files in staging
git status | grep -E "\\.env"  # Should be empty

# NEVER do this:
git add .env*     # Wrong!
```

### In CI/CD Pipelines

- **GitHub Actions:** Use `secrets.*` context, never hardcode
- **Vercel deployments:** Set env vars via Vercel dashboard or `vercel env pull` (masked locally)
- **Build logs:** Enable secret redaction in GitHub Actions:
  ```yaml
  - run: echo "::add-mask::${{ secrets.DATABASE_URL }}"
  ```

### Testing & Local Development

- **Test fixtures:** Never use real credentials; use test/sandbox API keys
- **Mock external services:** Mock API calls instead of using real credentials
- **Local .env:** Keep local-only and never commit. Add to `.gitignore`:
  ```
  .env*.local
  .env*.production
  ```

---

## Security Checklist (Before Production)

Before shipping any feature with secrets/auth:

- [ ] No hardcoded credentials in source code
- [ ] All secrets use environment variables
- [ ] `.env*` files in `.gitignore`
- [ ] Credentials rotated if ever exposed in history
- [ ] Secrets manager (1Password, Vercel, AWS Secrets) in use
- [ ] Audit logs configured for secret access
- [ ] Team notified of secret locations and access process
- [ ] CI/CD pipelines redact secrets from logs
- [ ] Production credentials different from staging
- [ ] Rotation schedule documented (e.g., quarterly)

---

## Quick Commands

```bash
# Check what secrets are expected
grep -r "process.env\." src/ | grep -oE "process\.env\.[A-Z_]+" | sort -u

# Find hardcoded credentials (example patterns)
grep -r "password:" src/     # ❌ NEVER hardcode
grep -r "[REDACTED_STRIPE_KEY]" src/      # ❌ NEVER hardcode
grep -r "secret=" src/       # ❌ NEVER hardcode

# Safely show a diff without values
git diff | sed 's/=.*/=[REDACTED]/'

# Check git history for exposed secrets
git log -p | grep -E "password|apikey|secret" | head -20
```

---

## FAQ

**Q: Can I write a secret to a config file?**  
A: No. Use environment variables only. Configs should reference env vars: `db.url = process.env.DATABASE_URL`.

**Q: Is it OK to log an error that mentions a secret?**  
A: No. Redact before logging:
```ts
// ❌ Wrong
console.error(`Failed to connect: ${error.message}`);  // Might include password

// ✅ Right
console.error('Database connection failed');
logger.error('DB connection error', { url: maskUrl(connectionUrl), error: error.message });
```

**Q: What if I accidentally expose a secret in Git history?**  
A: Use BFG Repo Cleaner (safer than git-filter-branch):
```bash
bfg --replace-text secrets.txt repo.git
git reflog expire --expire=now --all && git gc --prune=now
git push --force
```
Then rotate the exposed credential immediately.

**Q: Should I version-control a `.env.example` file?**  
A: Yes! This shows team members what variables they need to set:
```
# .env.example (SAFE TO COMMIT)
DATABASE_URL=<fill-in-your-database-url>
API_KEY=<fill-in-your-api-key>
SMTP_PASSWORD=<fill-in-your-smtp-password>
```

---

## Reporting Issues

If you discover a potential secret exposure:

1. **Create a private issue** in GitHub (mark `👁️ private` if available)
2. **Include:** What was exposed, where, and when
3. **Don't include:** The actual secret value (reference by variable name only)
4. **Action:** Mark as `security` label, assign to maintainer

Example:
```
Title: Potential credential exposure in build logs
Description:
  - What: DATABASE_URL value visible in GitHub Actions logs
  - Where: Actions run #1234
  - When: 2026-04-14 14:30 UTC
  - Fix: Enable GitHub Actions secret redaction
```

---

## Resources

- [OWASP: Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [GitHub: Managing secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel: Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [1Password: Developer Secrets](https://developer.1password.com/)

---

## Acknowledgments

This policy implements best practices from:
- OWASP Sensitive Data Exposure guidelines
- GitHub Security best practices
- Vercel platform security recommendations
- Industry standard secret management patterns
