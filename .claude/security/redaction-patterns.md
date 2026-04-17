---
type: reference
title: Secret Redaction Patterns
description: Canonical patterns for identifying and sanitizing secrets in git output
status: active
last-updated: 2026-04-17
---

# Secret Redaction Patterns Registry

Central registry of regex patterns used by session-lifecycle hooks to sanitize sensitive data before storage and transmission. These patterns are applied to git commit messages and branch names in `context-monitor.mjs`.

## Pattern Format

Each pattern defines:
- **Pattern:** Regex expression (JavaScript syntax)
- **Category:** Type of secret (API key, token, credential, etc.)
- **Confidence:** High, Medium, Low
- **Example Input:** Real-world example (with actual secret redacted)
- **Example Output:** How it appears after redaction
- **False Positives:** Known benign matches to avoid

---

## Patterns

### 1. API Keys (Generic)

**Pattern:**
```javascript
/([a-zA-Z_]*api[_-]?key\s*=\s*)[a-zA-Z0-9._\-]{20,}/gi
```

**Category:** API Key  
**Confidence:** High  
**Rationale:** Matches variable assignments with 20+ character alphanumeric value.

**Example Input:**
```
fix: update API_KEY to sk1234567890abcdefghij
```

**Example Output:**
```
fix: update API_KEY to [REDACTED]
```

**False Positives:** None expected; variable name is self-documenting.

---

### 2. Database URLs

**Pattern:**
```javascript
/(mongodb|mysql|postgres|postgresql|redis):\/\/[^\s]+/gi
```

**Category:** Database Connection String  
**Confidence:** High  
**Rationale:** Matches full connection strings including credentials.

**Example Input:**
```
connect to postgres://user:mypassword@prod-db.us-east-1.rds.amazonaws.com:5432/app_db
```

**Example Output:**
```
connect to [REDACTED]
```

**False Positives:** May match `postgres://` in documentation; context-aware review recommended.

---

### 3. OAuth Tokens

**Pattern:**
```javascript
/(oauth|bearer|token)\s+[a-zA-Z0-9._\-]{30,}/gi
```

**Category:** OAuth/Bearer Token  
**Confidence:** High  
**Rationale:** Matches "oauth", "bearer", or "token" followed by 30+ character credential.

**Example Input:**
```
auth: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0
```

**Example Output:**
```
auth: [REDACTED]
```

**False Positives:** None; 30+ character constraint filters out most legitimate uses.

---

### 4. AWS Credentials

**Pattern:**
```javascript
/(AKIA[0-9A-Z]{16}|aws_secret_access_key\s*=\s*[a-zA-Z0-9\/+]{40})/g
```

**Category:** AWS Credential  
**Confidence:** High  
**Rationale:** Matches AWS access key ID (AKIA prefix + 16 chars) or secret access key.

**Example Input:**
```
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Example Output:**
```
export AWS_ACCESS_KEY_ID=[REDACTED]
export AWS_SECRET_ACCESS_KEY=[REDACTED]
```

**False Positives:** "AKIA" is AWS-specific; no false positives expected.

---

### 5. Passwords (Generic)

**Pattern:**
```javascript
/(password|passwd|pwd)\s*[:=]\s*[^\s]+/gi
```

**Category:** Password  
**Confidence:** Medium (requires context)  
**Rationale:** Matches `password=X` or `password: X` patterns. May match config keys without actual secrets.

**Example Input:**
```
db_password = MySecurePassword123!
```

**Example Output:**
```
db_password = [REDACTED]
```

**False Positives:** May match environment variable names (e.g., `PASSWORD_MIN_LENGTH`). Recommend context review for full line redaction if needed.

---

### 6. GitHub Tokens

**Pattern:**
```javascript/(gh[pou]_[a-zA-Z0-9_]{36,255})/g```

**Category:** GitHub Personal/OAuth/User-to-Server Token  
**Confidence:** High  
**Rationale:** GitHub token format: `ghp_` (personal), `gho_` (OAuth), `ghu_` (user-to-server) + 36-255 chars.

**Example Input:**
```
github_token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12
```

**Example Output:**
```
github_token: [REDACTED]
```

**False Positives:** None; GitHub token prefix is unique.

---

### 7. NPM Tokens

**Pattern:**
```javascript/npm_[a-zA-Z0-9]{36,}/g```

**Category:** NPM Token  
**Confidence:** High  
**Rationale:** NPM tokens start with `npm_` and are 36+ characters.

**Example Input:**
```
registry token: npm_abcdefghijklmnopqrstuvwxyz1234567890
```

**Example Output:**
```
registry token: [REDACTED]
```

**False Positives:** None; prefix is unique to NPM.

---

### 8. Generic Secrets (Catch-All)

**Pattern:**
```javascript/(secret|api.?secret|private.?key|app.?secret)\s*[:=]\s*[a-zA-Z0-9!@#$%^&*._\-]{16,}/gi```

**Category:** Generic Secret  
**Confidence:** Medium (requires context)  
**Rationale:** Broad pattern for variable names containing "secret" or similar, followed by 16+ character value.

**Example Input:**
```
APP_SECRET = mysecretkey123456789
PRIVATE_KEY = -----BEGIN RSA PRIVATE KEY-----
```

**Example Output:**
```
APP_SECRET = [REDACTED]
PRIVATE_KEY = [REDACTED]
```

**False Positives:** May match environment variable declarations with short values (e.g., `SECRET_VERSION = v1`). Recommend manual review if confidence is low.

---

## Implementation Notes

### Regex Compilation

In `context-monitor.mjs`, patterns are compiled once and reused:

```javascript
const REDACTION_PATTERNS = [
  { pattern: /([a-zA-Z_]*api[_-]?key\s*=\s*)[a-zA-Z0-9._\-]{20,}/gi, name: 'API Keys' },
  // ... (7 more patterns)
];

function sanitizeCommitMessage(message) {
  let redacted = message;
  REDACTION_PATTERNS.forEach(({ pattern }) => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}
```

### Order of Application

Apply patterns in order:
1. **Most specific first** (AWS AKIA, GitHub ghp_, NPM npm_)
2. **Then domain-specific** (DB URLs, OAuth tokens)
3. **Then generic** (passwords, secrets, keys)

This order prevents overlapping captures.

### Edge Cases

**Multiline Values:**  
Some secrets (private keys, certificates) span multiple lines. Current implementation sanitizes per-line. For multi-line secrets, recommend:
- Full-line redaction if any pattern matches in the line
- Or post-processing to redact entire code blocks

**False Positive Tolerance:**

| Pattern | False Positive Cost | Acceptance Threshold |
|---------|-------------------|----------------------|
| AWS AKIA | Very Low (unique prefix) | Accept all matches |
| GitHub tokens | Very Low | Accept all matches |
| NPM tokens | Very Low | Accept all matches |
| Database URLs | Low (requires driver prefix) | Accept all matches |
| OAuth tokens | Low (30+ chars required) | Accept all matches |
| Passwords | Medium (variable names) | Flag for review if context < 50 chars |
| Generic secrets | Medium (variable name dependent) | Flag for review if matches < 3 chars after = |

---

## Testing

### Batch 1: Secrets Redaction Test Cases

All test cases defined in `context-monitor.mjs` test suite:

```javascript
const testCases = [
  // Pattern 1: API Keys
  { input: 'fix: update API_KEY to sk1234567890abcdefghij', expected: 'fix: update [REDACTED]' },
  { input: 'deploy with api_key=abc123def456ghi789jkl012mno345', expected: 'deploy with [REDACTED]' },
  
  // Pattern 2: Database URLs
  { input: 'postgres://user:pwd@host:5432/db', expected: '[REDACTED]' },
  { input: 'mongodb://user:secret@cluster.mongodb.net', expected: '[REDACTED]' },
  
  // Pattern 3: OAuth Tokens
  { input: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0', expected: 'bearer [REDACTED]' },
  
  // Pattern 4: AWS Credentials
  { input: 'export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', expected: 'export [REDACTED]' },
  
  // Pattern 5: Passwords
  { input: 'db_password = MySecurePassword123!', expected: 'db_password = [REDACTED]' },
  
  // Pattern 6: GitHub Tokens
  { input: 'github_token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12', expected: 'github_token: [REDACTED]' },
  
  // Pattern 7: NPM Tokens
  { input: 'npm_abcdefghijklmnopqrstuvwxyz1234567890', expected: '[REDACTED]' },
  
  // Pattern 8: Generic Secrets
  { input: 'APP_SECRET = mysecretkey123456789', expected: 'APP_SECRET = [REDACTED]' },
  
  // False Positives
  { input: 'feature/API_KEY_rotation', expected: 'feature/API_KEY_rotation' }, // No value
  { input: 'docs: password field should be 8+ chars', expected: 'docs: password field should be 8+ chars' }, // Context only
];
```

---

## Usage in Hooks

**In `session-start.sh`:**
```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH_CLEAN=$(sanitizeBranchName "$BRANCH")  # Returns "[branch-name-redacted]" if detected

COMMIT=$(git log --oneline -1)
COMMIT_CLEAN=$(sanitizeCommitMessage "$COMMIT")  # Applies all 8 patterns
```

**In `context-monitor.mjs`:**
```javascript
const redactedBranch = sanitizeBranchName(branch);
const continuation = `Branch: ${redactedBranch}...`;  // Use redacted version

// Store in Docker (never send raw secret)
await mcp__MCP_DOCKER__add_observations(stateId, [{
  category: 'session_end',
  branch: redactedBranch,  // Redacted before storage
  lastCommit: sanitizeCommitMessage(lastCommit),
}]);
```

---

## Maintenance

### Adding New Patterns

If a new secret type is discovered:

1. Create pattern in this file (all 3 sections: Pattern, Category, Example)
2. Add regex to `REDACTION_PATTERNS` array in `context-monitor.mjs`
3. Add test cases to Batch 1 test suite
4. Update this file's **Last Updated** field
5. Commit with message: `security: Add redaction pattern for [secret type]`

### Deprecating Patterns

If a pattern produces too many false positives:

1. Mark as `deprecated: true` in this file
2. Keep in `REDACTION_PATTERNS` for backward compatibility (old commits still redacted)
3. Document reason for deprecation
4. Remove from new commits after a grace period (30 days)

---

## References

- `.claude/security/SECRETS_POLICY.md` — Comprehensive secrets handling policy
- `context-monitor.mjs` — Implementation of sanitizeCommitMessage() and sanitizeBranchName()
- `session-start.sh` — Uses sanitization before embedding in preflight message

**Last Updated:** 2026-04-17  
**Status:** Active  
**Maintained by:** Code-Gen Sub-Agent (Claude Haiku)
