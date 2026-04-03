# New Window Prompt — Contact Migration Batch 4 (Continue from Batch 3)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Run MCP health preflight (`pnpm migration:contact:ready`) and report result.
2. Read memory entities from Docker memory via the gateway:
   - agent:v1:heuristic_snapshots:2026-04-03-session-end
   - agent:v1:reasoning:contact-migration-lift-shift-2026-04-03
   - agent:v1:drift_lane:memory-backend-fix-2026-04-03
   - agent:v1:handoff:contact-migration-batch4-2026-04-03
3. Read canonical migration source:
   - docs/contact-migration/contact-page-lift-and-shift.md

Memory is the single source of truth for migration state. Do not treat embedded prompt text as authoritative session state.

Current task focus after hydration:

- Batch 4 — Molecules
- Verify and unlock only this batch:
  - components/molecules/quick-contact-card.tsx
  - components/molecules/office-hours-card.tsx
  - components/molecules/location-map-card.tsx
  - components/molecules/navbar.tsx

Locked decisions must come from hydrated memory and remain unchanged during verification.

---

## Operating contract (strict)

- No coding by assistant during migration copy phase.
- User manually copies files.
- Assistant only releases next batch, verifies copied files, reports blockers, and unlocks next batch.
- Do not advance until current batch is green.

## Verification rules per batch

- Validate file presence and paths.
- Validate import/dependency integrity with targeted code search.
- Run get_errors on touched files.
- Run broader checks only at milestone boundaries.

---

## BATCH 4 — Molecule Sidebar Cards + Navbar

Copy these files now:
```

apps/ui/components/molecules/quick-contact-card.tsx -> components/molecules/quick-contact-card.tsx
apps/ui/components/molecules/office-hours-card.tsx -> components/molecules/office-hours-card.tsx
apps/ui/components/molecules/location-map-card.tsx -> components/molecules/location-map-card.tsx
apps/ui/components/molecules/navbar.tsx -> components/molecules/navbar.tsx

```

After copying, update the hardcoded contact details in the three sidebar card files
to match this project's actual phone, email, address, and map embed values.

Report back when done. Assistant will verify then unlock Batch 5.

---

## Remaining batches after 4

**Batch 5** — Contact feature schemas:
- features/contact/schemas/contact-schemas.ts

**Batch 6** — Zustand store + email templates:
- features/contact/hooks/use-contact-store.ts
- features/contact/api/templates/contact-customer-html.tsx
- features/contact/api/templates/contact-business-html.tsx

**Batch 7** — Email service + server action:
- features/contact/api/contact-email-service.ts
- features/contact/api/contact-request.ts

**Batch 8** — Form step components + success + container:
- features/contact/components/organisms/contact-steps/contact-info-step.tsx
- features/contact/components/organisms/contact-steps/inquiry-type-step.tsx
- features/contact/components/organisms/contact-steps/reference-linking-step.tsx
- features/contact/components/organisms/contact-steps/message-details-step.tsx
- features/contact/components/organisms/contact-steps/contact-review-step.tsx
- features/contact/components/molecules/contact-success-message.tsx
- features/contact/components/organisms/contact-form-container.tsx

**Batch 9** — Feature barrel + page + env vars + typecheck:
- features/contact/index.ts
- app/contact/page.tsx
- .env.local: RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, CSRF_SECRET
- pnpm tsc --noEmit

## Definition of done

- /contact renders complete layout (hero, trust, FAQ teaser, form, sidebar cards)
- 5-step form flow works with validation + persisted state
- submit path returns reference id + success state
- env wiring complete
- typecheck/build pass
- visual + scripted checks pass

## At every checkpoint include

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by summarizing hydrated memory state and proposing verification steps for Batch 4 only.
```
