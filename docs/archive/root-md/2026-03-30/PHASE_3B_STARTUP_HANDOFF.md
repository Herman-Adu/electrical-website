# PHASE 3B STARTUP HANDOFF

**For:** Next Claude Session  
**Date Prepared:** 2026-03-27  
**Status:** Ready (Phase 3A ✅ 54/54 tests passing, staging approved)  
**Recommended Duration:** 2-5h (B + optional C in parallel)

---

## Executive Summary

**Phase 3A Status:** ✅ COMPLETE (54/54 E2E tests passing, staging approved)  
**Phase 3B Plan:** Performance Monitoring (Vercel Analytics + Sentry) — 2h critical path  
**Phase 3C Option:** Accessibility Audit (independent, 3h) — can run in parallel

**Production Readiness:** 🟡 MONITORING BASELINE REQUIRED before production promotion

---

## Phase 3B: Performance Monitoring (Recommended Next)

### Why Phase 3B Now?

1. **Baseline Establishment** — Must capture metrics after E2E validates system stability
2. **Production Support** — Alerts + error tracking essential for production readiness
3. **Quick Win** — Only 2h implementation; unblocks production path
4. **Regression Detection** — Lighthouse CI catches perf degradation on future PRs

### Scope

#### 1. Vercel Analytics Integration (30min)

Add Web Vitals tracking to production environment:

```typescript
// next.config.ts: Enable analytics
{
  analytics: {
    enabled: true  // Vercel automatically collects Web Vitals
  }
}

// Key metrics tracked:
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to First Byte (TTFB)
- Next.js Route Change Speed
```

**Deliverable:** Vercel Analytics dashboard visible in Vercel UI showing 7-day baseline

#### 2. Sentry Error Tracking (30min)

Set up error tracking for JavaScript errors, CSP violations, 404s:

```typescript
// app/layout.tsx: Initialize Sentry
import * as Sentry from "@sentry/nextjs";

// lib/sentry.server.ts: Server-side error logging
// lib/sentry.client.tsx: Client-side error boundary

// Env vars:
NEXT_PUBLIC_SENTRY_DSN=https://***@sentry.io/project-id
SENTRY_AUTH_TOKEN=***  // For release upload
```

**Deliverable:** Sentry project dashboard with error ingestion verified via test error

#### 3. Lighthouse CI Regression Detection (20min)

Add GitHub Actions workflow for performance regression detection:

```yaml
# .github/workflows/lighthouse-ci.yml
Triggers: Pull Requests
Steps:
  1. pnpm build
  2. Start server (next start)
  3. Run Lighthouse on critical routes (/, /about, /projects, /contact)
  4. Compare to baseline
  5. Fail PR if: LCP > baseline, CLS > 0.1, FID > 100ms
```

**Deliverable:** GitHub Actions workflow runs on PR; reports performance deltas

#### 4. Monitoring Ops Playbook (40min)

Document alert thresholds and incident response:

```markdown
# Production Monitoring Runbook

## Vercel Analytics Thresholds

- LCP > 2.5s: Investigate image optimization, server latency
- CLS > 0.1: Check for layout shift bugs in animations, ads
- TTFB > 800ms: Check ISR revalidation frequency, server load

## Sentry Alerts

- JavaScript Error Rate > 1%: Page issues + visual regression
- 404 Rate > 10/min: Broken link crawl or misconfigured redirects
- CSP Violations > 5/min: Third-party script injection or config drift

## Escalation Procedure

1. Alert fires (Slack notification)
2. Open Vercel or Sentry dashboard
3. Check git log for recent deploys
4. Review error traces / Web Vitals timeline
5. Rollback or hotfix
6. Post-mortem in #incidents
```

**Deliverable:** PHASE_3B_MONITORING_RUNBOOK.md in repo

---

## Phase 3C: Accessibility Audit (Optional, Independent)

If you have bandwidth, run in parallel with 3B:

### Scope (3h)

1. **Automated Scan** (40min)
   - Run axe-core on all critical routes
   - Generate accessibility report
   - Categorize issues by severity (critical/high/medium/low)

2. **Manual Testing** (60min)
   - Test with NVDA or JAWS screen reader
   - Keyboard navigation: Tab, Enter, Escape, Arrow keys
   - Focus management in modals, dropdowns
   - Form labels and error messages

3. **Fixes** (50min)
   - Contrast ratio issues (use WebAIM checker)
   - Missing ARIA labels (aria-label, aria-describedby)
   - Keyboard trap fixes
   - Focus outline visibility

4. **Compliance Report** (30min)
   - WCAG 2.1 AA checklist
   - Issue matrix (route × issue category)
   - Remediation plan for remaining issues
   - Document accessibility test suite for future PRs

**Deliverable:** PHASE_3C_ACCESSIBILITY_AUDIT.md + fixes in commits

---

## Pre-Staged Environment Setup

### Before Starting Session

```powershell
# 1. Verify git state
git status
git log --oneline -3
# Should show: Phase 3A completion commit (1e2a9e9)

# 2. Verify E2E still passing (sanity check)
pnpm exec playwright test --reporter=list
# Should show: 54 passed

# 3. Verify production build
pnpm build 2>&1 | Select-Object -Last 5
# Should pass with no errors

# 4. Read memory index
# Query: agent:v1:phase3a_completion_full_report
```

---

## Sub-Agent Delegation Strategy

### To Avoid Rate Limiting: SAME PATTERN AS 3A

**Stage 1: Planning Agent (LIGHT)**

- Query existing monitoring setup
- Analyze current env vars
- Map Sentry vs Vercel capabilities
- Generate implementation checklist

**Stage 2: Implementation Agent (LIGHT)**

- Update env.ts with Sentry DSN
- Update next.config.ts with analytics flag
- Generate .github/workflows/lighthouse-ci.yml
- Create monitoring runbook

**Stage 3: Verification (LIGHT)**

- Verify Sentry event ingestion
- Check Vercel Analytics dashboard
- Test Lighthouse workflow on dummy PR

---

## Key Files to Know

### Monitoring Integration Points

- `app/env.ts` — T3-env config (add SENTRY_DSN)
- `next.config.ts` — Analytics flag + ISR config
- `.github/workflows/lighthouse-ci.yml` — NEW CI workflow
- `middleware.ts` — CSP headers (Sentry endpoint whitelisting)

### Error Handling Foundation

- `app/layout.tsx` — Layout error boundary
- `app/error.tsx` — Error UI component (already present from Phase 2)
- `app/not-found.tsx` — 404 page

### Performance Context

- `lib/site-config.ts` — Site metadata (ISR revalidation)
- `next.config.ts` — Image optimization, ISR strategy
- `vitest.config.ts` — Performance test patterns (if monitoring tests added)

---

## Monitoring MCP Entities (For Context)

If needing refresh on Phase 3A:

```
agent:v1:phase3a_completion_full_report      → Test metrics, fixes, deployment status
agent:v1:phase3a_deployment_approval         → Staging approval checklist
agent:v1:phase3_to_phase3b_handoff           → Phase 3B options + recommendations
```

---

## Success Criteria

### Phase 3B Complete When:

1. Vercel Analytics: 7-day Web Vitals baseline captured
2. Sentry: Error tracking active, dashboard showing ingested event
3. Lighthouse CI: Workflow added to .github/workflows/, runs on PRs
4. Runbook: Production monitoring playbook documented
5. Approval: Baseline metrics documented in PHASE_3B_PERFORMANCE_BASELINE.md

### Phase 3C Complete When (If Pursued):

1. Automated scan: axe-core report generated
2. Manual testing: Screen reader + keyboard nav verified
3. Fixes: Critical/high issues resolved
4. Report: WCAG 2.1 AA compliance documented

---

## Next Session Workflow

**On startup:**

1. ✅ Read THIS FILE (you are here)
2. ✅ Verify: `git log --oneline -3` (confirm 1e2a9e9 on main)
3. ✅ Sanity: `pnpm exec playwright test --reporter=list` (54/54 passing)
4. ➡️ Delegate planning: Monitoring setup analysis
5. ➡️ Implement: Sentry + Vercel + Lighthouse
6. ➡️ Verify: Dashboard + error ingestion confirmed
7. ✅ Compile: Monitoring baseline document
8. 🎯 Complete: Phase 3B — production-ready monitoring in place

---

## Rate-Limit Mitigation (Same as 3A)

✅ Use sub-agent for setup analysis (1 atomic call)  
✅ Batch env var updates in single file edit  
✅ Register workflow in one commit  
✅ Verify via Sentry/Vercel API (not recursive polling)  
✅ Fallback: Manual setup if APIs slow

**No sequential small tool calls = no rate-limit risk**

---

## Git Commit Pattern

```
docs(phase3b): stage handoff with monitoring setup plan

[Phase 3A complete: 1e2a9e9, 54/54 E2E tests passing, staging approved]
[Phase 3B plan: Vercel Analytics + Sentry + Lighthouse CI]
[Effort: 2h critical path, 3-5h with optional 3C accessibility]
```

---

## What NOT To Do

- ❌ Promote to production without Phase 3B monitoring baseline
- ❌ Deploy Sentry without SENTRY_DSN configured in .env
- ❌ Run Lighthouse on dev server (must use `next start`)
- ❌ Skip the monitoring runbook (ops needs it for incident response)
- ❌ Defer accessibility to Phase 4 (can parallelize now)

---

## Phase 3B + 3C Timeline

| Phase          | Duration | Type               | Priority                       |
| -------------- | -------- | ------------------ | ------------------------------ |
| **3B**         | 2h       | Sequential         | 🔴 Critical path to production |
| **3C**         | 3h       | Parallel           | 🟡 Quality gate, not blocker   |
| **Sequential** | 5h       | B then C           | Production-ready + WCAG 2.1 AA |
| **Parallel**   | 3.5h     | B + C simultaneous | Faster if capacity available   |

**Recommendation:** Do B (blocking) → C (quality) → Production ready in ~3.5h total

---

**Prepared by:** Claude Sonnet 4.6 (Phase 3A completion)  
**Preparation Date:** 2026-03-27  
**Build Status:** ✅ PASSING  
**Test Status:** ✅ 54/54 PASSING  
**Staging Status:** 🟢 APPROVED (Phase 3A)  
**Production Status:** 🟡 AWAITING MONITORING (Phase 3B)
