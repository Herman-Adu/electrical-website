# Playwright Ops Skill

E2E tests, browser screenshots, and visual regression checks via Playwright and the Docker-hosted Playwright MCP service.

## When to Use

Use this skill WHENEVER you need to run E2E tests, take screenshots, verify UI behaviour in a browser, or check visual regressions. It handles dev server detection and Docker service startup automatically.

**Trigger phrases:**
- "Run E2E tests"
- "Take a screenshot of the page"
- "Check the UI visually"
- "Verify the form works end-to-end"
- "Run Playwright tests"
- "Open the site and take a screenshot"
- "Visual regression check after the refactor"
- `/playwright-ops [e2e | screenshot | visual-check | run-tests]`

## How It Works

```
1. Detect if dev server is already running on port 3000
2. If running: set PLAYWRIGHT_REUSE_SERVER=true to avoid port conflict
3. If not running: Playwright starts the dev server automatically
4. Execute the requested test or screenshot operation
5. Return results or screenshot paths
```

## Running E2E Tests

### Full Test Suite

```bash
# With existing dev server (recommended):
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e

# Fresh start (Playwright starts the dev server):
pnpm test:e2e
```

### Single Test File

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e tests/e2e/contact.spec.ts
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e tests/e2e/emergency.spec.ts
```

### Dev Server Detection

```bash
curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"
# 200 → dev server is running → set PLAYWRIGHT_REUSE_SERVER=true
# Other → not running → let Playwright start it
```

## Screenshots via Docker Playwright MCP

For one-off screenshots without running the full test suite, use the Docker Playwright MCP container.

### Check Container Health

```bash
curl -s http://localhost:3100/playwright/health
# {"status":"ok"} → ready
```

If not running:

```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d playwright
# Wait ~5s then retry health check
```

### Navigate and Screenshot

```bash
# Navigate to a page
curl -s -X POST http://localhost:3100/playwright/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "navigate", "arguments": {"url": "http://localhost:3000/services/emergency"}}'

# Take screenshot
curl -s -X POST http://localhost:3100/playwright/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "screenshot", "arguments": {"path": "screenshots/emergency-page.png"}}'
```

## Key Configuration

The `playwright.config.ts` must have `reuseExistingServer: !process.env.CI` to avoid port conflicts during local development.

If you see "port 3000 already in use" errors, this setting is missing. Add:

```typescript
webServer: {
  command: 'pnpm dev',
  port: 3000,
  reuseExistingServer: !process.env.CI,
}
```

## Usage Examples

### Example 1: Verify Contact Form Flow

```
/playwright-ops "e2e — run contact form test after refactor"
```

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e tests/e2e/contact.spec.ts
```

Expected output: test results with pass/fail status per scenario.

### Example 2: Visual Check After CSS Changes

```
/playwright-ops "screenshot — compare emergency page before and after hero changes"
```

1. Navigate to `http://localhost:3000/services/emergency`
2. Screenshot saved to `screenshots/emergency-before.png`
3. Apply changes
4. Screenshot saved to `screenshots/emergency-after.png`
5. Review diff

### Example 3: Full Suite Before Merge

```
/playwright-ops "run-tests — full suite before PR merge"
```

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e
```

All tests must pass before creating a PR.

## Integration

- **Invoked by:** `orchestrator` (QA verification gate), `qa-sme` (test execution), CI pipeline
- **Related skill:** `github-ops` (create PR after tests pass)
- **Build gate:** `pnpm typecheck && pnpm build` runs before E2E tests in CI
- **Test location:** E2E test files live in `tests/e2e/`

## Error Handling

| Scenario | Recovery |
|----------|----------|
| "Port 3000 already in use" | Ensure `reuseExistingServer: !process.env.CI` is in `playwright.config.ts` |
| Docker Playwright container not running | Run `docker compose -f docker-compose.mcp.yml up --no-deps -d playwright` |
| Flaky test (intermittent failures) | Increase test timeout in spec; check for race conditions in async operations |
| Screenshot path missing | Ensure `screenshots/` directory exists: `mkdir -p screenshots` |
| Dev server fails to start | Check `pnpm dev` works independently; fix build errors first |

## When NOT to Use

- Do NOT use manual browser testing instead of this skill — all browser verification goes through Playwright
- Do NOT run E2E tests without running `pnpm typecheck && pnpm build` first — catch type errors before browser tests

## Related Files

- **SKILL.md:** `.claude/skills/playwright-ops/SKILL.md` — full execution instructions
- **Config:** `playwright.config.ts` — Playwright configuration with reuse server settings
- **Tests:** `tests/e2e/` — E2E test files
- **Docker compose:** `docker-compose.mcp.yml` — Playwright MCP service definition
