# Phase 1 Implementation Checklist — Quotation Header V1

Date: 2026-04-06  
Phase: 1 (Quotation only)  
Status: Implementation completed; awaiting QA evidence + Checkpoint B sign-off

## 0) Preconditions (must pass before implementation)

- [ ] Checkpoint A approved in [HEADER_V1_EXECUTION_BRIEF_2026-04-06.md](HEADER_V1_EXECUTION_BRIEF_2026-04-06.md)
- [ ] Working branch confirmed for email-template normalization scope
- [ ] `pnpm docker:mcp:smoke` healthy
- [ ] Memory sync complete for:
  - `agent:v1:project:electrical-website`
  - `agent:v1:heuristic_snapshots:2026-04-06-template-normalization-quotation-bootstrap`
  - `agent:v1:next-task:email-template-normalization:quotation-first-2026-04-06`

## 1) In-Scope Files (Quotation only)

Primary shared helper:

- `lib/email/config/email-config-builder.ts`

Quotation templates:

- `features/quotation/api/templates/quotation-customer-html.tsx`
- `features/quotation/api/templates/quotation-business-html.tsx`

Quotation service path (read/verify only unless required):

- `features/quotation/api/quotation-email-service.ts`

## 2) Header V1 Contract to Implement

Mandatory structure (fixed order):

1. Brand Row
2. Accent Rule
3. Transaction Meta Row

Token sources:

- Config-driven: company + brand values from resolved config
- Transaction-driven: title, reference, optional status from template context

Hard rules:

- No hardcoded company name/logo/tagline in templates
- No footer changes in Phase 1
- No subject-line logic changes in Phase 1

## 3) Implementation Tasks (ordered)

### Task A — Shared Helper Alignment

- [x] Confirm `getSharedHeaderHtml` can render Header V1 structure
- [x] Keep helper API backward-safe for non-quotation templates
- [x] Ensure logo URL handling remains absolute URL safe for email clients

### Task B — Quotation Business Template

- [x] Route title/reference/status through canonical Header V1 contract
- [x] Remove legacy duplicated header fragments from template
- [x] Keep business body content unchanged except header integration

### Task C — Quotation Customer Template

- [x] Route title/reference through canonical Header V1 contract
- [x] Remove legacy duplicated header fragments from template
- [x] Keep customer body content unchanged except header integration

### Task D — Drift Check

- [x] Verify no new company branding hardcodes introduced in quotation templates
- [x] Verify only Phase 1 files are changed

## 4) Validation Gates (must pass)

- [x] Typecheck: `pnpm exec tsc --noEmit`
- [ ] Template smoke checks (if available for this scope)
- [ ] Visual proof package prepared for QA run sheet
- [ ] Browser/email inspection evidence attached

## 5) Commit/PR Slicing (Phase 1 only)

Suggested commit title:

- `feat(email-header): apply Header V1 to quotation templates`

PR scope:

- Quotation-only header changes
- Shared helper changes only if required by quotation integration

## 6) Stop/Go Checkpoint B

Do not proceed to Phase 2 until all are true:

- [ ] Validation gates passed
- [ ] QA run sheet marked PASS
- [ ] Stakeholder sign-off recorded
- [ ] Memory snapshot written for Phase 1 outcome

## 7) Memory Write After Completion (Phase 1)

Write/update keys:

- `agent:v1:heuristic_snapshots:2026-04-06-header-v1-phase1-quotation`
- `agent:v1:next-task:email-template-normalization:header-v1-phase2-contact`
