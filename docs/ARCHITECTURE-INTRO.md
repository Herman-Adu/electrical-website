# Architecture Introduction — Getting Started Guide

**electrical-website** | Next.js 16 + React 19 + TypeScript  
**Document Version:** 1.0  
**Last Updated:** March 27, 2026

---

## 📖 Who This Guide Is For

- **New team members** setting up the project for the first time
- **Developers** joining a sprint or feature work
- **Contributors** wanting to understand project structure and conventions
- **Reviewers** evaluating pull requests

**If you already know the project**, jump to:

- [Architecture Index](./ARCHITECTURE-INDEX.md) for a complete audit
- [Implementation Guide](./IMPLEMENTATION-GUIDE.md) for refactoring tasks

---

## 🎯 Project Overview

**Nexgen Electrical** is a full-stack Next.js application showcasing industrial and commercial electrical services. The site combines a marketing platform with admin capabilities, built on modern React and TypeScript with a focus on performance, type safety, and code organization.

**Key Stats:**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **UI Library:** React 19 with shadcn/ui components
- **Styling:** Tailwind CSS (PostCSS)
- **Validation:** Zod (runtime + TypeScript)
- **Deployment:** Vercel (production), Docker (local dev)
- **Bundle Size Target:** < 700 KB (~850 KB current, improving)

---

## 📁 Project Structure

### High-Level Organization

```
electrical-website/
├── app/                      # Next.js App Router pages & layouts
│   ├── api/                  # API routes (server-side endpoints)
│   ├── layout.tsx            # Root layout with metadata, providers
│   ├── page.tsx              # Homepage
│   ├── about/                # About page
│   ├── services/             # Services page
│   ├── projects/             # Projects showcase
│   ├── contact/              # Contact page
│   └── env.ts                # Environment variables (t3-env)
│
├── components/               # React components (UI + business logic)
│   ├── ui/                   # Shadcn components (Button, Card, etc.)
│   ├── shared/               # Reusable components (Layout, Hero, etc.)
│   ├── sections/             # Large page sections (BentoCards, Stats, etc.)
│   ├── navigation/           # Navigation components (Header, Footer)
│   ├── about/, services/, projects/    # Feature-specific components
│   └── theme-provider.tsx    # Theme/provider setup
│
├── lib/                      # Utilities and shared logic
│   ├── actions/              # Server Actions (submitContactInquiry, etc.)
│   ├── hooks/                # Custom React hooks (useAnimatedCounter, etc.)
│   ├── schemas/              # Zod validation schemas
│   ├── utils.ts              # Utility functions (cn, classname merging)
│   ├── email.ts              # Email sending (Resend integration)
│   ├── rate-limit.ts         # Rate limiting logic
│   ├── metadata.ts           # SEO metadata helpers
│   └── structured-data.ts    # Schema.org JSON-LD helpers
│
├── public/                   # Static assets (images, fonts, etc.)
│   └── images/               # Image files (logos, photos)
│
├── types/                    # Shared TypeScript types
│   └── projects.ts           # Project-related types
│
├── data/                     # Static data (projects, services, testimonials)
│   ├── projects.json
│   ├── services.json
│   └── about/
│
├── styles/                   # Global CSS
│   └── globals.css           # Tailwind directives
│
├── e2e/                      # End-to-end tests (Playwright)
│   ├── smoke-test.spec.ts
│   ├── og-route-auth.spec.ts
│   └── captcha-integration.spec.ts
│
├── agent/                    # MCP Agent skill system
│   ├── orchestrator.ts       # Skill routing + execution
│   ├── skills/               # Skill implementations
│   ├── agents/               # Agent pool definitions
│   └── constants/            # Skill IDs, MCP constants
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE-INTRO.md # This file
│   ├── ARCHITECTURE-INDEX.md # Audit document
│   ├── IMPLEMENTATION-GUIDE.md
│   └── adr/                  # Architecture Decision Records
│
└── ...config files: next.config.ts, tsconfig.json, playwright.config.ts, etc.
```

### Key Directories Explained

| Directory      | Purpose                | Contains                                        |
| -------------- | ---------------------- | ----------------------------------------------- |
| `app/`         | Next.js App Router     | Pages, layouts, API routes, middleware          |
| `components/`  | React UI components    | Pages sections, UI primitives, layouts          |
| `lib/actions/` | Server-side mutations  | `submitContactInquiry`, `updateProjectListItem` |
| `lib/hooks/`   | Custom React hooks     | Animation hooks, intersection observer, etc.    |
| `lib/schemas/` | Zod validation schemas | Form validation, API query params               |
| `types/`       | TypeScript definitions | Shared types across the app                     |
| `data/`        | Static content         | Projects, services, testimonials                |
| `agent/`       | MCP skill system       | Browser testing, CI, code search, etc.          |
| `docs/`        | Documentation          | Architecture, decisions, guides                 |
| `e2e/`         | Integration tests      | Playwright test suites                          |

---

## 🔄 Data Flow Architecture

### Request → Validation → Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT SIDE (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Component / Form                              │   │
│  │  • Collect user input                                │   │
│  │  • Display UI (animated, interactive)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                   POST/Call Server Action
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER SIDE (Node.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Action (lib/actions/*.ts)                    │   │
│  │  • Receive FormData / JSON                          │   │
│  │  • Validate with Zod schema (lib/schemas/)          │   │
│  │  • Verify CAPTCHA / Rate limit                       │   │
│  │  • Process business logic                            │   │
│  │  • Send emails, update database, etc.               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                   Return Response Object
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT SIDE (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Handle Response                                     │   │
│  │  • On success: show toast, reset form                │   │
│  │  • On error: display field-specific messages         │   │
│  │  • Trigger navigation or revalidation                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Example: Contact Form Submission

```typescript
// components/contact/contact-form.tsx (Client Component)
const handleSubmit = async (data: ContactFormData) => {
  // Call server action from the client
  const response = await submitContactInquiry(data, captchaToken);

  if (response.success) {
    toast.success(`Reference: ${response.referenceCode}`);
  } else {
    toast.error(response.error);
  }
};

// lib/actions/contact.ts (Server Action, "use server")
export async function submitContactInquiry(
  formData: unknown,
  turnstileToken: string
): Promise<ContactResponse> {
  // 1. Verify CAPTCHA
  if (!await verifyTurnstileToken(turnstileToken)) {
    return { success: false, error: "CAPTCHA failed" };
  }

  // 2. Validate with Zod schema
  const validatedData = contactFormSchema.parse(formData);

  // 3. Check rate limit
  const clientIp = await getClientIp();
  if (!await checkRateLimit(clientIp, ...)) {
    return { success: false, error: "Too many submissions" };
  }

  // 4. Send emails
  await sendUserConfirmation(validatedData.email, referenceCode);
  await sendAdminNotification(validatedData, referenceCode);

  // 5. Return success response
  return {
    success: true,
    referenceCode: "NEX-VO3XYRA",
    message: "Your inquiry has been received..."
  };
}

// lib/schemas/contact.ts (Zod Schema)
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim(),
  // ... more fields
});
```

---

## 🏗️ Code Organization Patterns

### 1. **Server Components (Default)**

- Used by default in Next.js 16 App Router
- Run **only on the server** (generate HTML)
- Cannot use browser APIs (useState, onClick, etc.)
- Great for data fetching, database queries, sensitive operations

```typescript
// components/shared/project-card.tsx
export default function ProjectCard({ project }: Props) {
  // This runs on the server
  return (
    <div>
      <h2>{project.name}</h2>
      {/* ✅ Can't use hooks here */}
    </div>
  );
}
```

### 2. **Client Components**

- Marked with `"use client"` directive at the top
- Run in the browser (can use React hooks)
- Use for interactive elements: buttons, forms, animations
- Keep small and focused; extract server components where possible

```typescript
// components/ui/button.tsx
"use client";

import { useState } from "react";

export function Button({ onClick }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "Click me"}
    </button>
  );
}
```

### 3. **Server Actions**

- Async functions marked with `"use server"`
- Can be called from client components
- Run **only on the server** (secure)
- Use for mutations: form submissions, database updates, external APIs

```typescript
// lib/actions/contact.ts
"use server";

export async function submitContactInquiry(
  formData: unknown,
  captchaToken: string,
): Promise<ContactResponse> {
  // Validate, process, send emails, etc.
  return { success: true, referenceCode: "..." };
}
```

### 4. **Custom Hooks**

- Reusable React logic (useAnimatedCounter, useIntersectionObserverAnimation, etc.)
- Located in `lib/hooks/`
- Can only be used in client components
- Document with JSDoc: @param, @returns, @example

```typescript
// lib/hooks/useAnimatedCounter.ts
export function useAnimatedCounter({ value, duration }: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  // ... animation logic
  return { displayValue, isAnimating };
}
```

### 5. **Validation with Zod**

- All user input is validated with Zod schemas
- Schemas live in `lib/schemas/`
- Provide type safety: `z.infer<typeof schema>`
- Error messages are user-friendly

```typescript
// lib/schemas/contact.ts
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

---

## 🛠️ Key Technologies & Why We Use Them

### **Next.js 16**

- **Why:** App Router provides file-based routing, server components, API routes, built-in optimization
- **Key files:** `app/layout.tsx`, `app/page.tsx`, `app/api/`
- **Docs:** [Next.js Docs](https://nextjs.org/docs)

### **React 19**

- **Why:** Latest React with automatic batching, actions, performance improvements
- **Key patterns:** Server Components, Client Components, Suspense
- **Learn:** React fundamentals, hooks, composition

### **TypeScript (Strict Mode)**

- **Why:** Catches bugs at compile time, improves developer experience, enforces type safety
- **Setup:** `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`
- **Pattern:** All exported functions have JSDoc types; avoid `any`

### **Tailwind CSS**

- **Why:** Utility-first CSS, no build overhead, consistent design system
- **Config:** `tailwind.config.ts` extends default theme
- **Utility:** `lib/utils.ts` provides `cn()` for merging classes

### **Zod**

- **Why:** Runtime schema validation + type inference (no separate TS types needed)
- **Schemas:** `lib/schemas/contact.ts`, `lib/schemas/og.ts`
- **Usage:** Validate form data, API query params, environment variables

### **shadcn/ui**

- **Why:** Headless, composable components built on Radix UI + Tailwind
- **Location:** `components/ui/`
- **Customization:** Copy-paste components into repo, modify as needed

### **Framer Motion**

- **Why:** High-performance animation library with scroll tracking, springs, variants
- **Hooks:** `useAnimatedCounter`, `useParallaxImage` wrap common patterns
- **Bundle:** 12 KB; used in 28+ components; lazy-load candidate

### **Resend**

- **Why:** Email API with beautiful React templates, simple authentication
- **Setup:** `env.RESEND_API_KEY` (from t3-env)
- **Usage:** `lib/email.ts` sends contact confirmations + admin notifications

### **t3-env**

- **Why:** Type-safe environment variables at build time
- **Setup:** `app/env.ts` defines all env vars with Zod schemas
- **Usage:** `import { env } from '@/app/env'`

---

## 📚 Common Tasks

### Task 1: Add a New Page

**Steps:**

1. Create file: `app/my-feature/page.tsx`
2. Add metadata in the component
3. Export default React component (Server Component by default)
4. Link from navigation

**Example:**

```typescript
// app/my-feature/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Feature | Nexgen",
  description: "Feature description..."
};

export default function MyFeaturePage() {
  return (
    <main>
      <h1>My Feature</h1>
      {/* ... */}
    </main>
  );
}
```

### Task 2: Create a Zod Validation Schema

**Steps:**

1. Create file: `lib/schemas/my-feature.ts`
2. Define schema with `.z.object()`, validation rules, and error messages
3. Export inferred type: `export type MyData = z.infer<typeof schema>`
4. Use in components and server actions

**Example:**

```typescript
// lib/schemas/my-feature.ts
import { z } from "zod";

export const myFeatureSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  description: z.string().max(500).optional(),
});

export type MyFeatureData = z.infer<typeof myFeatureSchema>;
```

### Task 3: Write a Server Action

**Steps:**

1. Create file: `lib/actions/my-feature.ts` with `"use server"` at top
2. Import schemas and types
3. Export async function that validates, processes, and returns response
4. Call from client components using form actions or direct calls

**Example:**

```typescript
// lib/actions/my-feature.ts
"use server";

import { myFeatureSchema, type MyFeatureData } from "@/lib/schemas/my-feature";

export async function createMyFeature(
  input: unknown,
): Promise<{ success: boolean; message: string }> {
  try {
    const data = myFeatureSchema.parse(input);

    // Process data, update database, send emails, etc.

    return {
      success: true,
      message: "Feature created!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create feature",
    };
  }
}
```

### Task 4: Add a Custom Hook

**Steps:**

1. Create file: `lib/hooks/useMyHook.ts` with `"use client"` at top
2. Define hook logic using React hooks (useState, useEffect, etc.)
3. Add JSDoc documentation
4. Export types for props and return value
5. Use in client components

**Example:**

```typescript
// lib/hooks/useMyHook.ts
"use client";

import { useState, useEffect } from "react";

export interface UseMyHookProps {
  enabled?: boolean;
}

export interface UseMyHookReturn {
  isReady: boolean;
}

/**
 * Custom hook for my feature
 * @param props - Configuration options
 * @returns Object with isReady state
 */
export function useMyHook({ enabled = true }: UseMyHookProps): UseMyHookReturn {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (enabled) {
      setIsReady(true);
    }
  }, [enabled]);

  return { isReady };
}
```

### Task 5: Write a Unit Test

**Steps:**

1. Create file: `lib/__tests__/my-function.test.ts`
2. Use Vitest + React Testing Library
3. Test behavior, error cases, and edge cases

**Example:**

```typescript
// lib/__tests__/my-function.test.ts
import { describe, it, expect } from "vitest";
import { myFunction } from "@/lib/my-function";

describe("myFunction", () => {
  it("should return expected result", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });

  it("should handle errors", () => {
    expect(() => myFunction("")).toThrow();
  });
});
```

---

## 🚀 Development Workflow

### Setup

```bash
# Clone repo
git clone https://github.com/Herman-Adu/electrical-website.git
cd electrical-website

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Fill in TURNSTILE_SECRET_KEY, RESEND_API_KEY, etc.

# Start dev server
pnpm dev
```

### Development

```bash
# Run dev server (localhost:3000)
pnpm dev

# Type checking
pnpm typecheck

# Linting (ESLint + JSDoc)
pnpm lint

# Format code
pnpm format

# Unit tests
pnpm test

# End-to-end tests
pnpm playwright

# Build for production
pnpm build
```

### Before Committing

```bash
# Ensure types pass
pnpm typecheck

# Ensure lint passes (ESLint, JSDoc)
pnpm lint

# Run tests
pnpm test

# Build to catch runtime errors
pnpm build

# Create feature branch and commit
git checkout -b feature/my-feature
git add .
git commit -m "feat(component): description"
git push origin feature/my-feature
```

---

## 📋 JSDoc Standards

All exported functions must have JSDoc comments. This enables IDE autocomplete, documentation, and type hints.

**Template:**

````typescript
/**
 * Brief description of what the function does
 *
 * **Additional context** (security, performance, side effects, etc.)
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws ZodError if validation fails
 *
 * @example
 * ```typescript
 * const result = myFunction("input");
 * console.log(result);
 * ```
 */
export function myFunction(paramName: string): string {
  // ...
}
````

**Components:**

- **@param** - Describe each parameter with its type and purpose
- **@returns** - Describe the return value and its type
- **@throws** - Document any exceptions that may be thrown
- **@example** - Show real usage example
- **@see** - Link to related functions or types

---

## 🧠 Mental Models

### Server vs Client

```
REQUEST → Next.js Server
  ① Can access database, env vars, API keys
  ② Cannot render interactive UI
  ③ Always runs server code here

     ↓ Serialize + Send HTML/JSON

BROWSER → React Client
  ① Can render UI, attach event listeners
  ② Cannot access secrets or database directly
  ③ Run interactive logic on client

     ↓ User interaction (form, button)

REQUEST → Next.js Server
  ① Server Action runs again
  ② Validates, processes, sends response
  ③ Client updates UI with response
```

### Data Validation Pipeline

```
User Input (unknown)
     ↓
Zod Schema Parse
     ↓
TypeScript Type (ContactFormData)
     ↓
Business Logic (rate limit, email, etc.)
     ↓
Response (ContactResponse)
     ↓
Browser Toast / Navigation
```

---

## 📖 Next Steps

1. **Read the project:**
   - Explore `app/`, `components/`, `lib/` directories
   - Open `package.json` to see available scripts
   - Read `.github/copilot-instructions.md` for custom agent rules

2. **Pick a task:**
   - Fix a bug in [GitHub Issues](https://github.com/Herman-Adu/electrical-website/issues)
   - Add a feature (contact form refinement, new page, etc.)
   - Improve tests or documentation

3. **Build something:**
   - Use the patterns from this guide
   - Reference JSDoc for function signatures
   - Test locally with `pnpm dev`
   - Run lint + typecheck before committing

4. **Learn more:**
   - [Architecture Index](./ARCHITECTURE-INDEX.md) — Detailed component audit
   - [Implementation Guide](./IMPLEMENTATION-GUIDE.md) — Refactoring roadmap
   - [Next.js Docs](https://nextjs.org/docs) — App Router, Server Components
   - [React Docs](https://react.dev) — React patterns, hooks

---

## 🤝 Questions?

- **"Where do I add X?"** → Check [Project Structure](#project-structure)
- **"How do I write Y?"** → Check [Common Tasks](#common-tasks)
- **"What's the pattern for Z?"** → Check [Code Organization Patterns](#code-organization-patterns)
- **"Module not found"** → Check `tsconfig.json` path aliases (`@/` → `src/`)
- **"Lint errors?"** → Run `pnpm lint --fix`

---

**Happy coding! 🚀**
