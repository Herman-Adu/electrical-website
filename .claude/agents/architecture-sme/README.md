# Architecture SME Agent

## Overview

The **Architecture SME** analyzes the **structural design** of features before implementation. It focuses on component hierarchy, data flow, performance efficiency, and architectural patterns.

## When to Use

Dispatch this agent when:
- Designing new components or pages
- Deciding where state should live (lifting, shared state, client vs. server)
- Optimizing performance (rendering, bundle size, data fetching)
- Refactoring components (changing structure, extracting shared logic)
- Making decisions about Server Components vs. Client Components

## What It Analyzes

| Dimension | Questions |
|-----------|-----------|
| **Component Hierarchy** | How should components be nested? Are there islands vs. shell? |
| **Data Flow** | Where do queries live? How does data move between components? |
| **Rendering Efficiency** | Will this cause unnecessary re-renders? Can we optimize? |
| **Performance** | Will bundle size increase? Are there network waterfalls? |
| **Reusability** | Can this component be extracted and reused elsewhere? |

## Example Finding

```
Finding: Form Island Pattern

- **Rationale:** Form state doesn't need page-level scope. 
  Isolating it reduces re-renders across the page.
- **Implementation note:** Make form a client component, wrap in error boundary.
- **Blocking?** No, but improves performance.
```

## Tools It Uses

- `mcp__MCP_DOCKER__*` — load prior architectural decisions
- `context7` — fetch latest Next.js 16 docs
- `Grep` / `Read` — inspect component structure
- `sequential-thinking` — analyze complex hierarchies

## How to Read Its Output

The agent returns a structured analysis:

```
## Domain: Next.js 16 Architecture

### Finding 1: [Specific architectural issue]
- **Rationale:** Why it matters
- **Implementation note:** How to address it
- **Blocking?** Yes/No

### Potential Conflicts
- [If architecture conflicts with validation, security, or QA]

### Recommended Component Order
1. [Build X first]
2. [Then Y, depends on X]
```

## Key Next.js 16 Patterns It Enforces

- **Server-First:** Server Components by default, `"use client"` only for interactivity
- **Mutations:** Use Server Actions, never POST/PUT/DELETE from client
- **Streaming:** Use `<Suspense>` for slow data, don't block on slow queries
- **Images:** Use `<Image />`, not `<img />`
- **CSS:** CSS modules or Tailwind, not inline styles

## Success Criteria

You'll know the agent did good analysis when:

- ✅ You understand the recommended component structure
- ✅ Data flow is clear (who fetches, where it goes)
- ✅ Performance implications are explicit
- ✅ Trade-offs are visible (option A vs. option B, why chosen)

---

**Role:** Architecture analyst (reads findings, doesn't code)  
**Dispatch:** Before implementing components, refactoring structure, or optimizing performance  
**Duration:** ~3–5 minutes analysis + response
