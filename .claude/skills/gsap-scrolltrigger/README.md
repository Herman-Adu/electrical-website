# GSAP ScrollTrigger Skill

**Fix scroll-triggered animation flicker, layout shift, and performance issues.**

## When to Use

Use this skill when you need to:
- Fix animations that flicker or jump on scroll
- Prevent layout shift during scroll animations
- Sync multiple animations together
- Optimize scroll animation performance
- Create smooth, professional scroll effects
- Animate on scroll entrance

**Trigger phrases:**
- "My scroll animation flickers"
- "Animation jumps when scrolling"
- "Fix scroll performance"
- "Smooth scroll animation"
- "Layout shift on animation"
- "Scroll entrance animations"

## Quick Start

```bash
npm install gsap
```

### Basic Fade-In on Scroll

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        once: true,  // Only animate once
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={ref}
      className="will-change-transform"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      Content appears smoothly on scroll
    </div>
  );
}
```

## Key Concepts

### The Flicker Problem

Most scroll animations flicker because they:
1. Animate `position`/`width`/`height` (causes layout shift)
2. Update state on every scroll pixel (forces re-renders)
3. Don't use GPU acceleration
4. Re-trigger animations multiple times

### The Solution

**GSAP ScrollTrigger:**
- Uses Intersection Observer (efficient, no layout thrashing)
- Animates `transform` only (GPU-accelerated, no layout shift)
- Batches updates, not per-pixel
- Supports `once: true` to prevent re-triggering
- Handles cleanup automatically

### Critical CSS

```css
.scroll-animate {
  will-change: transform;     /* GPU acceleration */
  contain: layout style paint; /* Isolate from layout */
  transform: translateZ(0);   /* Force GPU layer */
}
```

### Critical JavaScript Pattern

```typescript
// Always wrap in useEffect
useEffect(() => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      once: true,  // ⭐ KEY: prevents re-trigger
    },
    // Animate ONLY transform properties
    x: 100,      // ✅ Safe
    y: 50,       // ✅ Safe
    opacity: 0.5,// ✅ Safe
    // NOT these:
    // left: 100, // ❌ Causes layout shift
    // top: 50,   // ❌ Causes layout shift
  });

  // Always cleanup
  return () => ScrollTrigger.getAll().forEach((t) => t.kill());
}, []);
```

## Common Patterns

### 1. Fade-In on Scroll (Entrance)

```typescript
gsap.to(element, {
  scrollTrigger: { trigger: element, once: true },
  opacity: 1,
  y: 0,
  duration: 0.6,
});
```

### 2. Staggered Grid Animation

```typescript
const elements = gsap.utils.toArray<HTMLElement>('.card');
elements.forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, once: true },
    opacity: 1,
    delay: i * 0.1,
    duration: 0.6,
  });
});
```

### 3. Synced Timeline (Multiple Elements)

```typescript
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.section', start: 'top center' },
});

tl.to('.title', { opacity: 1, y: 0 }, 0)
  .to('.subtitle', { opacity: 1, y: 0 }, 0.1)
  .to('.cta', { opacity: 1, scale: 1 }, 0.2);
```

### 4. Refresh After Dynamic Content

```typescript
useEffect(() => {
  ScrollTrigger.refresh();  // Call after data loads
}, [data]);
```

## Debugging Checklist

- [ ] No console errors
- [ ] CSS has `will-change: transform`
- [ ] Animation uses transform properties only
- [ ] ScrollTrigger registered with `gsap.registerPlugin()`
- [ ] useEffect includes cleanup
- [ ] `once: true` prevents re-triggering
- [ ] No inline styles overriding CSS
- [ ] Element is visible in viewport when trigger fires
- [ ] No competing animations on same element
- [ ] Test in production build (dev behavior differs)

## Troubleshooting

**Animation doesn't trigger?**
- Check element is within viewport at start point
- Verify ScrollTrigger is registered
- Ensure trigger element has measurable dimensions
- Call `ScrollTrigger.refresh()` after content changes

**Animation flickers or jumps?**
- Add `will-change: transform;` to CSS
- Change properties from `left/top` to `x/y`
- Check no competing CSS animations
- Reduce duration if element isn't in view long enough

**Performance issues (jank)?**
- Use `once: true` to animate only once
- Batch animations instead of one per element
- Avoid animating large DOM trees at once
- Profile with DevTools Performance tab

## Resources

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [GPU Acceleration](https://web.dev/gpu-accelerated-compositing-with-transforms-will-change/)

## Related Skills

- **framer-motion** — For smooth component animations, entrance/exit, and gestures
- **aos-scroll-reveal** — For bulk scroll-reveal animations with less setup
