---
name: aos-scroll-reveal
description: Use this skill WHENEVER adding bulk scroll-reveal animations to multiple elements, fixing flicker on scroll-in, or applying simple entrance animations without complex setup. Triggers on "scroll reveal", "animate on scroll", "entrance animation", "scroll animation", "bulk animations", "reveal effect". Provides AOS library patterns with zero flicker for Next.js 16 with minimal configuration.
argument-hint: "[describe the scroll-reveal animations needed]"
disable-model-invocation: true
---

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
- ✅ Simpler setup (HTML attributes)
- ✅ Smaller bundle (~15KB)
- ✅ Better for many identical animations
- ❌ Less customizable
- ❌ Limited gesture support
- ❌ No timeline orchestration

## When to Use AOS vs Alternatives

| Scenario | Use AOS | Use Framer | Use GSAP |
|----------|---------|-----------|---------|
| Many fade-ins | ✅ | | |
| Complex orchestration | | | ✅ |
| Gesture interactions | | ✅ | |
| Page-level animations | ✅ | | |
| Scroll with position sync | | | ✅ |
| Component animations | | ✅ | |

## Execution Method

1. **Install AOS**
   ```bash
   npm install aos
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
      once: true,        // ⭐ KEY: only animate once
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

## Pattern 4: Directional Animations

**When to use:** Different entrance directions for visual variety

```typescript
// Use different AOS animations
<div data-aos="fade-left">Slides from right</div>
<div data-aos="fade-right">Slides from left</div>
<div data-aos="fade-up">Slides up from bottom</div>
<div data-aos="fade-down">Slides down from top</div>
<div data-aos="zoom-in">Scales up from center</div>
<div data-aos="flip-left">Flips in from left</div>
```

## Pattern 5: Refresh After Dynamic Content

**When to use:** Content loaded via pagination, infinite scroll, or data fetch

```typescript
// components/dynamic-list.tsx
'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function DynamicProjectList({ projects }) {
  useEffect(() => {
    // After content changes, refresh AOS measurements
    AOS.refresh();
  }, [projects]); // Re-run when projects change

  return (
    <div>
      {projects.map((p) => (
        <div key={p.id} data-aos="fade-up">
          {p.title}
        </div>
      ))}
    </div>
  );
}
```

## Pattern 6: Customize Per Element

**When to use:** Override global config for specific elements

```typescript
// Global config: 600ms duration
// But this element animates faster
<div
  data-aos="fade-in"
  data-aos-duration="300"      // Faster animation
  data-aos-delay="500"         // Longer delay before start
  data-aos-offset="200"        // Trigger earlier (200px above)
  data-aos-easing="ease-in-out"
  data-aos-once="true"
>
  Custom-configured element
</div>
```

## Available Animations

**Fade:**
- `fade` — Simple fade
- `fade-up`, `fade-down`, `fade-left`, `fade-right`

**Flip:**
- `flip-left`, `flip-right`, `flip-up`, `flip-down`

**Slide:**
- `slide-up`, `slide-down`, `slide-left`, `slide-right`

**Zoom:**
- `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`
- `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`

**Bounce:**
- `bounce-in`, `bounce-in-up`, `bounce-in-down`, `bounce-in-left`, `bounce-in-right`

## Global Configuration

```typescript
AOS.init({
  duration: 600,              // Animation duration (ms)
  easing: 'ease-out-cubic',   // Easing function
  once: true,                 // ⭐ KEY: only animate once
  offset: 100,                // Trigger when 100px from bottom
  delay: 0,                   // Default delay
  mirror: false,              // Don't re-animate on scroll up
  disable: 'phone',           // Disable on phones (optional)
  anchorPlacement: 'top-bottom',
});
```

## Anti-Patterns (Causes Issues)

❌ **Setting `once: false`** (re-animates every scroll)
```typescript
// DON'T: Flickers on scroll up/down
AOS.init({ once: false });
```

✅ **Use `once: true`** (smooth, one-time)
```typescript
// DO: Clean, professional
AOS.init({ once: true });
```

❌ **Very short `offset` with long `duration`**
```typescript
// DON'T: Animation continues after scroll
AOS.init({ duration: 2000, offset: 50 });
```

✅ **Balance offset and duration**
```typescript
// DO: Balanced
AOS.init({ duration: 600, offset: 100 });
```

## Implementation Checklist

- [ ] AOS installed (`npm install aos`)
- [ ] AOS CSS imported in layout
- [ ] AOS initialized with `once: true`
- [ ] Elements have `data-aos` attributes
- [ ] Staggered animations use `data-aos-delay`
- [ ] Call `AOS.refresh()` after dynamic content loads
- [ ] No console errors
- [ ] 60fps smooth on scroll
- [ ] No flicker
- [ ] Mobile performance acceptable

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
