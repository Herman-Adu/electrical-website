# Local Testing Setup & Pre-Flight Checklist

This guide ensures your local environment is ready to run Playwright E2E tests reliably before pushing changes.

## Pre-Flight Checklist (Required Every Test Run)

### Step 1: Kill Stray Node Processes

Port 3000 must be free. Kill any lingering node processes from previous runs:

**Windows PowerShell:**

```powershell
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "Port 3000 cleared"
```

**macOS/Linux:**

```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2
echo "Port 3000 cleared"
```

### Step 2: Verify Port 3000 is Free

**Windows PowerShell:**

```powershell
netstat -ano | findstr :3000
```

**Expected output:** Empty (no lines returned)

If port 3000 is still in use, manually identify and kill the process:

```powershell
# Find the PID (Process ID) using port 3000
$netstat = netstat -ano | findstr :3000
$pid = $netstat -split '\s+' | Select-Object -Last 1
Stop-Process -Id $pid -Force
```

### Step 3: Install Playwright Browsers (One-Time Setup)

```bash
pnpm exec playwright install chromium
```

This downloads the Chromium browser profile needed by Playwright. Run once per machine.

---

## Testing Workflows

### Workflow A: Development & Quick Feedback (Recommended for Active Development)

**Goal:** Write code, test locally, iterate fast.

```bash
# Terminal 1: Start the dev server
pnpm dev

# It will output: ▲ Next.js 16.x.x
#                started server on 0.0.0.0:3000, url: http://localhost:3000
```

Then in **VS Code**:

- Open a test file (e.g., `e2e/boundaries.spec.ts`)
- Click the **Run Test** icon (▶️) next to any `test()` block
- Or right-click and select "Run Test"
- Plugin auto-reruns on file changes

**Pros:**

- ✅ Fast feedback loop
- ✅ Watch mode (reruns as you edit)
- ✅ Visual feedback in IDE

**Cons:**

- ⚠️ Requires manual server start in another terminal
- ⚠️ May timeout if dev server is slow

---

### Workflow B: Pre-Commit Verification (CI-Like, Recommended Before Push)

**Goal:** Run all 58 tests exactly as GitHub Actions will, before committing.

```bash
# Kill any stray processes first (see Pre-Flight Checklist)
# Then run all tests in series with auto-server management:
pnpm test:e2e
```

**Expected output:**

```
  58 passed (38.6s)
```

**Pros:**

- ✅ All 58 tests run
- ✅ Server auto-spawned (no manual start needed)
- ✅ Identical to CI environment
- ✅ Only 0 image warnings expected

**Cons:**

- ⏱️ Takes ~40 seconds
- 📝 Full build happens each run

---

### Workflow C: Debug Specific Test

**Goal:** Run one or a few tests with verbose output.

```bash
# Kill stray processes first, then run filtered tests:
pnpm exec playwright test e2e/boundaries.spec.ts --grep "not-found"
```

Flags:

- `--grep "pattern"` — Run tests matching this regex (case-insensitive)
- `--grep "\"exact test name\""` — Run exact test by name
- `--headed` — Show browser window (not hidden)
- `--debug` — Open Playwright Inspector

**Examples:**

```bash
# Run just the boundaries tests
pnpm exec playwright test e2e/boundaries.spec.ts

# Run tests matching "error boundary"
pnpm exec playwright test --grep "error boundary"

# Show browser and debug
pnpm exec playwright test e2e/smoke-test.spec.ts --headed --debug
```

---

### Workflow D: Custom Port (Non-Standard Setup)

If you need to run tests against a server on a different port:

```bash
# Start server on custom port
pnpm exec next start --hostname 127.0.0.1 --port 4000

# In another terminal, run tests against custom port
PLAYWRIGHT_BASE_URL=http://localhost:4000 pnpm test:e2e
```

---

## Troubleshooting

### Error: "http://127.0.0.1:3000 is already used"

**Cause:** Port 3000 is held by a stray node process.

**Fix:**

```powershell
# Windows: Kill all node processes
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force

# Then retry
pnpm test:e2e
```

---

### Error: "Connection refused" in VS Code Plugin

**Cause:** Plugin expects server to be running, but it's not.

**Fix:**

1. Start the dev server manually:
   ```bash
   pnpm dev
   ```
2. Then click "Run Test" in the plugin
3. Or use CLI mode (Workflow B) which auto-starts the server

---

### Tests pass in CLI but fail in plugin

**Cause:** Timing — plugin doesn't wait for full server readiness.

**Fix:**

- Use CLI mode `pnpm test:e2e` for pre-commit verification (most reliable)
- Or increase wait time by stopping/restarting plugin server

---

### "Playwright browsers not found"

**Cause:** Browsers were not installed.

**Fix:**

```bash
pnpm exec playwright install chromium
```

---

## Environment Variables

If you need custom environment variables during testing:

```bash
# Set single env var
NODE_ENV=test pnpm test:e2e

# Set multiple env vars (Windows)
$env:NODE_ENV="test"; $env:DEBUG="*"; pnpm test:e2e

# Set multiple env vars (macOS/Linux)
NODE_ENV=test DEBUG="*" pnpm test:e2e
```

Common env vars:

- `PLAYWRIGHT_BASE_URL` — Override base URL (default: http://127.0.0.1:3000)
- `DEBUG` — Enable debug output (try `DEBUG="pw:browser"`)
- `CI` — Simulate CI mode (set to `"true"`)

---

## Best Practices

1. **Always run the pre-flight checklist** before running tests
2. **Use Workflow B** (`pnpm test:e2e`) before pushing to GitHub
3. **Keep dev server separate** from test runs (prevents port conflicts)
4. **Check image warnings** — 0 warnings expected:
   ```bash
   pnpm test:e2e 2>&1 | grep "isn't a valid image"
   # Should return empty
   ```
5. **Commit only passing tests** — never push with local test failures

---

## Reference: All Test Commands

| Command                | Use                     | Server | Time | Notes                 |
| ---------------------- | ----------------------- | ------ | ---- | --------------------- |
| `pnpm test`            | Unit tests              | None   | ~5s  | Vitest, no browser    |
| `pnpm test:watch`      | Unit tests (watch)      | None   | ∞    | Reruns on file change |
| `pnpm test:e2e`        | E2E tests               | Auto   | ~40s | **Use before commit** |
| `pnpm test:e2e:ui`     | E2E tests (interactive) | Auto   | ∞    | UI dashboard, slow    |
| `pnpm test:e2e:report` | Show E2E HTML report    | None   | ~2s  | Opens browser         |
| `pnpm dev`             | Dev server              | Manual | ∞    | For plugin testing    |

---

## CI Differences

Your local config differs slightly from GitHub Actions to optimize for developer experience:

| Setting     | Local              | CI                     |
| ----------- | ------------------ | ---------------------- |
| **Workers** | 1 (serial)         | 2 (parallel)           |
| **Retries** | 1                  | 2                      |
| **Server**  | Playwright-managed | GitHub Actions-managed |

This means:

- ✅ Local runs faster (less resource-intensive)
- ✅ CI retries transients (more forgiving)
- ✅ If a test passes locally, it should pass in CI (same test logic)
