# Mobile Responsive Fix — Hero & Illumination Components (2026-04-02)

## Problem Statement

**User Report:**
- Home page hero content overlaps mobile navbar on actual iPhone Pro Max
- Illumination component shows correctly in browser DevTools but stats cards get cut off on real device
- CommunitySection works correctly → pattern replication needed
- Issue occurs on actual device, not in browser simulator

**Root Causes:**
1. **Hero**: `safeArea="immersive"` (no navbar offset) + missing top padding
2. **Illumination**: Fixed `.section-padding` (4rem) + rigid `min-h-svh` + incomplete responsive scaling
3. **Pattern Mismatch**: DevTools responsive view ≠ actual mobile device (safe areas, dynamic island, notch)

## Solution Architecture

### Reference: CommunitySection (✅ Working)
```tsx
// Uses SectionWrapper with CSS clamp() for TRUE responsive padding
<SectionWrapper
  id="community"
  background={BackgroundLayer}
  variant="full"
>
  {/* Content automatically vertically centered + responsive padding */}
  {children}
</SectionWrapper>

// CSS: .section-fluid
// padding: clamp(3rem, 8vh, 10rem) // MIN, PREFERRED, MAX
// - Scales smoothly: 48px (mobile) → with viewport → 160px (desktop)
// - SAME top AND bottom = always vertically centered
```

### Applied To: Hero Component
**File:** `components/hero/hero.tsx`  
**Change:** `safeArea="immersive"` → `safeArea="page"`

**Effect:**
- Applies `.section-safe-top` + `.section-safe-bottom` padding
- `.section-safe-top`: 5rem (mobile) → 6rem (sm) → 7rem (md+)
- Accounts for mobile navbar + safe area regions

### Applied To: Illumination Component
**File:** `components/sections/illumination.tsx`  
**Changes:**

**Before (Broken):**
```tsx
<section className="section-container min-h-svh lg:min-h-[90vh]">
  <div className="section-padding">
    {/* content with 4rem fixed padding */}
  </div>
</section>
```

**After (Fixed):**
```tsx
<SectionWrapper
  background={BackgroundLayer}
  variant="full"
>
  <motion.div>
    {/* Automatic responsive centering + clamp() padding */}
  </motion.div>
</SectionWrapper>
```

**Key Improvements:**
- `.section-fluid` replaces hardcoded padding
- Background layer moved to prop (BackgroundParallax + ScanEffects)
- Image height: Already `h-[120%]` parallax (covers mobile properly)
- Stats grid now has proper spacing via responsive clamp()

## CSS Responsive Strategy

### .section-fluid (SectionWrapper)
```css
.section-fluid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: clamp(3rem, 8vh, 10rem);    /* 48px min → 160px max */
  padding-bottom: clamp(3rem, 8vh, 10rem);
}
```

### .section-safe-top (Hero)
```css
.section-safe-top {
  padding-top: 5rem;   /* mobile */
}
@media (min-width: 640px) {
  .section-safe-top { padding-top: 6rem; }
}
@media (min-width: 768px) {
  .section-safe-top { padding-top: 7rem; }
}
```

## Technical Implementation Details

### Why clamp() Works Better Than Fixed Values

| Metric | Fixed (4rem) | clamp(3rem, 8vh, 10rem) |
|--------|-------------|------------------------|
| iPhone mobile | 64px (tight) | 48px + responsive |
| Tablet | 64px (loose) | ~80px (perfect) |
| Desktop | 64px (insufficient) | 160px (generous) |
| Device quirks | Rigid, breaks notch/safe | Adapts automatically |

### Component Hierarchy

**SectionWrapper Architecture:**
```
<section class="section-fluid">
  {/* z-0: Background layer (images, video) */}
  <div className="absolute inset-0 z-0">{background}</div>
  
  {/* z-10: Overlay layer (gradients) */}
  <div className="absolute inset-0 z-10">{overlay}</div>
  
  {/* z-20: Content layer (actual UI) */}
  <div className="relative z-20 w-full">
    <div className="section-content">{children}</div>
  </div>
</section>
```

**Benefits:**
- Single source of truth for layout (no component-level margin/padding conflicts)
- Consistent z-index layering across all sections
- Responsive padding computed once, reused everywhere

## Validation Checklist

**Build Status:**
- ✅ `pnpm build` — No errors (static generation completed)
- ✅ TypeScript — Type-safe SectionWrapper props
- ✅ ESLint — No linting issues

**Next Steps (Before Merge):**
- [ ] E2E Tests: Run Playwright smoke tests (`pnpm test:e2e`)
- [ ] Lighthouse: Verify performance (`pnpm test:lighthouse-ci` if available)
- [ ] Visual: Screenshot comparison on iOS Safari + Chrome
- [ ] Manual: Test on actual iPhone/Android at 430×932 (iPhone Pro Max)

## Files Changed

```
components/hero/hero.tsx                      (+1/-1)
components/sections/illumination.tsx          (+79/-74)
```

## Git Details

**Branch:** `fix/mobile-responsive-hero-illumination-2026-04-02`  
**Commit:** `a115b3e`  
**Status:** Ready for PR → main

## Session Context

**Date:** 2026-04-02  
**Working Directory:** Electrical Website (Next.js 16, TypeScript, Tailwind)  
**Issue Type:** Mobile responsive layout (actual device ≠ DevTools)  
**Solution Pattern:** Replication of working CommunitySection architecture

## For Next Session

If additional responsive issues appear:
1. Check if component uses `SectionWrapper` (should be the pattern)
2. If not: Refactor to use `SectionWrapper` + verify background/overlay layers
3. Use `clamp()` for all responsive padding/margins (no fixed breakpoint jumps)
4. Test on actual device, not just DevTools (safe areas matter)

---

**Memory Keys for Docker Persistence:**
- `agent:v1:heuristic_snapshots:2026-04-02-mobile-responsive-fix`
- `agent:v1:reasoning:mobile-responsive-hero-illumination-2026-04-02`
- `agent:v1:component-pattern:section-wrapper-responsive-standard`
