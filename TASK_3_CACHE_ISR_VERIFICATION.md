# Task #3: Cache Control & ISR Verification

**Status:** READY FOR EXECUTION  
**Date:** 2026-03-27  
**Objective:** Verify cache layers are correctly configured for CDN + browser, confirm ISR effectiveness

---

## Executive Summary

Production deployment needs verified cache strategy:

1. **Browser caching** (Cache-Control headers for browser cache lifetime)
2. **CDN caching** (Cache-Control for Vercel Edge Network)
3. **ISR prerendering** (Incremental Static Regeneration working correctly)
4. **Stale-while-revalidate** (Serving stale during background revalidation)

---

## Current Configuration Status

### ✅ next.config.ts Cache Profile

```typescript
cacheLife: {
  default: {
    revalidate: 3600,      // 1 hour default
    stale: 86400,          // serve stale for 24h
  },
  categories: {
    revalidate: 86400,     // 24 hours
    stale: 604800,         // serve stale for 7 days
  },
  projects: {
    revalidate: 259200,    // 72 hours
    stale: 2592000,        // serve stale for 30 days
  },
},
```

**Status:** ✅ Configured with appropriate revalidation windows

### ✅ Cache-Control Headers (Contact Page)

```typescript
headers: async () => {
  return [
    // ... other headers ...
    {
      source: "/contact",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, s-maxage=3600",
        },
      ],
    },
  ];
},
```

**Status:** ✅ Contact route configured with public cache + browser (max-age) + CDN (s-maxage)

---

## Verification Checklist

### 1. Route-Level Cache Behavior

#### Homepage (/) - Should use default cache profile

- **Expected Behavior:**
  - Initial generation: SSG (prerendered at build time)
  - Revalidation: 1 hour from last access
  - Stale-while-revalidate: 24 hours
- **Verification Command:**

  ```bash
  # Check response headers
  curl -i http://localhost:3000/ | grep -i "cache-control\|age\|x-vercel"
  ```

- **Expected Response Headers:**
  - `Cache-Control: public, max-age=31536000, immutable` (for static assets)
  - `x-vercel-cache: HIT` (on repeat requests after initial generation)

#### Projects Page (/projects) - Should use projects cache profile

- **Expected Behavior:**
  - Initial generation: SSG (prerendered at build time)
  - Revalidation: 72 hours
  - Stale-while-revalidate: 30 days
- **Verification:**
  ```bash
  curl -i http://localhost:3000/projects | grep -i "cache-control\|x-vercel"
  ```

#### Contact Page (/contact) - Custom Cache-Control

- **Expected Behavior:**
  - Cache-Control: public, max-age=3600, s-maxage=3600 (1 hour both)
  - Form re-submission allowed after expiry
- **Verification:**
  ```bash
  curl -i http://localhost:3000/contact | grep -i "cache-control"
  ```

### 2. Static Assets Caching

#### CSS/JS Assets

- **Expected:**
  - Cache-Control: public, max-age=31536000, immutable (1 year for hashed assets)
  - Served with content hash in filename (Next.js automatic)

- **Verification:**
  ```bash
  curl -i http://localhost:3000/_next/static/... | grep -i "cache-control"
  ```

### 3. ISR Prerendering Verification

#### Build-Time Generation

- **Expected:** All routes prerendered at build time (SSG)
- **Verification Command:**
  ```bash
  # Check .next/server/pages output
  ls -la .next/server/pages/
  # Should show: .noop files for dynamic routes, html files for static routes
  ```

#### On-Demand Revalidation (if implemented)

- **Check:** `lib/actions/` for revalidatePath() calls
- **Expected:** Rate limiter + contact form submission might trigger revalidation
- **Verification:** Look for `revalidatePath()` or `revalidateTag()` calls in server actions

### 4. Vercel Environment Validation

#### Production Deployment Headers

- **On Vercel Production:** Verify cache headers match staging
- **Check via Vercel Dashboard:**
  1. Navigate: https://vercel.com/dashboard → electrical-website
  2. Analytics → Cache Hit Ratio (should show >80% hit rate after warmup)
  3. Deployments → Latest → Inspect response headers

#### Stale-While-Revalidate Behavior

- **Expected:** During revalidation window, Vercel serves cached response while fetching new version
- **Verification:** Timestamp changes after revalidation window (72h for projects, etc.)

---

## Testing Procedure

### Local Testing

1. **Start dev server:**

   ```bash
   pnpm dev
   ```

2. **Check homepage headers:**

   ```bash
   # Linux/Mac
   curl -i http://localhost:3000/

   # PowerShell (Windows)
   Invoke-WebRequest -Uri "http://localhost:3000/" -Method Head | Format-List Headers
   ```

3. **Check projects page headers:**

   ```bash
   curl -i http://localhost:3000/projects
   ```

4. **Check contact form headers:**

   ```bash
   curl -i http://localhost:3000/contact
   ```

5. **Verify static asset caching:**
   ```bash
   curl -i http://localhost:3000/_next/static/chunks/main*.js | grep -i "cache-control"
   ```

### Production Testing (via Vercel)

1. Navigate to https://electrical-website.vercel.app/
2. Open DevTools → Network tab
3. Check response headers for key pages:
   - Homepage: Cache-Control behavior
   - Projects: Verify 72h revalidation window
   - Contact: Verify 1h max-age

### Performance Metrics to Capture

| Page          | Cache-Control        | Expected Hit Rate | Actual | Status |
| ------------- | -------------------- | ----------------- | ------ | ------ |
| /             | dynamic (1h default) | >90%              | \_\_\_ | \_\_\_ |
| /about        | dynamic (1h default) | >90%              | \_\_\_ | \_\_\_ |
| /projects     | projects (72h)       | >85%              | \_\_\_ | \_\_\_ |
| /services     | dynamic (1h default) | >85%              | \_\_\_ | \_\_\_ |
| /contact      | public, 3600         | >80%              | \_\_\_ | \_\_\_ |
| Static assets | immutable, 1yr       | 99%+              | \_\_\_ | \_\_\_ |

---

## Known Configurations

### Image Optimization

```typescript
images: {
  unoptimized: env.NEXT_IMAGE_UNOPTIMIZED ?? false,
},
```

- **Dev/Staging:** Images unoptimized (faster iteration)
- **Production:** Images optimized by Next.js (automatic)

### Output Mode

```typescript
output: "standalone",
```

- **Standalone Build:** All dependencies included, optimized for Vercel deployment
- **Cache Strategy:** Compatible with Vercel Edge Caching

---

## Remediation If Issues Found

### Issue: Cache-Control not being sent

**Possible Causes:**

- next.config.ts headers() not returning correctly
- Vercel environment not reading headers
- Route not matching source pattern

**Solution:**

1. Verify headers() function returns array
2. Test locally with `curl -i`
3. Check Vercel logs: https://vercel.com/dashboard → electrical-website → Logs

### Issue: ISR not revalidating

**Possible Causes:**

- Revalidation triggered but not in valid window
- ISR disabled in environment
- CRON job not configured (if using automatic revalidation)

**Solution:**

1. Check `.next/metadata` for build metadata
2. Monitor `revalidatePath()` calls in server actions
3. Verify cacheLife configuration matches intended behavior

### Issue: Stale-while-revalidate not working

**Possible Causes:**

- Stale configuration not set in next.config.ts
- Cache miss occurring (page too old, past stale window)

**Solution:**

1. Verify cacheLife.stale values match stale window
2. Check Vercel CDN TTL settings
3. Monitor cache hit rate via Vercel Analytics

---

## Documentation Output

Create new file **CACHE_STRATEGY_VERIFICATION_2026-03-27.md** with:

Template section to fill in during testing:

```markdown
# Cache Strategy Verification Results

**Date:** 2026-03-27
**Environment:** Production (https://electrical-website.vercel.app)

## Homepage Cache Headers

- Cache-Control: [fill in actual value]
- Age: [fill in]
- x-vercel-cache: [fill in]
- Status: [✅/⚠️]

## Projects Cache Headers

- Cache-Control: [fill in actual value]
- Expected TTL: 72 hours
- Revalidation Status: [✅/⚠️]

## Static Assets Cache

- Sample URL: [list actual URL]
- Cache-Control: [fill in]
- Status: [✅/⚠️]

## ISR Effectiveness

- Pages Prerendered: [count from .next/server/pages]
- Revalidation Triggers: [count revalidatePath() calls]
- Status: [✅/⚠️]

## Vercel Analytics

- Cache Hit Rate: [fill in percentage]
- Edge Caching: [enabled/disabled]
- Status: [✅/⚠️]

## Summary

[Pass/Fail with action items]
```

---

## Success Criteria

✅ **PASS:** All pages return appropriate Cache-Control headers matching next.config.ts  
✅ **PASS:** Static assets cached with immutable + 1 year TTL  
✅ **PASS:** Vercel cache hit rate >80% after warmup  
✅ **PASS:** ISR revalidation windows match configuration  
✅ **PASS:** No security headers compromised by cache strategy

---

## Related Files

- [next.config.ts](next.config.ts) - Cache configuration
- [app/robots.ts](app/robots.ts) - SEO robots endpoint
- [DEPLOYMENT_VERIFICATION_2026-03-27.md](DEPLOYMENT_VERIFICATION_2026-03-27.md) - Deployment baseline

---

**Next Action:** Execute local testing with curl commands, document results, confirm production behavior matches strategy
