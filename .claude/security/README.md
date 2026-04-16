# Security Policies

Hard-stop security controls, incident procedures, and compliance requirements for `.claude` development.

## Files & Policies

| File | Purpose | Status |
|------|---------|--------|
| **SECRETS_POLICY.md** | Secret handling, masking, exposure recovery | ✅ Complete |
| `OWASP_CHECKLIST.md` | OWASP Top 10 validation rules | ⚠️ TODO |
| `AUTH_PATTERNS.md` | Approved authentication implementations | ⚠️ TODO |
| `PCI_DSL_RULES.md` | Payment handling compliance (if applicable) | ⚠️ TODO |

## Quick Reference

- **Secrets:** See [SECRETS_POLICY.md](SECRETS_POLICY.md) — Never output `.env` values, mask everything
- **Auth:** See `AUTH_PATTERNS.md` (TBD) — Approved patterns for login, OAuth, multi-factor
- **OWASP:** See `OWASP_CHECKLIST.md` (TBD) — XSS, CSRF, injection, auth bypass prevention

## Violation Escalation

| Severity | Action | Example |
|----------|--------|---------|
| **CRITICAL** | Stop work immediately | Secret exposed in logs; credential in source code |
| **HIGH** | Require team review before merge | Missing input validation; weak auth | 
| **MEDIUM** | Document and track | Missing error handling; logging patterns |
| **LOW** | Capture in memory; refactor later | Style/consistency issues |

## Incident Procedures

### Secret Exposed

1. **STOP** — Do not continue using exposed credential
2. **Alert:** Post in security channel with exposure details
3. **Rotate:** User rotates credential immediately
4. **Verify:** Check git history for other occurrences
5. **Improve:** Update CI/CD to redact secrets from logs
6. **Document:** Log in decisions/log.md for team review

### Suspected Vulnerability

1. Create private security issue (mark 👁️ if available)
2. Include: vulnerability type, location, affected component
3. Assign to security lead for triage
4. Do NOT include exploit code or proof-of-concept that could enable attack

### Suspicious Activity

1. Alert team immediately
2. Preserve logs/artifacts for investigation
3. Escalate to ops/security team
