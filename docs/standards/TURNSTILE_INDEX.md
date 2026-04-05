# Turnstile Widget Lifecycle — Documentation Index & Navigation Guide

**Version:** 1.0  
**Status:** Complete Design Documentation Set  
**Date:** April 5, 2026  
**Audience:** Engineers, Security, QA, Architects

---

## DOCUMENTATION SET OVERVIEW

This is a **complete, production-grade security specification** for Turnstile CAPTCHA reintegration in the Nexgen Electrical contact form. Four documents cover all aspects:

| Document                                                           | Purpose                                                                                                            | Audience                     | Read Time |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- | --------- |
| [TURNSTILE_WIDGET_LIFECYCLE.md](TURNSTILE_WIDGET_LIFECYCLE.md)     | **MAIN SPEC:** Complete lifecycle, failure modes, server verification, implementation patterns, security checklist | All engineers, architects    | 30 min    |
| [TURNSTILE_QUICK_REFERENCE.md](TURNSTILE_QUICK_REFERENCE.md)       | **IMPLEMENTATION GUIDE:** Code locations, file edits, test checklist, deployment                                   | Frontend, backend developers | 15 min    |
| [TURNSTILE_SECURITY_DECISIONS.md](TURNSTILE_SECURITY_DECISIONS.md) | **SECURITY RATIONALE:** Why each design choice was made, threat models, compliance mapping                         | Security team, architects    | 25 min    |
| [TURNSTILE_TEST_STRATEGY.md](TURNSTILE_TEST_STRATEGY.md)           | **TEST SCENARIOS:** 30+ concrete test cases with expected results, setup, and verification                         | QA engineers                 | 20 min    |

---

## QUICK START (5 MINUTES)

**You have 5 minutes?** Read this:

1. **What's the goal?**
   - Reintegrate Turnstile CAPTCHA on the Step 1 of contact form
   - User verifies they're human → token stored → Step 5 submit validated
   - Server verifies token with Cloudflare Siteverify API

2. **What's the workflow?**
   - Step 1: Widget renders → User completes challenge → Token stored in Zustand
   - Steps 2–4: Token remains ephemeral (not persisted)
   - Step 5: Button gated by token check → Server verifies token → Form submitted

3. **What's the security model?**
   - Token NEVER localStorage (XSS-safe)
   - Siteverify called BEFORE form processing (defense-in-depth)
   - Server validates hostname (prevents subdomain confusion)
   - Rate limiting + 8-second timeout (DoS protection)

4. **What needs to be implemented?**
   - [→ See TURNSTILE_QUICK_REFERENCE.md (Exact file edits section)](TURNSTILE_QUICK_REFERENCE.md#code-locations--edits)

---

## DOCUMENT SELECTION GUIDE

### "I'm implementing the feature"

→ Start with [TURNSTILE_QUICK_REFERENCE.md](TURNSTILE_QUICK_REFERENCE.md)

- Shows exact files to edit
- Code locations with line numbers
- Environment variables needed
- Test checklist

Then reference [TURNSTILE_WIDGET_LIFECYCLE.md](TURNSTILE_WIDGET_LIFECYCLE.md) for implementation patterns.

### "I'm reviewing security"

→ Start with [TURNSTILE_SECURITY_DECISIONS.md](TURNSTILE_SECURITY_DECISIONS.md)

- Explains threat model for each design choice
- Why alternatives were rejected
- Compliance mapping (OWASP, CWE)
- Future improvements

Then cross-check against [TURNSTILE_WIDGET_LIFECYCLE.md](TURNSTILE_WIDGET_LIFECYCLE.md) security checklist.

### "I'm writing tests"

→ Start with [TURNSTILE_TEST_STRATEGY.md](TURNSTILE_TEST_STRATEGY.md)

- 30+ concrete test scenarios
- Expected results for each
- Setup instructions
- Failure analysis

Then reference failure modes in [TURNSTILE_WIDGET_LIFECYCLE.md (Section 3)](TURNSTILE_WIDGET_LIFECYCLE.md#3-failure-mode-matrix).

### "I'm designing / architecting"

→ Start with [TURNSTILE_WIDGET_LIFECYCLE.md](TURNSTILE_WIDGET_LIFECYCLE.md) (full)

- Complete system design
- State transitions
- Execution order
- All code patterns

Then read [TURNSTILE_SECURITY_DECISIONS.md](TURNSTILE_SECURITY_DECISIONS.md) for rationale.

### "I'm debugging a failure"

→ Go directly to:

- [TURNSTILE_WIDGET_LIFECYCLE.md § 3 (Failure-Mode Matrix)](TURNSTILE_WIDGET_LIFECYCLE.md#3-failure-mode-matrix)
- [TURNSTILE_WIDGET_LIFECYCLE.md § 9 (Troubleshooting Guide)](TURNSTILE_WIDGET_LIFECYCLE.md#9-troubleshooting-guide)
- [TURNSTILE_TEST_STRATEGY.md § Failure Analysis](TURNSTILE_TEST_STRATEGY.md#category-g-security-checks)

---

## CROSS-REFERENCE MAP

### By Topic

#### "Widget Lifecycle"

- **Main ref:** [TURNSTILE_WIDGET_LIFECYCLE.md § 2](TURNSTILE_WIDGET_LIFECYCLE.md#2-widget-lifecycle)
- **Code:** [TURNSTILE_QUICK_REFERENCE.md § Code Locations (File 3)](TURNSTILE_QUICK_REFERENCE.md#file-3-featurescontactcomponentsorganismscontact-stepscont-info-steptsx)
- **Tests:** [TURNSTILE_TEST_STRATEGY.md § Category A, B, C](TURNSTILE_TEST_STRATEGY.md#category-a-widget-rendering)

#### "Server Verification (Siteverify)"

- **Main ref:** [TURNSTILE_WIDGET_LIFECYCLE.md § 4](TURNSTILE_WIDGET_LIFECYCLE.md#4-siteverify-api-request-details)
- **Implementation:** [TURNSTILE_WIDGET_LIFECYCLE.md § 5.4](TURNSTILE_WIDGET_LIFECYCLE.md#54-server-side-verification-siteverify-call)
- **Code edit:** [TURNSTILE_QUICK_REFERENCE.md § File 4](TURNSTILE_QUICK_REFERENCE.md#file-4-featurescontactapicontact-requestts)
- **Tests:** [TURNSTILE_TEST_STRATEGY.md § Category E](TURNSTILE_TEST_STRATEGY.md#category-e-server-side-verification)

#### "Rate Limiting"

- **Decision rationale:** [TURNSTILE_SECURITY_DECISIONS.md § Decision 4](TURNSTILE_SECURITY_DECISIONS.md#decision-4-rate-limiting-before-turnstile-verification)
- **Threat model:** [TURNSTILE_WIDGET_LIFECYCLE.md § 3.3](TURNSTILE_WIDGET_LIFECYCLE.md#33-scenario-token-expires-before-submit)
- **Implementation:** [TURNSTILE_WIDGET_LIFECYCLE.md § 5.5](TURNSTILE_WIDGET_LIFECYCLE.md#55-siteverify-call-integration-in-form-submission)
- **Tests:** [TURNSTILE_TEST_STRATEGY.md § Category F](TURNSTILE_TEST_STRATEGY.md#category-f-rate-limiting)

#### "Token Storage & Security"

- **Decision:** [TURNSTILE_SECURITY_DECISIONS.md § Decision 1](TURNSTILE_SECURITY_DECISIONS.md#decision-1-ephemeral-token-storage-zustand-not-localstorage)
- **Verification:** [TURNSTILE_WIDGET_LIFECYCLE.md § 1: Token Storage](TURNSTILE_WIDGET_LIFECYCLE.md#token-storage)
- **Security checklist:** [TURNSTILE_WIDGET_LIFECYCLE.md § 6.1](TURNSTILE_WIDGET_LIFECYCLE.md#61-token-storage--exposure)
- **Tests:** [TURNSTILE_TEST_STRATEGY.md § Tests 7.1, 7.2, 7.3](TURNSTILE_TEST_STRATEGY.md#category-g-security-checks)

#### "Failure Handling"

- **Matrix:** [TURNSTILE_WIDGET_LIFECYCLE.md § 3](TURNSTILE_WIDGET_LIFECYCLE.md#3-failure-mode-matrix)
- **Error mapping:** [TURNSTILE_WIDGET_LIFECYCLE.md § 5.3](TURNSTILE_WIDGET_LIFECYCLE.md#53-onerror-handler-client-side)
- **Troubleshooting:** [TURNSTILE_WIDGET_LIFECYCLE.md § 9](TURNSTILE_WIDGET_LIFECYCLE.md#9-troubleshooting-guide)
- **Tests:** [TURNSTILE_TEST_STRATEGY.md § Tests 2.2, 2.3](TURNSTILE_TEST_STRATEGY.md#test-22-user-fails-challenge-closes-widget)

#### "Environment Configuration"

- **Setup:** [TURNSTILE_QUICK_REFERENCE.md § Environment Configuration](TURNSTILE_QUICK_REFERENCE.md#environment-configuration)
- **Files:** [TURNSTILE_QUICK_REFERENCE.md § File 6 (app/env.ts)](TURNSTILE_QUICK_REFERENCE.md#file-6-appenvts)
- **Security:** [TURNSTILE_WIDGET_LIFECYCLE.md § 6.7](TURNSTILE_WIDGET_LIFECYCLE.md#67-environment-configuration)

#### "Testing"

- **Test matrix:** [TURNSTILE_TEST_STRATEGY.md § Test Coverage Matrix](TURNSTILE_TEST_STRATEGY.md#test-coverage-matrix)
- **Scenarios:** [TURNSTILE_TEST_STRATEGY.md § Detailed Test Scenarios](TURNSTILE_TEST_STRATEGY.md#detailed-test-scenarios)
- **Schedule:** [TURNSTILE_TEST_STRATEGY.md § Test Execution Schedule](TURNSTILE_TEST_STRATEGY.md#test-execution-schedule)
- **Smoke test:** [TURNSTILE_TEST_STRATEGY.md § Quick Start](TURNSTILE_TEST_STRATEGY.md#quick-start-5-minute-smoke-test)

### By Role

#### Frontend Developer

1. Read: [TURNSTILE_QUICK_REFERENCE.md](TURNSTILE_QUICK_REFERENCE.md) (15 min)
2. Reference: [TURNSTILE_WIDGET_LIFECYCLE.md § 5.1–5.3](TURNSTILE_WIDGET_LIFECYCLE.md#51-onverify-handler-client-side) (implementation patterns)
3. Test: [TURNSTILE_TEST_STRATEGY.md § Categories A, B, C, D](TURNSTILE_TEST_STRATEGY.md#detailed-test-scenarios) (manual testing)

#### Backend Developer

1. Read: [TURNSTILE_QUICK_REFERENCE.md](TURNSTILE_QUICK_REFERENCE.md) (15 min)
2. Reference: [TURNSTILE_WIDGET_LIFECYCLE.md § 4–5.5](TURNSTILE_WIDGET_LIFECYCLE.md#4-siteverify-api-request-details) (server implementation)
3. Test: [TURNSTILE_TEST_STRATEGY.md § Categories E, F](TURNSTILE_TEST_STRATEGY.md#category-e-server-side-verification) (API testing)

#### Security Engineer

1. Read: [TURNSTILE_SECURITY_DECISIONS.md](TURNSTILE_SECURITY_DECISIONS.md) (25 min)
2. Verify: [TURNSTILE_WIDGET_LIFECYCLE.md § 6 (Security Checklist)](TURNSTILE_WIDGET_LIFECYCLE.md#6-security-checklist)
3. Review Code: [TURNSTILE_QUICK_REFERENCE.md § Code Locations](TURNSTILE_QUICK_REFERENCE.md#code-locations--edits)
4. Test: [TURNSTILE_TEST_STRATEGY.md § Tests 7.1, 7.2, 7.3](TURNSTILE_TEST_STRATEGY.md#category-g-security-checks)

#### QA Engineer

1. Read: [TURNSTILE_TEST_STRATEGY.md](TURNSTILE_TEST_STRATEGY.md) (20 min)
2. Reference: [TURNSTILE_WIDGET_LIFECYCLE.md § 3 (Failure Modes)](TURNSTILE_WIDGET_LIFECYCLE.md#3-failure-mode-matrix) for expected behaviors
3. Execute: [TURNSTILE_TEST_STRATEGY.md § Test Execution Schedule](TURNSTILE_TEST_STRATEGY.md#test-execution-schedule)

#### Architect / Tech Lead

1. Read: [TURNSTILE_WIDGET_LIFECYCLE.md § 1-2 (Overview & Lifecycle)](TURNSTILE_WIDGET_LIFECYCLE.md)
2. Review: [TURNSTILE_SECURITY_DECISIONS.md (Full)](TURNSTILE_SECURITY_DECISIONS.md) (design rationale)
3. Approve: [TURNSTILE_WIDGET_LIFECYCLE.md § 6 (Security Checklist)](TURNSTILE_WIDGET_LIFECYCLE.md#6-security-checklist)

---

## IMPLEMENTATION TIMELINE

### Phase 1: Planning & Review (30 min)

- [ ] Tech Lead reads [TURNSTILE_WIDGET_LIFECYCLE.md § 1-2](TURNSTILE_WIDGET_LIFECYCLE.md#executive-summary)
- [ ] Security reviews [TURNSTILE_SECURITY_DECISIONS.md](TURNSTILE_SECURITY_DECISIONS.md)
- [ ] Approval given to proceed

### Phase 2: Development (2–4 hours)

- [ ] Frontend dev reads [TURNSTILE_QUICK_REFERENCE.md](TURNSTILE_QUICK_REFERENCE.md)
- [ ] Backend dev implements server verification (Files 1–5)
- [ ] Reference [TURNSTILE_WIDGET_LIFECYCLE.md § 5](TURNSTILE_WIDGET_LIFECYCLE.md#5-implementation-code-patterns)
- [ ] Local testing via [TURNSTILE_TEST_STRATEGY.md § Quick Start](TURNSTILE_TEST_STRATEGY.md#quick-start-5-minute-smoke-test)

### Phase 3: Code Review & Testing (1–2 hours)

- [ ] Code review checklist: [TURNSTILE_QUICK_REFERENCE.md § Security Checklist](TURNSTILE_QUICK_REFERENCE.md#security-checklist-before-merge)
- [ ] QA runs [TURNSTILE_TEST_STRATEGY.md § Category A–G](TURNSTILE_TEST_STRATEGY.md#detailed-test-scenarios)
- [ ] Unit + E2E tests: [TURNSTILE_TEST_STRATEGY.md § Test Execution](TURNSTILE_TEST_STRATEGY.md#test-execution-schedule)

### Phase 4: Deployment (1 hour prep + 24h monitoring)

- [ ] Deployment checklist: [TURNSTILE_WIDGET_LIFECYCLE.md § 8](TURNSTILE_WIDGET_LIFECYCLE.md#8-deployment-checklist)
- [ ] Post-deployment: [TURNSTILE_TEST_STRATEGY.md § Post-Deployment Monitoring](TURNSTILE_TEST_STRATEGY.md#post-deployment-monitoring-first-24-hours)

---

## KEY DECISIONS (At a Glance)

**Q: Where is the token stored?**  
A: Zustand ephemeral state (NOT localStorage/sessionStorage/cookies)  
→ See [TURNSTILE_SECURITY_DECISIONS.md § Decision 1](TURNSTILE_SECURITY_DECISIONS.md#decision-1-ephemeral-token-storage-zustand-not-localstorage)

**Q: When does the server verify the token?**  
A: AFTER rate limit check, BEFORE form field validation  
→ See [TURNSTILE_WIDGET_LIFECYCLE.md § 5.5 (Execution Order)](TURNSTILE_WIDGET_LIFECYCLE.md#execution-order-exact-sequence)

**Q: How long is the token valid?**  
A: 5–10 minutes (Cloudflare backend enforces)  
→ See [TURNSTILE_WIDGET_LIFECYCLE.md § 2.2 (Token Properties)](TURNSTILE_WIDGET_LIFECYCLE.md#token-properties)

**Q: What happens if the user takes >10 minutes between Step 1 and Step 5?**  
A: Token expires; user goes back to Step 1; re-verifies  
→ See [TURNSTILE_WIDGET_LIFECYCLE.md § 3.3](TURNSTILE_WIDGET_LIFECYCLE.md#33-scenario-token-expires-between-step-1-and-step-5)

**Q: What if Turnstile widget fails to load?**  
A: Fallback error message; user cannot proceed until retry succeeds  
→ See [TURNSTILE_WIDGET_LIFECYCLE.md § 3.1](TURNSTILE_WIDGET_LIFECYCLE.md#31-scenario-widget-fails-to-load)

**Q: What if the server Siteverify call times out?**  
A: Request aborted after 8 seconds; user sees "Service unavailable" error  
→ See [TURNSTILE_SECURITY_DECISIONS.md § Decision 6](TURNSTILE_SECURITY_DECISIONS.md#decision-6-8-second-timeout-on-siteverify-request)

**Q: Can I bypass the token gate on Step 5?**  
A: No. Client-side button disabled + server-side enforcement (defense-in-depth)  
→ See [TURNSTILE_SECURITY_DECISIONS.md § Decision 5](TURNSTILE_SECURITY_DECISIONS.md#decision-5-client-side-submit-button-gate-token-check)

---

## CRITICAL CHECKLIST (Before Merge)

**Security:**

- [ ] Token NOT in localStorage (verify in DevTools Application tab)
- [ ] Secret key NOT in client code (check env.ts)
- [ ] Siteverify called BEFORE form processing (check submitContactRequest order)
- [ ] Hostname validation in place (check verifyTurnstileToken)
- [ ] All error messages user-facing (no technical codes exposed)

**Implementation:**

- [ ] Schema updated with turnstileToken field
- [ ] Zustand store has ephemeral token (partialize excludes it)
- [ ] Widget renders on Step 1 with all callbacks
- [ ] Submit button gated on Step 5
- [ ] Server Siteverify integration complete

**Testing:**

- [ ] Smoke test passes ([TURNSTILE_TEST_STRATEGY.md § Quick Start](TURNSTILE_TEST_STRATEGY.md#quick-start-5-minute-smoke-test))
- [ ] All P0 tests pass ([TURNSTILE_TEST_STRATEGY.md § Test Matrix](TURNSTILE_TEST_STRATEGY.md#test-coverage-matrix))
- [ ] No console errors or warnings (prod build)
- [ ] Email delivers successfully

**Environment:**

- [ ] Test keys configured locally (.env.local)
- [ ] Production keys ready for Vercel
- [ ] .env.example documented

---

## REFERENCE TABLES

### Turnstile Error Codes

| Code                     | Meaning                       | Recovery                  |
| ------------------------ | ----------------------------- | ------------------------- |
| `challenge-closed`       | User clicked ✕                | Retry                     |
| `challenge-error`        | Cloudflare error              | Retry (may transient)     |
| `challenge-expired`      | Challenge timed out           | Retry                     |
| `network-error`          | Network timeout               | Check connectivity; retry |
| `timeout-or-duplicate`   | Token expired or reused       | Generate new token; retry |
| `invalid-input-secret`   | Server secret missing/invalid | Check env vars            |
| `missing-input-response` | No token from client          | Complete challenge        |

→ See [TURNSTILE_WIDGET_LIFECYCLE.md § 3](TURNSTILE_WIDGET_LIFECYCLE.md#3-failure-mode-matrix) for full mapping.

### Environment Variables

| Variable                         | Type   | Scope  | Example                               |
| -------------------------------- | ------ | ------ | ------------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Client | `1x00000000000000000000AA`            |
| `TURNSTILE_SECRET_KEY`           | Secret | Server | `1x0000000000000000000000000000000AA` |
| `NEXT_PUBLIC_SITE_URL`           | Public | Client | `http://localhost:3000`               |
| `CONTACT_RATE_LIMIT`             | Config | Server | `3` (per hour)                        |

→ See [TURNSTILE_QUICK_REFERENCE.md § Environment Configuration](TURNSTILE_QUICK_REFERENCE.md#environment-configuration).

---

## EXTERNAL REFERENCES

### Cloudflare Turnstile

- [Official Docs](https://developers.cloudflare.com/turnstile/)
- [Siteverify API](https://developers.cloudflare.com/turnstile/api/siteverify/)
- [JavaScript API](https://developers.cloudflare.com/turnstile/references/javascript-api/)

### react-turnstile Library

- [npm Package](https://www.npmjs.com/package/react-turnstile)
- [GitHub Repo](https://github.com/marsibarbar/react-turnstile)

### Security Standards

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Registry](https://cwe.mitre.org/)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## FAQ (Frequently Asked Questions)

**Q: Can I use this token for multiple form submissions?**  
A: No. Token is single-use after first Siteverify call. Second submission needs new token.

**Q: What if user navigates away from Step 1 and comes back?**  
A: Token remains in ephemeral Zustand if in same session. Lost on page reload.

**Q: Can I test with production keys locally?**  
A: No. Prod keys tied to production domain. Use test keys for `localhost`.

**Q: What's the rate limit?**  
A: 3 requests per 1 hour per IP (configurable via `CONTACT_RATE_LIMIT`).

**Q: Can I skip server-side verification if client verifies?**  
A: No. Server verification is mandatory (client gate is not sufficient).

**Q: How do I monitor Turnstile failures in production?**  
A: Check server logs for `[contact] Turnstile verification` entries (TODO: centralize to monitoring system).

---

## DOCUMENT MAINTENANCE

**Last Updated:** April 5, 2026  
**Next Review:** July 1, 2026 (post-production validation)  
**Owner:** Security & Architecture Team  
**Reviewers:** Engineering leads, QA, Infosec

### Version History

- **v1.0 (Apr 5, 2026):** Initial design specification
- (Future versions documented here)

---

## QUICK LINKS

- [Main Lifecycle Design](TURNSTILE_WIDGET_LIFECYCLE.md) — Complete spec
- [Quick Reference](TURNSTILE_QUICK_REFERENCE.md) — For developers
- [Security Decisions](TURNSTILE_SECURITY_DECISIONS.md) — For architects
- [Test Strategy](TURNSTILE_TEST_STRATEGY.md) — For QA

---

**End of Index**  
When in doubt, start with [TURNSTILE_WIDGET_LIFECYCLE.md](TURNSTILE_WIDGET_LIFECYCLE.md) and search for your topic.
