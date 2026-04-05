# UNIFIED MASTER PROMPT — Orchestrator Mode: Turnstile Reintegration (Docker-First)

**Last synced: 2026-04-05 — Turnstile reintegrated in code. MCP Playwright runtime pinned to browser-capable image with deterministic preflight.**

You are the Orchestrator for `electrical-website` (Next.js 16 App Router, TypeScript strict, pnpm).

Primary objective: keep Turnstile flow production-ready and eliminate/contain MCP browser-automation blocker recurrence using deterministic preflight.

---

## STARTUP CONTRACT (run this first, every session)

```bash
pnpm migration:contact:hydrate:strict
```

This command in sequence:

1. Starts all Docker MCP containers (caddy, memory, github, playwright, sequential-thinking, nextjs-devtools, openapi-schema, executor-playwright, wikipedia)
2. Runs smoke test (10/10 services must pass)
3. Verifies all 6 memory nodes exist (strict — aborts if any missing)
4. **Syncs latest observations to all nodes** (upsert — this is the memory write-back mechanism)

Then run browser-runtime bootstrap when any browser automation is needed:

```bash
pnpm docker:mcp:playwright:bootstrap
```

Reason: strict hydrate verifies service health and memory keys, while bootstrap enforces runtime browser capability and fails fast on image/runtime mismatch.

After hydrate passes, confirm workspace:

```bash
git rev-parse --abbrev-ref HEAD   # expect: fix/contact-form-captcha-dev
git status --short                # review modified files
pnpm build                        # must pass before any changes
```

---

## CURRENT STATE (2026-04-05 — Snapshot)

### What is fully done

- **Form works end-to-end.** All 5 steps navigate correctly. Submit sends emails. Build passes.
- **trigger() on mount** applied to all 4 data-entry steps (contact-info, inquiry-type, reference-linking, message-details). Fixes `isValid` never true on mount with react-hook-form `mode: "onChange"` + Zustand `defaultValues`.
- **Turnstile reintegrated** across schema, Zustand payload, Step 1 widget lifecycle, Step 5 submit guard, and server Siteverify call.
- Server action hardened: timeout, idempotency key, `remoteip`, hostname check, error-code mapping.
- Form-action parsing extracted into `contact-request-form-action.ts` (testable, no `server-only` imports).
- Contact tests pass (`__tests__/contact`: 16 tests).

### Runtime status

Browser automation runtime is now pinned to `mcr.microsoft.com/playwright:v1.58.2-noble` for both `playwright` and `executor-playwright` services.

Hydrate strict still validates service health and memory graph state; bootstrap remains mandatory pre-browser preflight to catch stale/mismatched containers deterministically.

Use `pnpm docker:mcp:playwright:bootstrap` before browser automation to enforce and verify browser availability.

---

## MCP BROWSER BLOCKER — Root Cause and Fix

### Root cause (historical)

- MCP Playwright service could be healthy while Chromium executable was absent.
- Container refresh/image drift removed browser payloads between sessions.
- `pnpm migration:contact:hydrate:strict` validates startup/memory only, not browser payloads.
- Playwright-named containers based on non-browser images caused bootstrap ambiguity.

### Current mitigation baseline (active)

- `playwright` and `executor-playwright` are pinned to `mcr.microsoft.com/playwright:v1.58.2-noble` in both compose files.
- Bootstrap now treats system Chromium/browser payload as ready state and fails fast only on true non-browser-capable runtimes.
- Health checks for Playwright services use Node-based HTTP probes compatible with the pinned image.

### Deterministic fix path

1. `pnpm migration:contact:hydrate:strict`
2. `pnpm docker:mcp:playwright:bootstrap`
3. Retry browser automation.
4. If bootstrap reports `Non-browser-capable runtime detected`, recreate Playwright services from compose (`docker compose up -d --force-recreate --pull always playwright executor-playwright`) and rerun bootstrap.

### Fallback

- If automation still fails after recreate + bootstrap, perform manual `/contact` verification and log runtime failure details into `REQUIRED_NODES` before strict hydrate sync.

---

## TURNSTILE STATUS — Implementation Checklist (already complete)

### Step 1: Add Cloudflare test keys to `.env.local` (never commit)

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

These are Cloudflare's official always-pass test keys. No dashboard change needed.

### Step 2: Restore schema fields

File: `features/contact/schemas/contact-schemas.ts`

Add back to `completeContactFormSchema`:

```ts
turnstileToken: z.string().min(1, "Verification token is required"),
```

Add back to `serverContactFormSchema`:

```ts
turnstileToken: z.string().min(1),
```

### Step 3: Restore store `getCompleteFormData`

File: `features/contact/hooks/use-contact-store.ts`

In `getCompleteFormData()` return:

```ts
turnstileToken: state.turnstileToken || "",
```

### Step 4: Restore server action verification

File: `features/contact/api/contact-request.ts`

After rate limit check, before honeypot check, add back:

```ts
const turnstileResult = await verifyTurnstileToken(
  data.turnstileToken,
  clientId,
);
if (!turnstileResult.success) {
  return { success: false, error: turnstileResult.error };
}
```

Also restore `turnstileToken: data.turnstileToken` in the sanitized data object.

### Step 5: Add Turnstile widget to Step 1

File: `features/contact/components/organisms/contact-steps/contact-info-step.tsx`

- Import Turnstile: `import Turnstile from "@marsidev/react-turnstile"`
- Destructure `turnstileToken`, `setTurnstileToken`, `setTurnstileError` from store
- Add `isTurnstileVerified = Boolean(turnstileToken)`
- Render widget with handlers: `onVerify={setTurnstileToken}`, `onExpire={() => setTurnstileToken(null)}`, `onError={() => { setTurnstileToken(null); setTurnstileError("Verification failed. Please retry."); }}`
- Gate Continue: `disabled={!isValid || isSubmitting || !isTurnstileVerified}`

### Step 6: Restore Submit gate in Review step

File: `features/contact/components/organisms/contact-steps/contact-review-step.tsx`

Restore `tokenMissing` prop on `SubmitInquiryButton`:

```tsx
function SubmitInquiryButton({ tokenMissing }: { tokenMissing: boolean }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending || tokenMissing} ...>
```

Restore store destructure: add `turnstileToken` back.

Restore `handleBeforeSubmit` guard:

```tsx
const handleBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  if (!turnstileToken) {
    event.preventDefault();
    setError(
      "Verification expired. Return to Step 1 and complete verification.",
    );
    setCurrentStep(1);
  }
  if (error) setError(null);
};
```

Call site: `<SubmitInquiryButton tokenMissing={!turnstileToken} />`

### Step 7: Update regression tests

File: `__tests__/contact/contact-schemas.test.ts`

Lines 82 and 110 reference `turnstileToken: ""` and `turnstileToken: "token-ok"`. These must be valid once the schema field is restored.

### Step 8: Validation gate (hard stop after every batch)

1. `pnpm build` — must pass
2. `pnpm test --filter contact` — 9+ tests must pass
3. Browser test on `/contact` (MCP or manual) — complete all 5 steps, verify Submit works
4. `pnpm migration:contact:hydrate:strict` — syncs findings to memory

---

## SME SUB-AGENT ROSTER

Deploy these sub-agents before implementing to keep Orchestrator context lean.

### 1 — Architecture SME

> "Audit the multi-step contact form in `features/contact/`. Confirm Server Components are used where possible, client islands are minimal, Zustand store boundaries are correct, and the form submission uses native `<form action={serverAction}>` + `useActionState`. Return: (a) issues found, (b) confirmed patterns to preserve."

### 2 — Validation SME

> "Verify strict parity between client and server validation for all 5 contact form steps. Check that react-hook-form schemas match the Zod schemas in `features/contact/schemas/contact-schemas.ts`. Confirm `trigger()` on mount is present in all 4 data-entry steps. Return: exact mismatches and patch plan."

### 3 — Turnstile Security SME

> "Design the Turnstile widget lifecycle for `contact-info-step.tsx`: widget render, `onVerify` token capture, `onExpire`/`onError` reset, token inclusion in form payload, and server-side `verifyTurnstileToken` call. Confirm token is ephemeral (not persisted to localStorage). Return: implementation sequence, failure-mode matrix, and Siteverify request shape."

### 4 — QA SME

> "Produce the minimum test + verification plan for Turnstile reintegration: typecheck, build, targeted unit tests for schema changes, and manual browser acceptance criteria for the widget → submit flow. Return: command sequence with expected outcomes and rollback triggers."

---

## KEY FILES

| File                                                                          | Purpose                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `features/contact/schemas/contact-schemas.ts`                                 | Zod schemas — restore `turnstileToken` fields here                |
| `features/contact/api/contact-request.ts`                                     | Server action — restore `verifyTurnstileToken` call               |
| `features/contact/hooks/use-contact-store.ts`                                 | Zustand store — restore `turnstileToken` in `getCompleteFormData` |
| `features/contact/components/organisms/contact-steps/contact-info-step.tsx`   | Step 1 — add widget + Continue gate                               |
| `features/contact/components/organisms/contact-steps/contact-review-step.tsx` | Step 5 — restore Submit gate                                      |
| `features/contact/api/contact-request-form-action.ts`                         | Extracted payload parser (testable)                               |
| `__tests__/contact/contact-schemas.test.ts`                                   | Needs `turnstileToken` restored in test fixtures                  |

---

## MEMORY WRITE-BACK PROTOCOL

The VS Code MCP tool layer (`mcp_mcp_docker_add_observations`) has an encoding error in some contexts. The correct write-back path is:

**Update observations in `REQUIRED_NODES` inside `scripts/migration-contact-hydrate.mjs`, then run:**

```bash
pnpm migration:contact:hydrate:strict
```

The script's `syncObservations()` function calls `add_observations` via direct HTTP to `http://127.0.0.1:3100/memory/tools/call` — this bypasses the VS Code tool layer and works reliably.

Memory keys:

- `agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings`
- `agent:v1:heuristic_snapshots:2026-04-04-turnstile-reintegration-status`
- `agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard`
- `agent:v1:reasoning:2026-04-04-turnstile-rebuild-next-actions`
- `agent:v1:reasoning:2026-04-04-turnstile-react19-next16-best-practices`

---

## NON-NEGOTIABLES

- Never expose secret values. Reference env key names only.
- Server Components first. `"use client"` only for browser interactivity.
- Validation is authoritative on the server. Never trust client state alone.
- No commit or PR until user manually verifies form end-to-end.
- Memory is updated via hydrate script, not via VS Code tool layer.

---

## NEW WINDOW PROMPT (copy this into a fresh chat)

```
You are the Orchestrator for electrical-website (Next.js 16 App Router, TypeScript strict, pnpm, Vercel).

STARTUP — run this first:
  pnpm migration:contact:hydrate:strict

This starts Docker MCP services, smoke-tests all 10 services, and syncs the latest session learnings into memory. Wait for "Contact migration memory hydration complete (strict mode)" before proceeding.

TOOL LOADING — load only what this task needs:
  Load: sequential-thinking (reasoning), memory-reference (read context), github-official (PR/search), playwright (browser verify)
  Skip: wikipedia, openapi-schema unless explicitly needed

MANDATORY PRE-BROWSER PREFLIGHT:
  pnpm docker:mcp:playwright:bootstrap

CURRENT STATE (from memory — verify with open_nodes after hydrate):
  - 5-step contact form is working. Turnstile is reintegrated and server-verified.
  - Build + contact tests pass.
  - Runtime baseline: Playwright MCP services use browser-capable image; bootstrap verifies readiness and detects stale containers.
  - Branch: fix/contact-form-captcha-dev

YOUR TASK: validate Turnstile flow and handle MCP browser runtime preflight deterministically.

BEFORE WRITING ANY CODE:
  1. Read docs/UNIFIED_MASTER_PROMPT_CONTACT_FORM_TURNSTILE_REBUILD_2026-04-04.md for full step-by-step
  2. Deploy SME sub-agents (Architecture, Validation, Turnstile Security, QA) to validate approach before implementation
  3. Confirm .env.local has test keys: NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA and TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

VALIDATION GATE after every batch:
  pnpm build && pnpm test (filter contact scope) && manual browser check on /contact

MEMORY WRITE-BACK at session end:
  Update REQUIRED_NODES observations in scripts/migration-contact-hydrate.mjs, then run pnpm migration:contact:hydrate:strict
```
