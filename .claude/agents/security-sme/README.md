# Security SME Agent

## Overview

The **Security SME** analyzes **security risks** and **compliance requirements** before implementation. It focuses on auth, secrets, OWASP compliance, and data sensitivity.

## When to Use

Dispatch this agent when:
- Adding authentication or authorization
- Handling sensitive data (PII, passwords, API keys)
- Designing user-facing forms or APIs
- Integrating third-party services
- Making decisions about data encryption or access control

## What It Analyzes

| Dimension | Questions |
|-----------|-----------|
| **Authentication** | How are users identified? Are credentials handled securely? |
| **Authorization** | Can user A access user B's data? Are roles enforced? |
| **Secrets** | Where do API keys/tokens live? Are they ever logged? |
| **OWASP Compliance** | Does this feature have SQL injection, XSS, CSRF risks? |
| **Data Sensitivity** | What PII is handled? Is it encrypted? What's retention policy? |

## Example Finding

```
Finding: Missing Auth Check on Delete

- **Threat:** Any user can delete any project via /api/projects/[id]/delete
- **Risk level:** Critical
- **Mitigation:** Add auth check; verify project ownership before delete
- **Blocking?** Yes — security hole
```

## Tools It Uses

- `mcp__MCP_DOCKER__*` — load prior security decisions
- `context7` — fetch OWASP, bcrypt, OAuth docs
- `Grep` / `Read` — inspect auth code, env handling
- `sequential-thinking` — analyze threat scenarios

## How to Read Its Output

The agent returns a structured analysis:

```
## Domain: Security & Compliance

### Finding 1: [Security risk or compliance gap]
- **Threat:** What could go wrong
- **Risk level:** Critical / High / Medium / Low
- **Mitigation:** How to address it
- **Blocking?** Yes/No

### Auth & Authorization
- [Who can access what? How is this enforced?]

### Secrets & Credentials
- [API keys, tokens, passwords handling]

### OWASP Compliance
- [Which Top 10 items apply? How to mitigate?]

### Conflicts with Other SMEs?
- [If security requirement conflicts with architecture, validation, or QA]
```

## Key Security Patterns It Enforces

- **Never Log Secrets:** API keys, passwords, tokens must NOT appear in logs
- **Env Variables Only:** Secrets in `.env.local` or Vercel secrets, never hardcoded
- **Auth Checks Always:** Protected routes must verify authentication before serving data
- **CSRF Tokens:** All forms must include CSRF protection (Next.js Server Actions implicit)
- **Validation + Sanitization:** Input must be validated (structure) AND sanitized (content)

## Success Criteria

You'll know the agent did good analysis when:

- ✅ You understand which threats apply to this feature
- ✅ Mitigations are specific (not vague "be secure")
- ✅ Blocking vs. recommended security measures are clear
- ✅ OWASP compliance gaps are identified
- ✅ Secrets handling strategy is documented

---

**Role:** Security analyst (reads findings, doesn't code)  
**Dispatch:** When handling auth, PII, API keys, or building user-facing features  
**Duration:** ~3–5 minutes analysis + response
