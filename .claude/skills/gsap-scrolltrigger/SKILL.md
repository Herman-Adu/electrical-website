---
name: gsap-scrolltrigger
description: Use this skill WHENEVER fixing scroll-triggered animations, removing animation flicker, solving layout shift issues, or optimizing scroll performance. Triggers on "smooth scroll", "scroll animation flicker", "scroll jumps", "animation not syncing", "flickering entrance", "scroll jank". Provides GSAP ScrollTrigger patterns with zero flicker, GPU acceleration, and layout-shift prevention for Next.js 16 App Router.
argument-hint: "[describe the scroll animation issue or target]"
disable-model-invocation: true
---

## Session Preflight

`pnpm docker:mcp:memory:open nexgen-electrical-innovations-state` — check active phase and existing animation patterns before generating new ones.

## Live Context (auto-injected)

Current project structure: !`find app -type f -name "*.tsx" | grep -E "(layout|page)" | head -5 2>/dev/null || echo "Next.js 16 App Router structure"`
Animation patterns in use: !`find components -type f -name "*.tsx" | xargs grep -l "animate\|motion\|transition" 2>/dev/null | head -5 || echo "No animation patterns detected yet"`

# GSAP ScrollTrigger Skill

**Purpose:** Fix scroll-triggered animation problems — flicker, layout shift, performance jank

**Use When:**
- Animations flicker or jump when scrolling
- Multiple scroll animations compete for resources
- Layout shift causes visual misalignment
- Scroll performance drops (janky feeling)
- Need smooth, professional scroll effects
- Syncing animations with scroll position

## Core Problem: Why Scroll Animations Flicker

Most animation flicker comes from:
1. **Layout shift** — animating `position`, `width`, `height` instead of `transform`
2. **Forced reflow** — Reading/writing DOM properties in scroll listeners
3. **Scroll event thrashing** — Animating on every single scroll pixel
4. **Missing GPU acceleration** — Not using `transform: translateZ(0)` or `will-change`

**Solution:** Use GSAP ScrollTrigger to:
- Animate only `transform` properties (GPU-accelerated)
- Batch DOM updates, not per-pixel
- Prevent layout thrashing with Intersection Observer
- Add `will-change` and `contain` CSS properties

## Execution Method

1. **Diagnose the issue**
   - Identify which animations are flickering
   - Check if they animate position/size or transform
   - Look for scroll event listeners
   - Profile render performance

2. **Apply the pattern**
   - Wrap animation in useEffect for client side
   - Use ScrollTrigger.create() or gsap.to() with scrollTrigger option
   - Animate transform properties only
   - Add will-change CSS
   - Add once: true to prevent re-trigger

3. **Verify the fix**
   - No visual flicker on scroll
   - 60fps smooth animation
   - No layout shift
   - Elements align correctly

For complex timeline orchestration spanning many components, delegate via `Agent(subagent_type='general-purpose')`.

## Pattern 1: Basic ScrollTrigger (No Flicker)

**When to use:** Simple entrance animations, fade-in-on-scroll

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Animate only transform properties
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',     // Trigger when 80% visible
        once: true,            // Only animate once — KEY
        markers: false,
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={ref}
      className="will-change-transform"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      {children}
    </div>
  );
}
```

## Pattern 2: Prevent Layout Shift (Critical)

**When to use:** Any element where position/size shouldn't change

```typescript
// Causes layout shift — avoid:
gsap.to(element, {
  left: 100,      // Changes layout
  top: 50,        // Changes layout
  width: 200,     // Changes layout
});

// No layout shift — use this:
gsap.to(element, {
  x: 100,         // Transform only
  y: 50,          // Transform only
  opacity: 0.5,   // Opacity is safe
  scrollTrigger: { trigger: element, once: true },
});
```

**CSS requirement:**
```css
.animate-on-scroll {
  will-change: transform;  /* Tell browser this will animate */
  contain: layout style paint;  /* Isolate from document flow */
  transform: translateZ(0);  /* GPU acceleration */
}
```

Patterns 3–5 (batch animations, timeline orchestration, dynamic content refresh) are in [`patterns.md`](patterns.md).

## vs Framer Motion

Use GSAP ScrollTrigger when: complex timeline orchestration, scrub effects, pinning, or batch-animating many elements. Use Framer Motion when: component-level transitions, gesture interactions, or spring physics.

## Anti-Patterns (Causes Flicker)

Updating state on every scroll event:
```typescript
// Re-renders = flicker
window.addEventListener('scroll', () => {
  setScrollY(window.scrollY);
});
```

Animating position properties:
```typescript
// Causes layout shift
gsap.to(el, { left: 100, top: 50 });
```

Missing will-change CSS:
```typescript
// No GPU acceleration
.element { /* empty styles */ }
gsap.to(element, { x: 100 });
```

## Implementation Checklist

- [ ] GSAP + ScrollTrigger installed (`pnpm add gsap`)
- [ ] ScrollTrigger plugin registered in useEffect
- [ ] All animations use transform properties only (x, y, scale, rotate)
- [ ] Elements have `will-change: transform` CSS
- [ ] ScrollTrigger wrapped in useEffect with cleanup
- [ ] `once: true` prevents re-triggering
- [ ] No direct scroll event listeners
- [ ] `ScrollTrigger.refresh()` called after dynamic content
- [ ] No console errors or warnings
- [ ] Test with `PLAYWRIGHT_REUSE_SERVER=true pnpm test` when dev server is running on port 3000

## Quick Fix Checklist (Existing Animations)

If animation flickers on scroll:

1. Add `will-change: transform;` to element CSS
2. Change animation to use `x`, `y`, `scale` not `left`, `top`, `width`
3. Wrap ScrollTrigger in useEffect with cleanup
4. Add `once: true` to prevent re-triggering
5. Call `ScrollTrigger.refresh()` after content loads
6. Verify no inline `position` styles conflicting
7. Test in production build (dev may have different behavior)

## References

- [GSAP ScrollTrigger Official Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [CSS Transforms vs Position (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [GPU Acceleration & will-change](https://web.dev/gpu-accelerated-compositing-with-transforms-will-change/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
