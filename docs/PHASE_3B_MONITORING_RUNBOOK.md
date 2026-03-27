# Production Monitoring Runbook
**For:** Electrical Website  
**Updated:** 2026-03-27  
**Owner:** DevOps / SRE Team

---

## Overview

This runbook documents the production monitoring stack, alert thresholds, and incident response procedures for nexgen-electrical-innovations.co.uk.

**Monitoring Tools:**
- Vercel Analytics (Web Vitals)
- Sentry (Error Tracking)
- Lighthouse CI (Performance Regression Detection)

---

## Vercel Analytics — Web Vitals Baseline

**Dashboard:** https://vercel.com/dashboard → Project → Analytics

### Key Metrics & Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| **LCP** (Largest Contentful Paint) | > 2.5s | 🔴 Critical |
| LCP | 2.0-2.5s | 🟡 Warning |
| LCP | < 2.0s | 🟢 Healthy |
| **CLS** (Cumulative Layout Shift) | > 0.1 | 🔴 Critical |
| CLS | 0.05-0.1 | 🟡 Warning |
| CLS | < 0.05 | 🟢 Healthy |
| **FID** (First Input Delay) | > 100ms | 🔴 Critical |
| FID | 50-100ms | 🟡 Warning |
| FID | < 50ms | 🟢 Healthy |
| **TTFB** (Time to First Byte) | > 800ms | 🔴 Critical |

### When LCP is High (> 2.5s)

**Likely Causes:**
- Slow server response (TTFB > 600ms)
- Large/unoptimized images
- Heavy JavaScript parsing
- Slow CSS delivery
- Third-party script blocker

**Investigation Steps:**
1. Check Vercel deployment logs: `vercel logs <project>`
2. Review recent code changes: `git log --oneline -20`
3. Check image sizes: `pnpm build` → verify `.next/static/media` directory
4. Profile with Lighthouse: `npx lighthouse https://nexgen-electrical-innovations.co.uk`

**Actionable Fixes:**
- Image optimization: Use `next/image` with `width` + `height` props
- CSS optimization: Defer non-critical CSS to secondary stylesheet
- JavaScript: Split large bundles with `next/dynamic`
- Caching: Review ISR revalidation times in `next.config.ts`
- Server: Check Vercel region for slowness

---

## Sentry Error Tracking

**Dashboard:** https://sentry.io/  
**Project:** electrical-website  
**Integration:** @sentry/nextjs (initialized in app/layout.tsx)

### Error Rate Thresholds

| Error Rate | Severity | Action |
|-----------|----------|--------|
| > 5 errors/min | 🔴 Critical | Page broken; page redeploy or rollback |
| 1-5 errors/min | 🟡 Warning | Monitor; investigate within 1h |
| < 1 error/min | 🟢 Healthy | Expected with user base this size |

### Common Error Types & Resolution

#### 1. JavaScript Errors (Hydration Mismatch)
**Symptoms:** Client-side errors, inconsistent behavior  
**Root Cause:** SSR/client rendering mismatch  
**Fix:**
```typescript
// Add Suspense boundary in app/layout.tsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingShell />}>
  {children}
</Suspense>
```

#### 2. 404 Not Found (> 10/min)
**Symptoms:** Users accessing nonexistent routes  
**Root Cause:** Broken links, crawlers hitting missing assets  
**Fix:**
- Check recent URL structure changes
- Review Sentry breadcrumbs for referrer
- Add canonical + robots.txt rules to block crawlers if needed

#### 3. CSP Violations
**Symptoms:** "Refused to load script/style" warnings  
**Root Cause:** Third-party scripts not whitelisted in Content Security Policy  
**Fix:**
- Review `middleware.ts` CSP header
- Add trusted domain to allowlist: `script-src 'self' https://trusted-domain.com`
- Document in code comment why needed

#### 4. Rate Limit Errors (429 Too Many Requests)
**Symptoms:** Contact form, API endpoints returning 429  
**Root Cause:** IP hitting rate limit (Resend, CAPTCHA, or custom)  
**Fix:**
- Check rate limit config in `app/env.ts` (CONTACT_RATE_LIMIT, CONTACT_RATE_LIMIT_WINDOW_HOURS)
- For API: Increase threshold or implement sliding window
- For CAPTCHA: Verify Cloudflare Turnstile config

---

## Lighthouse CI — Performance Regression Detection

**Runs On:** Every PR to `main` branch  
**Workflow:** `.github/workflows/lighthouse-ci.yml`  
**Report:** Available in PR checks tab

### Performance Thresholds (Google Defaults)

| Metric | Threshold | Fail Action |
|--------|-----------|-------------|
| LCP | > 2500ms | ❌ PR check fails |
| CLS | > 0.1 | ❌ PR check fails |
| FID | > 100ms | ⚠️ Warning (informational) |

### Interpreting Lighthouse Report

When a PR shows a red ❌ Lighthouse check:

1. **Click "Details"** on the GitHub check
2. **Review metric breakdown:**
   ```
   Performance: 85/100
   ├─ LCP: 2.1s ✅
   ├─ CLS: 0.08 ✅
   ├─ FID: 45ms ✅
   └─ TTI: 3.2s
   ```
3. **Common failure culprits:**
   - New image without `next/image` wrapper
   - Heavy JavaScript added (check bundle)
   - Animation regressing performance (use CSS over JS)
   - ISR revalidation time increased (check next.config.ts)

### Fixing Lighthouse Failures

```typescript
// BAD: Large image, blocks rendering
<img src="/image.jpg" alt="..." />

// GOOD: Optimized with next/image
import Image from 'next/image';
<Image 
  src="/image.jpg" 
  alt="..." 
  width={800} 
  height={600} 
  priority
/>
```

---

## Alert Procedures

### CRITICAL Alert (🔴 LCP > 2.5s AND Error Rate > 1%)

**Triggered By:** Vercel + Sentry simultaneous spike  
**Response Time:** < 5 minutes  
**Checklist:**
- [ ] Check Vercel deployment logs
- [ ] Review recent commits (git log --oneline -10)
- [ ] Check Sentry for specific errors
- [ ] Decide: Rollback vs. Hotfix?
  - Rollback if: Major regression in last commit
  - Hotfix if: Incremental degradation, needs quick improvement
- [ ] Notify team in #incidents channel
- [ ] Post-mortem after stabilization

### WARNING Alert (🟡 LCP 2.0-2.5s OR Error Rate 1-5/min)

**Triggered By:** Single metric high  
**Response Time:** < 1 hour  
**Checklist:**
- [ ] Investigate root cause in Sentry/Lighthouse
- [ ] Check if related to traffic spike or deployments
- [ ] Create GitHub issue for tracking
- [ ] Plan fix (don't need emergency rollback)
- [ ] Schedule for next sprint if not urgent

### INFO Alert (🟢 Healthy)

**Status:** Normal operation  
**Action:** None; continue monitoring

---

## Escalation Matrix

| Severity | Owner | Escalation | Response Time |
|----------|-------|-----------|---------------|
| 🔴 Critical (Page Down) | On-Call Eng | VP Eng → CTO | < 5 min |
| 🟡 Warning (Degraded) | Product Eng | Team Lead → VP Eng | < 1 hour |
| 🟢 Info (Tracked) | Product Eng | Team Slack | < 24 hours |

---

## Post-Incident Checklist

After addressing a critical incident:

1. **Stabilize:** Rollback or deploy hotfix
2. **Verify:** Check all metrics return to baseline
3. **Notify:** Post-incident summary in #incidents
4. **Document:** Add findings to this document
5. **Automate:** If possible, add automated fix for future

**Post-Mortem Template:**
```markdown
# Incident: [Title]

## Timeline
- HH:MM: Alert fired
- HH:MM: Root cause identified
- HH:MM: Mitigation applied
- HH:MM: Verified resolved

## Root Cause
[What went wrong]

## Impact
- Duration: X minutes
- Users Affected: ~X
- Revenue Impact: $X (if applicable)

## Fix
[What was changed]

## Prevention
[How to prevent next time]

## Assigned Follow-Up
- [ ] PR #XXX for automation
- [ ] Review in code: [file] L[line]
```

---

## External Runbooks

- Vercel Docs: https://vercel.com/docs/observability
- Sentry Docs: https://docs.sentry.io/
- Next.js Performance: https://nextjs.org/learn/cms/deploy-nextjs-app/optimize-database-queries

---

## On-Call Support

**On-Call Schedule:** #on-call Slack channel  
**Escalation:** @incidents-channel  
**Status Page:** https://nexgen.statuspage.io (if available)

---

**Last Updated:** 2026-03-27  
**Next Review:** Quarterly (or after major incident)

