# AOS Scroll Reveal Skill

**Simple, lightweight scroll-reveal animations with minimal setup.**

## When to Use

Use this skill when you need to:
- Add scroll-reveal animations to many elements
- Implement simple fade/slide/zoom entrances
- Stagger animations on lists or grids
- Minimize JavaScript overhead
- Quick implementation with HTML attributes

**Trigger phrases:**
- "Scroll reveal animation"
- "Animate on scroll"
- "Entrance animation"
- "Bulk animations"
- "Staggered list animation"

## Installation

```bash
npm install aos
```

## Quick Start

### 1. Initialize in Layout

```typescript
'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,  // Only animate once
      offset: 100,
    });
  }, []);

  return <html>{children}</html>;
}
```

### 2. Add to Elements

```typescript
// Simple fade-in
<section data-aos="fade-in">Content</section>

// Fade up with delay
<div data-aos="fade-up" data-aos-delay="200">Item</div>

// Zoom with custom duration
<button data-aos="zoom-in" data-aos-duration="300">Click</button>
```

## Key Concepts

### HTML Attributes (No JS)

Instead of writing JavaScript, use HTML:

```typescript
// All configuration via HTML attributes
<div
  data-aos="fade-up"           // Animation type
  data-aos-duration="600"      // Duration (ms)
  data-aos-delay="200"         // Delay (ms)
  data-aos-offset="100"        // Trigger point (px from bottom)
  data-aos-easing="ease-out"   // Easing function
  data-aos-once="true"         // Only once
>
  Content
</div>
```

### Staggered Animations

```typescript
// List with staggered entrance
{items.map((item, i) => (
  <div
    key={item.id}
    data-aos="fade-up"
    data-aos-delay={i * 100}  // 0ms, 100ms, 200ms...
  >
    {item.name}
  </div>
))}
```

### Initialize Once, Use Everywhere

```typescript
// Set global defaults once in layout
AOS.init({ duration: 600, once: true });

// Then use everywhere with just HTML
<div data-aos="fade-in">Works everywhere</div>
```

## Available Animations

| Animation | Effect |
|-----------|--------|
| `fade` | Simple fade in |
| `fade-up`, `fade-down`, `fade-left`, `fade-right` | Fade with direction |
| `slide-up`, `slide-down`, etc. | Slide with direction |
| `zoom-in`, `zoom-out` | Scale animation |
| `flip-left`, `flip-right`, etc. | Flip animation |
| `bounce-in` | Bouncy entrance |

## Common Patterns

### Hero Section

```typescript
<section>
  <h1 data-aos="fade-in" data-aos-duration="800">Title</h1>
  <p data-aos="fade-up" data-aos-delay="200">Subtitle</p>
  <button data-aos="zoom-in" data-aos-delay="400">CTA</button>
</section>
```

### Project Grid

```typescript
<div className="grid grid-cols-3">
  {projects.map((p, i) => (
    <div
      key={p.id}
      data-aos="fade-up"
      data-aos-delay={i * 100}
    >
      {p.title}
    </div>
  ))}
</div>
```

### With Refresh (Dynamic Content)

```typescript
'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function DynamicList({ items }) {
  useEffect(() => {
    AOS.refresh();  // Re-measure after content loads
  }, [items]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} data-aos="fade-up">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## Performance

- **Bundle size:** ~15KB gzipped (smallest)
- **Approach:** Intersection Observer (efficient)
- **Best for:** 10-100+ elements with same animation
- **Mobile:** Can disable per viewport

```typescript
// Disable on phones
AOS.init({ disable: 'phone' });

// Or responsive
AOS.init({
  disable: window.innerWidth < 768 ? 'phone' : false,
});
```

## Debugging Checklist

- [ ] AOS installed and CSS imported
- [ ] AOS initialized with `once: true`
- [ ] Element has `data-aos` attribute
- [ ] Element is visible in viewport at trigger
- [ ] `AOS.refresh()` called after content changes
- [ ] No console errors
- [ ] 60fps smooth on scroll

## Troubleshooting

**Animation doesn't trigger?**
- Verify `data-aos` attribute present
- Check element in viewport at trigger point
- Confirm AOS initialized in layout

**Animations flicker/re-trigger?**
- Ensure `once: true` (in global config or element)
- Check `offset` value (increase if needed)

**Performance drop?**
- Disable on mobile: `disable: 'phone'`
- Reduce number of animated elements
- Increase `offset` value

## Comparison With Alternatives

| Feature | AOS | Framer Motion | GSAP |
|---------|-----|---------------|------|
| Setup | Simple | Moderate | Complex |
| Bundle | 15KB | 50KB | 35KB |
| Bulk animations | ⭐ | OK | OK |
| Gesture support | None | ⭐ | None |
| Scroll complex | OK | OK | ⭐ |
| Learning curve | Minimal | Low | Steep |

## Resources

- [AOS Documentation](https://michalsnik.github.io/aos/)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Related Skills

- **framer-motion** — For component-level animations and gestures
- **gsap-scrolltrigger** — For complex scroll synchronization
