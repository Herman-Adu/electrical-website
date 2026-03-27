# PHASE 3B SESSION PROMPT

**Session Type:** Implementation (Performance Monitoring)  
**Duration:** 2 hours (critical path)  
**Branch:** main (669907a)  
**Build State:** ✅ PASSING | Tests: ✅ 54/54 | Ready to proceed

---

## MISSION

Implement performance monitoring baseline for production promotion:

1. ✅ Vercel Analytics Web Vitals tracking
2. ✅ Sentry error tracking + error boundary
3. ✅ Lighthouse CI regression workflow
4. ✅ Production monitoring runbook

---

## SUCCESS CRITERIA

- [ ] Vercel Analytics enabled in next.config.ts
- [ ] Sentry DSN configured in .env + initialized in app
- [ ] Error boundary integrated with Sentry
- [ ] .github/workflows/lighthouse-ci.yml created
- [ ] Performance thresholds configured (LCP, CLS, FID)
- [ ] PHASE_3B_PERFORMANCE_BASELINE.md documented
- [ ] Build still passing, no new lint warnings
- [ ] 2-3 commits created

---

## IMPLEMENTATION ORDER

### Step 1: Vercel Analytics (15min)

**What:** Enable Web Vitals collection in Next.js  
**Files:**

- `next.config.ts` → Add analytics flag
- `app/layout.tsx` → Add Web Vitals script (optional, Vercel does it automatically)

**Code:**

```typescript
// next.config.ts
{
  analytics: {
    enabled: true;
  }
}
```

### Step 2: Sentry Setup (30min)

**What:** Error tracking + client/server error boundaries  
**Files:**

- `app/env.ts` → Add SENTRY_DSN (optional, read from .env)
- `app/layout.tsx` → Initialize Sentry
- `app/error.tsx` → Wrap with Sentry error boundary (already exists, enhance it)
- `.env.example` → Document SENTRY_DSN placeholder
- `package.json` → Add `@sentry/nextjs`

**Packages:**

```bash
pnpm add @sentry/nextjs
```

**Code Pattern:**

```typescript
// app/layout.tsx
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enabled:
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging",
  });
}
```

### Step 3: Lighthouse CI Workflow (20min)

**What:** GitHub Actions workflow for performance regression detection  
**Files:**

- `.github/workflows/lighthouse-ci.yml` → NEW workflow

**Config:**

```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start &
      - run: npx @lhci/cli@latest autorun
```

### Step 4: Monitoring Runbook (25min)

**What:** Documentation for production ops  
**File:**

- `PHASE_3B_PERFORMANCE_BASELINE.md` → Thresholds, alerts, incident response

**Content:**

```markdown
# Production Monitoring Runbook

## Vercel Analytics Thresholds

- LCP > 2.5s: Investigate image optimization, server latency
- CLS > 0.1: Check for layout shift bugs
- TTFB > 800ms: Check ISR revalidation

## Sentry Alerts

- JS Error Rate > 1%: Page issues
- 404 Rate > 10/min: Broken links

## Response Procedures

1. Alert fires → Check dashboard
2. Review git log for recent deploys
3. Rollback or hotfix
4. Post-mortem documentation
```

---

## DEPENDENCIES & BLOCKERS

- ❌ None identified
- ✅ All plugins/packages available
- ✅ Production build still passing
- ✅ No breaking changes expected

---

## RATE-LIMIT STRATEGY (LEAN)

**Maximum Sub-Agents Used:** 2

- Agent 1 (Planning): Analyze setup order, dependency chains, conflicts
- Agent 2 (Verification): After implementation, verify integrations work

**Parallel Operations:** Batch file changes in single replacement (analytics + env vars)

**Implementation:** Direct (not delegated) to avoid cascading tool calls

---

## FILES TO MODIFY

```
NEW FILES:
  .github/workflows/lighthouse-ci.yml
  PHASE_3B_PERFORMANCE_BASELINE.md

MODIFIED FILES:
  next.config.ts              → Add analytics flag
  app/layout.tsx              → Sentry init
  app/error.tsx               → Enhanced error boundary
  .env.example                → Document Sentry DSN
  package.json                → Add @sentry/nextjs (via pnpm add)
```

---

## COMMIT PATTERN

```
1. feat(monitoring): add Vercel Analytics and Sentry error tracking
   - next.config.ts: enable analytics
   - app/layout.tsx: initialize Sentry
   - package.json: add @sentry/nextjs dependency

2. feat(ci): add Lighthouse performance regression workflow
   - .github/workflows/lighthouse-ci.yml: LCP/CLS/FID thresholds

3. docs(monitoring): add performance baseline and ops runbook
   - PHASE_3B_PERFORMANCE_BASELINE.md: thresholds, incident response
```

---

## NEXT STEPS AFTER 3B

- **Option 1:** Phase 3C Accessibility Audit (3h, independent)
- **Option 2:** Staging smoke test + production promotion (30min)
- **Option 3:** Both (parallel, 3.5h total to prod-ready)

---

## GO!

Start with Agent 1 (Planning) → Execute steps 1-4 → Verify → Commit → Finalize
