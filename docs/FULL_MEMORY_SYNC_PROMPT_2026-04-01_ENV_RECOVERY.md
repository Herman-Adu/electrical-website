# FULL MEMORY SYNC PROMPT — Post Env Recovery + Production Alignment (2026-04-01)

Use this prompt in a new chat window to continue safely.

---

You are continuing work in `Herman-Adu/electrical-website` on Windows (VS Code).

## Non-negotiable safety rules

- Never request, quote, summarize, or attach `.env*` files.
- Never print secret values from terminal output, logs, screenshots, or attachments.
- Reference variable names only.
- If secrets were exposed in-session, assume compromised and require rotation before further validation.

## Mandatory repo rules

- Follow `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`.
- Before changing Next.js behavior, run: `pnpm run status:next-docs`.
- Docs resolution order:
  1. `node_modules/next/dist/docs/`
  2. `node_modules/next/docs/`
  3. `node_modules/next/README.md`
- In this repo, docs currently resolve to `node_modules/next/README.md`.

## Session outcomes already completed

1. E2E boundary smoke fix:
   - Updated `e2e/browser-agent-smoke.spec.ts` assertion for `/services/error-test` fixture visibility behavior.
   - Result after fix: targeted spec passing; full E2E suite passing in-session.

2. Unit tests:
   - Vitest tests in `lib/__tests__/search-params.test.ts` and `lib/__tests__/rate-limit.test.ts` passed in-session.

3. Navigation layout-shift fix:
   - Added `scrollbar-gutter: stable;` in `app/globals.css`.
   - `pnpm build` passed after the change.

4. Production Turnstile diagnosis:
   - CSP/header check on deployed contact page indicated Cloudflare Turnstile origins are allowed by CSP.
   - Likely issue domain/env alignment rather than blocked script policy.

## Production env alignment status (by variable name only)

From `app/env.ts`, production-relevant variables include:

- CAPTCHA:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`

- Contact/rate limit:
  - `CONTACT_RATE_LIMIT_MODE` (`redis` | `memory` | `off`)
  - `CONTACT_RATE_LIMIT`
  - `CONTACT_RATE_LIMIT_WINDOW_HOURS`

- Redis/KV (for redis mode):
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`
  - Fallback support also exists for `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_REDIS_REST_READ_ONLY_TOKEN`.

- Email:
  - `RESEND_API_KEY`
  - `CONTACT_ADMIN_EMAIL`
  - `CONTACT_FROM_EMAIL`
  - `CONTACT_FROM_NAME`

- Site metadata:
  - `NEXT_PUBLIC_SITE_URL`

User confirmed:

- Keys have been rotated.
- Missing production variables were added in Vercel.

## Immediate verification sequence (safe)

Run in order (no secret output):

1. `pnpm run status:next-docs`
2. `pnpm build`
3. `pnpm exec playwright test e2e/captcha-integration.spec.ts --reporter=list`
4. `pnpm exec playwright test e2e/browser-agent-smoke.spec.ts e2e/boundaries.spec.ts --reporter=list`

Then manual prod check:

- Open production `/contact`.
- Verify Turnstile loads and completes.
- Submit form and verify no CAPTCHA verification failure.

## If production Turnstile still fails

Check only configuration (no secret printing):

1. Turnstile widget hostname allowlist includes the exact production host(s).
2. Vercel env scope is set for **Production** (not just Preview/Development).
3. Latest deployment picked up env changes (redeploy if needed).
4. `CONTACT_RATE_LIMIT_MODE=redis` only if KV vars are present and valid.

## Current branch/workspace state

- Workspace is operating on mainline continuation context.
- Do not commit generated artifacts unless intentional.
- Keep changes surgical and validated locally before push.

---

End of memory sync.
