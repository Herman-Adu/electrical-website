---
name: aos-scroll-reveal
description: Use this skill WHENEVER adding bulk scroll-reveal animations to multiple elements, fixing flicker on scroll-in, or applying simple entrance animations without complex setup. Triggers on "scroll reveal", "animate on scroll", "entrance animation", "scroll animation", "bulk animations", "reveal effect". Provides AOS library patterns with zero flicker for Next.js 16 with minimal configuration.
argument-hint: "[describe the scroll-reveal animations needed]"
disable-model-invocation: true
---

> **Check project decisions first.** Recent project phases have deliberately removed scroll-reveal animations from some components. Run `pnpm docker:mcp:memory:search "scroll-reveal"` and check `nexgen-electrical-innovations-state` before adding AOS animations. Confirm with user if unsure.

## Session Preflight

`pnpm docker:mcp:memory:open nexgen-electrical-innovations-state` — check active phase and verify scroll-reveal is appropriate for the target components.

## Live Context (auto-injected)

Current sections: !`find app -path "*/page.tsx" -o -path "*/sections/*" 2>/dev/null | head -10 || echo "No sections detected"`
Animation needs: !`grep -r "data-aos\|whileInView\|ScrollTrigger" components --include="*.tsx" 2>/dev/null | wc -l || echo "No animations yet"`

# AOS Scroll Reveal Skill

**Purpose:** Add smooth scroll-reveal animations to many elements with minimal setup

**Best For:**
- Bulk animations (same pattern on many elements)
- Simple entrance animations (fade, slide, zoom)
- Performance-critical pages (AOS uses Intersection Observer)
- Quick implementation (HTML data-attributes)
- Staggered animations on lists

**Trade-offs vs GSAP/Framer Motion:**
- Simpler setup (HTML attributes)
- Smaller bundle (~15KB)
- Better for many identical animations
- Less customizable
- Limited gesture support
- No timeline orchestration

## When to Use AOS vs Alternatives

| Scenario | Use AOS | Use Framer | Use GSAP |
|----------|---------|-----------|---------|
| Many fade-ins | Yes | | |
| Complex orchestration | | | Yes |
| Gesture interactions | | Yes | |
| Page-level animations | Yes | | |
| Scroll with position sync | | | Yes |
| Component animations | | Yes | |

## Execution Method

1. **Install AOS**
   ```bash
   pnpm add aos
   ```

2. **Initialize in layout**
   - Import AOS CSS
   - Call AOS.init() in useEffect
   - Refresh after dynamic content

3. **Apply to elements**
   - Add `data-aos` attribute
   - Optional: `data-aos-delay`, `data-aos-duration`
   - Optional: `data-aos-offset`

4. **Verify quality**
   - No flicker on scroll
   - 60fps smooth
   - Proper element visibility
   - Clean after unmount

For bulk animation systems spanning many page sections, delegate via `Agent(subagent_type='general-purpose')`.

## Pattern 1: Basic Scroll Reveal

**When to use:** Simple fade-in entrance for sections

```typescript
// app/layout.tsx
'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,        // KEY: only animate once
      offset: 100,       // Trigger when 100px from bottom
      disable: 'phone',  // Disable on mobile (optional)
    });
  }, []);

  return <html>{children}</html>;
}
```

## Pattern 2: Element with Fade-In

**When to use:** Individual elements fade in on scroll

```typescript
// components/sections/hero.tsx
'use client';

export function HeroSection() {
  return (
    <section>
      <h1 data-aos="fade-in" data-aos-duration="800">
        Welcome
      </h1>
      <p data-aos="fade-up" data-aos-delay="200">
        Subtitle with delay
      </p>
      <button data-aos="zoom-in" data-aos-delay="400">
        CTA
      </button>
    </section>
  );
}
```

## Pattern 3: Staggered Grid Animation

**When to use:** Card grids with sequential entrance

```typescript
// components/sections/projects.tsx
'use client';

export function ProjectsGrid({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {projects.map((project, i) => (
        <div
          key={project.id}
          data-aos="fade-up"
          data-aos-delay={i * 100}  // Stagger: 0ms, 100ms, 200ms...
        >
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

Patterns 4–6 (directional animations, dynamic content refresh, per-element overrides) are in [`patterns.md`](patterns.md).

## Available Animations

**Fade:** `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`

**Flip:** `flip-left`, `flip-right`, `flip-up`, `flip-down`

**Slide:** `slide-up`, `slide-down`, `slide-left`, `slide-right`

**Zoom:** `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`

**Bounce:** `bounce-in`, `bounce-in-up`, `bounce-in-down`, `bounce-in-left`, `bounce-in-right`

## Global Configuration

```typescript
AOS.init({
  duration: 600,              // Animation duration (ms)
  easing: 'ease-out-cubic',   // Easing function
  once: true,                 // KEY: only animate once
  offset: 100,                // Trigger when 100px from bottom
  delay: 0,                   // Default delay
  mirror: false,              // Don't re-animate on scroll up
  disable: 'phone',           // Disable on phones (optional)
  anchorPlacement: 'top-bottom',
});
```

## Anti-Patterns

Setting `once: false` re-animates every scroll — always use `once: true`.

Very short `offset` with long `duration` causes animation to continue after scroll — balance them (`duration: 600, offset: 100`).

## Implementation Checklist

- [ ] AOS installed (`pnpm add aos`)
- [ ] AOS CSS imported in layout
- [ ] AOS initialized with `once: true`
- [ ] Elements have `data-aos` attributes
- [ ] Staggered animations use `data-aos-delay`
- [ ] Call `AOS.refresh()` after dynamic content loads
- [ ] No console errors
- [ ] 60fps smooth on scroll
- [ ] No flicker
- [ ] Mobile performance acceptable
- [ ] Test with `PLAYWRIGHT_REUSE_SERVER=true pnpm test` when dev server is running on port 3000

## Troubleshooting

**Animations don't trigger?**
- Verify AOS initialized in layout
- Check element in viewport at trigger point
- Ensure `data-aos` attribute is set
- Call `AOS.refresh()` after content changes

**Flicker on scroll?**
- Set `once: true` (don't re-animate)
- Increase `offset` value
- Test in production (dev behavior differs)

**Performance issues?**
- Disable on mobile: `disable: 'phone'`
- Reduce animated elements count
- Increase `offset` (animate fewer elements)

## References

- [AOS Documentation](https://michalsnik.github.io/aos/)
- [AOS GitHub](https://github.com/michalsnik/aos)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
