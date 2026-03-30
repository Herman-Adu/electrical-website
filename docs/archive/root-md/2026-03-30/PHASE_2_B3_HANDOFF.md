# PHASE 2 BATCH P2-B3 HANDOFF BRIEF

**Status:** Rate-limited on sub-agents. Handing off P2-B3 to Claude for direct implementation.

**Date:** March 27, 2026  
**Branch:** main (7 commits ahead)  
**Build Status:** ✅ PASSING (0 errors, 45/45 tests)

---

## QUICK CONTEXT

### P2-B1 Completed (8h)

- ticket-007: Rate Limit Fallback (production error handling)
- ticket-009: Vitest Framework (16 tests passing)
- ticket-012: ISR Config (revalidate exports set)
- ticket-014: ESLint Setup (162 baseline warnings)

### P2-B2 Completed (7h)

- ticket-006: useAnimatedCounter Hook (hooks/use-animated-counter.ts created)
- ticket-008: Harden CSP Headers (CSP policy configured)
- ticket-013: Search Params Validation (lib/schemas/search-params.ts, 29 tests)
- ticket-016: JSDoc + ARCHITECTURE.md (docs/ARCHITECTURE-INTRO.md created)

### Current Build State

```
✅ pnpm build  — PASSING (0 errors)
✅ pnpm test   — 45/45 passing (29 search-params + 16 rate-limit tests)
✅ pnpm lint   — 162 warnings (0 errors, P2-B2 added 0 new errors)
```

---

## P2-B3 PARALLEL DISPATCH (8h total effort)

All 4 tickets are **independent** (no blocking dependencies). Process them in parallel or sequentially.

### Ticket-001: Refactor ComponentGrid (2h)

**Location:** [components/ui/component-grid.tsx](components/ui/component-grid.tsx)

**Current State:** Attached in this handoff — modern component with responsive props already implemented.

**Requirements:**

1. ✅ ComponentGrid already refactored (flexible cols, gap, autoFit, render props)
2. Find all consumers of ComponentGrid using:
   ```bash
   grep -r "ComponentGrid" components/ app/ --include="*.tsx"
   ```
3. Update consumers to use new props (no breaking changes expected)
4. Validate: `pnpm build && pnpm lint`
5. Commit: `git commit -m "refactor(components): modernize ComponentGrid structure"`

**Deliverable Checklist:**

- [ ] All ComponentGrid consumers updated
- [ ] pnpm build PASSING
- [ ] pnpm lint: no new errors
- [ ] Commit pushed to main

---

### Ticket-002: Make ProjectCard Responsive (2h)

**Locations to Check:**

- [components/projects/project-card.tsx](components/projects/project-card.tsx)
- [components/projects/project-card-shell.tsx](components/projects/project-card-shell.tsx)

**Requirements:**

1. Use code-search or grep to locate ProjectCard:
   ```bash
   find components/ -name "*project*card*" -type f
   ```
2. Implement responsive design:
   - Mobile-first Tailwind breakpoints (sm, md, lg, xl, 2xl)
   - Flexible image sizing (object-cover, responsive img)
   - Text truncation/expansion per viewport
   - Touch targets: min 48px
   - Adaptive padding/margins
3. Add JSDoc with responsive notes
4. Validate: `pnpm build && pnpm lint`
5. Commit: `git commit -m "refactor(components): add responsive design to ProjectCard"`

**Deliverable Checklist:**

- [ ] Breakpoints implemented (sm/md/lg/xl/2xl)
- [ ] Touch targets ≥48px
- [ ] Image sizing responsive
- [ ] pnpm build PASSING
- [ ] pnpm lint: no new errors
- [ ] Commit pushed to main

---

### Ticket-003: Enhance HeroSection Animations (2h)

**Locations to Check:**

- [components/hero/](components/hero/)
- [components/sections/](components/sections/)

**Available Hooks:**

- NEW: `useAnimatedCounter` (hooks/use-animated-counter.ts) — from P2-B2

**Requirements:**

1. Locate HeroSection component:
   ```bash
   find components/ -name "*hero*" -o -name "*hero*section*"
   ```
2. Implement animations:
   - Fade-in on load (opacity 0→1, duration 600ms)
   - Slide-in for text (translateX/Y, stagger)
   - Parallax scroll on background/images
   - Button hover scale/glow
   - Use existing animation patterns (Framer Motion or CSS)
3. Integrate `useAnimatedCounter` if HeroSection displays stats
4. Performance: minimize layout shifts, use will-change sparingly
5. Add JSDoc with animation notes
6. Validate: `pnpm build && pnpm lint`
7. Commit: `git commit -m "feat(animations): enhance HeroSection with modern effects"`

**Deliverable Checklist:**

- [ ] Animations implemented (fade, slide, parallax, hover)
- [ ] useAnimatedCounter integrated (if applicable)
- [ ] No layout shift issues (check Core Web Vitals concepts)
- [ ] pnpm build PASSING
- [ ] pnpm lint: no new errors
- [ ] Commit pushed to main

---

### Ticket-011: Optimize Metadata & SEO (2h)

**Locations to Check:**

- [lib/metadata.ts](lib/metadata.ts) — UPDATED in P2-B3 (check current state)
- [lib/schemas/metadata-validation.ts](lib/schemas/metadata-validation.ts) — CREATED in P2-B3
- [app/page.tsx](app/page.tsx), [app/projects/page.tsx](app/projects/page.tsx), etc.

**Requirements:**

1. Audit existing metadata coverage:
   ```bash
   grep -r "export const metadata" app/ --include="*.ts" --include="*.tsx"
   ```
2. Ensure all pages have:
   - title, description, keywords
   - og:title, og:description, og:image, og:url, og:type
   - twitter:card, twitter:creator, twitter:title
   - canonical URLs (for dynamic routes)
   - structured data (JSON-LD for projects)
3. Create/update [lib/schemas/metadata-validation.ts](lib/schemas/metadata-validation.ts) with Zod schema
4. Update [lib/metadata.ts](lib/metadata.ts) with helper: `createPageMetadata(title, desc, og)`
5. Add JSDoc for all metadata exports
6. Routes to check: home, about, projects, services, contact, error page
7. Validate: `pnpm build && pnpm lint`
8. Commit: `git commit -m "feat(seo): optimize metadata and OG tags across routes"`

**Deliverable Checklist:**

- [ ] lib/metadata.ts enhanced with helpers
- [ ] lib/schemas/metadata-validation.ts created/updated
- [ ] All major routes have complete metadata
- [ ] Structured data added (JSON-LD)
- [ ] pnpm build PASSING
- [ ] pnpm lint: no new errors
- [ ] Commit pushed to main

---

## IMPLEMENTATION FLOW

### Option A: Direct Implementation (Recommended for Stability)

1. **Start ticket-001** (ComponentGrid) — fastest, known changes
2. **Start ticket-002** (ProjectCard) — mid-complexity
3. **Start ticket-003** (HeroSection) — animation work
4. **Start ticket-011** (Metadata) — SEO/config work

### Option B: Sub-Agent Dispatch (Parallel, Faster)

✅ **Claude CAN use sub-agents** — all 4 tickets are independent and can be dispatched in parallel

- Use `runSubagent` tool (Docker MCP available, no rate-limiting constraints for you)
- Sub-agents work autonomously with full codebase context
- Each returns detailed completion summary
- Faster overall: 4 parallel tasks vs sequential

**Recommended:** Try sub-agent dispatch first. Fall back to direct implementation if needed.

**Validation After Each Ticket (or all 4 if parallel):**

```bash
pnpm build
pnpm test
pnpm lint
git log --oneline -5  # Verify commits
```

**Final Validation After All 4:**

```bash
pnpm build
pnpm test  # Should still be 45/45 passing
pnpm lint  # Should be ≤162 warnings (0 new errors)
git status  # Clean tree
git log --oneline -4  # 4 new commits
```

---

## KEY FILES & TOOLS

### Code Search

```bash
# Find all usages
grep -r "ProjectCard\|HeroSection\|ComponentGrid" components/ app/ --include="*.tsx"

# Find metadata exports
grep -rn "export const metadata" app/

# Find animations/hooks patterns
grep -r "useAnimatedCounter\|framer-motion\|motion\." components/
```

### Build & Validate

```bash
pnpm build          # TypeScript + Next.js build
pnpm test           # Vitest (45 tests)
pnpm lint           # ESLint flat config
```

### Git Workflow

```bash
# After each ticket
git add -A
git commit -m "feat/refactor(...): ticket-XXX description"

# Or individual files
git add components/ui/component-grid.tsx
git commit -m "refactor(components): modernize ComponentGrid"
```

---

## NOTES FOR CLAUDE

- **P2-B1 & P2-B2 are complete** — all foundational work done (vitest, rate-limit, CSP, search-params validation, useAnimatedCounter hook)
- **P2-B3 is all component refactoring + metadata optimization** — no infrastructure changes
- **✅ Sub-agents ARE enabled** — use `runSubagent` tool for parallel dispatch (Docker MCP server available)
- **✅ Docker MCP available** — use Docker MCP tools (search, code analysis, etc.) as needed via `runSubagent` context
- **Build is currently PASSING** — maintain 0 errors, 45 tests, ≤162 lint warnings
- **All commits should go to main** — no feature branches for P2 batches
- **Each ticket is independent** — can be done in any order or in parallel via sub-agents

---

### Sub-Agent Dispatch Prompts (Copy/Paste Ready)

All tickets below can be dispatched in parallel. Use these prompts as-is or adapt them.

---

## PARALLEL SUB-AGENT DISPATCH (P2-B3)

Use this workflow to dispatch all 4 tickets in parallel:

```typescript
runSubagent(ticket001_prompt); // ComponentGrid
runSubagent(ticket002_prompt); // ProjectCard
runSubagent(ticket003_prompt); // HeroSection
runSubagent(ticket011_prompt); // Metadata
```

### Ticket-001 Sub-Agent Prompt

**Prompt:**

```
TASK: ticket-001 — Refactor ComponentGrid Component Structure (2h)

Context:
- Repo: Herman-Adu/electrical-website (Next.js 16, TypeScript, Tailwind)
- Branch: main (8 commits ahead, build PASSING, 45 tests passing)
- This is P2-B3 ticket-001 (parallel dispatch with 3 others)

Objective:
Refactor ComponentGrid component to use modern React patterns and verify all consumers work with new flexible props.

Requirements:
1. Use code-search to find component-grid.tsx (likely components/ui/)
2. Component is already modernized with responsive cols, gap, autoFit, render props
3. Find all ComponentGrid consumers across components/ and app/
4. Update consumers to use new props (no breaking changes expected)
5. Add JSDoc if missing
6. Run pnpm build && pnpm lint validation
7. Commit: "refactor(components): modernize ComponentGrid structure"

Deliverables:
- All ComponentGrid consumers updated
- pnpm build PASSING (0 errors)
- pnpm lint: no new errors from this ticket
- Commit pushed to main
- Summary: files updated count, consumers verified, validation results

Use code-search skill to locate all usages of ComponentGrid across the codebase.
```

### Ticket-002 Sub-Agent Prompt

**Prompt:**

```
TASK: ticket-002 — Make ProjectCard Component Responsive (2h)

Context:
- Repo: Herman-Adu/electrical-website (Next.js 16, TypeScript, Tailwind)
- Branch: main (8 commits ahead, build PASSING)
- This is P2-B3 ticket-002 (parallel dispatch with 3 others)

Objective:
Enhance ProjectCard component with full responsive design for mobile, tablet, and desktop viewports.

Requirements:
1. Use code-search to locate ProjectCard component (likely components/projects/)
2. Implement responsive improvements:
   - Mobile-first Tailwind breakpoints (sm, md, lg, xl, 2xl)
   - Flexible image sizing (object-cover, responsive img srcset)
   - Text truncation/expansion based on viewport
   - Touch-friendly targets (min 48px)
   - Adaptive padding/margins
3. Add JSDoc with responsive coverage notes
4. Run pnpm build && pnpm lint validation
5. Commit: "refactor(components): add responsive design to ProjectCard"

Deliverables:
- Updated ProjectCard component with all breakpoints
- Responsive improvements verified
- pnpm build PASSING (0 errors)
- pnpm lint: no new errors from this ticket
- Commit pushed to main
- Summary: breakpoints implemented, responsive patterns, validation results

Use code-search skill to analyze current ProjectCard structure and responsive coverage.
```

### Ticket-003 Sub-Agent Prompt

**Prompt:**

```
TASK: ticket-003 — Enhance HeroSection with Advanced Animations (2h)

Context:
- Repo: Herman-Adu/electrical-website (Next.js 16, TypeScript, Tailwind)
- Branch: main (8 commits ahead, build PASSING)
- NEW: useAnimatedCounter hook available (hooks/use-animated-counter.ts from P2-B2)
- This is P2-B3 ticket-003 (parallel dispatch with 3 others)

Objective:
Enhance HeroSection component with modern animations (fade-in, slide, scale, parallax effects).

Requirements:
1. Use code-search to locate HeroSection component (likely components/hero/ or components/sections/)
2. Implement animations:
   - Fade-in on page load (opacity, duration 600ms)
   - Slide-in for hero text (translateX/Y, stagger effect)
   - Parallax scroll effect on background/images
   - Button hover scale/glow effects
   - Use existing animation approach (Framer Motion or CSS)
3. Integrate useAnimatedCounter hook if HeroSection displays stats
4. Performance-check: minimize layout shifts, use will-change sparingly
5. Add JSDoc with animation notes
6. Run pnpm build && pnpm lint validation
7. Commit: "feat(animations): enhance HeroSection with modern effects"

Deliverables:
- Updated HeroSection with animations (fade, slide, parallax, hover)
- useAnimatedCounter integrated if applicable
- No performance regressions (Core Web Vitals friendly)
- pnpm build PASSING (0 errors)
- pnpm lint: no new errors from this ticket
- Commit pushed to main
- Summary: animation types, dependencies used, performance notes, validation results

Use code-search skill to analyze existing HeroSection and animation patterns in codebase.
```

### Ticket-011 Sub-Agent Prompt

**Prompt:**

```
TASK: ticket-011 — Optimize Metadata and SEO Tags (2h)

Context:
- Repo: Herman-Adu/electrical-website (Next.js 16, TypeScript, Zod)
- Branch: main (8 commits ahead, build PASSING)
- Existing: lib/metadata.ts, lib/schemas/metadata-validation.ts
- This is P2-B3 ticket-011 (parallel dispatch with 3 others)

Objective:
Enhance metadata handling for improved SEO, social sharing, and search engine optimization across all routes.

Requirements:
1. Use code-search to find all metadata exports in app/*/page.tsx and lib/metadata*.ts
2. Audit existing metadata coverage for:
   - title, description, keywords
   - og:title, og:description, og:image, og:url, og:type
   - twitter:card, twitter:creator, twitter:title
   - mobile viewport, canonical URLs
   - structured data (JSON-LD)
3. Enhance lib/metadata.ts with helper: createPageMetadata(title, desc, og) with Zod validation
4. Ensure lib/schemas/metadata-validation.ts exists with Zod schema for metadata
5. Update all major pages (home, about, projects, services, contact, error) with complete metadata
6. Add structured data (JSON-LD) where applicable
7. Run pnpm build && pnpm lint validation
8. Commit: "feat(seo): optimize metadata and OG tags across routes"

Deliverables:
- lib/metadata.ts enhanced with createPageMetadata helper
- lib/schemas/metadata-validation.ts created/validated
- All major routes updated with complete metadata
- Structured data (JSON-LD) added for projects/products
- pnpm build PASSING (0 errors)
- pnpm lint: no new errors from this ticket
- Commit pushed to main
- Summary: metadata audit results, routes updated count, helpers created, validation results

Use code-search skill to find all metadata exports and audit current coverage.
```

---

## SUMMARY

All 4 prompts are ready. Dispatch them in parallel via `runSubagent()` and collect results. Each sub-agent will:

1. Autonomously analyze the codebase
2. Make necessary changes
3. Validate locally (pnpm build/test/lint)
4. Commit to main
5. Return detailed summary

**Expected total time:** ~2 hours (parallel execution)

---

## EXPECTED OUTPUTS

After completing P2-B3:

```
✅ pnpm build  — 0 errors
✅ pnpm test   — 45/45 tests passing
✅ pnpm lint   — 162-170 warnings (no new errors)
✅ git log     — 4 new commits (one per ticket)
✅ All features integrated and ready for merge
```

---

## HANDOFF COMPLETE

Claude can now proceed with **EITHER**:

1. **Sub-agent dispatch** (faster): Use `runSubagent()` to dispatch all 4 tickets in parallel (see prompts above)
2. **Direct implementation** (stable): Use code-search + direct file edits

**Docker MCP is available** — all tools (code-search, file ops, git, etc.) are accessible via Docker MCP gateway.

All context is embedded in this document and linked file attachments.

**Ready to dispatch! 🚀**
