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

1. **Start ticket-001** (ComponentGrid) — fastest, known changes
2. **Start ticket-002** (ProjectCard) — mid-complexity
3. **Start ticket-003** (HeroSection) — animation work
4. **Start ticket-011** (Metadata) — SEO/config work

**Validation After Each Ticket:**
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
- **No sub-agents needed** — all work can be done directly via code-search, file edits, and local validation
- **Build is currently PASSING** — maintain 0 errors, 45 tests, ≤162 lint warnings
- **All commits should go to main** — no feature branches for P2 batches
- **Each ticket is independent** — can be done in any order or in parallel

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

Claude can now proceed with direct implementation of P2-B3 without sub-agents or rate-limiting concerns. All context is embedded in this document and linked file attachments.

**Go! 🚀**
