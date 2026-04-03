# Contact Page — Lift & Shift Checklist

> Copy every file listed below into your target Next.js project. Work top-to-bottom; each section depends on the one before it.

---

## Visual Overview

```
app/contact/page.tsx
│
├── <Navbar />
│   └── components/molecules/navbar.tsx
│       └── components/atoms/theme-toggle.tsx
│           └── components/providers/theme-provider.tsx
│
├── <ContactFormContainer />          ← features/contact (multi-step form)
│   │
│   ├── [State]  features/contact/hooks/use-contact-store.ts  (zustand)
│   ├── [Schema] features/contact/schemas/contact-schemas.ts  (zod)
│   │
│   ├── Step 1 — InquiryTypeStep
│   ├── Step 2 — ContactInfoStep
│   ├── Step 3 — ReferenceLinkingStep
│   ├── Step 4 — MessageDetailsStep
│   ├── Step 5 — ContactReviewStep
│   └── Success — ContactSuccessMessage
│       │
│       └── [Submit Action]  features/contact/api/contact-request.ts
│           ├── lib/sanitize/input-sanitizer.ts
│           ├── lib/security/csrf.ts
│           ├── lib/security/rate-limiter.ts
│           └── features/contact/api/contact-email-service.ts
│               ├── lib/email/config/email-config-builder.ts
│               ├── lib/email/services/delivery-log.ts
│               ├── api/templates/contact-customer-html.tsx
│               └── api/templates/contact-business-html.tsx
│
├── <QuickContactCard />
│   └── components/molecules/quick-contact-card.tsx
│
├── <OfficeHoursCard />
│   └── components/molecules/office-hours-card.tsx
│
└── <LocationMapCard />
    └── components/molecules/location-map-card.tsx

Shared atoms used across all steps:
  components/atoms/form-input.tsx
  components/atoms/form-textarea.tsx
  components/atoms/form-checkbox.tsx
  components/atoms/radio-group.tsx
  components/ui/button.tsx          (shadcn/ui)
  lib/utils.ts                      (cn() helper)
```

---

## Page Layout Diagram

```
┌─────────────────────────────────────────────────┐
│                    <Navbar />                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  HERO SECTION                                   │
│  ┌─────────────────────────────────────────┐   │
│  │  Badge icon + text                      │   │
│  │  h1 title                               │   │
│  │  description paragraph                  │   │
│  │                                         │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │   │
│  │  │Trust │ │Trust │ │Trust │ │Trust │  │   │
│  │  │  #1  │ │  #2  │ │  #3  │ │  #4  │  │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘  │   │
│  └─────────────────────────────────────────┘   │
│       (data driven from contact.json)           │
│                                                 │
├────────────────────────┬────────────────────────┤
│                        │                        │
│  <ContactFormContainer>│  <QuickContactCard />  │
│                        │                        │
│  ┌──────────────────┐  │  <OfficeHoursCard />   │
│  │ Step indicator   │  │                        │
│  │ ───────────────  │  │  <LocationMapCard />   │
│  │                  │  │                        │
│  │  [Step content]  │  │                        │
│  │                  │  │                        │
│  │  [Back] [Next]   │  │                        │
│  └──────────────────┘  │                        │
│   (2/3 width)          │  (1/3 width sidebar)   │
│                        │                        │
├────────────────────────┴────────────────────────┤
│                                                 │
│  FAQ TEASER SECTION                             │
│  ┌─────────────────────────────────────────┐   │
│  │  h2 title + description                 │   │
│  │  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │ FAQ item #1  │  │ FAQ item #2  │    │   │
│  │  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │ FAQ item #3  │  │ FAQ item #4  │    │   │
│  │  └──────────────┘  └──────────────┘    │   │
│  └─────────────────────────────────────────┘   │
│       (data driven from contact.json)           │
└─────────────────────────────────────────────────┘
```

---

## Checklist — Files to Copy

### 1. Page

- [ ] `apps/ui/app/contact/page.tsx`

---

### 2. Feature — Contact Form (copy entire folder)

- [ ] `apps/ui/features/contact/index.ts`
- [ ] `apps/ui/features/contact/schemas/contact-schemas.ts`
- [ ] `apps/ui/features/contact/hooks/use-contact-store.ts`
- [ ] `apps/ui/features/contact/components/organisms/contact-form-container.tsx`
- [ ] `apps/ui/features/contact/components/organisms/contact-steps/contact-info-step.tsx`
- [ ] `apps/ui/features/contact/components/organisms/contact-steps/inquiry-type-step.tsx`
- [ ] `apps/ui/features/contact/components/organisms/contact-steps/reference-linking-step.tsx`
- [ ] `apps/ui/features/contact/components/organisms/contact-steps/message-details-step.tsx`
- [ ] `apps/ui/features/contact/components/organisms/contact-steps/contact-review-step.tsx`
- [ ] `apps/ui/features/contact/components/molecules/contact-success-message.tsx`
- [ ] `apps/ui/features/contact/api/contact-request.ts`
- [ ] `apps/ui/features/contact/api/contact-email-service.ts`
- [ ] `apps/ui/features/contact/api/templates/contact-customer-html.tsx`
- [ ] `apps/ui/features/contact/api/templates/contact-business-html.tsx`

---

### 3. Molecule Components

- [ ] `apps/ui/components/molecules/navbar.tsx`
- [ ] `apps/ui/components/molecules/office-hours-card.tsx`
- [ ] `apps/ui/components/molecules/location-map-card.tsx`
- [ ] `apps/ui/components/molecules/quick-contact-card.tsx`

---

### 4. Atom Components

- [ ] `apps/ui/components/atoms/form-input.tsx`
- [ ] `apps/ui/components/atoms/form-textarea.tsx`
- [ ] `apps/ui/components/atoms/form-checkbox.tsx`
- [ ] `apps/ui/components/atoms/radio-group.tsx`
- [ ] `apps/ui/components/atoms/theme-toggle.tsx`

---

### 5. shadcn/ui Components

- [ ] `apps/ui/components/ui/button.tsx`

> If your target project already has shadcn/ui installed, run `npx shadcn@latest add button` instead of copying the file.

---

### 6. Providers

- [ ] `apps/ui/components/providers/theme-provider.tsx`

> Wire this into your root `layout.tsx` — wrap children with `<ThemeProvider>`.

---

### 7. Types

- [ ] `apps/ui/types/marketing.ts`
- [ ] `apps/ui/lib/actions/action.types.ts`

---

### 8. Data (JSON mock)

- [ ] `apps/ui/data/strapi-mock/marketing/contact.json`

> This drives the hero text, trust indicators, and FAQ teaser section.

---

### 9. Utilities & Helpers

- [ ] `apps/ui/lib/utils.ts` — `cn()` helper (Tailwind class merge)
- [ ] `apps/ui/lib/constants.ts` — form constants

---

### 10. Security & Sanitization

- [ ] `apps/ui/lib/sanitize/input-sanitizer.ts`
- [ ] `apps/ui/lib/security/csrf.ts`
- [ ] `apps/ui/lib/security/rate-limiter.ts`

---

### 11. Email Infrastructure

- [ ] `apps/ui/lib/email/config/email-config-builder.ts`
- [ ] `apps/ui/lib/email/services/delivery-log.ts`

---

### 12. Config — Update in Target Project

- [ ] `tsconfig.json` — ensure `@/` alias points to your app root (`"@/*": ["./*"]`)
- [ ] `next.config.mjs` — check for any custom config carried over

---

## Packages to Install

Run in your target project:

```bash
pnpm add zod react-hook-form @hookform/resolvers zustand framer-motion lucide-react resend
```

| Package               | Used for                                    |
| --------------------- | ------------------------------------------- |
| `zod`                 | Form validation schemas                     |
| `react-hook-form`     | Multi-step form state                       |
| `@hookform/resolvers` | Connects Zod to react-hook-form             |
| `zustand`             | Cross-step form state (persisted)           |
| `framer-motion`       | Step transition animations                  |
| `lucide-react`        | Icons (Mail, MessageSquare, Shield, Clock…) |
| `resend`              | Email delivery (server action)              |

> `next`, `react`, `tailwindcss`, and `shadcn/ui` are assumed to already be in your target project.

---

## Environment Variables to Add

Add these to your `.env.local` in the target project:

```
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
CSRF_SECRET=
```

> Copy the **names** only — fill in your own values.

---

## Post-Copy Checklist

- [ ] `@/` alias resolves correctly in `tsconfig.json`
- [ ] `<ThemeProvider>` wraps app in root `layout.tsx`
- [ ] All env vars set in `.env.local`
- [ ] `pnpm build` passes with zero TypeScript errors
- [ ] Form submits and email arrives in inbox
- [ ] Dark/light mode toggle works via `<ThemeProvider>`

---

## How It All Wires Up

> This section is written for an AI or developer reading the codebase cold. It explains the runtime flow, state model, and every handoff point so nothing is a mystery.

---

### 1. The Page (`app/contact/page.tsx`)

The page is a **React Server Component** (RSC) — it runs only on the server, has no `"use client"` directive, and renders static markup for the hero, trust indicators, and FAQ teaser sections.

All three of those content blocks are **data-driven from a single JSON file**:

```
data/strapi-mock/marketing/contact.json
  └── hero         → badge icon/text, h1, description paragraph
  └── trustIndicators → array of { icon, title, description }
  └── faqTeaser    → title, description, items[]{ question, answer }
```

The page imports the JSON directly (`import contactData from "@/data/strapi-mock/marketing/contact.json"`), casts it to `MarketingContactContent`, and destructures the three sections. The icon names in the JSON (e.g. `"Mail"`, `"Shield"`) are resolved at runtime via a local `iconMap` lookup — this is why `lucide-react` icons (Mail, MessageSquare, Shield, Clock) are imported at the top of the page.

The page itself does **not manage form state** — it simply mounts four client components into the layout.

---

### 2. The Multi-Step Form — State Model (`use-contact-store.ts`)

`ContactFormContainer` is a `"use client"` component. All cross-step form state lives in a **Zustand store** (`useContactStore`) backed by `localStorage` via the `persist` middleware.

```
localStorage key: "contact-form-storage"
Persisted slices: currentStep, contactInfo, inquiryType, referenceLinking, messageDetails
NOT persisted:    isSubmitting, isSubmitted, submissionError, contactReferenceId
```

This means **if the user closes the browser mid-way through the form, their progress is restored** on next visit. The store exposes:

- `currentStep` (1–5) — drives which step component renders
- `nextStep()` / `prevStep()` / `setCurrentStep(n)` — navigation (clamped by `FORM_CONSTANTS.CONTACT_FORM_MIN_STEP` / `MAX_STEP`)
- `updateContactInfo()` / `updateInquiryType()` / etc. — each step writes its slice on "Next"
- `getCompleteFormData()` — assembles all four slices into `CompleteContactFormInput` at submit time
- `setSubmitted(true, referenceId)` — triggers the success screen swap

---

### 3. The Multi-Step Form — Step Sequence

`ContactFormContainer` renders inside `<AnimatePresence mode="wait">` (framer-motion). Each step is swapped in/out with an animated transition keyed by step number.

```
Step 1 → ContactInfoStep       fullName, email, phone, company (optional)
Step 2 → InquiryTypeStep       inquiryType enum, sector enum, priority enum
Step 3 → ReferenceLinkingStep  hasExistingReference bool, referenceType, referenceId (SR-/QR- format)
Step 4 → MessageDetailsStep    subject, message, preferredContactMethod, bestTimeToContact, newsletterOptIn
Step 5 → ContactReviewStep     read-only summary of all steps + Submit button
```

Each step uses **`react-hook-form`** with a **Zod resolver** bound to the relevant per-step schema (`contactInfoSchema`, `inquiryTypeSchema`, etc.). On "Next", the step calls its store slice updater (`updateContactInfo(data)`) then advances via `nextStep()`. No data is held in local component state beyond what react-hook-form needs for the current step.

The progress indicator at the top is clickable for already-completed steps (`step.number <= currentStep`), letting users navigate back freely.

---

### 4. Validation — Two-Layer Zod

There are **two separate Zod schemas** and they serve different purposes:

| Schema                                      | Where used                | What it does                                                                 |
| ------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Per-step schemas (`contactInfoSchema` etc.) | Browser (react-hook-form) | Client-side field validation, instant error feedback                         |
| `serverContactFormSchema`                   | Server action             | Re-validates + `.transform()` trims/lowercases strings before email dispatch |

The per-step schemas are combined into `completeContactFormSchema` for typing. The server schema is a stricter re-definition that applies transforms (`.trim()`, `.toLowerCase()`). This means client validation provides UX feedback; server validation provides the guarantee.

---

### 5. Form Submission Flow (`contact-request.ts`)

The Review step calls `submitContactRequest(data)` — a Next.js **Server Action** (`"use server"`). The flow inside the action is:

```
1. CSRF check          securityCheck({ validateOriginHeader: true })
                       → rejects if Origin header doesn't match expected host

2. Rate limit          rateLimiters.contactForm.check(clientId)
                       → clientId = hashed IP from request headers
                       → returns { allowed: boolean }

3. Honeypot check      if data.website field is populated → silently return fake success
                       → invisible to bots, visible only in reference ID suffix "-BLOCKED"

4. Sanitize            sanitizeInput.text() / .email() / .phone() on every string field
                       → strips HTML, normalises whitespace

5. Server-side Zod     serverContactFormSchema.safeParse(sanitizedData)
                       → trims/lowercases via .transform(), returns fieldErrors map on failure

6. Generate ref ID     crypto.randomUUID() → "CR-{timestamp36}-{uuid6}"
                       → e.g. CR-LQZX4K-A3F8D2

7. Send emails         sendContactEmails({ ...validatedData, referenceId })
                       → two emails dispatched (see §6 below)

8. Return result       { success: true, referenceId } or { success: false, error, fieldErrors? }
```

On success, the Review step calls `store.setSubmitted(true, referenceId)`, which causes `ContactFormContainer` to swap the form out and render `<ContactSuccessMessage referenceId={referenceId} />`.

---

### 6. Email Dispatch (`contact-email-service.ts`)

On successful validation, **two emails are sent via Resend** in sequence:

```
Email 1 — Customer confirmation
  from:    config.email.contactFromEmail   (env: CONTACT_FROM_EMAIL)
  to:      customer's email address
  subject: "Contact Inquiry Received - CR-xxxx"
  html:    generateContactCustomerEmail({ customerName, referenceId, subject, inquiryType, config })

Email 2 — Business notification
  from:    config.email.contactFromEmail
  to:      config.company.email.support    (env: CONTACT_TO_EMAIL)
  subject: "New Contact Inquiry: {subject} [PRIORITY]"
  html:    generateContactBusinessEmail({ all form fields + config })
```

**Important:** If the business email fails, the action still returns `success: true`. The customer confirmation is the critical one. Both send results are logged via `logDelivery()` regardless of success/failure.

The `config` object is assembled by `buildEmailConfig()` from `lib/email/config/email-config-builder.ts` — this reads company name, support email, and contact-from address from environment variables.

---

### 7. The Sidebar Cards

The three sidebar cards are self-contained `"use client"` components with **no props and no external data dependencies**. Their content is hardcoded:

| Component          | What it renders                                     | Hardcoded data                   |
| ------------------ | --------------------------------------------------- | -------------------------------- |
| `QuickContactCard` | Phone, email, emergency contact links + trust stats | Phone number, email, href values |
| `OfficeHoursCard`  | Office hours table per day                          | Day/hours pairs                  |
| `LocationMapCard`  | Address block + map embed                           | Address string, map iframe src   |

> **When doing the lift-and-shift:** update the hardcoded values in these three files to match the new project's contact details. There is no data file driving them.

---

### 8. The Navbar (`navbar.tsx`)

The Navbar is a `"use client"` molecule. It uses `usePathname()` (Next.js) to highlight the active nav link. It renders the site logo, nav links, and the `<ThemeToggle />` button.

`ThemeToggle` calls `setTheme()` from `next-themes` via `ThemeProvider`. **`ThemeProvider` must be present in the root `layout.tsx`** for this to work — it is not self-contained.

---

### 9. The `contact.json` Data Shape

For reference, the expected shape of `data/strapi-mock/marketing/contact.json` (typed by `MarketingContactContent`):

```typescript
{
  hero: {
    badge: { icon: "Mail" | "MessageSquare" | "Shield" | "Clock", text: string }
    title: string
    description: string
  }
  trustIndicators: Array<{
    icon: "Mail" | "MessageSquare" | "Shield" | "Clock"
    title: string
    description: string
  }>
  faqTeaser: {
    title: string
    description: string
    items: Array<{ question: string, answer: string }>
  }
}
```

---

### 10. What Stays Server-Side vs Client-Side

| File                          | Directive      | Reason                                                  |
| ----------------------------- | -------------- | ------------------------------------------------------- |
| `app/contact/page.tsx`        | RSC (none)     | Static hero/FAQ, no interactivity needed                |
| `contact-form-container.tsx`  | `"use client"` | Reads Zustand store, drives step rendering              |
| All 5 step components         | `"use client"` | react-hook-form requires browser                        |
| `contact-success-message.tsx` | `"use client"` | Reads referenceId from store                            |
| `quick-contact-card.tsx`      | `"use client"` | Link interactions                                       |
| `office-hours-card.tsx`       | `"use client"` | (no server data needed)                                 |
| `location-map-card.tsx`       | `"use client"` | iframe embed                                            |
| `contact-request.ts`          | `"use server"` | Security checks, email dispatch — never runs in browser |
| `contact-email-service.ts`    | `"use server"` | Resend API key only safe server-side                    |

---

## Step-by-Step Migration Guide

> Follow this order exactly. Each step either has no dependencies yet, or only depends on steps already completed. Do NOT skip ahead — earlier steps define the types and utilities that later steps import.

---

### Step 1 — Install pnpm packages

Nothing else can compile until these are present.

```bash
pnpm add zod react-hook-form @hookform/resolvers zustand framer-motion lucide-react resend
```

---

### Step 2 — Configure `tsconfig.json` path alias

Open your target project's `tsconfig.json` and confirm the `@/` alias exists:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If your `app/` folder is inside `src/`, adjust the alias to `"@/*": ["./src/*"]` and mirror that in all copied file paths.

---

### Step 3 — Copy shared types

These are imported by nearly everything else. Copy first.

```
apps/ui/types/marketing.ts              → types/marketing.ts
apps/ui/lib/actions/action.types.ts     → lib/actions/action.types.ts
```

---

### Step 4 — Copy `lib/utils.ts`

The `cn()` helper is used by every UI component. Copy it before any component.

```
apps/ui/lib/utils.ts    → lib/utils.ts
```

Confirm it uses `clsx` + `tailwind-merge`. If not already installed:

```bash
pnpm add clsx tailwind-merge
```

---

### Step 5 — Copy `lib/constants.ts`

The Zustand store reads `FORM_CONSTANTS.CONTACT_FORM_MIN_STEP` and `CONTACT_FORM_MAX_STEP` from here.

```
apps/ui/lib/constants.ts    → lib/constants.ts
```

---

### Step 6 — Copy the data file

The page imports this at the top level. Without it the page won't compile.

```
apps/ui/data/strapi-mock/marketing/contact.json    → data/strapi-mock/marketing/contact.json
```

Create the folder structure if it doesn't exist.

---

### Step 7 — Copy security & sanitization utilities

The server action depends on all three of these. Copy them as a group.

```
apps/ui/lib/sanitize/input-sanitizer.ts     → lib/sanitize/input-sanitizer.ts
apps/ui/lib/security/csrf.ts                → lib/security/csrf.ts
apps/ui/lib/security/rate-limiter.ts        → lib/security/rate-limiter.ts
```

---

### Step 8 — Copy email infrastructure utilities

The email service depends on both. Copy before the email service.

```
apps/ui/lib/email/config/email-config-builder.ts    → lib/email/config/email-config-builder.ts
apps/ui/lib/email/services/delivery-log.ts          → lib/email/services/delivery-log.ts
```

---

### Step 9 — Copy the ThemeProvider

The Navbar's ThemeToggle imports from here. Copy before any component that touches theming.

```
apps/ui/components/providers/theme-provider.tsx    → components/providers/theme-provider.tsx
```

Install `next-themes` if not already present:

```bash
pnpm add next-themes
```

---

### Step 10 — Wire ThemeProvider into root layout

Open your target project's `app/layout.tsx` and wrap children:

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Without this, the ThemeToggle will throw at runtime.

---

### Step 11 — Copy shadcn/ui `Button`

Several step components and the form container use `<Button>`. Copy or install it.

**Option A — copy the file:**

```
apps/ui/components/ui/button.tsx    → components/ui/button.tsx
```

**Option B — install via shadcn CLI (recommended if you already have shadcn configured):**

```bash
npx shadcn@latest add button
```

---

### Step 12 — Copy atom components

These are the lowest-level form primitives. Copy all four before the step components.

```
apps/ui/components/atoms/form-input.tsx       → components/atoms/form-input.tsx
apps/ui/components/atoms/form-textarea.tsx    → components/atoms/form-textarea.tsx
apps/ui/components/atoms/form-checkbox.tsx    → components/atoms/form-checkbox.tsx
apps/ui/components/atoms/radio-group.tsx      → components/atoms/radio-group.tsx
apps/ui/components/atoms/theme-toggle.tsx     → components/atoms/theme-toggle.tsx
```

---

### Step 13 — Copy molecule sidebar cards + Navbar

These depend only on `lucide-react`, `next/link`, and `lib/utils.ts` — all already in place.

```
apps/ui/components/molecules/quick-contact-card.tsx    → components/molecules/quick-contact-card.tsx
apps/ui/components/molecules/office-hours-card.tsx     → components/molecules/office-hours-card.tsx
apps/ui/components/molecules/location-map-card.tsx     → components/molecules/location-map-card.tsx
apps/ui/components/molecules/navbar.tsx                → components/molecules/navbar.tsx
```

> At this point open each of the three sidebar cards and update any hardcoded contact details (phone number, email address, address, map embed URL) to match your new project.

---

### Step 14 — Copy the contact feature schemas

This is the foundation of the form. Everything else in the feature imports from here.

```
apps/ui/features/contact/schemas/contact-schemas.ts    → features/contact/schemas/contact-schemas.ts
```

---

### Step 15 — Copy the Zustand store

Depends on `contact-schemas.ts` and `lib/constants.ts` — both now in place.

```
apps/ui/features/contact/hooks/use-contact-store.ts    → features/contact/hooks/use-contact-store.ts
```

---

### Step 16 — Copy the email templates

These are pure functions (no imports beyond the schema types). Copy before the email service.

```
apps/ui/features/contact/api/templates/contact-customer-html.tsx    → features/contact/api/templates/contact-customer-html.tsx
apps/ui/features/contact/api/templates/contact-business-html.tsx    → features/contact/api/templates/contact-business-html.tsx
```

---

### Step 17 — Copy the email service

Depends on templates, delivery-log, email-config-builder, and schema types — all now in place.

```
apps/ui/features/contact/api/contact-email-service.ts    → features/contact/api/contact-email-service.ts
```

---

### Step 18 — Copy the server action

Depends on the email service, sanitizer, CSRF, rate-limiter, schemas, and action types — all in place.

```
apps/ui/features/contact/api/contact-request.ts    → features/contact/api/contact-request.ts
```

---

### Step 19 — Copy the form step components

Depend on the Zustand store, schemas, atom components, and `lib/utils.ts`. Copy as a group.

```
apps/ui/features/contact/components/organisms/contact-steps/contact-info-step.tsx       → features/contact/components/organisms/contact-steps/contact-info-step.tsx
apps/ui/features/contact/components/organisms/contact-steps/inquiry-type-step.tsx       → features/contact/components/organisms/contact-steps/inquiry-type-step.tsx
apps/ui/features/contact/components/organisms/contact-steps/reference-linking-step.tsx  → features/contact/components/organisms/contact-steps/reference-linking-step.tsx
apps/ui/features/contact/components/organisms/contact-steps/message-details-step.tsx    → features/contact/components/organisms/contact-steps/message-details-step.tsx
apps/ui/features/contact/components/organisms/contact-steps/contact-review-step.tsx     → features/contact/components/organisms/contact-steps/contact-review-step.tsx
```

---

### Step 20 — Copy the success message and form container

`ContactSuccessMessage` depends on the store. `ContactFormContainer` depends on everything above.

```
apps/ui/features/contact/components/molecules/contact-success-message.tsx              → features/contact/components/molecules/contact-success-message.tsx
apps/ui/features/contact/components/organisms/contact-form-container.tsx               → features/contact/components/organisms/contact-form-container.tsx
```

---

### Step 21 — Copy the feature barrel

This is the public import surface used by the page.

```
apps/ui/features/contact/index.ts    → features/contact/index.ts
```

---

### Step 22 — Copy the page

All dependencies are now in place.

```
apps/ui/app/contact/page.tsx    → app/contact/page.tsx
```

---

### Step 23 — Set environment variables

Create or update `.env.local` in the target project root:

```
RESEND_API_KEY=your_resend_api_key
CONTACT_FROM_EMAIL=noreply@yourdomain.com
CONTACT_TO_EMAIL=support@yourdomain.com
CSRF_SECRET=a_long_random_string
```

> Never commit this file. Confirm `.env.local` is in `.gitignore`.

---

### Step 24 — Type check

```bash
npx tsc --noEmit
```

Fix any path alias or missing import errors before starting the dev server. Common issues:

- `@/` alias not configured in `tsconfig.json`
- A copied file references another `@/lib/...` path not yet copied — trace and copy the missing file

---

### Step 25 — Start dev server and test

```bash
pnpm run dev
```

Navigate to `http://localhost:3000/contact` and verify:

- [ ] Page renders — hero, trust indicators, FAQ teaser visible
- [ ] Navbar renders with theme toggle
- [ ] All 3 sidebar cards render (QuickContact, OfficeHours, LocationMap)
- [ ] Form step 1 renders and validates (try submitting empty)
- [ ] Next/Back navigation moves between all 5 steps
- [ ] Progress indicator updates and completed steps show a tick
- [ ] Closing and reopening the page restores form state (Zustand localStorage)
- [ ] Step 5 shows a read-only review of all entered data
- [ ] Submitting the form sends a confirmation email to the test address
- [ ] Success screen appears with the `CR-xxxxx` reference ID
- [ ] "Start over" / reset clears the form and localStorage
