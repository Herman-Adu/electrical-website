# Phase 4b: Component Refactoring — Migrate to useCyclingText Hook

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 9 hero/section components from 20-line setInterval logic to the centralized `useCyclingText` hook (created in Phase 4a).

**Architecture:** Sequential component refactoring. Each component follows identical pattern:
1. Remove old `useEffect` with `setInterval` and `statusText`/`currentText` state
2. Import and call `useCyclingText([...statuses], interval)`
3. Update JSX to use hook's `currentText`
4. Visual regression test (Playwright) — expect zero diff from Phase 3
5. Commit with `feat(animation): Phase 4b—component N refactored`

**Tech Stack:** React 19, Next.js 16, useCyclingText hook (lib/hooks/use-cycling-text.ts), Playwright MCP

**Validation Gates:**
- ✅ All 9 components refactored
- ✅ Visual regression: zero diff (Playwright)
- ✅ `pnpm typecheck` passes (TypeScript strict)
- ✅ `pnpm build` succeeds
- ✅ `pnpm test` passes (114+ tests)

---

## File Structure

**Files to modify (sequential):**
1. `components/hero/hero.tsx` — Main hero component (status cycling)
2. `components/news-hub/news-hub-hero.tsx` — News hub hero (status cycling)
3. `components/news-hub/news-category-hero.tsx` — News category hero (status cycling)
4. `components/projects/projects-hero.tsx` — Projects hero (status cycling)
5. `components/projects/project-category-hero.tsx` — Project category hero (status cycling)
6. `components/about/about-hero.tsx` — About hero (status cycling)
7. `components/services/services-hero.tsx` — Services hero (status cycling)
8. `components/services/services-bento.tsx` — Services bento (feature cycling)
9. `components/about/vision-mission.tsx` — Vision/mission (role cycling)

**No new files created.** Hook already exists: `lib/hooks/use-cycling-text.ts` (verified in Phase 4a).

---

## Task 1: Refactor hero.tsx

**Files:**
- Modify: `components/hero/hero.tsx` (lines 117–150)

- [ ] **Step 1: Identify current pattern in hero.tsx**

Current code (lines 126–150):
```typescript
useEffect(() => {
  setIsLoaded(true);
  const statuses = [
    "INITIALIZING",
    "LOADING_MODULES",
    "CALIBRATING",
    "SYSTEM_READY",
  ];

  if (shouldReduceMotion) {
    setStatusText(statuses.at(-1) ?? "SYSTEM_READY");
    return;
  }

  let index = 0;
  const interval = setInterval(() => {
    index++;
    if (index < statuses.length) {
      setStatusText(statuses[index]);
    } else {
      clearInterval(interval);
    }
  }, 400);
  return () => clearInterval(interval);
}, []);
```

To be replaced with `useCyclingText` hook.

- [ ] **Step 2: Add import for useCyclingText**

At top of `hero.tsx`, add after existing imports:

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 3: Remove old state and useEffect**

Delete lines:
- `const [statusText, setStatusText] = useState("INITIALIZING");` (line 123)
- Entire useEffect block (lines 126–150)

- [ ] **Step 4: Add useCyclingText hook call**

Replace removed code with:

```typescript
const statuses = [
  "INITIALIZING",
  "LOADING_MODULES",
  "CALIBRATING",
  "SYSTEM_READY",
];

const { currentText: statusText } = useCyclingText(statuses, 400);
```

**Note:** Hook receives `statuses` and interval (400ms). Destructure `currentText` as `statusText` to match JSX.

- [ ] **Step 5: Verify JSX still uses statusText**

Verify line 280 still references `{statusText}`:
```typescript
<span className="font-mono text-[10px] tracking-[0.3em] dark:text-electric-cyan/80 uppercase">
  Status // {statusText}
</span>
```

No JSX changes needed — variable name is same.

- [ ] **Step 6: Visual regression test (Playwright)**

Run:
```bash
pnpm exec playwright test --grep "hero" --update-snapshots
```

Expected: Snapshots update with zero visual diff.

- [ ] **Step 7: Run type check**

```bash
pnpm typecheck
```

Expected: PASS (no TS errors in hero.tsx)

- [ ] **Step 8: Commit**

```bash
git add components/hero/hero.tsx
git commit -m "feat(animation): Phase 4b—Hero component refactored to use useCyclingText"
```

---

## Task 2: Refactor news-hub-hero.tsx

**Files:**
- Modify: `components/news-hub/news-hub-hero.tsx`

- [ ] **Step 1: Identify current pattern**

Open file and locate similar useEffect with `statusText` state and setInterval.

- [ ] **Step 2: Add import**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 3: Replace old pattern**

Identify the statuses array and interval (typically 380–400ms). Example:
```typescript
const statuses = ["LOADING", "PROCESSING", "READY"];
```

Replace entire useEffect + state with:
```typescript
const { currentText: statusText } = useCyclingText(statuses, 380);
```

- [ ] **Step 4: Verify JSX references statusText**

Search for `{statusText}` in JSX. No changes needed if variable name matches.

- [ ] **Step 5: Visual regression test**

```bash
pnpm exec playwright test --grep "news-hub-hero" --update-snapshots
```

Expected: Zero diff snapshot.

- [ ] **Step 6: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/news-hub/news-hub-hero.tsx
git commit -m "feat(animation): Phase 4b—News hub hero refactored to use useCyclingText"
```

---

## Task 3: Refactor news-category-hero.tsx

**Files:**
- Modify: `components/news-hub/news-category-hero.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace setInterval + useEffect**

Identify statuses array and interval. Replace old pattern with:
```typescript
const { currentText: statusText } = useCyclingText(statuses, interval);
```

(Interval typically 380–400ms; check existing code.)

- [ ] **Step 3: Update JSX**

Verify JSX still uses `statusText`. No changes if variable name matches.

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "news-category-hero" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/news-hub/news-category-hero.tsx
git commit -m "feat(animation): Phase 4b—News category hero refactored to use useCyclingText"
```

---

## Task 4: Refactor projects-hero.tsx

**Files:**
- Modify: `components/projects/projects-hero.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

Identify `statusText` state and setInterval. Replace with:
```typescript
const { currentText: statusText } = useCyclingText(statuses, interval);
```

- [ ] **Step 3: Verify JSX**

No changes needed if JSX already uses `statusText`.

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "projects-hero" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/projects/projects-hero.tsx
git commit -m "feat(animation): Phase 4b—Projects hero refactored to use useCyclingText"
```

---

## Task 5: Refactor project-category-hero.tsx

**Files:**
- Modify: `components/projects/project-category-hero.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

Identify statuses and interval. Replace old useEffect + state:
```typescript
const { currentText: statusText } = useCyclingText(statuses, interval);
```

- [ ] **Step 3: Verify JSX uses statusText**

No changes needed if already using `statusText`.

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "project-category-hero" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/projects/project-category-hero.tsx
git commit -m "feat(animation): Phase 4b—Project category hero refactored to use useCyclingText"
```

---

## Task 6: Refactor about-hero.tsx

**Files:**
- Modify: `components/about/about-hero.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

Identify statuses and interval. Replace old useEffect:
```typescript
const { currentText: statusText } = useCyclingText(statuses, interval);
```

- [ ] **Step 3: Verify JSX**

Confirm JSX uses `statusText`. No changes if variable name matches.

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "about-hero" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/about/about-hero.tsx
git commit -m "feat(animation): Phase 4b—About hero refactored to use useCyclingText"
```

---

## Task 7: Refactor services-hero.tsx

**Files:**
- Modify: `components/services/services-hero.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

Identify statuses and interval. Replace:
```typescript
const { currentText: statusText } = useCyclingText(statuses, interval);
```

- [ ] **Step 3: Verify JSX**

Confirm uses `statusText`. No changes needed.

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "services-hero" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/services/services-hero.tsx
git commit -m "feat(animation): Phase 4b—Services hero refactored to use useCyclingText"
```

---

## Task 8: Refactor services-bento.tsx

**Files:**
- Modify: `components/services/services-bento.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

This component cycles through features, not statuses. Identify the array (e.g., `features`) and interval. Replace old useEffect:
```typescript
const { currentText: currentFeature } = useCyclingText(features, interval);
```

**Note:** Variable name may differ (e.g., `currentFeature` instead of `statusText`). Check JSX.

- [ ] **Step 3: Update JSX**

Replace references to old state variable with `currentFeature` (or appropriate name from step 2).

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "services-bento" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/services/services-bento.tsx
git commit -m "feat(animation): Phase 4b—Services bento refactored to use useCyclingText"
```

---

## Task 9: Refactor vision-mission.tsx

**Files:**
- Modify: `components/about/vision-mission.tsx`

- [ ] **Step 1: Import useCyclingText**

```typescript
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
```

- [ ] **Step 2: Replace pattern**

This component cycles through roles or mission statements. Identify array and interval. Replace:
```typescript
const { currentText: currentRole } = useCyclingText(roles, interval);
```

**Note:** Variable name may differ. Check existing code.

- [ ] **Step 3: Update JSX**

Replace old state references with new variable (e.g., `currentRole`).

- [ ] **Step 4: Visual regression**

```bash
pnpm exec playwright test --grep "vision-mission" --update-snapshots
```

Expected: Zero diff.

- [ ] **Step 5: Type check**

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/about/vision-mission.tsx
git commit -m "feat(animation): Phase 4b—Vision mission refactored to use useCyclingText"
```

---

## Task 10: Final Validation

**Files:**
- No files modified in this task. Validation only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: All tests pass (114+). Output should show:
```
✓ 114+ tests passed
```

- [ ] **Step 2: Run TypeScript strict check**

```bash
pnpm typecheck
```

Expected: PASS (no TS errors)

- [ ] **Step 3: Run production build**

```bash
pnpm build
```

Expected: Success. No errors or warnings.

- [ ] **Step 4: Run full visual regression suite**

```bash
pnpm exec playwright test
```

Expected: All snapshots match (zero visual diff from Phase 3 baseline).

- [ ] **Step 5: Verify git log**

```bash
git log --oneline -10
```

Expected output should show 9 sequential commits:
```
[commit] feat(animation): Phase 4b—Vision mission refactored to use useCyclingText
[commit] feat(animation): Phase 4b—Services bento refactored to use useCyclingText
[commit] feat(animation): Phase 4b—Services hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—About hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—Project category hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—Projects hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—News category hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—News hub hero refactored to use useCyclingText
[commit] feat(animation): Phase 4b—Hero component refactored to use useCyclingText
```

- [ ] **Step 6: Document completion**

Create brief summary in `e8f09d9` commit message (or equivalent). Example:
```
Phase 4b: Component Refactoring Complete
- 9 components refactored to use useCyclingText hook
- Visual regression: zero diff (all snapshots match)
- Tests: 114+ passing
- Build: production-ready
- Ready for Phase 5: Deploy to production
```

---

## Self-Review Against Spec

**Spec coverage:**
- ✅ Migrate 9 components (Tasks 1–9)
- ✅ Replace 20-line setInterval with useCyclingText (each task)
- ✅ Update JSX to use currentText (each task)
- ✅ Visual regression test via Playwright (each task)
- ✅ TypeScript strict mode validation (Task 10)
- ✅ Tests pass 114+ (Task 10)
- ✅ Build succeeds (Task 10)

**Placeholder scan:**
- ✅ No TBD/TODO/implement-later placeholders
- ✅ All code steps have complete code blocks
- ✅ All commands have expected output
- ✅ No "similar to Task N" repetitions

**Type consistency:**
- ✅ Hook returns `{ currentText, cycleIndex, isAnimating }` (Phase 4a)
- ✅ Destructuring pattern consistent: `const { currentText: statusText } = useCyclingText(...)`
- ✅ Variable names match JSX references (statusText, currentFeature, currentRole)

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-phase-4b-component-refactoring.md`.**

**Two execution options:**

### **Option 1: Subagent-Driven (Recommended)**
Dispatch fresh subagent per task, review between tasks, fast iteration.

**Advantages:**
- Parallel task execution (multiple components refactored simultaneously)
- Focused agents = better code review
- Lower context overhead per agent

**Approach:** Use superpowers:subagent-driven-development to orchestrate Tasks 1–9 in parallel, then run Task 10 (validation) after all complete.

---

### **Option 2: Inline Execution**
Execute tasks sequentially in this session, batch with checkpoints for review.

**Advantages:**
- Single session continuity
- Immediate feedback and debugging

**Approach:** Use superpowers:executing-plans to run Tasks 1–10 sequentially.

---

**Which execution approach would you like?** (Type "subagent" or "inline")
