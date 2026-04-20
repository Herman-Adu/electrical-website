---
name: code-generation
description: Use this skill WHENEVER the user mentions code, files, implementation, or debugging — even if they don't explicitly ask for "code generation". Use for: writing new code, refactoring existing code, explaining logic, implementing features, creating components/functions, writing tests (unit/integration/e2e), debugging errors, documenting code. Trigger on: "how do I", "I'm stuck", "can you fix", "what's wrong with this", "build X", "implement Y", "why does this fail", or any mention of TypeScript, React, API endpoints, database queries, or specific languages/frameworks.
argument-hint: "[language, goal, or description]"
disable-model-invocation: true
---

## Project Stack (auto-injected)

!`cat context/work.md 2>/dev/null || echo "No project context available. Ask the user to specify the language, framework, and project goals."`

# Code Generation Skill

A system that generates, explains, refactors, documents, and reviews code across multiple languages and frameworks.
This skill acts as the Senior Engineer of the Executive Assistant.

It integrates with:

- Research Skill (technical comparisons, best practices)
- Planning Skill (dev roadmaps, task breakdowns)
- Brand Voice Skill (developer-friendly documentation)
- Content Creation Skill (technical blogs, release notes)

## Execution Method

**Step 0: Docker Preflight (Session Start)**
- Search for project state: `mcp__MCP_DOCKER__search_nodes("electrical-website-state")`
- Load context: `mcp__MCP_DOCKER__open_nodes([returned_entity_ids])`
- Extract: active phase, prior code decisions, test coverage status, blockers
- If Docker unavailable: check `.claude/CLAUDE.md` § Session State for fallback notes
- This ensures code work builds on verified prior context and architectural decisions

**Workflow Selection:**

Choose your workflow based on task size and requirements:

→ See [README.md](README.md) for detailed **Super Powers Workflow** (large features) and **Standard Workflow** (quick tasks) including step-by-step instructions and decision matrix.

**Quick reference:**
- **Super Powers:** Use for features 2–3h+, architecture redesigns, critical features
- **Standard:** Use for bug fixes, quick refactors, one-off utilities

**Core steps for both (after Docker Preflight):**
1. Parse request (language, framework, goal)
2. Fetch context via Context7 (if needed) for latest framework docs
3. Delegate to code-generation agent (if needed)
4. Apply best practices
5. Generate output and verify

---

## Output Format

### For code implementation:

```ts
// Code block with explanation above or below
```

### For documentation:

# Module Documentation

## Overview
…

## API / Components
…

## Usage Examples
…

---

### For tests:

```ts
// Test file with clear test cases
describe('...', () => {
  test('...', () => {
    // test code
  })
})
```

---

### For debugging:

# Debugging Analysis

## Issue
…

## Root Cause
…

## Solution
…

## Code
```ts
// Fixed code
```

---

### For architecture:

# Architecture Overview

## Components
…

## Data Flow
…

## Dependencies
…

---

## Best Practices

**TypeScript/JavaScript:**
- Use strict mode and explicit typing (avoid `any`)
- Use async/await over callbacks
- Implement error boundaries for React components
- Use middleware for cross-cutting concerns
- Keep functions under 50 lines; extract utilities

**Testing:**
- Minimum 80% coverage for business logic
- Test happy path + error cases
- Use descriptive test names
- Mock external dependencies (APIs, databases)

**Performance:**
- Measure before optimizing
- Lazy-load components and routes
- Debounce rapid event handlers
- Cache API responses strategically

**Security:**
- Never hardcode secrets (use environment variables)
- Validate all user input
- Sanitize before inserting into DOM
- Use HTTPS for all external calls

**Error Handling:**
| Scenario | Action |
|----------|--------|
| API call fails | Retry with exponential backoff; show user message |
| Missing required parameter | Ask user before proceeding |
| Build/compile error | Provide error message + fix suggestions |
| Ambiguous requirement | Ask 1-2 clarifying questions |

## Output Routing

**Where generated code goes:**
- **Feature code** → `src/` (components, utilities, hooks)
- **Tests** → `__tests__/` or same directory as source
- **Documentation** → `docs/` or inline comments
- **Configuration** → `config/` or root (`.env`, `.tsconfig`, etc.)
- **Scripts** → `scripts/` (build, deploy, utility scripts)

## When NOT to Use

❌ Do NOT use code-generation for:
- Code that requires real security testing before production (verify Super Powers auto-review output)
- Complex algorithms needing peer review first (pair with /research skill for algorithm validation)
- Code that integrates with external payment/auth systems without audit (manual review mandatory)
- Refactoring without understanding the full codebase context (pair with /planning skill first)
- Writing code to replace learning (always review and understand generated code)
- Performance-critical paths without profiling (Super Powers TDD helps, but manual optimization often needed)

---

## Token Efficiency Summary

**Super Powers Workflow (Large Features):**
- Baseline: 8,000 tokens per 10h feature
- With Super Powers: 3,000–5,000 tokens (60–70% savings)
- Savings driver: Sequential thinking replaces exploration steps; agent delegation scales to parallel subtasks

**Standard Workflow (Bugfixes, Refactoring):**
- Baseline: 500–2,000 tokens per task
- Stays efficient (agent delegation + Context7 docs)
- No Super Powers overhead for small tasks

---

## Notes

- See `README.md` for documentation and code generation templates.
