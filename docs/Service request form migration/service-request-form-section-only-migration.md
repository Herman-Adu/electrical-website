# Service Request Form Section — Animated + Shared-Core Migration Guide

## Scope lock (non-negotiable)

Migrate only the Service Request form section into the existing services page, while preserving the form’s unique electric/light-bulb animation identity.

Required outcomes:

- Keep full service-request form behavior (all steps, validation, server action, emails)
- Preserve unique service form animation experience (light-bulb/electric theme)
- Implement on the shared generic multistep architecture for DRY reuse
- Do **not** migrate unrelated page blocks (hero/services grid/certifications/trust/footer)

---

## Architecture target

Use a hybrid pattern:

- **Shared core**: generic multistep orchestration, types, action state, security pipeline
- **Service-specific UI layer**: animated step indicator and electric effects unique to service-request

This keeps cross-form consistency without sacrificing service-form branding and UX.

---

## Required file groups (section-only)

### 1) Service feature (copy/keep complete)

- `features/service-request/**`

### 2) Shared multistep core (required)

- `components/organisms/multi-step-form-wrapper.tsx`
- `components/molecules/form-step-container.tsx`
- `components/organisms/shared-steps/contact-info-step.tsx`
- `lib/forms/types.ts`
- `lib/actions/action.types.ts`

### 3) Service animation layer (required for unique UX)

- `components/animations/electric-current.tsx`
- `components/animations/power-surge.tsx`
- `components/animations/pulse-circle.tsx`
- `components/animations/light-bulb.tsx`
- `components/animations/lightning-arc.tsx`
- `components/animations/electric-border.tsx`
- `components/animations/spark-effect.tsx`
- `components/molecules/step-indicator.tsx`

### 4) Security + sanitization (required by action path)

- `lib/security/turnstile.ts`
- `lib/security/rate-limiter.ts`
- `lib/security/csrf.ts`
- `lib/sanitize/input-sanitizer.ts`

### 5) Step input components

- `components/atoms/form-input.tsx`
- `components/atoms/form-select.tsx`
- `components/atoms/form-textarea.tsx`
- `components/atoms/radio-group.tsx`
- `components/atoms/date-picker.tsx`
- `components/atoms/form-checkbox.tsx`

### 6) Supporting dependencies

- `components/ui/button.tsx`
- `lib/scroll-to-section.ts`
- `lib/email/services/delivery-log.ts`
- `lib/email/config/email-config.tsx`
- `lib/email/config/email-config-builder.ts`

---

## Services page integration (only this section)

Add/keep only the embedded section with form mount:

- section anchor: `id="request-service"` (or retain `id="service-request"` where existing links depend on it)
- section header/subtext
- animated decorations (`ElectricCurrent` top/bottom) as needed
- `ServiceRequestFormContainer`

---

## Packages required

- `react-hook-form`
- `@hookform/resolvers`
- `zod`
- `zustand`
- `framer-motion`
- `@marsidev/react-turnstile`
- `resend`
- `lucide-react`

---

## Env vars required (names only)

- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- company email/from values used by `email-config-builder.ts`

---

## Ready-to-paste next-chat prompt (animated + shared-core)

Implement only the Service Request Form section on the current services page, preserving the unique electric/light-bulb step animations while wiring it to the shared generic DRY multistep core used across forms. Keep full service form behavior (validation, review/edit routing, submit action, Turnstile/security, email flow), keep the section embedded on `/services`, and do not migrate unrelated page blocks. Use orchestrator mode with SME delegation and independent verification per batch; run targeted checks, then typecheck/build, then Docker memory sync with immediate verification.
