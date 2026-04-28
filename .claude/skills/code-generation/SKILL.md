---
name: code-generation
description: Use this skill WHENEVER someone on the electrical-website project mentions code, files, implementation, or debugging — even if they don't explicitly ask for "code generation". Use for: writing new components (React/Next.js App Router), refactoring existing code, implementing server actions, creating hooks/utilities, writing tests (unit/integration/e2e with Playwright), debugging TypeScript errors, documenting code. Trigger on: "how do I", "I'm stuck", "can you fix", "what's wrong with this", "build X", "implement Y", "why does this fail", or any mention of TypeScript, React, Next.js, API routes, server actions, Tailwind, Zod, or specific component names.
argument-hint: "[language, goal, or description]"
disable-model-invocation: true
---

# Code Generation Skill — electrical-website

Generates, refactors, debugs, and reviews code for the electrical-website Next.js 16 App Router project (strict TypeScript, Tailwind v4, Zod validation, Server Actions).

## Execution Method

### Step 0: Docker Preflight (Session Start)
- Search for project state: `pnpm docker:mcp:memory:search "electrical-website-state"`
- Load context: `pnpm docker:mcp:memory:open electrical-website-state`
- Extract: active phase, prior code decisions, test coverage status, blockers
- If Docker unavailable: check `.claude/CLAUDE.md` § Session State for fallback notes

**After preflight:** Use `Agent(subagent_type="general-purpose")` to spawn specialised agents for subtasks — never implement >50 LOC directly in main context.

### Step 1: Parse Request
- Identify language, framework, goal
- Clarify ambiguities before coding (ask 1–2 questions max)

### Step 2: Fetch Context (if needed)
- Use Context7 for latest framework docs before writing framework-specific code
- Check `node_modules/next/` for installed Next.js API reference

### Step 3: Super Powers Workflow (features 2h+)
1. **Brainstorm** (extended thinking) — explore scope, user stories, edge cases → output spec
2. **Plan** (Context7 + sequential reasoning) — component hierarchy, API surface, test structure → roadmap
3. **Execute** (TDD) — tests first (unit + integration + edge cases), then implementation to pass them
4. **Verify** — `pnpm typecheck && pnpm build` + auto-review against spec

For bug fixes and quick refactors: skip to Step 4 directly.

### Step 4: Apply Best Practices and Generate Output
- Follow project standards (see Best Practices below)
- Generate code to correct output location (see Output Routing)

---

## Output Format

### For code implementation:
```ts
// Code block with explanation above or below
```

### For documentation:
# Module Documentation
## Overview …
## API / Components …
## Usage Examples …

---

### For tests:
```ts
describe('...', () => {
  test('...', () => {
    // test code
  })
})
```
Run Playwright tests with `PLAYWRIGHT_REUSE_SERVER=true` when dev server is on port 3000.

---

### For debugging:
# Debugging Analysis
## Issue …
## Root Cause …
## Solution …
## Code
```ts
// Fixed code
```

---

### For architecture:
# Architecture Overview
## Components …
## Data Flow …
## Dependencies …

---

## Best Practices

**TypeScript/JavaScript:**
- Use strict mode and explicit typing (avoid `any`)
- Use async/await over callbacks
- Implement error boundaries for React components
- Use Server Actions for mutations; avoid client-side state mutations
- Validate all external input with Zod before processing
- Keep functions under 50 lines; extract utilities

**Testing:**
- Minimum 80% coverage for business logic
- Test happy path + error cases + edge cases
- Use descriptive test names
- Mock external dependencies (APIs, email, databases)

**Performance:**
- Measure before optimizing
- Default to Server Components; use `"use client"` only for browser interactivity
- Lazy-load components and routes
- Cache API responses strategically

**Security:**
- Never hardcode secrets (use environment variables)
- Validate all user input with Zod
- Sanitize before inserting into DOM
- Use HTTPS for all external calls

**Error Handling:**
| Scenario | Action |
|----------|--------|
| API call fails | Retry with exponential backoff; show user message |
| Missing required parameter | Ask user before proceeding |
| Build/compile error | Provide error message + fix suggestions |
| Ambiguous requirement | Ask 1–2 clarifying questions |

## Output Routing

**Where generated code goes:**
- **Feature code** → `app/`, `components/`, `lib/` (not `src/`)
- **Tests** → `__tests__/` or same directory as source; Playwright e2e → `e2e/`
- **Documentation** → `docs/` or inline comments
- **Configuration** → root (`.env`, `tsconfig.json`, `next.config.ts`, etc.)
- **Scripts** → `scripts/` (build, deploy, utility scripts)

---

## Token Efficiency Summary

**Super Powers Workflow (Large Features):**
- Baseline: 8,000 tokens per 10h feature
- With Super Powers: 3,000–5,000 tokens (60–70% savings)
- Savings driver: Sequential thinking + agent delegation + TDD-first

**Standard Workflow (Bugfixes, Refactoring):**
- Baseline: 500–2,000 tokens per task
- No Super Powers overhead for small tasks
