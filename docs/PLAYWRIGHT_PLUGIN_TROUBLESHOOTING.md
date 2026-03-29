# Playwright Plugin Troubleshooting (VS Code)

This guide addresses common issues when running tests via the **VS Code Playwright Plugin** on Windows.

## Why Does the Plugin Behave Differently Than CLI?

The VS Code Playwright Plugin has a different execution model than the CLI:

| Aspect              | CLI (`pnpm test:e2e`)                      | Plugin (Run Test in IDE)             |
| ------------------- | ------------------------------------------ | ------------------------------------ |
| **Server spawning** | Playwright manages (builds, starts, stops) | **Plugin assumes server is running** |
| **Port cleanup**    | Kills stray processes on port 3000         | ❌ Does not auto-cleanup             |
| **Retries**         | Configured (1 retry locally)               | ❌ No retry on failure               |
| **Error messages**  | Clear, in terminal                         | ⚠️ Sometimes hidden in IDE console   |

**Key difference:** The plugin **expects you to have already started the dev server manually** (e.g., `pnpm dev`).

---

## Common Issues & Solutions

### Issue 1: "Error: http://127.0.0.1:3000 is already used"

<details>
<summary>Click to expand</summary>

**What it means:**
The plugin tried to connect to port 3000, but either:

- No server is running (connection refused)
- A stray node process holds the port

**Why it happens:**

- Previous test run crashed and didn't clean up
- Dev server from an earlier session still running
- Another application using port 3000 (Docker, another IDE, etc.)

**Fix (Quick):**

**Step 1:** Stop the plugin (close the test output pane if visible)

**Step 2:** Kill stray processes

Windows PowerShell:

```powershell
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Port 3000 cleared"
```

**Step 3:** Verify port is free

```powershell
netstat -ano | findstr :3000
# Should return empty
```

**Step 4:** Restart the plugin test

- In VS Code, click **Run Test** again

---

**Fix (Recommended — Use CLI Instead):**

Instead of using the plugin, use the CLI for reliable pre-commit verification:

```bash
pnpm test:e2e
```

CLI mode manages server lifecycle automatically and never fails on port conflicts.

---

</details>

### Issue 2: "Connection refused" or "ECONNREFUSED"

<details>
<summary>Click to expand</summary>

**What it means:**
The plugin tried to connect to http://127.0.0.1:3000 but nothing is listening there.

**Why it happens:**

- You forgot to start the dev server
- Dev server crashed or hung
- Placeholder message while server is still starting

**Fix:**

**Option A: Start the dev server manually (Recommended for plugin use)**

Open a new terminal and run:

```bash
pnpm dev
```

Wait for output like:

```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
- Environments: .env, .env.local

✓ Ready in 2.5s
```

Then click **Run Test** in the plugin. Tests should now pass.

---

**Option B: Use CLI mode (Recommended for pre-commit)**

```bash
pnpm test:e2e
```

CLI automatically starts the server, no manual work needed.

---

</details>

### Issue 3: Tests Pass in CLI but Fail in Plugin

<details>
<summary>Click to expand</summary>

**What it means:**
`pnpm test:e2e` passes (58/58), but running the same test via plugin shows failures.

**Why it happens:**

- Plugin doesn't wait long enough for server readiness (timing issue)
- Plugin connects to a different server (port mismatch)
- Server is slow to respond after edits (plugin is too eager)

**Fix:**

**Option 1: Use CLI for verification**

Before committing, always verify with:

```bash
pnpm test:e2e
# Must see: 58 passed
```

If CLI passes but plugin fails, the issue is with the plugin setup, not your code.

---

**Option 2: Increase wait time in plugin**

In VS Code settings (`.vscode/settings.json`), if it exists, adjust:

```json
{
  "playwright.webServer.reuseExistingServer": false,
  "playwright.timeout": 60000
}
```

Then restart the test.

---

**Option 3: Kill and restart the server**

```powershell
# Kill server
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force

# Start fresh
pnpm dev

# Wait for "✓ Ready" message, then run test in plugin
```

---

</details>

### Issue 4: Plugin Hangs or Times Out

<details>
<summary>Click to expand</summary>

**What it means:**
You clicked Run Test, but it never completes — the test runner appears stuck.

**Why it happens:**

- Test is waiting for a resource that never loads (network timeout)
- Server process is hung (not responding)
- Browser process crashed silently
- Test hit the 30-second timeout

**Fix:**

**Step 1:** Kill the plugin process

Press `Ctrl+C` in the VS Code terminal or close the test output pane.

**Step 2:** Kill stray processes

```powershell
Get-Process | Where-Object { $_.Name -like '*node*' -or $_.Name -like '*chrome*' } | Stop-Process -Force
```

**Step 3:** Use CLI to diagnose

```bash
pnpm test:e2e --reporter=verbose 2>&1 | tail -100
```

This will give you full output. If CLI also hangs, the issue is in your test or app code, not the plugin.

---

**Step 4: Check if app has infinite loops**

Search your test file for:

- `page.waitForTimeout()` without clear exit condition
- `while (true)` loops
- Unresolved promises

---

</details>

### Issue 5: "Playwright browsers not installed"

<details>
<summary>Click to expand</summary>

**What it means:**
Plugin can't find the Chromium browser it needs to run tests.

**Fix:**

```bash
pnpm exec playwright install chromium
```

This downloads the Playwright browser profile. Run once per machine.

---

</details>

### Issue 6: Plugin loses connection after every file edit

<details>
<summary>Click to expand</summary>

**What it means:**
Tests pass initially, but after you edit any app file, next test run fails with connection refused.

**Why it happens:**

- Dev server (`pnpm dev`) crashes on hot-reload
- Webpack/Next.js rebuild fails silently
- Plugin watches files and doesn't kill old server before next run

**Fix:**

**Option 1: Run tests after full rebuild**

```bash
# Kill server
Get-Process | Where-Object { $_.Name -like '*node*' } | Stop-Process -Force

# Start fresh dev server
pnpm dev

# Wait for rebuild, then run test in plugin
```

**Option 2: Check app for build errors**

Look at the dev server terminal output for:

```
Error: [error message]
```

Fix the app code, and dev server will auto-recover.

**Option 3: Use CLI for reliable testing**

```bash
pnpm test:e2e
```

CLI rebuilds the entire app before each test, so no incremental build issues.

---

</details>

---

## Recommended Workflows

### For Active Development (Using Plugin)

```
1. Terminal: pnpm dev
2. Edit code in VS Code
3. Click "Run Test" in plugin near the test you're editing
4. Plugin reruns on file changes
5. For pre-commit: Switch to CLI (pnpm test:e2e) for definitive pass/fail
```

### For Pre-Commit Verification (Using CLI)

```
1. Terminal: pnpm test:e2e
2. Wait for "58 passed" (should be ~40 seconds)
3. Commit and push
```

### For Debugging a Failing Test

```
1. Terminal: pnpm dev
2. VS Code: Right-click test → "Debug" (or click debug icon)
3. Browser opens with Playwright Inspector
4. Step through test, inspect page state
5. Fix code, save
6. Browser auto-reruns test
7. Verify with: pnpm test:e2e before pushing
```

---

## Performance Tips

### Plugin Tests Are Slow?

**Causes:**

- Server takes time to rebuild after edits
- Browser startup time
- Network requests to real APIs

**Solutions:**

- Use `--grep "specific test"` to run only one test
- Use `--headed=false` (headless mode) — faster but no visual feedback
- Consider `fullyParallel: true` in config (not default locally, but available)

---

## VS Code Plugin Settings

The plugin respects these VS Code settings (if set in `settings.json`):

```json
{
  "playwright.reuseBrowser": false, // Kill browser between tests
  "playwright.showBrowser": true, // Show browser window
  "playwright.launchOptions": {
    "headless": false // Always show browser
  },
  "playwright.webServer.reuseExistingServer": true, // Reuse running server
  "playwright.timeout": 30000 // Individual test timeout
}
```

(These are already set in `.vscode/settings.json` if you created it in local setup.)

---

## When to Use Plugin vs CLI

| Scenario                         | Use                   | Reason                                 |
| -------------------------------- | --------------------- | -------------------------------------- |
| **Write new test, iterate fast** | Plugin + pnpm dev     | Immediate feedback, watch mode         |
| **Before commit / push**         | CLI: pnpm test:e2e    | Definitive pass/fail, matches CI       |
| **Debug flaky test**             | Plugin + --debug flag | Playwright Inspector shows internals   |
| **Run entire suite locally**     | CLI: pnpm test:e2e    | 58 tests, ~40s, guaranteed clean state |
| **Run one test only**            | Plugin click button   | Fast, no CLI overhead                  |

---

## If Plugin Still Doesn't Work

**Last resort: Use CLI only**

```bash
pnpm test:e2e
```

The CLI is always reliable and matches GitHub Actions exactly. The plugin is optional — use it for quick feedback during development, but **rely on CLI for verification before pushing**.

---

## Report Issues

If you encounter a plugin issue not covered here:

1. Check the [Official Playwright VS Code Extension Docs](https://playwright.dev/docs/vs-code-plugin)
2. Review [LOCAL_TESTING_SETUP.md](./LOCAL_TESTING_SETUP.md) for general test setup
3. Try `pnpm test:e2e --reporter=verbose` to diagnose app-level issues
4. Open an issue in the repo if it's a project-specific problem
