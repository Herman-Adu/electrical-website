# Next.js 16 Server Actions + Form Validation (App Router)

Last updated: 2026-04-04
Scope: reusable process reference for future form migrations in this repository.

## Source acquisition log

### 1) MCP resources

- Next.js MCP guide (official): https://nextjs.org/docs/app/guides/mcp
- Attempted Next.js MCP docs tool query via `mcp_mcp_docker_nextjs_docs`:
  - Query: `Next.js 16 App Router Server Actions forms validation best practices useActionState useFormStatus Zod server-side validation authentication authorization`
  - Result: no documentation returned by tool in this session.

### 2) Official Next.js documentation

- Forms guide: https://nextjs.org/docs/app/guides/forms
- Forms validation errors section: https://nextjs.org/docs/app/guides/forms#validation-errors

## Authoritative best practices (Next.js 16 App Router)

1. Prefer native `<form action={serverAction}>` for final mutations.
2. Always re-check auth/authz inside each Server Action.
3. Keep server-side validation authoritative with `zod.safeParse`.
4. Use `useActionState` for action result state (messages/field errors).
5. Use `useFormStatus` for pending UX and submit button disabling.
6. Treat client-side validation as UX, not trust boundary.
7. Return minimal serialized action payloads (`success`, `error`, `fieldErrors`, IDs).
8. Keep anti-bot checks and abuse controls server-side.

## Repo-specific implementation standard

### A. Architecture boundaries

- Server page shell + client form island remains the default split.
- Keep Server Action files thin and async-only exports.
- Persist draft form values only; exclude volatile anti-bot token state.

### B. Validation parity contract

- Use one canonical schema source for business rules.
- Derive step schemas from canonical schema to reduce drift.
- Server schema must be equal or stricter than client schema.
- Avoid hidden sanitizer truncation that changes user meaning.

### C. Submission lifecycle

1. Client step validation gates progression (`!isValid || isSubmitting`).
2. Final submit runs server action through form action.
3. Server validates security (origin/rate-limit/honeypot/anti-bot) then Zod.
4. Server maps field errors for UI and step routing.

### D. Turnstile token lifecycle rules (multi-step forms)

- Token is ephemeral only (no localStorage persistence).
- Clear token on expire/error/retry/success and uncertain verification failures.
- Reject final submit on missing/expired/invalid token.
- Map replay/timeout (`timeout-or-duplicate`) to forced re-verification.
- Use safe diagnostics (`console.warn`), never token or secret logging.

## SME synthesis for migration reuse

### Architecture SME outcomes

- Standardize on one contact-form implementation path per domain.
- Prefer native form actions over imperative `onClick` server action calls.
- Keep security checks at mutation boundary in server action.

### Validation SME outcomes

- Remove client/server rule drift for reference IDs, trim behavior, and text length.
- Reuse structured `fieldErrors` end-to-end instead of generic error-only UI.
- Add parity tests across step schema vs complete schema vs server schema.

### Security SME outcomes

- Verify more than Siteverify `success` where available (`hostname`, error class).
- Add bounded timeout behavior for Siteverify transport failures.
- Keep fail-closed behavior for missing keys and token uncertainty.

## Phase D reusable checklist (for next forms)

- [ ] Resolve docs in order: local packaged docs -> official docs fallback.
- [ ] Capture source URLs and retrieval date in migration note.
- [ ] Ensure canonical schema + derived step schemas.
- [ ] Confirm final submit uses `<form action>` with `useActionState` + `useFormStatus`.
- [ ] Confirm server action applies security checks + `safeParse` before side effects.
- [ ] Confirm anti-bot token is ephemeral and never logged.
- [ ] Run validation gate: build + targeted tests + manual route test + rollback note.
- [ ] Write memory snapshot keys after each migration batch.

## Operational note for future sessions

- Startup hydration remains mandatory:
  - `pnpm migration:contact:hydrate:strict`
- Memory MCP helper commands:
  - `pnpm docker:mcp:memory:search <query>`
  - `pnpm docker:mcp:memory:open <keys...>`
