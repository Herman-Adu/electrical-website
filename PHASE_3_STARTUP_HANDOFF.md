# PHASE 3 STARTUP HANDOFF
**For:** Next Claude Session  
**Date Prepared:** 2026-03-27  
**Status:** Ready to delegate — no blockers  
**Rate Limit Strategy:** Single sub-agent analysis, then streaming browser-testing skill

---

## Executive Summary

**Phase 2 Status:** ✅ COMPLETE (16 commits, 45/45 tests, 0 build errors)  
**Phase 3 Plan:** A (E2E Playwright Tests) + D (Performance Monitoring) — 5.5h critical path  
**Optional Parallel:** C (Accessibility Audit) — adds 3h, independent of A+D

**Deployment Readiness:** 🟨 STAGING (awaiting E2E validation)

---

## Decision Framework (Sub-Agent Analysis Complete)

### Recommendation: A (E2E Playwright Tests) — PRIMARY

**Why:**
- Validates all Phase 2 deliverables in real browser environment
- Highest deployment risk mitigation (catches integration issues)
- Zero dependencies; can start immediately
- Efficient 3-4h effort-to-value ratio
- Confirms staging readiness with end-to-end coverage

**Scope:**
- Navigation flows (header, footer, internal links)
- Form submissions (contact, newsletter signup if present)
- API routes (metadata endpoints, search params validation)
- OG tag generation (/api/og route with auth tests)
- Error states (404, 500, CSP violations)
- Responsive design breakpoints (mobile, tablet, desktop)

**Deliverables:**
- e2e/smoke-test.spec.ts enhanced with 12-15 new test cases
- CI integration: GitHub Actions workflow for E2E on PR
- Coverage report with critical path matrix
- Deployment approval document (sign-off for staging → production)

---

### Secondary: D (Performance Monitoring) — AFTER A PASSES

**Why:**
- Establishes baseline metrics post-E2E validation
- Essential for production support
- Only 2h implementation
- Enables early detection of regressions

**Scope:**
- Vercel Analytics integration (Web Vitals dashboard)
- Sentry error tracking setup (JavaScript errors, 404s, CSP violations)
- CI perf regression detection (Lighthouse in GH Actions)
- Monitoring dashboard (Vercel + Sentry)

**Deliverables:**
- Monitoring config in next.config.ts
- Sentry project setup + DSN in env
- GitHub Actions perf check workflow
- Ops playbook for responding to alerts

---

### Optional Parallel: C (Accessibility Audit) — INDEPENDENT

**Why:**
- WCAG 2.1 AA compliance requirement
- No dependency on A or D
- Only 3h effort
- High quality impact for users

**If You Have Bandwidth:**
- Run axe-core automated scan
- Manual testing with NVDA/JAWS
- Fix contrast issues, ARIA labels, keyboard navigation
- Generate compliance report

---

## Pre-Staged Environment Setup

### Before Starting Session

```powershell
# 1. Verify git state
git status
git log --oneline -5  # Should show Phase 2 commits

# 2. Install browser automation (if not present)
pnpm add -D @playwright/test  # Already present, but verify
pnpm exec playwright install  # Chrome/Firefox/Safari

# 3. Check dev server is ready
pnpm build  # Verify production build works
pnpm dev   # Should start on :3000

# 4. Verify existing E2E tests work
pnpm exec playwright test e2e/smoke-test.spec.ts --reporter=list
```

---

## Sub-Agent Delegation Structure

### To Avoid Rate Limiting: STAGED APPROACH

**Stage 1: Planning Agent (LIGHT)**
- Query existing test structure
- Analyze OG route auth (TICKET-004)
- Map critical user flows
- Generate test plan doc

**Stage 2: Browser Testing (HEAVY)**
- Use `browser-testing` skill from .github/skills/browser-testing/SKILL.md
- Delegate all Playwright execution to skill
- Skill provides browser automation, screenshots, error collection
- No direct playwright invocations from main Claude thread

**Stage 3: CI Integration (LIGHT)**
- Use `github-actions` skill  
- Trigger workflow runs
- Collect results
- No manual GitHub API calls

**Stage 4: Monitoring Setup (LIGHT)**
- Env-based configuration
- No API calls (Sentry/Vercel DSN via .env)

---

## Key Files to Know (Reference)

### E2E Test Foundation
- `e2e/smoke-test.spec.ts` — Main smoke test (build on this)
- `e2e/og-route-auth.spec.ts` — OG route auth (Reference for pattern)
- `playwright.config.ts` — Webserver config

### Routes to Test
- `app/page.tsx` — Homepage
- `app/about/page.tsx` — About page
- `app/projects/page.tsx` — Projects listing
- `app/contact/page.tsx` — Contact form
- `app/api/og` — OG image generation with CORS auth

### Components to Validate
- `components/hero/hero.tsx` — Animation rendering
- `components/projects/project-card.tsx` — Responsive design
- `components/navigation/header.tsx` — Navigation links
- `components/shared/section-values.tsx` — Content display

### Performance Baseline (for Phase 3D)
- `lib/site-config.ts` — Site metadata
- `next.config.ts` — ISR config
- `vercel.json` — Deployment config

---

## Memory Entities (For Context Gathering)

If you need to refresh context quickly, query these MCP memory entities:

```
agent:v1:phase2_full_project_state          → Overall metrics
agent:v1:phase2_p2b3_git_commits            → Recent commits
agent:v1:phase2_deliverables_full_inventory → All new files
agent:v1:phase2_to_phase3_handoff           → Codebase readiness
```

No need to read PHASE_2_B3_HANDOFF.md again; memory is source of truth.

---

## Skills to Delegate To (Avoid Direct Invocation)

### Primary Skill: browser-testing
```
skill: browser-testing (from .github/skills/browser-testing/SKILL.md)
capabilities:
  - Start Playwright browser
  - Navigate to URL
  - Click/fill form elements
  - Take screenshots
  - Collect browser console errors
  - Evaluate JavaScript
  - Upload files (for forms)

Usage:
  1. Read SKILL.md for full API
  2. Call step-by-step via skill (not direct Playwright API)
  3. Each action is logged + error-collected
```

### Secondary Skill: github-actions  
```
skill: github-actions (from .github/skills/github-actions/SKILL.md)
capabilities:
  - Trigger workflows
  - List recent runs
  - Summarize CI failures
  - Request code review
  - Deploy preview

Usage:
  1. Trigger E2E workflow on PR
  2. Collect results for approval
```

### Tertiary Skill: code-search
```
skill: code-search (if need to analyze test patterns)
capabilities:
  - AST grep patterns
  - Symbol search
  - Import chain resolution

Usage:
  1. Find all test files
  2. Locate critical components to test
```

---

## Rate Limiting Mitigation Strategy

**Why likely to hit limits:**
- 5+ sequential browser navigations
- Multiple API calls to GitHub Actions
- Full codebase search

**How to avoid:**
1. ✅ Use sub-agent for planning (1 atomic call, not 10 small ones)
2. ✅ Delegate all browser actions to browser-testing SKILL
3. ✅ Batch GitHub Actions calls (list runs, then filter locally)
4. ✅ Use memory MCP instead of re-reading large .md files
5. ✅ Parallel read-only operations (git log, file structure) in single tool call

**Fallback if rate limited:**
- Write .mjs script to execute tests locally (vitest + playwright)
- Run in background terminal
- Check results in next session
- No tool invocations needed

---

## Checkpoints Before Handoff

- [x] Phase 2 complete: 16 commits, 45/45 tests passing
- [x] Build verified: ✅ PASSING
- [x] Lint status: ✅ 170 warnings (0 new)
- [x] Git state: ✅ Clean (3b21d71)
- [x] Decision framework: ✅ Sub-agent analysis complete
- [x] Deployment readiness: 🟨 STAGING (awaiting E2E)

---

## What NOT To Do

- ❌ Read PHASE_2_B3_HANDOFF.md (old; memory is now source of truth)
- ❌ Manually rewrite existing E2E tests (enhance, don't replace)
- ❌ Commit to Performance Monitoring without E2E passing first
- ❌ Make large refactors before E2E validation
- ❌ Deploy to production without Vercel smoke test approval

---

## Success Criteria

### Phase 3A Complete When:
1. E2E test suite: 12+ new test cases added
2. All critical routes covered (home, about, projects, contact, /api/og)
3. GitHub Actions: E2E workflow added to CI
4. Coverage report: >90% route coverage documented
5. Approval: Staging environment test run shows 0 failures
6. Deployable: Production-ready based on E2E results

### Phase 3D Complete When (If Pursued):
1. Vercel Analytics: Web Vitals dashboard visible
2. Sentry: Error tracking capturing real events
3. Lighthouse: CI regression check running on PRs
4. Baseline: Documented in PHASE_3_PERFORMANCE_BASELINE.md

---

## Next Session Workflow

**On startup:**
1. ✅ Read THIS FILE (you are here)
2. ✅ Run: `git log --oneline -3` (confirm on main)
3. ✅ Query: `agent:v1:phase2_full_project_state` (refresh context if needed)
4. ➡️ Delegate to planning agent: Analyze test needs
5. ➡️ Delegate to browser-testing skill: Execute Playwright tests
6. ➡️ Delegate to github-actions skill: CI workflow
7. ✅ Compile: Approval document
8. 🎯 Complete: Phase 3A — E2E coverage ready for staging → production promotion

---

**Prepared by:** Claude Copilot  
**Preparation Date:** 2026-03-27  
**MCP Gateway Status:** All servers healthy (16 enabled)  
**Ready to Start:** YES ✅

