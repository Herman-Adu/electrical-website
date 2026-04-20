# Phase 8b: About Page ScrollReveal Implementation

**Date:** 2026-04-18  
**Status:** Ready for Implementation  
**Pattern Source:** feat-phase-8a-features-scrollreveal-home (Commit: 778c168)

## Overview

Apply the Phase 8a ScrollReveal animation pattern + WCAG reduced-motion compliance to About page components. This is a **batch implementation** using the same pattern validated in Phase 8a.

## Components to Update

All components are in `app/about/` or `components/sections/about/`:

### 1. SectionIntro Component
- **Type:** Card grid (intro/overview cards)
- **Current:** Likely has `whileInView` props on `motion.div`
- **Fix:** Remove whileInView, wrap with ScrollReveal (direction=up, staggered delay)

### 2. PeaceOfMind Component
- **Type:** Feature card grid
- **Current:** Per-card animation props
- **Fix:** Remove card-level animations, apply ScrollReveal pattern

### 3. VisionMission Component
- **Type:** Section content/cards
- **Current:** Check for whileInView + reduce-motion issues
- **Fix:** Align animations with Phase 8a pattern if grid layout

### 4. Certifications Component
- **Type:** Cert card/badge grid
- **Current:** Per-card or per-cert animations
- **Fix:** Single ScrollReveal wrapper with staggered delays

### 5. SectionValues Component
- **Type:** Stat/value card grid
- **Current:** May have counters + animations (need useReducedMotion guards)
- **Fix:** Apply ScrollReveal + check for setInterval patterns

### 6. CommunitySection Component
- **Type:** Community card grid or community member list
- **Current:** Check for animation observer conflicts
- **Fix:** Apply Phase 8a ScrollReveal pattern

## Implementation Pattern (from Phase 8a)

```tsx
// BEFORE (Blocking Issue):
<motion.div whileInView={{opacity: 1, y: 0}} transition={{...}} viewport={{...}}>
  {/* card content */}
</motion.div>

// AFTER (Phase 8a Pattern):
<ScrollReveal direction="up" blur delay={0.07 * index} duration={0.65} distance={40} once margin="0px 0px -80px 0px">
  <motion.div>  {/* No animation props */}
    {/* card content */}
  </motion.div>
</ScrollReveal>
```

## WCAG Compliance Checklist

For any components with `setInterval` or repeating motion effects:

```tsx
// Add to component
const prefersReducedMotion = useReducedMotion();

// Guard animations
useEffect(() => {
  if (prefersReducedMotion) return;  // Skip animation if user prefers reduced motion
  const interval = setInterval(() => { /* ... */ }, 3000);
  return () => clearInterval(interval);
}, [prefersReducedMotion]);
```

## Testing Strategy (TDD)

Mirror Phase 8a test pattern:

1. **Reduced Motion Tests** — Verify setInterval/motion guarded by useReducedMotion()
2. **Animation Observer Conflict Tests** — Verify no whileInView on card motion.divs
3. **ScrollReveal Integration Tests** — Verify cards wrapped with ScrollReveal + staggered delays
4. **Build Verification** — `pnpm build` must pass

## Reusable Patterns from Phase 8a

✅ **Pattern File:** `lib/hooks/use-reduced-motion.ts`  
✅ **Component:** `components/ui/scroll-reveal.tsx` (already created in Phase 7)  
✅ **Test Pattern:** See `components/sections/__tests__/features-phase8a.test.tsx`

## Execution Steps

1. **Preflight:** Read each About page component, identify animation patterns
2. **Plan:** Determine which components need ScrollReveal vs already compliant
3. **Implement (TDD):**
   - Write failing tests for each component
   - Remove whileInView/viewport props
   - Wrap cards with ScrollReveal
   - Add useReducedMotion guards if needed
   - Verify all tests pass
4. **Verify:** `pnpm build` → `pnpm test` → Commit

## Expected Outcome

- All About page card grids use ScrollReveal wrapper (single observer per grid)
- All animated setInterval effects respect useReducedMotion()
- Zero animation observer conflicts
- WCAG 2.1 Animation from Interactions compliance
- All tests passing, build passing

## Notes

- **Reuse Phase 8a hook:** `useReducedMotion()` is in `lib/hooks/use-reduced-motion.ts`
- **Import pattern:** `import { useReducedMotion } from "@/lib/hooks/use-reduced-motion"`
- **ScrollReveal import:** Already available from `components/ui/scroll-reveal`
- **Stagger calculation:** Use `(index % 3) * 0.07` or explicit delays [0, 0.07, 0.14] if 3 columns
- **Duration/Distance:** Match Phase 8a defaults (duration=0.65, distance=40)

## Follow-up Phases

After Phase 8b completes:
- **Phase 8c:** Dashboard/illumination/smart-living animations
- **Phase 8d:** Lighthouse audit + performance optimization
- **Phase 9:** Production release + deployment

---

**Related Commit:** 778c168 (Phase 8a: Features ScrollReveal implementation)  
**Stack:** Next.js 16 + Framer Motion + Tailwind CSS  
**Accessibility:** WCAG 2.1 compliant
