---
name: browser-testing
description: "Execute browser automation and UI tests using Playwright. Can navigate pages, click elements, fill forms, take screenshots, evaluate JavaScript, and collect console errors. Use this when asked to run browser tests, verify UI behaviour, take screenshots, test navigation flows, or automate web interactions on the electrical-website or any URL."
---

# Browser Testing Skill

Uses the **playwright-mcp-server** MCP server for all browser automation.

## When to use

- "Take a screenshot of the homepage"
- "Test that the contact form submits successfully"
- "Verify the dropdown menu works on the services page"
- "Run a smoke test on http://localhost:3000"
- "Check for console errors on the about page"

## Steps

1. Identify the target URL.
2. Plan the sequence of steps (navigate, click, fill, evaluate, screenshot).
3. Execute via the `browser-testing` skill with the step array.
4. Report: steps completed, steps failed, console errors, screenshot path.
5. If `stepsFailed > 0`, include the `failureReason` in your response.

## Guidelines

- Always set `captureScreenshot: true` for visual verification tasks.
- Do not exceed 20 steps per invocation — break large flows into batches.
- `evaluate` steps return raw JavaScript results — validate before trusting.
- This skill is **not** dry-run capable — it interacts with live pages.
- Use `waitForSelector` before interacting with dynamically rendered elements.

## Secret Safety (Non-Negotiable)

- Never print, echo, summarize, or quote secret values from `.env*`, terminal output, logs, screenshots, or tool results.
- Always mask sensitive tokens in all outputs (for example: `re_***`, `gQAA***`).
- Use secret variable names only (for example: `RESEND_API_KEY`) when discussing configuration.
- If credentials are exposed during a session, recommend immediate credential rotation before continuing.
