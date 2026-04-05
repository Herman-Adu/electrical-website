# FULL MEMORY SYNC PROMPT — Contact Form Migration + Turnstile Recovery (2026-04-04)

Use this in a brand-new chat for docker-first orchestration, full continuity, and reusable migration standards.

---

Continue in `electrical-website` on Windows.

## Mandatory startup sequence (memory-first)

Before hydrating keys, run:

- Preferred strict startup: `pnpm migration:contact:hydrate:strict`
- Auto-heal startup: `pnpm migration:contact:hydrate`

Hydrate memory keys in this exact order:

1. `agent:v1:project:electrical-website`
2. `agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings`
3. `agent:v1:heuristic_snapshots:2026-04-04-turnstile-reintegration-status`
4. `agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard`
5. `agent:v1:reasoning:2026-04-04-turnstile-rebuild-next-actions`
6. `agent:v1:reasoning:2026-04-04-turnstile-react19-next16-best-practices`

If any key is missing, reconstruct from this document and write back before coding.

## Ground truth (latest validated state)

- Multi-step contact form flow is functional end-to-end.
- Turnstile is reintegrated in the active flow and required for final submit.
- Final submit uses native `<form action={serverAction}>` semantics with `useActionState` / `useFormStatus`.
- Email send path works (Resend configured and templates/config verified).
- Toast notifications and success state UX are working.
- Step navigation and submission are stable.
- Server-side Turnstile verification is active with timeout + idempotency key + hostname check.
- Button gating now follows client-side validation across steps:
  - Step 1: `disabled={!isValid || isSubmitting}`
  - Step 2: `disabled={!isValid || isSubmitting}`
  - Step 3: `disabled={!isValid || isSubmitting}`
  - Step 4: `disabled={!isValid || isSubmitting}`
  - Step 5 (Review/Submit): `disabled={isSubmitting}`

## Remaining closeout item

- Manual `/contact` verification by user is pending before final memory snapshot sync.
- Environment keys are present by name: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
- Never expose or log key values.

## Migration timeline (what happened)

1. Step 1 "Continue" button was blocking valid users due to strict `isValid` behavior under certain input/autofill conditions.
2. Turnstile was added for diagnosis and showed callback error code `400020`.
3. Turnstile was fully reintegrated with token lifecycle across store + review + server action.
4. Submit path was hardened to native final form-action with server-returned field routing.
5. Server verification was hardened (timeout/idempotency/hostname/error mapping).
6. Focused regressions were added and made deterministic through utility extraction.

## Learned patterns (portable to next 2 form migrations)

### Validation and button gating

- Use `react-hook-form` with `mode: "onChange"` for immediate client feedback.
- Gate step buttons with `!isValid || isSubmitting` on data-entry steps.
- Keep review/submit step gated by `isSubmitting` plus server-side schema validation.
- Avoid optimistic progression when a step has unresolved client errors.

### Architecture standards

- Next.js 16 + App Router: server components by default; client islands only for interactivity.
- Keep mutation logic in server actions and always validate input with Zod on server.
- Keep store state minimal, serializable, and migration-safe for multi-step flows.
- For anti-bot controls, enforce server-side verification at final submission, never client-only.

### Reliability and observability

- Expected third-party callback failures should use `console.warn`, not `console.error`, in dev to avoid noisy overlays.
- Add dev-only diagnostics for widget lifecycle (`load`, `verify`, `expire`, `error`) with safe messages.
- Keep diagnostics non-secret and removable behind an explicit dev gate.

### Production-readiness checklist for forms

- Loading and pending states for each async transition.
- Step-level and global error boundaries with clear recovery actions.
- Skeleton/loading placeholders where network-delivered content is present.
- Rate limiting + honeypot + payload sanitization + server schema validation.
- Accessibility: keyboard focus, labels, aria-invalid, and screen-reader error association.

### Rendering strategy considerations (Next.js 16)

- ISR/PPR are optional per route needs; dynamic form flows should prioritize correctness and UX consistency.
- Keep expensive static shell content cacheable while preserving dynamic client form islands.
- Explicitly document cache boundaries when introducing data dependencies around forms.

## Research protocol for next hydration

Before Turnstile reimplementation, collect references in this order:

1. Local Next.js docs resolution (`pnpm run status:next-docs`).
2. Project-native patterns already in this repository.
3. Context7/library docs for:
   - Next.js 16 App Router + Server Actions
   - React 19 form patterns
   - react-hook-form + zodResolver
   - Cloudflare Turnstile client/server verification

Current local docs status snapshot:

- `node_modules/next/dist/docs`: missing
- `node_modules/next/docs`: missing
- `node_modules/next/README.md`: found (preferred local source)

## Required implementation target (next phase)

Turnstile implementation target is complete for this form. Next phase is operational closeout:

1. Manual user verification on `/contact`.
2. Final Docker memory snapshot sync/write-back.
3. Prepare migration template reuse for the next two multistep forms.

## Guardrails

- Never print secret values from `.env*`, logs, or tools.
- Report only key names with `present` / `missing`.
- Memory MCP is the primary system-of-record; do not create additional handoff `.md` files during normal operation.
- Use markdown fallback only when MCP write/read is unavailable, and reconcile fallback notes back into memory at next startup.
- No commit until user manual local verification is complete.
- Keep changes surgical, reversible, and validated batch-by-batch.

## Validation sequence (hard requirement)

After each implementation batch:

1. `pnpm build`
2. targeted tests for changed scope
3. manual user test on `/contact`
4. checkpoint summary + rollback note

## Session close write-back payload

Persist at least:

- `agent:v1:heuristic_snapshots:2026-04-04-contact-form-migration-learnings`
- `agent:v1:heuristic_snapshots:2026-04-04-turnstile-reintegration-status`
- `agent:v1:reasoning:2026-04-04-multistep-form-architecture-standard`
- `agent:v1:reasoning:2026-04-04-turnstile-rebuild-next-actions`

If MCP write fails, keep this file as source-of-truth and retry write-back first in the next session.

## Latest validation evidence

- Strict docker-first hydration: passed (`pnpm migration:contact:hydrate:strict`).
- Focused regression tests: passed (`9 passed, 0 failed`).
- Production build: passed (`pnpm build`).

---

End of full memory sync prompt.
