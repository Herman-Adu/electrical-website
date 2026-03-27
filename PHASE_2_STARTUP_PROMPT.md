🚀 PHASE 2 CONTINUATION PROMPT FOR NEW CHAT WINDOW

## CONTEXT SUMMARY

**Project:** electrical-website (Next.js 16 + React 19)  
**Current Status:** ✅ Phase 1 COMPLETE & MERGED TO MAIN  
**Branch:** main (5 commits ahead of origin/main)  
**Last Merge:** Phase 1 integration complete (commit 4e94ff6)

---

## PHASE 1 COMPLETION (JUST COMPLETED)

### ✅ All 5 Tickets Complete (48h deadline)

- **ticket-001:** Add CAPTCHA (Turnstile) ✅ 2h
- **ticket-002:** Fix /api/og Route Auth ✅ 30m
- **ticket-003:** Update glob CVE ✅ 15m
- **ticket-004:** Fix Hydration Mismatches (6 comp) ✅ 3h
- **ticket-005:** Update Tailwind Syntax (18x) ✅ 30m

### Documentation Created

- `PHASE_1_COMPLETION_REPORT.md` - Detailed results + metrics
- `TICKET-004-COMPLETION-REPORT.md` - Hydration fixes breakdown
- `PHASE_1_BRANCH_STRUCTURE.md` - Branch hierarchy reference

### Build Status

- ✅ Production build: PASSING (0 TypeScript errors, 5.2s)
- ✅ Tests: 27/27 passing
- ✅ Type errors: 0 (fixed captcha type error)

### Branches Created

- `feat/phase-1-immediate-tickets` (feature branch) - merged to main
- 5 ticket branches (001-005) at commit 59dc26f for reference

---

## PHASE 2 IMMEDIATE TICKETS (Week 2-3)

**Duration:** 7 days (estimates flexible)  
**Total Effort:** ~24 hours across 12 tickets  
**Deadline:** April 3, 2026

### QUICK TICKET REFERENCE

| ID  | Title                              | Effort | Agent Assignment          |
| --- | ---------------------------------- | ------ | ------------------------- |
| 006 | Extract useAnimatedCounter Hook    | 3h     | code-intel + browser-test |
| 007 | Fix Rate Limit Fallback            | 1h     | devtools + code-intel     |
| 008 | Harden CSP                         | 1h     | security + code-intel     |
| 009 | Setup Vitest                       | 4h     | devtools + code-intel     |
| 010 | Refactor SmartLiving (570→200 LOC) | 5h     | code-intel + browser-test |
| 011 | Refactor CtaPower (419→200 LOC)    | 5h     | code-intel + browser-test |
| 012 | Add ISR Config                     | 1h     | code-intel                |
| 013 | Add Search Params Validation       | 2h     | code-intel                |
| 014 | Setup ESLint                       | 2h     | devtools                  |
| 015 | Add Suspense Boundaries            | 4h     | code-intel + browser-test |
| 016 | Add JSDoc + ARCHITECTURE.md        | 3h     | code-intel + docs         |
| 017 | Add E2E Test Coverage              | 4h     | browser-testing           |

---

## PHASE 2 EXECUTION STRATEGY

### 🎯 Recommended Batches

**Batch P2-B1 (Infra & Tooling - 8h)**

- ticket-009: Setup Vitest (4h)
- ticket-014: Setup ESLint (2h)
- ticket-012: Add ISR Config (1h)
- ticket-007: Fix Rate Limit Fallback (1h)

**Batch P2-B2 (Security & Performance - 7h)**

- ticket-008: Harden CSP (1h)
- ticket-013: Add Search Params Validation (2h)
- ticket-006: Extract useAnimatedCounter Hook (3h)
- ticket-016: Add JSDoc + ARCHITECTURE.md (1h intro)

**Batch P2-B3 (Component Refactors - 10h)**

- ticket-010: Refactor SmartLiving (5h)
- ticket-011: Refactor CtaPower (5h)

**Batch P2-B4 (UI & Testing - 8h)**

- ticket-015: Add Suspense Boundaries (4h)
- ticket-017: Add E2E Test Coverage (4h)

### 🔄 Parallelization Opportunities

- ticket-009 (Vitest) + ticket-014 (ESLint) can run in parallel
- ticket-010 (SmartLiving) + ticket-011 (CtaPower) can run in parallel
- ticket-006 (useAnimatedCounter) independent
- ticket-008, 012, 013, 007 can parallelize

---

## SUCCESS METRICS TO TRACK

### Code Quality

- Test Coverage: 0% → 40% (after Vitest + E2E suite)
- Code Duplication: 360 LOC → 0 LOC (after refactors 010-011)
- LOC Reduction: SmartLiving 570→200, CtaPower 419→200
- Linter: ESLint strict mode enabled, 0 critical warnings

### Performance

- Component refactors: Remove 370+ LOC of unnecessary code
- useAnimatedCounter extraction: Reusable hook pattern
- Suspense boundaries: Improve Time to Interactive

### Security

- CSP hardening: Migrate to strict CSP policy
- Search params validation: All routes validated with Zod
- Rate limiting: Fallback strategy implemented

### Architecture

- ISR config: Implement cache invalidation strategy
- JSDoc coverage: 100% on exported functions
- ARCHITECTURE.md: Document system design decisions

---

## DEPENDENCIES & CONSTRAINTS

### From Phase 1 (Now Available)

✅ Turnstile CAPTCHA integration (ticket-001)  
✅ OG route auth (ticket-002)  
✅ Hydration fixes (ticket-004)  
✅ Glob CVE resolved (ticket-003)

### Phase 2 Prerequisites

- Node.js v20+ with pnpm
- Docker MCP available (16 servers)
- All Phase 1 PRs merged & validated

### Known Backlog Items (Phase 2+)

- 20+ Tailwind v4 migration instances in SVG components (future ticket)
- Additional CSP refinements (Phase 3)

---

## LOCAL DEVELOPMENT SETUP

```bash
# Current state
git branch -v
# main (HEAD) - 5 commits ahead of origin/main

# Verify Phase 1 build
pnpm build           # ✅ Should pass (0 errors)
pnpm run test:e2e    # Requires dev server: pnpm dev

# Create Phase 2 feature branch
git checkout -b feat/phase-2-week2-3

# Create batch branches (as needed)
git branch feat/phase-2-ticket-009-vitest
git branch feat/phase-2-ticket-014-eslint
# ... etc for each batch
```

---

## KEY FILES & REFERENCES

### Phase 1 Documentation (In repo)

- `PHASE_1_COMPLETION_REPORT.md` - Full Phase 1 breakdown
- `TICKET-004-COMPLETION-REPORT.md` - Hydration fixes detail
- `PHASE_1_BRANCH_STRUCTURE.md` - Branch organization

### Code Quality Reports

- `CODE_QUALITY_AUDIT.md` - Current baseline
- `docs/remediation-status.md` - Remediation tracker (updated)
- `docs/remediation-plan.md` - Master plan

### Architecture & Configuration

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind v4 config
- `tsconfig.json` - TypeScript strict mode
- `lib/site-config.ts` - Runtime configuration

### Testing & E2E

- `playwright.config.ts` - E2E configuration
- `e2e/` - Test suites (captcha-integration.spec.ts, og-route-auth.spec.ts created in Phase 1)
- No Vitest config yet (ticket-009)

---

## COMMAND CHECKLIST FOR NEW CHAT

When you load this in a new chat, start with:

```bash
# 1. Verify Phase 1 merge status
git log --oneline -5
git status

# 2. Verify build still passes
pnpm build

# 3. Check Phase 1 documentation exists
ls -la PHASE_1_*.md
ls -la TICKET-*.md

# 4. Identify current working branch
git branch -v

# 5. Ready to start Phase 2
# → Create feat/phase-2-week2-3 branch
# → Dispatch sub-agents for parallel batches
# → Update memory with Phase 2 progress
```

---

## NEXT IMMEDIATE ACTIONS

**For Phase 2 Start in New Chat:**

1. **Verify Setup**
   - Confirm Phase 1 merged to main ✅
   - Build passing ✅
   - All Phase 1 docs present ✅

2. **Create Phase 2 Branch Structure**
   - `feat/phase-2-week2-3` (feature branch)
   - Batch-specific branches for parallelization

3. **Dispatch Sub-agents**
   - Batch P2-B1: Infra (Vitest, ESLint, ISR, Rate Limit)
   - Batch P2-B2: Security (CSP, Search Params, Hook, JSDoc intro)
   - Batches P2-B3 & P2-B4 sequential after first batches

4. **Update Memory**
   - Store Phase 2 ticket definitions in knowledge graph
   - Track parallel dispatch results
   - Update remediation status tracker

5. **Validation Gates**
   - `pnpm build` after each batch
   - TypeScript strict check
   - Test coverage tracking

---

## EXECUTION WORKFLOW (Phase 2)

```
START NEW CHAT
  ↓
[Verify Phase 1 merged & main clean]
  ↓
Create feat/phase-2-week2-3 branch
  ↓
Dispatch Batch P2-B1 (parallel: Vitest + ESLint + ISR + Rate Limit)
  ├→ Sub-agent: ticket-009 (Vitest)
  ├→ Sub-agent: ticket-014 (ESLint)
  ├→ Sub-agent: ticket-012 (ISR)
  └→ Sub-agent: ticket-007 (Rate Limit)
  ↓
[Validate batch 1: build, tests, coverage]
  ↓
Dispatch Batch P2-B2 (Security & Performance)
  ├→ Sub-agent: ticket-008 (CSP)
  ├→ Sub-agent: ticket-013 (Search Params)
  ├→ Sub-agent: ticket-006 (useAnimatedCounter)
  └→ Sub-agent: ticket-016 (JSDoc intro)
  ↓
[Validate batch 2: build, type check]
  ↓
Dispatch Batch P2-B3 (Sequential: Component Refactors)
  ├→ Sub-agent: ticket-010 (SmartLiving)
  └→ Sub-agent: ticket-011 (CtaPower)
  ↓
[Validate batch 3: build, UI smoke test]
  ↓
Dispatch Batch P2-B4 (Final: Boundaries & E2E Coverage)
  ├→ Sub-agent: ticket-015 (Suspense Boundaries)
  └→ Sub-agent: ticket-017 (E2E Test Coverage)
  ↓
[Final validation: full build + all tests]
  ↓
Merge feat/phase-2-week2-3 → main
  ↓
Push → origin/main
  ↓
PHASE 2 COMPLETE ✅
```

---

## KEY PATTERNS FROM PHASE 1

✅ Always create feature branches (not work on main directly)  
✅ Create ticket-specific branches as snapshots  
✅ Use sub-agents for parallel independent work  
✅ Run `pnpm build` after each batch  
✅ Document completion in PHASE_X_COMPLETION_REPORT.md  
✅ Check for type errors (sub-agents must validate own work)  
✅ Commit messages: `feat/fix/refactor(component): ticket-X description`

---

## CONTEXT FOR AGENTS

- **Repository:** Herman-Adu/electrical-website (private)
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript strict
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + custom components
- **Validation:** Zod (all external inputs)
- **Testing:** Playwright (E2E), Vitest (unit - Phase 2)
- **Form Handling:** react-hook-form + Server Actions
- **Animation:** Framer Motion (post-hydration safe)
- **Target Node:** v20+ with pnpm

---

**Status:** ✅ PHASE 1 COMPLETE & READY FOR PHASE 2

**Ready?** Copy this prompt, open new chat, paste it, and begin Phase 2!

---

_Prompt Generated: March 27, 2026_  
_Phase 1 Completion: 4e94ff6 (main)_  
_Build Status: ✅ Passing_  
_Context Synced: ✅ Full_
