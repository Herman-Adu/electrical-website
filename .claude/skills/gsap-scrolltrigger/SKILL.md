---
name: gsap-scrolltrigger
description: Use this skill WHENEVER fixing scroll-triggered animations, removing animation flicker, solving layout shift issues, or optimizing scroll performance. Triggers on "smooth scroll", "scroll animation flicker", "scroll jumps", "animation not syncing", "flickering entrance", "scroll jank". Provides GSAP ScrollTrigger patterns with zero flicker, GPU acceleration, and layout-shift prevention for Next.js 16 App Router.
argument-hint: "[describe the scroll animation issue or target]"
disable-model-invocation: true
---

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
        once: true,            // Only animate once ⭐ KEY
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
// ❌ CAUSES LAYOUT SHIFT (Don't do this)
gsap.to(element, {
  left: 100,      // Changes layout
  top: 50,        // Changes layout
  width: 200,     // Changes layout
});

// ✅ NO LAYOUT SHIFT (Use this)
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

## Pattern 3: Batch Animations (Performance)

**When to use:** Many elements with the same animation (lists, grids)

```typescript
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ProjectGrid() {
  useEffect(() => {
    // Instead of one ScrollTrigger per element, batch them
    const elements = gsap.utils.toArray<HTMLElement>('.project-card');
    
    elements.forEach((element) => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Cards with class="project-card" */}
    </div>
  );
}
```

## Pattern 4: Sync Multiple Animations (Timeline)

**When to use:** Sequential animations that must stay in sync

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Group related animations with timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top center',
        markers: false,
      },
    });

    // All animations sync together
    tl.to('.hero-title', { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.5 }, 0.1)
      .to('.hero-cta', { opacity: 1, scale: 1, duration: 0.5 }, 0.2);

    return () => tl.kill();
  }, []);

  return (
    <section ref={ref}>
      <h1 className="hero-title" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        Title
      </h1>
      <p className="hero-subtitle" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        Subtitle
      </p>
      <button className="hero-cta" style={{ opacity: 0, transform: 'scale(0.8)' }}>
        CTA
      </button>
    </section>
  );
}
```

## Pattern 5: Refresh After Dynamic Content

**When to use:** Content loads dynamically (pagination, infinite scroll)

```typescript
'use client';

import { useEffect } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function DynamicProjectList({ projects }: { projects: Project[] }) {
  useEffect(() => {
    // After content changes, refresh ScrollTrigger measurements
    ScrollTrigger.refresh();
  }, [projects]); // Re-run when projects change

  return (
    <div>
      {projects.map((p) => (
        <div key={p.id} className="project-item will-change-transform">
          {p.title}
        </div>
      ))}
    </div>
  );
}
```

## Anti-Patterns (Causes Flicker)

### ❌ Updating State on Every Scroll Event

```typescript
// DON'T DO THIS (re-renders = flicker)
window.addEventListener('scroll', () => {
  setScrollY(window.scrollY);  // Triggers re-render per pixel
});
```

### ❌ Animating Position Properties

```typescript
// DON'T DO THIS (causes layout shift)
gsap.to(el, { left: 100, top: 50 });
```

### ❌ Missing will-change CSS

```typescript
// DON'T DO THIS (no GPU acceleration)
.element { /* empty styles */ }
gsap.to(element, { x: 100 });
```

## Implementation Checklist

- [ ] GSAP + ScrollTrigger installed (`npm install gsap`)
- [ ] ScrollTrigger plugin registered in useEffect
- [ ] All animations use transform properties only (x, y, scale, rotate)
- [ ] Elements have `will-change: transform` CSS
- [ ] ScrollTrigger wrapped in useEffect with cleanup
- [ ] `once: true` prevents re-triggering
- [ ] No direct scroll event listeners
- [ ] `ScrollTrigger.refresh()` called after dynamic content
- [ ] No console errors or warnings
- [ ] Test: Smooth 60fps on scroll, no flicker, correct alignment

## Quick Fix Checklist (Existing Animations)

If animation flickers on scroll:

1. ✅ Add `will-change: transform;` to element CSS
2. ✅ Change animation to use `x`, `y`, `scale` not `left`, `top`, `width`
3. ✅ Wrap ScrollTrigger in useEffect with cleanup
4. ✅ Add `once: true` to prevent re-triggering
5. ✅ Call `ScrollTrigger.refresh()` after content loads
6. ✅ Verify no inline `position` styles conflicting
7. ✅ Test in production build (dev may have different behavior)

## References

- [GSAP ScrollTrigger Official Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [CSS Transforms vs Position (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [GPU Acceleration & will-change](https://web.dev/gpu-accelerated-compositing-with-transforms-will-change/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
