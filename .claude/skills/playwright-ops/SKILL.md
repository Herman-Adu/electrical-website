---
name: playwright-ops
description: Use this skill WHENEVER you need to run E2E tests, take screenshots, verify UI behaviour in a browser, run Playwright automation, or check visual regressions. Trigger phrases: "run E2E tests", "take a screenshot", "check the UI", "verify visually", "playwright", "browser test", "open the site", "screenshot of".
argument-hint: "[e2e | screenshot | visual-check | run-tests]"
disable-model-invocation: true
---

# Playwright Ops

Runs E2E tests and browser automation via Playwright.

## Dev server detection

Before running Playwright, check if the dev server is running:

```bash
curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"
```

If `200`: set `PLAYWRIGHT_REUSE_SERVER=true` to avoid port conflict.
If not running: Playwright will start it automatically.

## Running E2E tests

```bash
# With existing dev server:
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e

# Fresh start (no dev server):
pnpm test:e2e
```

## Running a specific test file

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e tests/e2e/contact.spec.ts
```

## Taking a screenshot via Docker Playwright MCP

First check if playwright container is running:

```bash
curl -s http://localhost:3100/playwright/health
```

If not running:
```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d playwright
```

Then take screenshot:
```bash
curl -s -X POST http://localhost:3100/playwright/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "navigate", "arguments": {"url": "http://localhost:3000/PAGE_PATH"}}'
```

## Key playwright.config.ts setting

The config must have `reuseExistingServer: !process.env.CI` to avoid port conflicts during local development. If you see "port 3000 already in use", this setting is missing.
