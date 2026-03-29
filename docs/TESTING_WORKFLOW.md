# Testing Workflow Guide

This guide outlines the recommended workflows for different testing scenarios in the electrical-website repository.

## Local green run (exact commands)

### Flow A (recommended pre-push, auto-managed server)

```bash
# 1) Kill stray node/next processes
Get-Process | Where-Object { $_.Name -like '*node*' -or $_.Name -like '*next*' } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2) Build
pnpm run build

# 3) Run full Playwright suite (auto-managed server)
pnpm exec playwright test --reporter=list

# 4) Optional: check image warning noise
pnpm exec playwright test --reporter=list 2>&1 | Select-String "isn't a valid image"
```

Success criteria: `58 passed` and `isn't a valid image` warning count is `0`.

### Flow B (plugin/manual dev server flow)

Terminal A:

```bash
# 1) Start dev server
pnpm dev
```

Terminal B:

```bash
# 2) Reuse the already-running dev server and run full suite
# Windows PowerShell:
$env:PLAYWRIGHT_REUSE_SERVER = "true"
pnpm exec playwright test --reporter=list

# macOS/Linux:
PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test --reporter=list
```

Then stop Terminal A (`Ctrl+C`).

Success criteria: full suite passes (`58 passed`) and no `isn't a valid image` warnings.

Note: `Invalid category` logs are expected validation noise from negative tests and are not test failures.

## Quick Reference

| Goal                        | Command                                | Time           | Environment         |
| --------------------------- | -------------------------------------- | -------------- | ------------------- |
| **Quick local test**        | `pnpm dev` then plugin Run             | ~3s per test   | Dev server + plugin |
| **Pre-commit verification** | `pnpm test:e2e`                        | ~40s all tests | CLI, auto server    |
| **Debug failing test**      | `pnpm test:e2e --grep "name" --headed` | ~5s            | CLI with browser    |
| **Unit tests**              | `pnpm test`                            | ~5s            | No browser needed   |
| **Full suite before push**  | `pnpm test:e2e && pnpm test`           | ~45s           | E2E + unit          |

---

## Workflow 1: Active Development (Code → Test → Iterate)

**Goal:** Write code, test immediately, refine iteratively.

**Duration:** 2–5 minutes per change

### Setup

```bash
# Terminal 1: Start dev server (once, keep running)
pnpm dev

# Output:
# ▲ Next.js 16.x.x
# - Local:        http://localhost:3000
# ✓ Ready in 2.3s
```

### Run Tests

In VS Code:

1. Open your test file (e.g., `e2e/boundaries.spec.ts`)
2. Find the test you're working on
3. Click the **▶️ Run** icon next to `test()` block
4. Or right-click → **Run Test**

### Iterate

1. Tests fail/pass in IDE
2. Edit your app code (`components/`, `app/`, etc.)
3. Save file
4. Dev server hot-reloads automatically
5. Click Run button again or let plugin auto-rerun
6. Repeat

### Verify Before Committing

```bash
# Stop dev server (Ctrl+C in Terminal 1)

# Run full CLI test suite
pnpm test:e2e

# Expected: ✓ 58 passed (38.6s)
```

**Why:** Plugin is for rapid feedback. CLI is for verification — it tests exactly as GitHub Actions will.

---

## Workflow 2: Pre-Commit Verification (CI-Like Run)

**Goal:** Ensure everything passes before pushing to GitHub.

**Duration:** ~40 seconds

### Run This Before Every Commit

```bash
# Kill any stray node processes
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for port to clear
Start-Sleep -Seconds 2

# Run all E2E tests
pnpm test:e2e
```

### Expected Output

```
Running 58 tests using 1 worker

  ✔   1 [chromium] › e2e\boundaries.spec.ts (234ms)
  ✔   2 [chromium] › e2e\boundaries.spec.ts (208ms)
  ...
  ✔   58 [chromium] › e2e\smoke-test.spec.ts (156ms)

  58 passed (38.6s)
```

### Verify No Image Warnings

```bash
pnpm test:e2e 2>&1 | Select-String "isn't a valid image"
# Should return nothing (0 matches)
```

### If Any Tests Fail

1. Note the failing test name
2. Debug with: `pnpm test:e2e --grep "exact test name" --headed`
3. Fix the issue
4. Re-run: `pnpm test:e2e`
5. **Do NOT commit until all 58 pass**

### Commit

```bash
git add .
git commit -m "feat: your feature description"
git push origin your-branch
```

---

## Workflow 3: Debugging a Specific Test

**Goal:** Investigate why a test fails; see browser interactions in real-time.

**Duration:** 5–15 minutes

### Option A: Headed Mode (See the Browser)

```bash
# Kill stray processes first
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force

# Run specific test with browser visible
pnpm test:e2e --grep "error boundary" --headed
```

This launches Chrome, runs the test, and you see exactly what the browser sees.

### Option B: Playwright Inspector (Step-by-Step Debugging)

```bash
# Run with debug inspector
pnpm test:e2e --grep "error boundary" --debug
```

A separate Playwright Inspector window opens where you can:

- Step through test line-by-line
- Pause at any point
- Inspect page state (`locators`, DOM, network)
- Live evaluate JavaScript in console

### Option C: VS Code Plugin Debug

1. Start dev server: `pnpm dev`
2. In VS Code, right-click test → **Debug** (or click debug icon)
3. Playwright Inspector opens with the test paused at start
4. Step through, inspect, adjust

### Fix Issues

```bash
# If you found a bug in the app, fix it
# App files auto-reload in dev server

# If test itself needs changes
# Edit the test file
# Press Run again (plugin reruns automatically)
```

### Cleanup

Stop the test Inspector and commit your fixes.

---

## Workflow 4: Running Specific Test Suites

**Goal:** Run one file or category of tests without running full suite.

### Run One Test File

```bash
pnpm test:e2e e2e/boundaries.spec.ts
```

Runs only the 8 tests in `boundaries.spec.ts` (~2 seconds).

### Run Tests Matching a Pattern

```bash
# Tests matching "error boundary"
pnpm test:e2e --grep "error boundary"

# Tests matching "smoke"
pnpm test:e2e --grep "smoke"

# Tests NOT matching "slow"
pnpm test:e2e --grep -v "slow"
```

### Run Multiple Files

```bash
pnpm test:e2e e2e/boundaries.spec.ts e2e/captcha-integration.spec.ts
```

---

## Workflow 5: Running Unit Tests

**Goal:** Test React components and utils in isolation (no browser).

### Run Once

```bash
pnpm test
```

Expected output:

```
✓ test/some.test.ts (12 tests)
✓ test/other.test.ts (8 tests)

PASS  20 passed
```

### Run in Watch Mode

```bash
pnpm test:watch
```

Auto-reruns when you edit files.

### Run with Coverage

```bash
pnpm test:coverage
```

Generates coverage report in `coverage/index.html`.

### Run Specific Test File

```bash
pnpm test test/some.test.ts
```

---

## Workflow 6: Full Test Suite Before Push

**Goal:** Run both E2E and unit tests to ensure nothing is broken.

**Duration:** ~45 seconds

```bash
# Kill stray processes
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force

# Run all E2E tests
pnpm test:e2e

# Then run all unit tests
pnpm test
```

### Both Must Pass

```
E2E:   58 passed (38.6s)
Unit:  20 passed (5.2s)
```

### If Either Fails

1. Debug the failure (see Workflow 3)
2. Fix the issue
3. Run both again
4. **Only push once both pass**

---

## Workflow 7: CI Environment Testing (GitHub Actions Preview)

**Goal:** Test in CI-like conditions before pushing.

### Enable CI Mode Locally

```bash
# Set CI=true and run tests like GitHub Actions does
$env:CI = "true"
pnpm build
pnpm exec next start &
npx wait-on http://localhost:3000 --timeout 30000
pnpm exec playwright test --reporter=list,html
```

Differences from local:

- 2 workers (parallel) instead of 1
- 2 retries instead of 1
- Standalone output mode

### Check Build Output

```bash
pnpm build 2>&1 | tail -50
```

If build succeeds locally, it will succeed in CI.

---

## Workflow 8: Smoke Test for Full Feature

**Goal:** Quick validation that a new feature works end-to-end.

```bash
# 1. Run pre-commit suite (all tests)
pnpm test:e2e

# 2. Run unit tests
pnpm test

# 3. Check for image warnings
pnpm test:e2e 2>&1 | Select-String "isn't a valid image"

# 4. Build for production
pnpm build

# If all 4 pass → feature is safe to push
```

---

## Decision Tree

```
Start here ↓

Are you actively writing/fixing code?
├─ YES → Workflow 1 (pnpm dev + plugin auto-run)
└─ NO ↓

Do you need to debug why a specific test fails?
├─ YES → Workflow 3 (--headed or --debug)
└─ NO ↓

Ready to commit?
├─ YES → Workflow 2 (pnpm test:e2e full suite)
└─ NO ↓

Just want to run one test file quickly?
├─ YES → Workflow 4 (specific file or --grep)
└─ NO ↓

Want to see coverage for unit tests?
└─ Workflow 5 (pnpm test:coverage)
```

---

## Common Mistakes to Avoid

| Mistake                                              | Fix                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| Running plugin test without `pnpm dev` running       | Always start dev server first in separate terminal                    |
| Committing after plugin passes but never running CLI | CLI is the source of truth; always run `pnpm test:e2e` before push    |
| Not killing stray processes between runs             | Run pre-flight checklist from `LOCAL_TESTING_SETUP.md`                |
| Editing test while server is building                | Wait for "✓ Ready" message before clicking Run                        |
| Pushing without running `pnpm test:coverage`         | Coverage is optional for features, but check it for critical paths    |
| Using `--headed=true` when you meant `--headed`      | Usually implied; test runs headless by default unless flag is present |

---

## Reference: All Test Commands

```bash
# E2E Tests
pnpm test:e2e                        # All 58 E2E tests (auto server)
pnpm test:e2e:ui                     # E2E tests in UI mode (interactive)
pnpm test:e2e:report                 # Show latest HTML report

# Unit Tests
pnpm test                             # Run all unit tests once
pnpm test:watch                       # Run in watch mode
pnpm test:ui                          # Vitest UI dashboard
pnpm test:coverage                    # With coverage report

# Direct Playwright
pnpm exec playwright test             # Same as pnpm test:e2e
pnpm exec playwright install chromium # Install browsers (one-time)

# App Commands
pnpm dev                              # Dev server (for plugin testing)
pnpm build                            # Production build
pnpm start                            # Start production server
```

---

## Performance Expectations

| Task                       | Time   | Notes                                    |
| -------------------------- | ------ | ---------------------------------------- |
| Dev server start           | ~2-3s  | First run; caching speeds up reloads     |
| Single plugin test         | 2-5s   | With server already running              |
| All E2E tests (58)         | 38-45s | Depends on machine; serial, not parallel |
| All unit tests (20)        | 4-8s   | Vitest is very fast                      |
| Full build                 | 15-30s | First build; cache speeds up rebuilds    |
| Playwright browser install | ~60s   | One-time, first machine setup            |

---

## Troubleshooting Quick Links

- Port 3000 already in use? → [LOCAL_TESTING_SETUP.md](LOCAL_TESTING_SETUP.md#troubleshooting)
- Plugin issues? → [PLAYWRIGHT_PLUGIN_TROUBLESHOOTING.md](PLAYWRIGHT_PLUGIN_TROUBLESHOOTING.md)
- Test expectations unclear? → Review test file comments
- App build failing? → Check `pnpm build` output for errors
