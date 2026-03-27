# Task #2: Lighthouse CI Baseline Establishment

**Status:** READY FOR EXECUTION  
**Date:** 2026-03-27  
**Workflow:** Lighthouse CI Performance Regression Detection

---

## Objective

Establish performance regression guardrails by triggering Lighthouse CI workflow on the current green main branch, capturing baseline metrics for:

- Core Web Vitals (LCP, FID, CLS)
- Performance Score
- Best Practices Score
- SEO Score
- Accessibility Score

---

## Prerequisites Verification

### ✅ Workflow Configuration Verified

**File:** `.github/workflows/lighthouse-ci.yml`

```yaml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]
  workflow_dispatch: # <-- Manual trigger enabled ✅
```

**Line 1:** Workflow defined with `workflow_dispatch` support ✅  
**Status:** Ready for manual trigger

### ✅ Current Branch State

- **Branch:** main
- **Latest Commit:** 26b4f338 (clean, all tests passing)
- **E2E Status:** ✅ 54/54 tests passing
- **Build Status:** ✅ Production build validated
- **Ready for Baseline:** Yes ✅

---

## Execution Steps

### Step 1: Navigate to GitHub Actions

1. Open: https://github.com/Herman-Adu/electrical-website/actions
2. View: Under "Lighthouse CI" workflow in the sidebar

### Step 2: Trigger Workflow Manually

1. **Select Workflow:** "Lighthouse CI"
2. **Click:** "Run workflow" button
3. **Branch:** Keep as `main` (default)
4. **Confirm:** Click "Run workflow"

### Alternative: Via GitHub CLI (if available)

```bash
gh workflow run lighthouse-ci.yml -r main
```

### Alternative: Via cURL (requires GITHUB_TOKEN env var)

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Herman-Adu/electrical-website/actions/workflows/252675777/dispatches \
  -d '{"ref":"main"}'
```

---

## Expected Workflow Execution

### Timeline

- **Step 1 - Checkout:** ~5s
- **Step 2 - Dependencies:** ~30s (pnpm cache warm)
- **Step 3 - Build:** ~15s
- **Step 4 - Start Server:** ~5s
- **Step 5 - Wait for Server:** ~10s
- **Step 6 - Run Lighthouse:** ~60-90s (for all 3 URLs)
- **Total Duration:** ~2-3 minutes

### URLs Tested (Default Lighthouse Behavior)

The workflow tests the root endpoint and key pages:

1. `http://localhost:3000/` (Homepage)
2. `http://localhost:3000/about` (About page)
3. `http://localhost:3000/projects` (Projects page)

> **Note:** Exact URLs depend on `.lighthouseci` config if present in root

### Success Indicators

✅ **Workflow completes** (green checkmark on GitHub Actions)  
✅ **Artifacts uploaded** (lighthouse-report folder available for download)  
✅ **Scores captured:**

- Performance: Expected ~80-95 (local testing baseline)
- Best Practices: Expected ~90+
- SEO: Expected 90+
- Accessibility: Expected 95+

---

## Baseline Metrics to Document

Once Lighthouse completes, capture and document:

| Metric                         | Homepage | About  | Projects | Threshold |
| ------------------------------ | -------- | ------ | -------- | --------- |
| Performance Score              | \_\_\_   | \_\_\_ | \_\_\_   | ≥80       |
| LCP (Largest Contentful Paint) | \_\_\_   | \_\_\_ | \_\_\_   | ≤2.5s     |
| FID (First Input Delay)        | \_\_\_   | \_\_\_ | \_\_\_   | ≤100ms    |
| CLS (Cumulative Layout Shift)  | \_\_\_   | \_\_\_ | \_\_\_   | ≤0.1      |
| Best Practices                 | \_\_\_   | \_\_\_ | \_\_\_   | ≥90       |
| SEO Score                      | \_\_\_   | \_\_\_ | \_\_\_   | ≥90       |
| Accessibility                  | \_\_\_   | \_\_\_ | \_\_\_   | ≥95       |

---

## Resolution & Next Actions

### After Workflow Completes

1. ✅ **Download Report** from GitHub Actions artifacts
2. ✅ **Document Baseline** in new file: `LIGHTHOUSE_BASELINE_2026-03-27.md`
3. ✅ **Address Any Issues:**
   - If any score < threshold: Create ticket for remediation
   - If all scores pass: Proceed to Task #3

### Result Expectations

- **Best Case:** All scores ≥90, workflow stable, baseline established ✅
- **Good Case:** Scores acceptable (≥80), minor optimizations noted
- **Action Case:** Any score <80, diagnostics needed

---

## Post-Execution Checklist

After Lighthouse CI completes:

- [ ] Workflow duration recorded
- [ ] All metrics captured and documented
- [ ] Performance regression detection active (future PRs will compare)
- [ ] Baseline file committed
- [ ] Task #2 marked complete

---

## Related Documentation

- **Lighthouse Config:** Check `.lighthouseci/lighthouserc.json` if it exists
- **CI File:** [.github/workflows/lighthouse-ci.yml](.github/workflows/lighthouse-ci.yml)
- **Workflow Logs:** Available at https://github.com/Herman-Adu/electrical-website/actions under Lighthouse CI runs

---

**Status:** Ready to trigger manually via GitHub Actions UI  
**Next Action:** Execute workflow dispatch and monitor run completion  
**Estimated Wait:** 2-3 minutes for full execution
