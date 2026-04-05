# Services Page — Lift-and-Shift Migration Guide

> **Purpose:** Complete reference for migrating the `/services` page and its 5-step `service-request` form into a standalone Next.js project.
> Read `contact-page-lift-and-shift.md` and `quotation-page-lift-and-shift.md` for comparison — this document follows the same structure.

---

## 1. What This Document Covers

The services page is a data-driven RSC marketing page that includes:

- A **hero section** with an `ElectricCurrent` SVG animation background
- A **services grid**, specializations strip, certifications, trust indicators, and a final CTA — all driven from a single JSON file
- A **5-step service-request form** embedded mid-page with a unique electric light-bulb themed step indicator and electric animation system
- **Two Resend emails** sent on submission: customer confirmation + business notification, with urgency-aware subjects
- **Dual-layer Zod validation**: client schemas (UX) + server schemas (stricter, with `.transform()` and business rules)
- **Origin-header CSRF** + in-memory rate limiting + honeypot field

This page has the most extensive animation system of the three marketing pages. Copy the whole `components/animations/` folder.

---

## 2. Visual Component Tree

```
ServicesPage (RSC — app/services/page.tsx)
│
├── Navbar                            components/molecules/navbar.tsx
│
└── <main>
    ├── Hero Section
    │   └── ElectricCurrent           components/animations/electric-current.tsx
    │
    ├── Services Grid Section         (inline JSX — data from services.json)
    │
    ├── Specializations Strip         (inline JSX — data from services.json)
    │
    ├── Service Request Form Section  id="request-service"
    │   ├── ElectricCurrent ×2        (top + bottom, decorative background)
    │   └── MultiStepFormContainer    features/service-request/components/organisms/multi-step-form-container.tsx
    │       ├── PowerSurge            components/animations/power-surge.tsx
    │       ├── StepIndicator         components/molecules/step-indicator.tsx  ← light-bulb themed
    │       └── AnimatePresence (framer-motion)
    │           ├── Step 1: PersonalInfoStep
    │           │   └── FormInput ×4  components/atoms/form-input.tsx
    │           ├── Step 2: ServiceDetailsStep
    │           │   ├── FormSelect    components/atoms/form-select.tsx
    │           │   ├── RadioGroup    components/atoms/radio-group.tsx
    │           │   └── FormTextarea  components/atoms/form-textarea.tsx
    │           ├── Step 3: PropertyInfoStep
    │           │   ├── RadioGroup    components/atoms/radio-group.tsx
    │           │   ├── FormInput ×4  components/atoms/form-input.tsx
    │           │   └── FormTextarea  components/atoms/form-textarea.tsx
    │           ├── Step 4: ScheduleStep
    │           │   ├── DatePicker    components/atoms/date-picker.tsx
    │           │   ├── RadioGroup    components/atoms/radio-group.tsx
    │           │   └── FormCheckbox  components/atoms/form-checkbox.tsx
    │           └── Step 5: ReviewStep
    │               ├── PulseCircle   components/animations/pulse-circle.tsx
    │               └── ReviewStepDisplay (pure display, all 4 data sections + Edit buttons)
    │
    ├── Why Choose Us / Certifications Section
    ├── Trust Indicators Section
    └── Final CTA Section
```

---

## 3. Page Layout Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  Navbar                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  HERO                                                                 │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ~ ElectricCurrent SVG (decorative, opacity-10) ~              │  │
│  │  Badge pill  •  H1 title  •  description  •  CTA buttons       │  │
│  └────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  SERVICES GRID  (4 columns, icon + title + description + features)   │
├──────────────────────────────────────────────────────────────────────┤
│  SPECIALIZATIONS STRIP  (horizontal icon + label list)               │
├──────────────────────────────────────────────────────────────────────┤
│  SERVICE REQUEST FORM  id="request-service"                          │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ~ ElectricCurrent ×2 (top + bottom rotated, opacity-20) ~    │  │
│  │  Section title  •  description                                  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  PowerSurge (flash on step complete)                     │  │  │
│  │  │  StepIndicator (5 light-bulb icons, connector lines)     │  │  │
│  │  │  ┌────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  bg-card  min-h-[500px]  AnimatePresence           │  │  │  │
│  │  │  │  Current step component renders here               │  │  │  │
│  │  │  └────────────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  WHY CHOOSE US  •  CERTIFICATIONS  (4-column grid)                   │
├──────────────────────────────────────────────────────────────────────┤
│  TRUST INDICATORS  (3-column: value + label + icon)                  │
├──────────────────────────────────────────────────────────────────────┤
│  FINAL CTA  (centred, single primary button)                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Differences vs Contact and Quotation

| Aspect | Services | Contact | Quotation |
|--------|----------|---------|-----------|
| Steps | 5 (1-indexed: 1–5) | 5 (1-indexed: 1–5) | 7 (0-indexed: 0–6) |
| Step indicator component | `StepIndicator` (light-bulb SVG, animated glow) | Inline progress bar | `FormProgressIndicator` (numbered circles) |
| State shape | **Nested object** (`data.personalInfo`, `data.serviceDetails`, etc.) | Flat store | Nested sections |
| Unique store method | `isStepComplete(step)` checks data populated | Not present | Not present |
| Animation system | ElectricCurrent + PowerSurge + PulseCircle + StepIndicator glow | None | framer-motion only |
| Business validation rule | Emergency urgency = same-day only (no future date) | None | None |
| Server schemas | **Two files** (`schemas.ts` client + `server-schemas.ts` server) | Single file | Single file |
| Postcode transform | `.transform(v => v.toUpperCase().trim())` on server schema | None | None |
| Email urgency | EMERGENCY prefix on both subjects; URGENT prefix also | None | URGENT prefix on business email |
| Business email recipient | `config.company.email.support` (from email-config-builder) | `config.company.email.support` | `config.company.email.support` |
| Rate limiter used | `rateLimiters.formSubmission` (5/1 min) | `rateLimiters.contactForm` (3/1 min) | `rateLimiters.quotationRequest` (3/5 min) |
| Shared organism steps | None — all 5 steps are self-contained | None | Yes (`contact-info-step`, `address-info-step` from `components/organisms/shared-steps/`) |
| Data source | `services.json` + `MarketingServicesContent` type | `contact.json` + `MarketingContactContent` | `quotation.json` + `MarketingQuotationContent` |
| LocalStorage key | `"electrical-service-form"` | `"contact-form"` | `"quotation-form"` |
| Form validation mode | `mode: "onSubmit"`, `reValidateMode: "onChange"` | `mode: "onChange"` | `mode: "onChange"` |

---

## 5. Folder Copy Strategy

Copy in this order — whole folders first, then selective files. All paths are relative to `apps/ui/` in the source monorepo.

### Round 1 — Full Feature Folder (whole folder)
```
features/service-request/       →  new-project/features/service-request/
```
Contains everything for the form: schemas, store, step components, API server actions, email templates.

### Round 2 — Atom Components (whole folder)
```
components/atoms/                →  new-project/components/atoms/
```
All atom components (FormInput, FormSelect, FormTextarea, RadioGroup, FormCheckbox, DatePicker, etc.). Safe to copy whole — no dashboard dependencies.

### Round 3 — Animation Components (whole folder — UNIQUE TO THIS PAGE)
```
components/animations/           →  new-project/components/animations/
```
Contains all 7 animation files: `electric-current.tsx`, `electric-border.tsx`, `light-bulb.tsx`, `lightning-arc.tsx`, `power-surge.tsx`, `pulse-circle.tsx`, `spark-effect.tsx`. The form uses `PowerSurge` and `PulseCircle`; the page uses `ElectricCurrent` directly.

### Round 4 — Sanitize Library (whole folder)
```
lib/sanitize/                    →  new-project/lib/sanitize/
```

### Round 5 — Security Library (whole folder)
```
lib/security/                    →  new-project/lib/security/
```
Contains `csrf.ts` (origin-header check) and `rate-limiter.ts` (in-memory).

### Round 6 — Forms Library (whole folder)
```
lib/forms/                       →  new-project/lib/forms/
```
Contains `types.ts` with shared form type definitions.

### Round 7 — Utils Library (whole folder)
```
lib/utils/                       →  new-project/lib/utils/
```
Contains `date-utils.ts` (exports `minDate()` and `formatDateUK()`). ScheduleStep imports `minDate` from here.

### Round 8 — Providers (whole folder)
```
components/providers/            →  new-project/components/providers/
```

### Round 9 — Marketing Data (whole folder)
```
data/strapi-mock/marketing/      →  new-project/data/strapi-mock/marketing/
```
Contains `services.json` (all page content), `contact.json`, `quotation.json`. Copy whole folder.

### Round 10 — Selective: Molecules (named files only)

> WARNING: `components/molecules/` contains dashboard-only files (`dashboard-shell.tsx`, `docs-sidebar.tsx`, etc.) that have Strapi imports. Do NOT copy the whole folder.

Copy these files only:
```
components/molecules/navbar.tsx              →  new-project/components/molecules/
components/molecules/step-indicator.tsx      →  new-project/components/molecules/
```

### Round 11 — Selective: Email Library (named files only)

> WARNING: `lib/email/` contains files with Strapi imports (`continuation-email-service.ts`, etc.). Do NOT copy the whole folder.

Copy these 3 files only:
```
lib/email/services/delivery-log.ts          →  new-project/lib/email/services/
lib/email/config/email-config.tsx           →  new-project/lib/email/config/
lib/email/config/email-config-builder.ts    →  new-project/lib/email/config/
```
Then replace `email-config-builder.ts` with the env-var version (see §11 below).

### Round 12 — Selective: Actions Types (named file only)
```
lib/actions/action.types.ts                 →  new-project/lib/actions/
```

### Round 13 — Selective: Marketing Types (named file only)
```
types/marketing.ts                          →  new-project/types/
```
Contains `MarketingServicesContent`, `MarketingIconName`, and the contact/quotation types too.

### Round 14 — Create: Page File (new file — do not copy)
Create `app/services/page.tsx` in the new project. Use the source as a template but update import aliases to match the new project's `tsconfig.json` path aliases.

---

## 6. Complete File Checklist

### Feature: Service Request Form
```
features/service-request/index.ts                                         ✓ barrel export
features/service-request/hooks/use-form-store.ts                          ✓ Zustand store
features/service-request/schemas/schemas.ts                               ✓ client Zod schemas
features/service-request/schemas/server-schemas.ts                        ✓ server Zod schemas + business rules
features/service-request/components/organisms/multi-step-form-container.tsx  ✓ form shell
features/service-request/components/organisms/personal-info-step.tsx      ✓ Step 1
features/service-request/components/organisms/service-details-step.tsx    ✓ Step 2
features/service-request/components/organisms/property-info-step.tsx      ✓ Step 3
features/service-request/components/organisms/schedule-step.tsx           ✓ Step 4
features/service-request/components/organisms/review-step.tsx             ✓ Step 5
features/service-request/components/organisms/review-step-display.tsx     ✓ display sub-component
features/service-request/api/service-request.ts                           ✓ server action
features/service-request/api/email-service.ts                             ✓ email dispatch
features/service-request/api/templates/customer-confirmation-html.tsx     ✓ customer HTML email
features/service-request/api/templates/business-notification-html.tsx     ✓ business HTML email
```

### Page
```
app/services/page.tsx                                                      ✓ RSC page
```

### Atom Components
```
components/atoms/form-input.tsx         ✓ used in steps 1, 3
components/atoms/form-select.tsx        ✓ used in step 2
components/atoms/form-textarea.tsx      ✓ used in steps 2, 3
components/atoms/radio-group.tsx        ✓ used in steps 2, 3, 4
components/atoms/date-picker.tsx        ✓ used in step 4
components/atoms/form-checkbox.tsx      ✓ used in step 4
```
(Copy the whole `components/atoms/` folder — the others do no harm and may be needed.)

### Molecule Components
```
components/molecules/navbar.tsx         ✓ page navigation
components/molecules/step-indicator.tsx ✓ light-bulb step indicator (unique to this form)
```

### Animation Components
```
components/animations/electric-current.tsx   ✓ page hero + form background
components/animations/power-surge.tsx        ✓ fires on each step completion
components/animations/pulse-circle.tsx       ✓ success state in ReviewStep
components/animations/electric-border.tsx    ✓ copy (referenced by animation system)
components/animations/light-bulb.tsx         ✓ copy
components/animations/lightning-arc.tsx      ✓ copy
components/animations/spark-effect.tsx       ✓ copy
```

### Security & Sanitisation
```
lib/security/csrf.ts                    ✓ origin-header CSRF check
lib/security/rate-limiter.ts            ✓ in-memory rate limiting
lib/sanitize/input-sanitizer.ts         ✓ sanitizeInput.text/email/phone/address/postcode
```

### Email Infrastructure
```
lib/email/services/delivery-log.ts     ✓ in-memory delivery log (no Strapi dependency)
lib/email/config/email-config.tsx       ✓ BRAND_COLORS, SLA constants, UrgencyLevel type
lib/email/config/email-config-builder.ts  ✓ REPLACE with env-var version (see §11)
```

### Types & Shared Lib
```
lib/actions/action.types.ts             ✓ ActionResult<T> type
lib/constants.ts                        ✓ GENERAL_FORM_MIN_STEP, GENERAL_FORM_MAX_STEP
lib/forms/types.ts                      ✓ shared form type definitions
lib/utils/date-utils.ts                 ✓ minDate(), formatDateUK()
types/marketing.ts                      ✓ MarketingServicesContent, MarketingIconName
```

### Data
```
data/strapi-mock/marketing/services.json   ✓ all page content (hero, services, etc.)
```

### Providers
```
components/providers/                   ✓ copy whole folder
```

---

## 7. NPM Packages Required

```bash
# Core
next
react
react-dom
typescript

# Form
react-hook-form
@hookform/resolvers
zod

# State
zustand

# Animations
framer-motion

# Icons
lucide-react

# Email
resend

# UI Primitives (Tailwind + shadcn/ui)
tailwindcss
@radix-ui/react-checkbox
@radix-ui/react-radio-group
# (whatever your shadcn setup installs)

# Utilities
clsx
tailwind-merge
```

Install:
```bash
pnpm add react-hook-form @hookform/resolvers zod zustand framer-motion lucide-react resend
```

---

## 8. Environment Variables

```env
# Required — email sending
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Required — where business notification emails go
BUSINESS_EMAIL=team@yourcompany.com

# Required — the "from" address for all sent emails (must be a verified Resend domain)
EMAIL_FROM=noreply@yourcompany.com

# Optional — used by the env-var replacement of email-config-builder
COMPANY_NAME=Your Company Name
COMPANY_PHONE=+44 20 1234 5678
COMPANY_ADDRESS=123 Main Street, London
```

### What each var does

| Variable | Used in | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | `email-service.ts` | Authenticates Resend API calls. Required — emails silently fail if missing |
| `BUSINESS_EMAIL` | `email-config-builder.ts` (replacement) | The `to` address for business notification emails |
| `EMAIL_FROM` | `email-config-builder.ts` (replacement) | The `from` address. Must match a verified Resend sending domain |
| `COMPANY_NAME` | email templates | Displayed in email headers and footers |
| `COMPANY_PHONE` | email templates | Shown in customer confirmation "contact us" section |

### No CSRF secret needed
The CSRF check in `lib/security/csrf.ts` validates the `Origin` / `Referer` request headers against the host. There is **no `CSRF_SECRET` environment variable**.

---

## 9. How It All Wires Up

### 9.1 Page Load (RSC)
`app/services/page.tsx` is a React Server Component — it runs only on the server. At build/request time it:
1. Imports `servicesData` from `data/strapi-mock/marketing/services.json` and casts it to `MarketingServicesContent`
2. Destructures all 8 content sections (hero, services, servicesSection, specializations, certifications, trustIndicators, requestForm, whyChooseUs, finalCta) at module scope
3. Renders all static page sections inline as JSX — no client state needed for the page itself
4. Renders `<MultiStepFormContainer />` for the form section — this is the client island boundary

### 9.2 ElectricCurrent Animation
`ElectricCurrent` is a pure SVG framer-motion component. It renders a curved path that animates `pathLength` from 0 → 1 with a repeating loop and a gradient stroke. It is used three times on the page:
- Once in the hero (opacity-10, absolute positioned behind content)
- Twice in the form section (opacity-20, top + bottom, second one rotated 180°)

It takes only an optional `className` prop. Self-contained, no store or data dependencies.

### 9.3 Form Container Bootstrap
`MultiStepFormContainer` is `"use client"`. On mount it:
1. Reads `currentStep` from the Zustand store (which hydrates from localStorage via `persist`)
2. Computes `completedSteps` = all step numbers below `currentStep`
3. Passes both to `StepIndicator` so bulbs render in the correct state immediately (no flash)
4. Initialises `previousStep` and `surgeTrigger` state

### 9.4 StepIndicator — Electric Light Bulb Theme
`StepIndicator` in `components/molecules/step-indicator.tsx` is NOT the same as `FormProgressIndicator` (used by quotation). It renders 5 SVG light-bulb icons connected by animated gradient lines:
- **Pending steps**: dim bulb, muted badge with step number
- **Active step**: pulsing amber/gold glow rings, animated fill, lit bolt symbol, badge shows number
- **Completed steps**: lit bulb fill, check mark path animates in, pulsing glow continues
- **Connector lines**: animated gradient fill sweeps left-to-right as steps complete
- Clicking a completed or current step calls `goToStep(stepNumber)`

### 9.5 PowerSurge Effect
`MultiStepFormContainer` tracks `previousStep`. Whenever `currentStep > previousStep` (user moved forward), it increments `surgeTrigger`. `PowerSurge` watches this prop and fires a full-screen flash animation on each increment — visual reward for completing a step.

### 9.6 Zustand Store — Nested Data Shape
`useFormStore` (Zustand + `persist`) stores data as a **nested object**:
```ts
data: {
  personalInfo: { firstName, lastName, email, phone }
  serviceDetails: { serviceType, urgency, description }
  propertyInfo: { address, city, county?, postcode, propertyType, accessInstructions? }
  schedulePreferences: { preferredDate, alternativeDate?, preferredTimeSlot, flexibleScheduling }
}
```
Each step reads its own slice (`data.personalInfo`, etc.) as `defaultValues` for react-hook-form. On submit the step calls its update action (`updatePersonalInfo`, `updateServiceDetails`, etc.) and then `nextStep()`. The full `data` object is passed to the server action on final submission from ReviewStep.

The unique `isStepComplete(step)` method checks if a step's data sub-object has been populated — `MultiStepFormContainer` uses this to determine whether to allow step navigation.

### 9.7 Per-Step Validation Flow (Client)
Each step (1–4) uses `react-hook-form` with `zodResolver`:
- `mode: "onSubmit"` — validation runs on Continue click, not on every keystroke
- `reValidateMode: "onChange"` — after first submit attempt, re-validates on change
- Errors render inline below each field via the atom's `error` prop
- Step 2 and 3 use `Controller` from react-hook-form for `RadioGroup` (controlled component)
- Step 4 uses `Controller` for all fields (DatePicker, RadioGroup, FormCheckbox) and `watch("flexibleScheduling")` to conditionally show the alternative date picker with an animated height transition

### 9.8 Server Action Pipeline (`submitServiceRequest`)
When ReviewStep calls `submitServiceRequest(data)`:

```
1. securityCheck({ validateOriginHeader: true })
   └── Reads Origin/Referer header, rejects cross-origin requests
   └── Returns { valid: false, error } if mismatch → early return

2. Rate limit check
   └── rateLimiters.formSubmission.check(clientId)  [5 req / 1 min]
   └── Returns error "Too many requests" if exceeded

3. Honeypot check
   └── If data.website field is non-empty → fake success returned (bot detected silently)

4. sanitizeFormData(data)
   └── Runs sanitizeInput.text/email/phone/address/postcode on each field
   └── Preserves nested object shape

5. serverCompleteFormSchema.safeParse(sanitizedData)
   └── Stricter Zod: name/city regex, UK phone regex, UK postcode with .transform()
   └── Returns fieldErrors on failure

6. validateBusinessRules(validatedData)
   └── Emergency urgency: preferredDate must be today (not tomorrow or later)
   └── Returns { valid: false, errors: string[] } on violation

7. Generate requestId = `SR-${Date.now()}-${random7chars}`

8. sendServiceRequestEmails({ formData, requestId })
   └── Dispatches customer + business emails via Resend
   └── Logs each attempt to delivery-log (category: "service")

9. Return { success: true, data: { requestId } }
```

### 9.9 Email Dispatch
`sendServiceRequestEmails` sends two emails in parallel:

**Customer Confirmation**
- `to`: `formData.personalInfo.email`
- `from`: `config.email.fromEmail` (from email-config-builder)
- Subject:
  - Emergency: `EMERGENCY - Service Request Received (${requestId})`
  - Routine/Urgent: `Service Request Confirmed - ${requestId}`
- Template: urgency-aware banner (red for emergency, amber for urgent), request details table, SLA next-steps from `config.sla.service[urgency]`

**Business Notification**
- `to`: `config.company.email.support` (your business inbox)
- `from`: `config.email.fromEmail`
- Subject:
  - Emergency: `EMERGENCY SERVICE REQUEST - ${requestId} - IMMEDIATE ACTION REQUIRED`
  - Routine/Urgent: `New Service Request - ${requestId}`
- Template: full customer details, all property fields, schedule, urgency level

Both results are returned to the server action. Email failure does NOT fail the submission — `success: true` is returned even if emails fail (the request is considered submitted regardless).

### 9.10 Delivery Logging
Every email attempt (success or failure) is logged via `logDelivery()` in `lib/email/services/delivery-log.ts`. The log:
- Stores entries in `globalThis.__email_delivery_log__` (survives hot reloads)
- Max 200 entries (newest first, oldest discarded)
- Category is always `"service"` for service-request emails
- Recipients are logged as `"customer"` or `"business"`
- No Strapi dependency — fully self-contained

### 9.11 Review Step — Success State
After successful server action response, `ReviewStep` renders the success state:
- Pulsing `PulseCircle` animation behind a large animated SVG checkmark
- `requestId` displayed in monospace
- "Submit Another Request" button calls `resetForm()` → resets Zustand store to step 1, clears localStorage, and clears all local component state

---

## 10. Validation Wiring Detail

### 10.1 Client vs Server — Field-by-Field

| Field | Client Schema | Server Schema | Notes |
|-------|--------------|---------------|-------|
| `firstName` | min 2 chars | min 2 + regex `/^[a-zA-Z\s'-]+$/` | Server rejects numbers/symbols |
| `lastName` | min 2 chars | min 2 + regex `/^[a-zA-Z\s'-]+$/` | |
| `email` | valid email | valid email + `.toLowerCase()` | Server normalises to lowercase |
| `phone` | non-empty string | UK regex `/^(\+44\|0)[1-9]\d{8,9}$/` | Server enforces UK format |
| `serviceType` | non-empty string | strict enum (7 values) | Server rejects arbitrary strings |
| `urgency` | enum: routine/urgent/emergency | same enum | |
| `description` | min 10 chars | min 10 chars | |
| `address` | non-empty | non-empty | |
| `city` | non-empty | non-empty + regex (letters/spaces only) | |
| `county` | optional string | optional string | |
| `postcode` | UK regex (case-insensitive) | UK regex + `.transform(toUpperCase + trim)` | Server normalises format |
| `propertyType` | enum: residential/commercial | same enum | |
| `accessInstructions` | optional | optional | |
| `preferredDate` | non-empty string | non-empty string | |
| `preferredTimeSlot` | enum: morning/afternoon/evening | same enum | |
| `alternativeDate` | optional string | optional string | |
| `flexibleScheduling` | boolean | boolean | |

### 10.2 Business Rules (Server Only)

```
validateBusinessRules(data):
  IF urgency === "emergency":
    tomorrow = new Date(Date.now() + 86_400_000)
    tomorrow.setHours(0, 0, 0, 0)
    IF new Date(preferredDate) >= tomorrow:
      return { valid: false, errors: ["Emergency requests require same-day service..."] }

  return { valid: true, errors: [] }
```

This rule means an emergency booking **must be for today**. If the user tries to schedule an emergency for a future date the server action returns a validation error displayed in ReviewStep's error banner.

### 10.3 Sanitisation Applied Before Validation

The server action calls `sanitizeFormData()` before Zod parsing. This strips XSS/injection characters from each field before the schema validates:

| Sanitiser | Applied to |
|-----------|-----------|
| `sanitizeInput.text()` | firstName, lastName, serviceType, description, city, county, accessInstructions |
| `sanitizeInput.email()` | email |
| `sanitizeInput.phone()` | phone |
| `sanitizeInput.address()` | address |
| `sanitizeInput.postcode()` | postcode |

`urgency`, `propertyType`, `preferredTimeSlot`, `flexibleScheduling`, dates — passed through as-is (Zod enums / booleans validate them).

---

## 11. Strapi Dependency Warning — email-config-builder.ts

> **This is the most important thing to replace.** The email service will fail at runtime if you copy `email-config-builder.ts` without modification.

`features/service-request/api/email-service.ts` calls:
```ts
const config = await buildEmailConfig()
```

In the monorepo, `buildEmailConfig()` fetches live data from Strapi (`getCompanySettings()` + `getEmailSettings()`). In a standalone project there is no Strapi, so this will throw.

**Replace `lib/email/config/email-config-builder.ts` with this env-var version:**

```ts
// lib/email/config/email-config-builder.ts
// Standalone replacement — reads from environment variables instead of Strapi

export interface ResolvedEmailConfig {
  company: {
    name: string
    phone: string
    email: { support: string }
    address: string
  }
  email: {
    fromEmail: string
  }
  urgency: {
    routine:   { gradientStart: string; gradientEnd: string }
    urgent:    { gradientStart: string; gradientEnd: string }
    emergency: { gradientStart: string; gradientEnd: string }
  }
  sla: {
    service: {
      routine:   { time: string; description: string }
      urgent:    { time: string; description: string }
      emergency: { time: string; description: string }
    }
  }
}

export async function buildEmailConfig(): Promise<ResolvedEmailConfig> {
  return {
    company: {
      name:    process.env.COMPANY_NAME    || "Electrical Services",
      phone:   process.env.COMPANY_PHONE   || "",
      email: { support: process.env.BUSINESS_EMAIL || "" },
      address: process.env.COMPANY_ADDRESS || "",
    },
    email: {
      fromEmail: process.env.EMAIL_FROM || "noreply@example.com",
    },
    urgency: {
      routine:   { gradientStart: "#1e293b", gradientEnd: "#0f172a" },
      urgent:    { gradientStart: "#92400e", gradientEnd: "#78350f" },
      emergency: { gradientStart: "#991b1b", gradientEnd: "#7f1d1d" },
    },
    sla: {
      service: {
        routine:   { time: "5-7 business days", description: "We will schedule your appointment within 5-7 business days." },
        urgent:    { time: "24-48 hours",        description: "Your urgent request will be attended to within 24-48 hours." },
        emergency: { time: "1 hour",             description: "Our emergency team has been notified and will respond within 1 hour." },
      },
    },
  }
}

// These helpers are imported by the email templates — keep them
export function getSharedHeaderHtml(config: ResolvedEmailConfig, gradientStart: string, gradientEnd: string): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${config.company.name}</h1>
      </td>
    </tr>`
}

export function getSharedFooterHtml(config: ResolvedEmailConfig, _type: string): string {
  return `
    <tr>
      <td style="padding: 24px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">${config.company.name}</p>
        <p style="margin: 0; color: #94a3b8; font-size: 12px;">${config.company.address}</p>
      </td>
    </tr>`
}

export function getUrgencyBadgeStyleFromConfig(urgency: string, _config: ResolvedEmailConfig): string {
  const styles: Record<string, string> = {
    routine:   "display:inline-block;padding:4px 12px;background:#dcfce7;color:#166534;border-radius:9999px;font-size:12px;font-weight:600;",
    urgent:    "display:inline-block;padding:4px 12px;background:#fef3c7;color:#92400e;border-radius:9999px;font-size:12px;font-weight:600;",
    emergency: "display:inline-block;padding:4px 12px;background:#fee2e2;color:#991b1b;border-radius:9999px;font-size:12px;font-weight:600;",
  }
  return styles[urgency] || styles.routine
}
```

Also add `COMPANY_NAME`, `COMPANY_PHONE`, `COMPANY_ADDRESS` to your `.env.local`.

---

## 12. Server vs Client Component Table

| File | Directive | Why |
|------|-----------|-----|
| `app/services/page.tsx` | None (RSC) | Static data from JSON, no client state needed at page level |
| `multi-step-form-container.tsx` | `"use client"` | Uses Zustand store, tracks `currentStep`, fires animations |
| `personal-info-step.tsx` | `"use client"` | react-hook-form, user input |
| `service-details-step.tsx` | `"use client"` | react-hook-form, Controller, user input |
| `property-info-step.tsx` | `"use client"` | react-hook-form, Controller, user input |
| `schedule-step.tsx` | `"use client"` | react-hook-form, Controller, conditional render |
| `review-step.tsx` | `"use client"` | useState for submit state, calls server action |
| `review-step-display.tsx` | `"use client"` | onEdit callback prop (needs client event handlers) |
| `step-indicator.tsx` | `"use client"` | framer-motion animations |
| `electric-current.tsx` | `"use client"` | framer-motion SVG animation |
| `power-surge.tsx` | `"use client"` | framer-motion animation |
| `pulse-circle.tsx` | `"use client"` | framer-motion animation |
| `service-request.ts` | `"use server"` | Server action — security, validation, email dispatch |
| `email-service.ts` | `"use server"` | Resend API calls |
| `delivery-log.ts` | `"use server"` | In-memory log write |

---

## 13. Step-by-Step Migration Guide

Work in these bundles. After each bundle verify TypeScript compiles before moving on.

---

### Bundle 1 — Scaffold and Shared Config

Copy:
```
lib/constants.ts                 (GENERAL_FORM_MIN_STEP/MAX_STEP)
lib/utils/date-utils.ts
lib/forms/types.ts
lib/actions/action.types.ts
types/marketing.ts
```
Verify: `pnpm exec tsc --noEmit` — no errors yet (no imports resolved yet, that's fine).

---

### Bundle 2 — Security and Sanitisation

Copy whole folders:
```
lib/security/
lib/sanitize/
```
These have no external dependencies beyond Next.js `headers()`.
Verify: TypeScript passes.

---

### Bundle 3 — Atoms

Copy whole folder:
```
components/atoms/
```
Atoms depend only on Tailwind, `cn()` from `lib/utils`, and Radix UI primitives. Install any missing Radix packages.
Verify: TypeScript passes.

---

### Bundle 4 — Animation System

Copy whole folder:
```
components/animations/
```
All animation components depend only on `framer-motion`.
Verify: TypeScript passes.

---

### Bundle 5 — Molecules

Copy named files only:
```
components/molecules/navbar.tsx
components/molecules/step-indicator.tsx
```
`step-indicator.tsx` imports `framer-motion` and `cn`. `navbar.tsx` imports atoms and Next.js `Link`.
Verify: TypeScript passes.

---

### Bundle 6 — Email Infrastructure

Copy named files:
```
lib/email/services/delivery-log.ts
lib/email/config/email-config.tsx
```
Then **create** (not copy) `lib/email/config/email-config-builder.ts` using the env-var replacement from §11.
Verify: TypeScript passes.

---

### Bundle 7 — Feature: Store + Schemas

Copy:
```
features/service-request/hooks/use-form-store.ts
features/service-request/schemas/schemas.ts
features/service-request/schemas/server-schemas.ts
```
Install Zustand if not already: `pnpm add zustand`
Verify: TypeScript passes. The store uses `GENERAL_FORM_MIN_STEP`/`MAX_STEP` from `lib/constants` — must be present from Bundle 1.

---

### Bundle 8 — Feature: Step Components

Copy:
```
features/service-request/components/organisms/personal-info-step.tsx
features/service-request/components/organisms/service-details-step.tsx
features/service-request/components/organisms/property-info-step.tsx
features/service-request/components/organisms/schedule-step.tsx
features/service-request/components/organisms/review-step-display.tsx
```
Each step imports from `../../hooks/use-form-store` and `../../schemas/schemas` (relative) plus atoms from `@/components/atoms/`. All should resolve now.
Install react-hook-form if not already: `pnpm add react-hook-form @hookform/resolvers`
Verify: TypeScript passes.

---

### Bundle 9 — Feature: Email Templates

Copy:
```
features/service-request/api/templates/customer-confirmation-html.tsx
features/service-request/api/templates/business-notification-html.tsx
```
These import `BRAND_COLORS`, `UrgencyLevel` from `lib/email/config/email-config` and `ResolvedEmailConfig`, `getSharedHeaderHtml`, `getSharedFooterHtml`, `getUrgencyBadgeStyleFromConfig` from `lib/email/config/email-config-builder`. Both must exist (from Bundle 6).
Verify: TypeScript passes.

---

### Bundle 10 — Feature: API (Server Actions)

Copy:
```
features/service-request/api/email-service.ts
features/service-request/api/service-request.ts
```
Install Resend: `pnpm add resend`
`email-service.ts` imports `buildEmailConfig` from the replacement builder, `logDelivery` from delivery-log, and the two templates. All should resolve.
`service-request.ts` imports security, sanitize, email-service, rate-limiter, action.types. All should resolve.
Verify: TypeScript passes.

---

### Bundle 11 — Feature: ReviewStep + Barrel

Copy:
```
features/service-request/components/organisms/review-step.tsx
features/service-request/index.ts
```
`review-step.tsx` imports `submitServiceRequest` from the server action, `PulseCircle` from animations, and `ReviewStepDisplay`.
`index.ts` re-exports everything the page needs.
Verify: TypeScript passes.

---

### Bundle 12 — Feature: Form Container

Copy:
```
features/service-request/components/organisms/multi-step-form-container.tsx
```
This imports `StepIndicator`, `PowerSurge`, the store, and all 5 step components. Everything should now resolve.
Verify: TypeScript passes.

---

### Bundle 13 — Providers

Copy whole folder:
```
components/providers/
```

---

### Bundle 14 — Data

Copy:
```
data/strapi-mock/marketing/services.json
```
(Copy whole `data/strapi-mock/marketing/` folder — contains contact.json and quotation.json too, no harm.)

---

### Bundle 15 — Page

Create `app/services/page.tsx`. Copy from source and update:
- Path aliases (`@/`) to match your new project's `tsconfig.json`
- If your new project uses `src/` directory, adjust accordingly
- The data import: `import servicesData from "@/data/strapi-mock/marketing/services.json"`

Add `resolveJsonModule: true` to your `tsconfig.json` if not already set.
Verify: `pnpm exec tsc --noEmit` — full clean.

---

### Bundle 16 — Environment Variables

Create `.env.local`:
```env
RESEND_API_KEY=re_your_key_here
BUSINESS_EMAIL=your@email.com
EMAIL_FROM=noreply@yourdomain.com
COMPANY_NAME=Your Company Name
COMPANY_PHONE=+44 20 1234 5678
COMPANY_ADDRESS=123 Main Street, London SW1A 1AA
```

---

### Bundle 17 — Final Build Verification

```bash
pnpm exec tsc --noEmit    # zero TypeScript errors
pnpm build                # full production build
pnpm dev                  # start dev server
```

Navigate to `/services` and verify the page renders. Check DevTools console for any import errors.

---

## 14. Test Checklist

### Page Render
- [ ] `/services` loads without console errors
- [ ] Hero section renders with ElectricCurrent animation visible (subtle wave)
- [ ] Services grid shows 4 cards with icons, title, description, feature bullets
- [ ] Specializations strip renders horizontally
- [ ] Form section renders with `StepIndicator` showing 5 light-bulb icons
- [ ] Certifications, Trust Indicators, and Final CTA sections render

### Animation System
- [ ] ElectricCurrent SVG animates in hero background
- [ ] ElectricCurrent SVG animates in form section (top and bottom)
- [ ] StepIndicator: step 1 bulb glows amber/gold with pulsing rings
- [ ] StepIndicator: pending steps are dim with step number badge
- [ ] Advancing a step fires PowerSurge flash effect
- [ ] Completing a step: bulb animates to lit/completed state, connector line fills
- [ ] Clicking a completed step navigates back to it

### Form — Step Navigation
- [ ] Step 1 (Personal Info): 4 fields render, Continue validates, moves to step 2
- [ ] Step 2 (Service Details): dropdown, urgency radio, description textarea; Previous works
- [ ] Step 3 (Property Info): property type radio, address fields including optional county; Previous works
- [ ] Step 4 (Schedule): date picker (min=today), time slot radio, flexible checkbox; checking flexible reveals alternative date picker; Previous works
- [ ] Step 5 (Review): all entered data shown in 4 sections; Edit buttons navigate back to correct step
- [ ] Refreshing the page restores form to the correct step (localStorage persistence)

### Form — Validation
- [ ] Step 1: submitting empty fields shows inline errors on all required fields
- [ ] Step 1: invalid email format shows error
- [ ] Step 2: submitting without serviceType or urgency shows errors
- [ ] Step 2: description under 10 chars shows error
- [ ] Step 3: submitting without postcode shows error; invalid UK postcode format shows error
- [ ] Step 4: submitting without preferredDate shows error; past dates are not selectable
- [ ] Step 4: flexibleScheduling checked → alternative date field appears; unchecking hides it

### Business Rule
- [ ] Step 2: select urgency = Emergency
- [ ] Step 4: select a future date (tomorrow or later)
- [ ] Submit from Step 5 → server returns validation error about emergency same-day requirement
- [ ] Error displays in the red banner in ReviewStep

### Honeypot
- [ ] Manually POST with `website` field filled → server returns fake `{ success: true }` (check server logs — no email sent)

### Rate Limiting
- [ ] Submit the form 6 times rapidly → 6th attempt returns "Too many requests" error

### Email Delivery (requires RESEND_API_KEY set)
- [ ] Routine submission: customer receives `Service Request Confirmed - SR-...` email
- [ ] Routine submission: business receives `New Service Request - SR-...` email
- [ ] Emergency submission: customer receives `EMERGENCY - Service Request Received (SR-...)` email
- [ ] Emergency submission: business receives `EMERGENCY SERVICE REQUEST - SR-... - IMMEDIATE ACTION REQUIRED` email
- [ ] Customer email body shows urgency-appropriate banner (none for routine, amber for urgent, red for emergency)

### Success State
- [ ] After successful submission: PulseCircle and animated checkmark display
- [ ] Reference ID displayed in monospace
- [ ] "Submit Another Request" resets form to Step 1 and clears all fields

### Accessibility
- [ ] Tab through form — all fields focusable in logical order
- [ ] Screen reader can read step indicator labels
- [ ] `prefers-reduced-motion`: confirm animations are suppressed (framer-motion respects this automatically)

---

*End of Services Page — Lift-and-Shift Migration Guide*
