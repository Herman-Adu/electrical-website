---
name: code-generation
description: Use when someone asks to generate code, refactor code, explain code, create components, write tests, debug errors, or document modules.
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

### Super Powers Workflow (Recommended for Large Features)

Use this workflow for substantial features, architectural decisions, or multi-component projects (2–3h+ effort). This pattern combines spec-driven development (TDD) with subagent orchestration.

**Step 0: Brainstorm** (via extended thinking)
- Goal: Generate a comprehensive spec document before any code
- Process: Use sequential thinking (mcp__MCP_DOCKER__sequentialthinking) to explore:
  - Feature scope + boundaries
  - User stories + acceptance criteria
  - Component architecture + data flow
  - Error scenarios + edge cases
- Output: Structured spec doc (markdown, 500–1000 words)
- Why: Specs reduce rework, ensure requirements clarity, enable TDD
- **Live context:** Inject project context (context/work.md, current project stack)

**Step 1: Write Plan** (via sequential thinking + Context7)
- Goal: Create an implementation roadmap from the spec
- Process:
  - Inject Context7 library docs (resolve framework → get-library-docs)
  - Use sequential thinking to design component hierarchy, API surface, test structure
  - Break down into subtasks: setup, core features, error handling, tests, docs
- Output: Implementation plan with file structure, component signatures, test outline
- Why: Plans enable parallel work, reduce backtracking, target 60–70% token savings
- **Live context:** Include framework docs, project style guide, testing patterns

**Step 2: Execute Plan** (via agent delegation + auto-review)
- Goal: Generate code + tests following the plan
- Process:
  - Delegate to code-generation agent for each subtask (components, tests, etc.)
  - Generate tests FIRST (TDD discipline)
  - Generate implementation code to make tests pass
  - Generate docs/exports
  - Auto-review: Check code against spec, verify tests pass, validate types
- Output: Production-ready code (components, tests, documentation)
- Why: Structured execution reduces errors, TDD ensures correctness, auto-review catches issues early

**Metrics:** Super Powers workflow targets 60–70% token savings vs. baseline (3,000–5,000 tokens per 10h feature vs. 8,000 baseline)

---

### Standard Workflow (For Small Tasks, Bug Fixes, Refactoring)

Use for debugging, small refactors, one-off code generation, or when speed is more important than comprehensive planning.

1. **Parse the request**
   - The request is: $ARGUMENTS
   - Identify the language (JS, TS, Python, Go, Rust, etc.)
   - Identify the framework (React, Next.js, Node, Express, etc.)
   - Identify the goal (build, refactor, debug, document)

2. **Fetch context via Context7** (if needed)
   - Before agent delegation, resolve relevant library documentation:
   - Identify framework/library involved (e.g., "React", "TypeScript", "Node.js")
   - Call `mcp__MCP_DOCKER__resolve-library-id [framework-name]` to identify exact library ID
   - Call `mcp__MCP_DOCKER__get-library-docs [library-id]` to fetch current docs
   - Inject resolved docs into agent context for accurate, up-to-date patterns
   - Fallback: If library resolution fails, proceed with agent using cached patterns from training data
   - **Why:** Ensures code follows latest framework conventions, API changes, and best practices (not stale training data)

3. **If needed, call the Code Generation Agent**
   - Call `.claude/agents/code-generation/AGENT.md` with:
     - `subtask`: [the specific technical request: debugging, refactoring, test generation, error explanation, architecture mapping, or language transformation]
     - `code`: [optional code to analyze]
     - `context`: [stack preferences, project notes, architectural patterns, + Context7 library docs if resolved]
   - Use the agent for: code analysis, technical subtasks, pattern identification, refactoring strategies
   - Do NOT use the agent for: final output polish or documentation (keep at Opus level)

4. **Apply best practices**
   - Use modern, idiomatic patterns
   - Follow security and performance guidelines
   - Respect the user’s preferred stack (stored in context)

5. **Integrate Planning Skill (optional)**
   - If the request is part of a dev project, update dev tasks

6. **Generate the final output** (ultrathink)
   - Synthesize all analysis, best practices, and framework knowledge
   - Clean, readable, production-ready code
   - Or clear explanations, diagrams, or documentation

---

## When to Use Each Workflow

| Scenario | Use | Why |
|----------|-----|-----|
| New feature (2–3h+) | **Super Powers** | Specs prevent rework, TDD ensures correctness, 60–70% token savings |
| Bug fix / Quick refactor | **Standard** | Faster feedback loop, less overhead |
| Ambiguous requirements | **Super Powers** | Brainstorm step clarifies scope before building |
| Performance optimization | **Standard** | Quick analysis + targeted fixes; minimal planning needed |
| Architecture redesign | **Super Powers** | Plan step ensures stakeholder alignment, prevents mistakes |
| One-off utility function | **Standard** | Overhead not justified |
| Critical production feature | **Super Powers** | TDD + auto-review catches issues early |

---

## Super Powers Subagent Orchestration

When using Super Powers workflow:
- **Brainstorm** delegate to sequential thinking (built-in)
- **Plan** step can delegate to planning skill for roadmap synthesis
- **Execute** step delegates to code-generation agent (Haiku) for fast iterations
- **Auto-review** returns to Opus level (this skill) for final polish
- **Main context stays clean:** All heavy lifting delegated; main skill coordinates
- **Token efficiency:** Specialized agents (Haiku) handle 80% of work; Opus handles 20% (coordination + synthesis)

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
