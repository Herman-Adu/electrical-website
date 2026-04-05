# Quotation Page — Lift & Shift Guide

> A comprehensive migration reference for the `/quotation` page and its 7-step form.
> Written so an AI assistant or developer can read this cold and understand exactly what they are looking at, what every file does, and the exact order to copy things across.

---

## Folder Copy Approach — Do This

> Copy in the numbered order below. Each round is a single drag-and-drop or `cp -r` in your terminal. **Do not skip rounds** — earlier rounds provide types and utilities that later ones import.
>
> Assumes: tsconfig `@/` alias already working, Tailwind configured, Next.js App Router project ready. Skip any step already in place.

### What Can Be Copied as a Whole Folder

| Folder in source | Copy to target | Notes |
|---|---|---|
| `apps/ui/features/quotation/` | `features/quotation/` | **Entire feature — copy the whole folder** |
| `apps/ui/components/atoms/` | `components/atoms/` | All atoms are self-contained — safe to copy whole |
| `apps/ui/components/providers/` | `components/providers/` | Just ThemeProvider — safe to copy whole |
| `apps/ui/lib/sanitize/` | `lib/sanitize/` | One file, self-contained |
| `apps/ui/lib/security/` | `lib/security/` | Two files, self-contained |
| `apps/ui/lib/forms/` | `lib/forms/` | One file (`types.ts`), self-contained |
| `apps/ui/components/organisms/shared-steps/` | `components/organisms/shared-steps/` | Just 3 files, all self-contained |

### What Must Be Copied File-by-File (NOT the whole folder)

> `lib/actions/`, `lib/email/`, `components/molecules/`, and `components/organisms/` all contain extra dashboard or Strapi-backed files that would break TypeScript if the whole folder was copied.
> Copy only the files listed below from these folders.

| File in source | Copy to target | Reason whole folder is unsafe |
|---|---|---|
| `lib/utils.ts` | `lib/utils.ts` | Single file at lib root |
| `lib/constants.ts` | `lib/constants.ts` | Single file at lib root |
| `lib/actions/action.types.ts` | `lib/actions/action.types.ts` | Other files in `lib/actions/` import from Strapi |
| `lib/email/config/email-config-builder.ts` | `lib/email/config/email-config-builder.ts` | Other files in `lib/email/` import from Strapi |
| `lib/email/config/email-config.tsx` | `lib/email/config/email-config.tsx` | Needed by builder (pure constants, no Strapi) |
| `lib/email/services/delivery-log.ts` | `lib/email/services/delivery-log.ts` | Other services in same folder import from Strapi |
| `types/marketing.ts` | `types/marketing.ts` | Other types in `types/` may be Strapi-specific |
| `data/strapi-mock/marketing/quotation.json` | `data/strapi-mock/marketing/quotation.json` | Only this JSON, not the whole data folder |
| `components/ui/button.tsx` | `components/ui/button.tsx` | Or install via `npx shadcn@latest add button` |
| `components/molecules/form-step-container.tsx` | `components/molecules/form-step-container.tsx` | Molecules folder has dashboard-specific files |
| `components/molecules/form-progress-indicator.tsx` | `components/molecules/form-progress-indicator.tsx` | Same — dashboard files would break TS |
| `components/molecules/navbar.tsx` | `components/molecules/navbar.tsx` | Same |
| `components/organisms/multi-step-form-wrapper.tsx` | `components/organisms/multi-step-form-wrapper.tsx` | Organisms folder has many dashboard files |
| `app/quotation/page.tsx` | `app/quotation/page.tsx` | Single page file |

---

### Ordered Copy Sequence (10 rounds)

Work through these in order. Each round completes before the next.

```
Round 1 — Self-contained lib folders (whole folder copy)
  cp -r apps/ui/lib/sanitize/   lib/sanitize/
  cp -r apps/ui/lib/security/   lib/security/
  cp -r apps/ui/lib/forms/      lib/forms/

Round 2 — Individual lib files (from lib root)
  cp apps/ui/lib/utils.ts       lib/utils.ts
  cp apps/ui/lib/constants.ts   lib/constants.ts

Round 3 — Action types (single file only — not the whole lib/actions/ folder)
  mkdir -p lib/actions
  cp apps/ui/lib/actions/action.types.ts   lib/actions/action.types.ts

Round 4 — Email infrastructure (3 specific files — not the whole lib/email/ folder)
  mkdir -p lib/email/config lib/email/services
  cp apps/ui/lib/email/config/email-config-builder.ts   lib/email/config/email-config-builder.ts
  cp apps/ui/lib/email/config/email-config.tsx           lib/email/config/email-config.tsx
  cp apps/ui/lib/email/services/delivery-log.ts          lib/email/services/delivery-log.ts

  ⚠️ After copying email-config-builder.ts: decide whether to replace buildEmailConfig()
     with the env-var version (see §8 in this doc) or keep the full Strapi version.
     Make that edit now before anything imports it.

Round 5 — Types & data (single files into correct folders)
  mkdir -p types data/strapi-mock/marketing
  cp apps/ui/types/marketing.ts                           types/marketing.ts
  cp apps/ui/data/strapi-mock/marketing/quotation.json    data/strapi-mock/marketing/quotation.json

Round 6 — Providers, shadcn Button, and atoms (whole folder copies)
  cp -r apps/ui/components/providers/   components/providers/
  mkdir -p components/ui
  cp apps/ui/components/ui/button.tsx   components/ui/button.tsx
  (OR: npx shadcn@latest add button)
  cp -r apps/ui/components/atoms/       components/atoms/

  Wire ThemeProvider into app/layout.tsx now:
  import { ThemeProvider } from "@/components/providers/theme-provider"
  Wrap children: <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

Round 7 — Molecules (3 specific files — NOT the whole molecules folder)
  mkdir -p components/molecules
  cp apps/ui/components/molecules/form-step-container.tsx       components/molecules/form-step-container.tsx
  cp apps/ui/components/molecules/form-progress-indicator.tsx   components/molecules/form-progress-indicator.tsx
  cp apps/ui/components/molecules/navbar.tsx                    components/molecules/navbar.tsx

Round 8 — Shared organisms (1 specific file + 1 whole subfolder)
  mkdir -p components/organisms
  cp apps/ui/components/organisms/multi-step-form-wrapper.tsx    components/organisms/multi-step-form-wrapper.tsx
  cp -r apps/ui/components/organisms/shared-steps/               components/organisms/shared-steps/

Round 9 — Feature (whole folder copy — everything quotation needs is inside)
  cp -r apps/ui/features/quotation/   features/quotation/

Round 10 — Page (single file)
  mkdir -p app/quotation
  cp apps/ui/app/quotation/page.tsx   app/quotation/page.tsx
```

After Round 10: set env vars → `npx tsc --noEmit` → `pnpm build` → test.

---

## Key Differences vs Contact Page

Before reading further, understand what makes the quotation page meaningfully different:

| Aspect | Contact Page | Quotation Page |
|---|---|---|
| Steps | 5 (1–5 indexed) | **7 (0–6 indexed)** |
| Step container | Custom inline progress in form container | **Shared `FormStepContainer` + `MultiStepFormWrapper`** |
| Shared steps | None — all steps are contact-specific | **Step 0 = shared `ContactInfoStep`; Step 3 = shared `AddressInfoStep`** |
| Progress bar | Custom SVG circles in container | **`FormProgressIndicator` molecule** |
| Rate limit | 3 per 1 minute | **3 per 5 minutes** |
| Reference prefix | `CR-` | **`QR-`** |
| Email `from` | `contactFromEmail` | **`quotationFromEmail`** |
| Terms required | No | **Yes — `termsAccepted` Zod refine, form cannot submit without it** |
| Success trigger | `store.setSubmitted(true, id)` | **`successData` useState in container, `resetForm()` called** |
| Email subject (urgent) | Fixed subject | **`URGENT QUOTATION REQUEST - QR-xxx` if timeline === "urgent"** |

---

## Visual Overview — Component Tree

```
app/quotation/page.tsx  (RSC — no "use client")
│
├── <Navbar />
│   └── components/molecules/navbar.tsx
│       └── components/atoms/theme-toggle.tsx
│           └── components/providers/theme-provider.tsx
│
├── HEADER SECTION        (inline JSX — driven by quotation.json → header)
│
├── <QuotationFormContainer />
│   └── features/quotation/components/organisms/quotation-form-container.tsx
│       │
│       ├── [State]   features/quotation/hooks/use-quotation-store.ts  (Zustand)
│       ├── [Action]  features/quotation/api/quotation-request.ts      ("use server")
│       │
│       ├── <MultiStepFormWrapper>          ← shared organism
│       │   └── components/organisms/multi-step-form-wrapper.tsx
│       │       └── <FormProgressIndicator>
│       │           └── components/molecules/form-progress-indicator.tsx
│       │
│       ├── Step 0 — <ContactInfoStep>      ← SHARED step (not feature-specific)
│       │   └── components/organisms/shared-steps/contact-info-step.tsx
│       │       ├── components/atoms/form-input.tsx
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 1 — <ProjectTypeStep>
│       │   └── features/quotation/.../quotation-steps/project-type-step.tsx
│       │       ├── components/atoms/form-select.tsx
│       │       ├── components/atoms/radio-group.tsx
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 2 — <ProjectScopeStep>
│       │   └── features/quotation/.../quotation-steps/project-scope-step.tsx
│       │       ├── components/atoms/form-textarea.tsx
│       │       ├── components/atoms/form-checkbox.tsx
│       │       ├── components/atoms/radio-group.tsx
│       │       ├── lib/utils.ts  (cn)
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 3 — <AddressInfoStep>      ← SHARED step (not feature-specific)
│       │   └── components/organisms/shared-steps/address-info-step.tsx
│       │       ├── components/atoms/form-input.tsx
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 4 — <BudgetTimelineStep>
│       │   └── features/quotation/.../quotation-steps/budget-timeline-step.tsx
│       │       ├── components/atoms/form-select.tsx
│       │       ├── components/atoms/form-checkbox.tsx
│       │       ├── components/atoms/date-picker.tsx   ← unique to quotation
│       │       ├── components/atoms/radio-group.tsx
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 5 — <AdditionalRequirementsStep>
│       │   └── features/quotation/.../quotation-steps/additional-requirements-step.tsx
│       │       ├── components/atoms/form-textarea.tsx
│       │       ├── components/atoms/form-select.tsx
│       │       ├── components/atoms/form-checkbox.tsx
│       │       ├── components/atoms/radio-group.tsx
│       │       ├── lib/utils.ts  (cn)
│       │       └── components/molecules/form-step-container.tsx
│       │
│       ├── Step 6 — <QuotationReviewStep>
│       │   └── features/quotation/.../quotation-steps/quotation-review-step.tsx
│       │       ├── components/ui/button.tsx
│       │       └── components/molecules/form-step-container.tsx
│       │
│       └── Success — <QuotationSuccessMessage>
│           └── features/quotation/components/molecules/quotation-success-message.tsx
│               ├── framer-motion
│               ├── lucide-react
│               ├── components/ui/button.tsx
│               └── next/link
│
├── TRUST INDICATORS      (inline JSX — driven by quotation.json → trustIndicators)
│
└── FAQ SECTION           (inline JSX — driven by quotation.json → faq)

Server-side pipeline (triggered on Step 6 submit):
features/quotation/api/quotation-request.ts
  ├── lib/security/csrf.ts               (origin check)
  ├── lib/security/rate-limiter.ts       (3 req / 5 min per IP)
  ├── lib/sanitize/input-sanitizer.ts    (XSS strip + normalise)
  ├── quotation-schemas.ts               (Zod server validate)
  └── features/quotation/api/quotation-email-service.ts
      ├── lib/email/config/email-config-builder.ts  (Strapi/env config)
      ├── lib/email/services/delivery-log.ts
      ├── api/templates/quotation-customer-html.tsx
      └── api/templates/quotation-business-html.tsx
```

---

## Page Layout Diagram

```
┌──────────────────────────────────────────────────────┐
│                      <Navbar />                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  HEADER SECTION                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  h1: header.title                              │  │
│  │  p:  header.description                        │  │
│  └────────────────────────────────────────────────┘  │
│      gradient bg, centered text, max-w-3xl           │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  FORM SECTION  (max-w-4xl)                           │
│  ┌────────────────────────────────────────────────┐  │
│  │  <MultiStepFormWrapper>                        │  │
│  │    Title: "Request a Quotation"                │  │
│  │    Description: ...                            │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │ <FormProgressIndicator>                  │ │  │
│  │  │ [●]──[○]──[○]──[○]──[○]──[○]──[○]      │ │  │
│  │  │  1    2    3    4    5    6    7          │ │  │
│  │  │ Progress bar fills left to right          │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │ bg-card border rounded-xl p-6 md:p-8     │ │  │
│  │  │                                           │ │  │
│  │  │  <AnimatePresence>                        │ │  │
│  │  │    <FormStepContainer>                    │ │  │
│  │  │      [Icon] Step Title                    │ │  │
│  │  │      Step description                     │ │  │
│  │  │      ─────────────────                    │ │  │
│  │  │      [ Step-specific fields ]             │ │  │
│  │  │      ─────────────────                    │ │  │
│  │  │      [← Back]          [Continue →]       │ │  │
│  │  │    </FormStepContainer>                   │ │  │
│  │  │  </AnimatePresence>                       │ │  │
│  │  │                                           │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  (Submit error banner appears below form if error)   │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  TRUST INDICATORS  (border-t, bg-muted/30)           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │    15+       │ │    500+      │ │    100%      │  │
│  │  Years Exp   │ │  Completed   │ │  Certified   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘  │
│      (data from quotation.json → trustIndicators)    │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  FAQ SECTION  (max-w-2xl)                            │
│  h2: faq.title                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  Q: How long does it take to receive a quote?  │  │
│  │  A: We typically respond within 2-5 days...    │  │
│  ├────────────────────────────────────────────────┤  │
│  │  Q: Is the quotation free?                     │  │
│  │  A: Yes, all quotations are free...            │  │
│  └────────────────────────────────────────────────┘  │
│      (data from quotation.json → faq.items)          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## The 7 Form Steps — What Each Collects

| Step # | Component | Schema | Key Fields |
|---|---|---|---|
| 0 | `ContactInfoStep` (shared) | `quotationContactSchema` | fullName, email, phone, company (optional) |
| 1 | `ProjectTypeStep` | `quotationProjectTypeSchema` | projectCategory enum, projectType enum, propertyType enum |
| 2 | `ProjectScopeStep` | `quotationScopeSchema` | projectDescription (min 20), estimatedSize, services[] (min 1), hasDrawings bool, needsDesign bool |
| 3 | `AddressInfoStep` (shared) | `quotationSiteSchema` (partial) | addressLine1, addressLine2, city, county, postcode (UK regex) |
| 4 | `BudgetTimelineStep` | `quotationBudgetSchema` | budgetRange enum, timeline enum, preferredStartDate (optional), flexibleOnBudget, flexibleOnTimeline |
| 5 | `AdditionalRequirementsStep` | `quotationAdditionalSchema` | complianceRequirements[], specialRequirements, preferredContactMethod, howDidYouHear, marketingConsent, **termsAccepted (required)** |
| 6 | `QuotationReviewStep` | none (read-only) | Read-only summary of all steps; triggers submit |

> **Important:** Steps 0 and 3 use **shared reusable components** from `components/organisms/shared-steps/`. They are NOT inside `features/quotation/`. These shared steps contain their own internal Zod schemas and are completely self-contained.

---

## Complete File Checklist

### Bundle A — Page

- [ ] `apps/ui/app/quotation/page.tsx`

---

### Bundle B — Feature: Quotation (copy entire folder tree)

**Barrel:**
- [ ] `apps/ui/features/quotation/index.ts`

**Schemas:**
- [ ] `apps/ui/features/quotation/schemas/quotation-schemas.ts`

**Store (Zustand):**
- [ ] `apps/ui/features/quotation/hooks/use-quotation-store.ts`

**Form container:**
- [ ] `apps/ui/features/quotation/components/organisms/quotation-form-container.tsx`

**Quotation-specific steps:**
- [ ] `apps/ui/features/quotation/components/organisms/quotation-steps/project-type-step.tsx`
- [ ] `apps/ui/features/quotation/components/organisms/quotation-steps/project-scope-step.tsx`
- [ ] `apps/ui/features/quotation/components/organisms/quotation-steps/budget-timeline-step.tsx`
- [ ] `apps/ui/features/quotation/components/organisms/quotation-steps/additional-requirements-step.tsx`
- [ ] `apps/ui/features/quotation/components/organisms/quotation-steps/quotation-review-step.tsx`

**Success message:**
- [ ] `apps/ui/features/quotation/components/molecules/quotation-success-message.tsx`

**Server actions & email service:**
- [ ] `apps/ui/features/quotation/api/quotation-request.ts`
- [ ] `apps/ui/features/quotation/api/quotation-email-service.ts`

**Email templates:**
- [ ] `apps/ui/features/quotation/api/templates/quotation-customer-html.tsx`
- [ ] `apps/ui/features/quotation/api/templates/quotation-business-html.tsx`

---

### Bundle C — Shared Organisms (generic form infrastructure)

> These are **not** inside `features/quotation/`. They are reusable across multiple forms.

- [ ] `apps/ui/components/organisms/multi-step-form-wrapper.tsx`
- [ ] `apps/ui/components/organisms/shared-steps/contact-info-step.tsx`
- [ ] `apps/ui/components/organisms/shared-steps/address-info-step.tsx`

> **Do NOT confuse** `components/organisms/shared-steps/contact-info-step.tsx` with
> `features/contact/components/organisms/contact-steps/contact-info-step.tsx`.
> These are two completely different files. The quotation form uses the shared one only.

---

### Bundle D — Molecule Components

- [ ] `apps/ui/components/molecules/form-step-container.tsx`
- [ ] `apps/ui/components/molecules/form-progress-indicator.tsx`
- [ ] `apps/ui/components/molecules/navbar.tsx`

> `form-navigation.tsx` also exists in molecules but is **not used** by the quotation flow — skip it.

---

### Bundle E — Atom Components

- [ ] `apps/ui/components/atoms/form-input.tsx`
- [ ] `apps/ui/components/atoms/form-textarea.tsx`
- [ ] `apps/ui/components/atoms/form-checkbox.tsx`
- [ ] `apps/ui/components/atoms/radio-group.tsx`
- [ ] `apps/ui/components/atoms/form-select.tsx`       ← needed by quotation, not contact
- [ ] `apps/ui/components/atoms/date-picker.tsx`       ← needed by quotation, not contact
- [ ] `apps/ui/components/atoms/theme-toggle.tsx`

---

### Bundle F — shadcn/ui Components

- [ ] `apps/ui/components/ui/button.tsx`

> Or run `npx shadcn@latest add button` if shadcn is configured.

---

### Bundle G — Providers

- [ ] `apps/ui/components/providers/theme-provider.tsx`

> Must also be wired into `app/layout.tsx` — see Step 10 in migration guide.

---

### Bundle H — Types

- [ ] `apps/ui/types/marketing.ts`               — `MarketingQuotationContent` type
- [ ] `apps/ui/lib/actions/action.types.ts`       — `ActionResult<T>` generic (used by server action)
- [ ] `apps/ui/lib/forms/types.ts`                — `FormStepConfig`, `AddressInfo`, `ContactInfo`, etc.

---

### Bundle I — Utilities & Constants

- [ ] `apps/ui/lib/utils.ts`                      — `cn()` Tailwind class merge helper
- [ ] `apps/ui/lib/constants.ts`                  — `FORM_CONSTANTS` (QUOTATION_FORM_MAX_STEP etc.)

---

### Bundle J — Data (JSON mock)

- [ ] `apps/ui/data/strapi-mock/marketing/quotation.json`

```json
{
  "header":          { "title": "...", "description": "..." },
  "trustIndicators": [{ "value": "...", "label": "..." }],
  "faq":             { "title": "...", "items": [{ "question": "...", "answer": "..." }] }
}
```

---

### Bundle K — Security & Sanitization

- [ ] `apps/ui/lib/sanitize/input-sanitizer.ts`
- [ ] `apps/ui/lib/security/csrf.ts`
- [ ] `apps/ui/lib/security/rate-limiter.ts`

---

### Bundle L — Email Infrastructure

- [ ] `apps/ui/lib/email/config/email-config-builder.ts`
- [ ] `apps/ui/lib/email/services/delivery-log.ts`

> **Read the Strapi dependency warning** in the "How It All Wires Up" section below before copying `email-config-builder.ts`.

---

### Bundle M — Config Files (update in target project)

- [ ] `tsconfig.json` — confirm `"@/*": ["./*"]` path alias
- [ ] `next.config.mjs` — check for any custom config

---

## npm Packages to Install

```bash
pnpm add zod react-hook-form @hookform/resolvers zustand framer-motion lucide-react resend
```

| Package | Used by |
|---|---|
| `zod` | All step schemas + server-side validation |
| `react-hook-form` | All 7 step components |
| `@hookform/resolvers` | Connects Zod to react-hook-form in every step |
| `zustand` | `use-quotation-store.ts` — cross-step state + localStorage |
| `framer-motion` | `FormStepContainer` (step transitions), `FormProgressIndicator`, success message |
| `lucide-react` | Icons in every step, navbar, success message |
| `resend` | Email dispatch in `quotation-email-service.ts` |

Also needed (likely already in project):
```bash
pnpm add clsx tailwind-merge next-themes
```

---

## Environment Variables to Add

```
RESEND_API_KEY=
BUSINESS_EMAIL=
EMAIL_FROM=
EMAIL_QUOTATION_FROM=
```

| Variable | Used by | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `quotation-email-service.ts` | Authenticates with Resend API |
| `BUSINESS_EMAIL` | `email-config-builder.ts` | Recipient for business notification email (`config.company.email.support`) |
| `EMAIL_FROM` | `email-config-builder.ts` | Default from address fallback |
| `EMAIL_QUOTATION_FROM` | `email-config-builder.ts` | From address for quotation emails (`config.email.quotationFromEmail`) |

> No `CSRF_SECRET` needed — CSRF uses origin-header matching and HttpOnly cookies only.
> Never commit `.env.local`. Confirm it is in `.gitignore`.

---

## How It All Wires Up

> This section is written for an AI or developer reading cold. Every handoff point, state model, and runtime flow is explained precisely.

---

### 1. The Page (`app/quotation/page.tsx`)

The page is a **React Server Component** — no `"use client"` directive. It runs only on the server.

Three content sections are data-driven from a single JSON file:

```
data/strapi-mock/marketing/quotation.json
  └── header          → h1 title + description paragraph
  └── trustIndicators → array of { value, label } stat cards
  └── faq             → { title, items[{ question, answer }] }
```

The JSON is imported directly and cast to `MarketingQuotationContent` (from `types/marketing.ts`). There are **no icons in the quotation page's static sections** — unlike the contact page, no `iconMap` lookup is needed. The page itself has zero form state; it only mounts `<QuotationFormContainer />`.

---

### 2. State Model (`use-quotation-store.ts`)

`QuotationFormContainer` is `"use client"`. All cross-step state lives in a **Zustand store** with `localStorage` persistence.

```
localStorage key: "quotation-form-storage"

Persisted slices:
  contact       → step 0 data
  projectType   → step 1 data
  scope         → step 2 data
  site          → step 3 data
  budget        → step 4 data
  additional    → step 5 data
  currentStep   → 0–6 (0-indexed)

NOT persisted:
  isSubmitting  → server action in-flight flag
  isComplete    → (set after success, but not persisted — success shown via local useState)
```

> **Key difference from contact store:** Success state is NOT in the Zustand store. Instead, `QuotationFormContainer` has local `useState<{ requestId: string } | null>` for `successData`. On success, `resetForm()` is called immediately (clearing the store), and `successData` is set (showing the success message). On "Submit Another Request", `setSuccessData(null)` hides it.

The store exposes:
- `nextStep()` / `previousStep()` / `goToStep(n)` — all clamped by `FORM_CONSTANTS.QUOTATION_FORM_MIN_STEP` (0) / `MAX_STEP` (6)
- `updateContact()` / `updateProjectType()` / ... / `updateAdditional()` — each step writes its slice on "Next"
- `getCompleteFormData()` — assembles all six slices for server action call

---

### 3. The Multi-Step Form Container & Wrapper

`QuotationFormContainer` does **not** render its own progress indicator. Instead it uses two shared components layered together:

```
<MultiStepFormWrapper
  title="Request a Quotation"
  steps={QUOTATION_STEPS}          // 7 FormStepConfig objects
  currentStep={currentStep}        // from store
  onStepClick={(i) => goToStep(i)} // only allowed if i <= currentStep
>
  <AnimatePresence>
    {renderStep()}                 // switch (currentStep) returning the right step
  </AnimatePresence>
</MultiStepFormWrapper>
```

`MultiStepFormWrapper` renders:
- Form title + description (static text, passed as props)
- `<FormProgressIndicator>` — the animated numbered circles + progress bar
- A `bg-card` card containing the step via `<AnimatePresence>`

`FormProgressIndicator` renders:
- A horizontal progress bar (fills % based on `(currentStep + 1) / steps.length`)
- Numbered circles — completed = tick, current = highlighted ring, future = muted
- Step title labels (hidden on mobile, shown `md:` and above)

---

### 4. Step Rendering — Switch Pattern

Unlike the contact form (which uses `currentStep === 1 && <ContactInfoStep>` conditionals), the quotation container uses a `switch (currentStep)` inside `renderStep()`. Each case passes the store slice as `defaultValues` and an `onSubmit` callback that updates the store and calls `nextStep()`.

The **back navigation** is handled per-step via `onPrevious={previousStep}` passed down. The `FormStepContainer` molecule renders the Back/Continue buttons using this prop.

Step 3 (site address) uses the shared `<AddressInfoStep>` with only the address fields extracted from `site` — the `siteAccessNotes` and boolean fields from `quotationSiteSchema` are stored via `updateSite()` but the shared `AddressInfoStep` only collects address fields. Note this means `siteAccessNotes`, `hasExistingElectrical`, and `requiresAsbestosSurvey` are **not collected via the shared step** — they are in the schema but the shared address step doesn't expose them. If you need those fields, you will need to add them to the AddressInfoStep or add a separate step.

---

### 5. Validation — Per-Step Zod with react-hook-form

Every step (including the two shared steps) uses the same pattern:

```ts
const { register, control, handleSubmit, watch, formState: { errors, isValid } } =
  useForm<StepType>({
    resolver: zodResolver(stepSchema),
    defaultValues,           // pre-filled from Zustand store slice
    mode: "onChange",        // validate on every keystroke
  })
```

The "Continue" button in `FormStepContainer` is `disabled={!isValid}` — it stays disabled until every required field in the step passes its Zod schema. The user cannot advance without the step being valid.

Per-step schemas and key rules:

| Step | Schema | Unusual rules |
|---|---|---|
| 0 | `quotationContactSchema` | UK phone regex; company optional |
| 1 | `quotationProjectTypeSchema` | All three fields are enums with `required_error`; projectType/propertyType options change dynamically based on `watch("projectCategory")` |
| 2 | `quotationScopeSchema` | `services` array must have `min(1)` item; multi-select toggled via `setValue("services", updated, { shouldValidate: true })` |
| 3 | `addressInfoSchema` (shared) | UK postcode regex `/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i` |
| 4 | `quotationBudgetSchema` | `preferredStartDate` optional; `flexibleOnTimeline` defaults to `true` |
| 5 | `quotationAdditionalSchema` | `termsAccepted` uses `.refine(val => val === true)` — Zod will reject `false`; compliance is multi-select toggled same as services |
| 6 | none | Read-only review; submits via `FormStepContainer`'s `onNext` prop wired to `handleSubmit` |

---

### 6. Form Submission Flow (`quotation-request.ts`)

Step 6 (Review) passes `onSubmit={handleSubmit}` where `handleSubmit` in the container calls `submitQuotationRequest(formData)` — a **Server Action** (`"use server"`).

```
1. CSRF check       securityCheck({ validateOriginHeader: true })
                    Origin header must match Host header.

2. Rate limit       rateLimiters.quotationRequest.check(clientId)
                    Limit: 3 requests per 5 minutes per IP.
                    clientId = x-forwarded-for → x-real-ip → "unknown"
                    ⚠️ In-memory — resets on server restart/Vercel cold start.

3. Honeypot         if formData.website field populated → return fake QR-...-BLOCKED

4. Sanitize         sanitizeQuotationFormData(formData) — private function in the action file
                    Handles all 6 slices explicitly:
                    .text()    on: fullName, company, projectDescription, city, county,
                               siteAccessNotes, specialRequirements, addressLine1, addressLine2
                    .email()   on: email
                    .phone()   on: phone
                    .address() on: addressLine1, addressLine2
                    .postcode() on: postcode
                    Enum fields and booleans are passed through without sanitization.

5. Server Zod       completeQuotationSchema.safeParse(sanitizedData)
                    Validates the entire form at once (all 6 slices combined).
                    Note: no .transform() on this schema — transforms are done by sanitizer above.
                    Returns fieldErrors map if fails.

6. Reference ID     QR-{base36(Date.now()).toUpperCase()}-{crypto.randomUUID().split("-")[0].toUpperCase()}
                    e.g. QR-LR5J4K-A9F2D8

7. Email dispatch   sendQuotationRequestEmails({ formData, requestId })
                    Returns { customerEmail, businessEmail } — both results logged,
                    but the action always returns success: true after this point
                    (email failure is NOT bubbled back as a submission error).

8. Return           { success: true, data: { requestId } }
                    or { success: false, error, fieldErrors? }
```

On success, `setSuccessData({ requestId: result.data.requestId })` shows the success screen. `resetForm()` clears the Zustand store and localStorage.

---

### 7. Email Dispatch (`quotation-email-service.ts`)

Two emails are sent in sequence (both awaited):

```
Email 1 — Customer confirmation
  from:    config.email.quotationFromEmail  (env: EMAIL_QUOTATION_FROM)
  to:      formData.contact.email
  subject: "Quotation Request Received - QR-xxxx"
  html:    generateQuotationCustomerEmail({ contact, projectCategory, projectType, budget, timeline, config })

Email 2 — Business notification
  from:    config.email.quotationFromEmail
  to:      config.company.email.support     (env: BUSINESS_EMAIL)
  subject: "New Quotation Request - QR-xxxx"
          OR "URGENT QUOTATION REQUEST - QR-xxxx"  ← if formData.budget.timeline === "urgent"
  html:    generateQuotationBusinessEmail({ requestId, submittedAt, formData, config })
```

**Unlike the contact email service**, both emails failing does NOT cause the server action to return `success: false`. The action always returns success after the email calls — email failures are logged via `logDelivery()` but silently absorbed.

---

### 8. `email-config-builder.ts` — Strapi Dependency Warning

`buildEmailConfig()` does NOT read env vars directly. It calls:

```ts
const [company, emailSettings] = await Promise.all([
  getCompanySettings(),   // lib/strapi/global/company-settings/
  getEmailSettings(),     // lib/strapi/global/email-settings/
])
```

**For a lift-and-shift without Strapi:** Replace the `buildEmailConfig()` body in your copy with a simple env-var version:

```ts
export async function buildEmailConfig(): Promise<ResolvedEmailConfig> {
  return {
    company: {
      name: process.env.COMPANY_NAME ?? "Your Company",
      tagline: "Professional & Reliable",
      legalName: process.env.COMPANY_LEGAL_NAME ?? "Your Company Ltd",
      address: process.env.COMPANY_ADDRESS ?? "",
      phone: process.env.COMPANY_PHONE ?? "",
      email: {
        support: process.env.BUSINESS_EMAIL ?? "",
        noreply: process.env.EMAIL_FROM ?? "",
      },
      website: process.env.COMPANY_WEBSITE ?? "",
      logoUrl: null,
      copyrightYear: new Date().getFullYear().toString(),
    },
    brand: {
      primary: "#3b82f6",
      primaryLight: "#60a5fa",
      primaryDark: "#2563eb",
      headerGradientStart: "#1e3a5f",
      headerGradientEnd: "#152d4a",
    },
    email: {
      fromEmail: process.env.EMAIL_FROM ?? "",
      contactFromEmail: process.env.EMAIL_FROM ?? "",
      quotationFromEmail: process.env.EMAIL_QUOTATION_FROM ?? process.env.EMAIL_FROM ?? "",
      replyToEmail: process.env.BUSINESS_EMAIL ?? "",
      slaResponseHours: 24,
      slaUrgentHours: 4,
      footerDisclaimer: null,
      emailSignatureTemplate: null,
    },
    sla: { /* copy defaults from original file */ } as ResolvedSla,
    urgency: { /* copy defaults from original file */ } as Record<UrgencyLevel, UrgencyColorSet>,
  }
}
```

Add to `.env.local`:
```
COMPANY_NAME=
COMPANY_LEGAL_NAME=
COMPANY_ADDRESS=
COMPANY_PHONE=
COMPANY_WEBSITE=
```

---

### 9. What Stays Server-Side vs Client-Side

| File | Directive | Reason |
|---|---|---|
| `app/quotation/page.tsx` | RSC (none) | Static hero/trust/FAQ sections, no interactivity |
| `quotation-form-container.tsx` | `"use client"` | Reads Zustand store, owns submit logic |
| `multi-step-form-wrapper.tsx` | `"use client"` | Renders progress + AnimatePresence |
| `form-progress-indicator.tsx` | `"use client"` | framer-motion animations |
| `form-step-container.tsx` | `"use client"` | framer-motion step transition |
| `shared-steps/contact-info-step.tsx` | `"use client"` | react-hook-form requires browser |
| `shared-steps/address-info-step.tsx` | `"use client"` | react-hook-form requires browser |
| All 5 quotation-specific step components | `"use client"` | react-hook-form + Controller |
| `quotation-success-message.tsx` | `"use client"` | framer-motion |
| `quotation-request.ts` | `"use server"` | Security, sanitization, Zod, email |
| `quotation-email-service.ts` | `"use server"` | Resend API key server-side only |
| `navbar.tsx` | `"use client"` | usePathname() for active link |

---

## Step-by-Step Migration Guide

> Follow this order exactly. Work through each numbered bundle completely before moving to the next. Every bundle has zero missing dependencies from the bundles before it.

---

### BUNDLE 1 — Install Packages

Nothing else compiles until these are installed.

```bash
pnpm add zod react-hook-form @hookform/resolvers zustand framer-motion lucide-react resend
pnpm add clsx tailwind-merge next-themes
```

Verify installs in `package.json` before proceeding.

---

### BUNDLE 2 — Configure Path Alias

Open `tsconfig.json` in the target project. Confirm this exists under `compilerOptions`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If your app lives inside `src/`, use `"@/*": ["./src/*"]` and mirror all copied paths into `src/`.

Run a quick type check after this step: `npx tsc --noEmit` (will fail on missing files, but should not fail on alias resolution).

---

### BUNDLE 3 — Copy Shared Types & Constants

These are imported by almost everything. Copy all four files before any component.

```
apps/ui/types/marketing.ts              → types/marketing.ts
apps/ui/lib/actions/action.types.ts     → lib/actions/action.types.ts
apps/ui/lib/forms/types.ts              → lib/forms/types.ts
apps/ui/lib/utils.ts                    → lib/utils.ts
apps/ui/lib/constants.ts                → lib/constants.ts
```

`lib/forms/types.ts` provides `FormStepConfig` — used by `MultiStepFormWrapper`, `FormProgressIndicator`, and the store. Copy it before anything else in the form chain.

After copying, run `npx tsc --noEmit` and confirm no errors in these 5 files.

---

### BUNDLE 4 — Copy Data File

The page imports this at the top level. Without it the page import will fail.

```
apps/ui/data/strapi-mock/marketing/quotation.json    → data/strapi-mock/marketing/quotation.json
```

Create the folder structure if needed. You can edit the JSON content to match your business — the structure must remain the same (header, trustIndicators, faq).

---

### BUNDLE 5 — Copy Security & Sanitization

The server action depends on all three. Copy as a group.

```
apps/ui/lib/sanitize/input-sanitizer.ts     → lib/sanitize/input-sanitizer.ts
apps/ui/lib/security/csrf.ts                → lib/security/csrf.ts
apps/ui/lib/security/rate-limiter.ts        → lib/security/rate-limiter.ts
```

Note: `rate-limiter.ts` uses in-memory storage. On Vercel serverless, each cold start resets the counter. For production-grade rate limiting, integrate Upstash Redis after the migration is working.

---

### BUNDLE 6 — Copy Email Infrastructure

`email-config-builder.ts` has a Strapi dependency. Decide now which option you're taking (see §8 above), then copy the files.

```
apps/ui/lib/email/config/email-config-builder.ts    → lib/email/config/email-config-builder.ts
apps/ui/lib/email/services/delivery-log.ts          → lib/email/services/delivery-log.ts
```

If replacing `buildEmailConfig()` with the env-var version, do that edit now before any file imports it.

---

### BUNDLE 7 — Copy & Wire ThemeProvider

```
apps/ui/components/providers/theme-provider.tsx    → components/providers/theme-provider.tsx
```

Then open `app/layout.tsx` and wrap children:

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Without this the Navbar's ThemeToggle will throw at runtime.

---

### BUNDLE 8 — Copy shadcn/ui Button

Used by `FormStepContainer`, `QuotationReviewStep`, and `QuotationSuccessMessage`.

**Option A — copy file:**
```
apps/ui/components/ui/button.tsx    → components/ui/button.tsx
```

**Option B — install via shadcn CLI:**
```bash
npx shadcn@latest add button
```

---

### BUNDLE 9 — Copy All Atom Components

Copy all 7 atoms. The quotation form requires two atoms not needed by the contact form (`form-select` and `date-picker`).

```
apps/ui/components/atoms/form-input.tsx       → components/atoms/form-input.tsx
apps/ui/components/atoms/form-textarea.tsx    → components/atoms/form-textarea.tsx
apps/ui/components/atoms/form-checkbox.tsx    → components/atoms/form-checkbox.tsx
apps/ui/components/atoms/radio-group.tsx      → components/atoms/radio-group.tsx
apps/ui/components/atoms/form-select.tsx      → components/atoms/form-select.tsx     ← NEW
apps/ui/components/atoms/date-picker.tsx      → components/atoms/date-picker.tsx     ← NEW
apps/ui/components/atoms/theme-toggle.tsx     → components/atoms/theme-toggle.tsx
```

Run `npx tsc --noEmit` after this bundle. All atoms should resolve cleanly — they depend only on `lib/utils.ts`, `lucide-react`, and shadcn `Button` (already in place).

---

### BUNDLE 10 — Copy Molecule Components

These depend on atoms and `lib/forms/types.ts` — all now in place.

```
apps/ui/components/molecules/form-step-container.tsx       → components/molecules/form-step-container.tsx
apps/ui/components/molecules/form-progress-indicator.tsx   → components/molecules/form-progress-indicator.tsx
apps/ui/components/molecules/navbar.tsx                    → components/molecules/navbar.tsx
```

> Do NOT copy `form-navigation.tsx` — it is not used by the quotation flow.

`form-step-container.tsx` is the **core building block** used by every step. It owns the Back/Continue buttons, framer-motion entrance animation, and submission spinner. Verify it compiles before proceeding.

---

### BUNDLE 11 — Copy Shared Organism Steps

These are the reusable step components that multiple forms share. The quotation container imports them from `@/components/organisms/shared-steps/`.

```
apps/ui/components/organisms/multi-step-form-wrapper.tsx           → components/organisms/multi-step-form-wrapper.tsx
apps/ui/components/organisms/shared-steps/contact-info-step.tsx    → components/organisms/shared-steps/contact-info-step.tsx
apps/ui/components/organisms/shared-steps/address-info-step.tsx    → components/organisms/shared-steps/address-info-step.tsx
```

**Verify these are the shared versions** — check the file header. The shared `ContactInfoStep` says "A reusable contact information step used by multiple forms". The contact-feature version says "ORGANISM: ContactInfoStep (Step 1 of 5)". They are completely different files.

After copying, run `npx tsc --noEmit` — these three files should compile cleanly.

---

### BUNDLE 12 — Copy Feature Schemas

This is the foundation of the quotation form. Everything else in the feature imports from here.

```
apps/ui/features/quotation/schemas/quotation-schemas.ts    → features/quotation/schemas/quotation-schemas.ts
```

The schema file contains 6 step schemas + combined `completeQuotationSchema` + all type exports. No changes needed — copy as-is.

After copying: `npx tsc --noEmit` — confirm the 6 exported schemas and their types resolve.

---

### BUNDLE 13 — Copy Zustand Store

Depends on `quotation-schemas.ts` and `lib/constants.ts` — both now in place.

```
apps/ui/features/quotation/hooks/use-quotation-store.ts    → features/quotation/hooks/use-quotation-store.ts
```

Confirm the `FORM_CONSTANTS.QUOTATION_FORM_MIN_STEP` and `QUOTATION_FORM_MAX_STEP` values (0 and 6) resolve from `lib/constants.ts`.

---

### BUNDLE 14 — Copy Email Templates

Pure render functions with no complex imports. Copy before the email service that calls them.

```
apps/ui/features/quotation/api/templates/quotation-customer-html.tsx    → features/quotation/api/templates/quotation-customer-html.tsx
apps/ui/features/quotation/api/templates/quotation-business-html.tsx    → features/quotation/api/templates/quotation-business-html.tsx
```

These accept `ResolvedEmailConfig` from `email-config-builder.ts` — already copied. If you replaced `buildEmailConfig()` with the env-var version, verify the config shape matches what the templates expect.

---

### BUNDLE 15 — Copy Email Service & Server Action

Both are `"use server"` files. Depends on templates, delivery-log, email-config-builder, schemas, csrf, rate-limiter, sanitizer — all in place.

```
apps/ui/features/quotation/api/quotation-email-service.ts    → features/quotation/api/quotation-email-service.ts
apps/ui/features/quotation/api/quotation-request.ts          → features/quotation/api/quotation-request.ts
```

Run `npx tsc --noEmit` after this bundle — server action and email service are the most import-heavy files. Fix any path issues here before moving to UI.

---

### BUNDLE 16 — Copy Quotation-Specific Step Components

All 5 depend on the schemas (Bundle 12), atoms (Bundle 9), molecules (Bundle 10), and `lib/utils.ts` (Bundle 3).

```
apps/ui/features/quotation/components/organisms/quotation-steps/project-type-step.tsx       → features/quotation/components/organisms/quotation-steps/project-type-step.tsx
apps/ui/features/quotation/components/organisms/quotation-steps/project-scope-step.tsx      → features/quotation/components/organisms/quotation-steps/project-scope-step.tsx
apps/ui/features/quotation/components/organisms/quotation-steps/budget-timeline-step.tsx    → features/quotation/components/organisms/quotation-steps/budget-timeline-step.tsx
apps/ui/features/quotation/components/organisms/quotation-steps/additional-requirements-step.tsx → features/quotation/components/organisms/quotation-steps/additional-requirements-step.tsx
apps/ui/features/quotation/components/organisms/quotation-steps/quotation-review-step.tsx   → features/quotation/components/organisms/quotation-steps/quotation-review-step.tsx
```

Run `npx tsc --noEmit` after this bundle to surface any remaining import issues before wiring the container.

---

### BUNDLE 17 — Copy Success Message & Form Container

`QuotationSuccessMessage` depends on `lucide-react`, `framer-motion`, `Button`, `next/link` — all in place.

`QuotationFormContainer` depends on everything above.

```
apps/ui/features/quotation/components/molecules/quotation-success-message.tsx              → features/quotation/components/molecules/quotation-success-message.tsx
apps/ui/features/quotation/components/organisms/quotation-form-container.tsx               → features/quotation/components/organisms/quotation-form-container.tsx
```

---

### BUNDLE 18 — Copy Feature Barrel

```
apps/ui/features/quotation/index.ts    → features/quotation/index.ts
```

The barrel re-exports everything the page imports from `@/features/quotation`. Copy last so all exports exist before the barrel file is evaluated.

---

### BUNDLE 19 — Copy the Page

All dependencies are now in place.

```
apps/ui/app/quotation/page.tsx    → app/quotation/page.tsx
```

---

### BUNDLE 20 — Set Environment Variables

Create or update `.env.local`:

```
RESEND_API_KEY=
BUSINESS_EMAIL=
EMAIL_FROM=
EMAIL_QUOTATION_FROM=
COMPANY_NAME=
COMPANY_LEGAL_NAME=
COMPANY_ADDRESS=
COMPANY_PHONE=
COMPANY_WEBSITE=
```

> Last four only needed if you replaced `buildEmailConfig()` with the env-var version.

---

### BUNDLE 21 — Full Type Check

```bash
npx tsc --noEmit
```

Expected result: zero errors. Common issues to fix:
- `@/` alias not resolving — check `tsconfig.json` paths
- A file referencing `@/lib/strapi/...` — that's the Strapi layer; trace the import and either copy that file or replace the dependency with an env-var alternative
- Missing `ResolvedSla` or `UrgencyLevel` types — these come from `email-config-builder.ts` itself; if you replaced the function body ensure the types are still exported

---

### BUNDLE 22 — Build Check

```bash
pnpm build
```

The build validates all pages including quotation. Expected result: build completes with quotation page included, zero TypeScript errors, zero Zod validation errors.

---

### BUNDLE 23 — Start Dev Server & Test

```bash
pnpm dev
```

Navigate to `http://localhost:3000/quotation` and verify:

**Page structure:**
- [ ] Navbar renders with logo, nav links, and theme toggle
- [ ] Header section shows title and description from `quotation.json`
- [ ] Form section renders (not blank, no console errors)
- [ ] Trust indicators show 3 stat cards from `quotation.json`
- [ ] FAQ section shows questions and answers from `quotation.json`
- [ ] Dark/light mode toggle works

**Form navigation:**
- [ ] Step 0 (Contact Info) renders with 4 fields
- [ ] Continue button is disabled until all required fields are valid
- [ ] Inline error messages appear on invalid input (name too short, bad email, bad UK phone)
- [ ] Clicking Continue advances to Step 1 (Project Type)
- [ ] Progress bar and step indicators update correctly
- [ ] Back button returns to previous step with data pre-filled
- [ ] Completed step numbers show a tick mark
- [ ] Clicking a completed step circle navigates back to it

**Step-specific behaviour:**
- [ ] Step 1: Selecting a project category dynamically shows correct project type and property type options
- [ ] Step 2: Service toggle buttons correctly select/deselect; "Continue" disabled until at least 1 service selected
- [ ] Step 3: UK postcode validation rejects invalid format
- [ ] Step 4: Date picker appears for preferred start date; timeline radio groups work
- [ ] Step 5: Terms checkbox required — Continue disabled until checked
- [ ] Step 6: Review shows all entered data with "Edit" links; Submit button enabled

**Zustand persistence:**
- [ ] Close browser mid-form and reopen — form data and current step restored from localStorage
- [ ] Complete submission and click "Submit Another Request" — store cleared, form resets to Step 0

**Submission & email:**
- [ ] Submitting triggers loading spinner on Submit button
- [ ] Success screen appears with `QR-` reference ID after submit
- [ ] Customer receives confirmation email from `EMAIL_QUOTATION_FROM`
- [ ] Business receives notification email at `BUSINESS_EMAIL`
- [ ] If `budget.timeline === "urgent"`, business email subject starts with "URGENT QUOTATION REQUEST"
- [ ] Submission error banner appears below the form (not inside card) if server action returns `success: false`
