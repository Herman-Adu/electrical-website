# AOS Scroll Reveal Agent

Specialized sub-agent for implementing AOS scroll-reveal animations with HTML data-attributes.

## When Orchestrator Dispatches This Agent

```typescript
// Setup AOS in layout
Agent(aos-scroll-reveal, {
  subtask: 'setup',
  target: 'app/layout.tsx',
  intensity: 'low'
});

// Implement animations on sections
Agent(aos-scroll-reveal, {
  subtask: 'implement',
  target: 'app/sections/[hero, projects, features]',
  context: 'Need fade-in, slide-up, zoom animations'
});

// Add staggered list animations
Agent(aos-scroll-reveal, {
  subtask: 'stagger',
  target: 'ProjectsGrid component',
  context: '20 project cards, need sequential entrance'
});

// Optimize for performance
Agent(aos-scroll-reveal, {
  subtask: 'optimize',
  target: 'Full page',
  context: 'Animations feel laggy on mobile'
});

// Validate animation quality
Agent(aos-scroll-reveal, {
  subtask: 'validate',
  target: 'All animations',
  intensity: 'full'
});
```

## What Agent Does

- **Setup:** Initializes AOS in layout with proper configuration
- **Implement:** Adds `data-aos` attributes to HTML elements
- **Stagger:** Creates sequential animations for lists/grids
- **Optimize:** Tunes configuration for performance
- **Validate:** Tests smoothness, flicker, accessibility

## Setup Pattern

```typescript
'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,        // Critical: only animate once
      offset: 100,
      disable: 'phone',  // Optional: disable on mobile
    });
  }, []);

  return <html>{children}</html>;
}
```

## Implementation Pattern

```typescript
// Individual element
<div data-aos="fade-in">Content</div>

// With delay
<div data-aos="fade-up" data-aos-delay="200">Delayed</div>

// Custom duration
<button data-aos="zoom-in" data-aos-duration="300">Click</button>
```

## Staggered Pattern

```typescript
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

## Refresh Pattern (Dynamic Content)

```typescript
useEffect(() => {
  AOS.refresh();  // Re-measure animations
}, [data]);      // When data changes
```

## Key Advantages

- **Simple:** Just add HTML attributes, no JavaScript
- **Lightweight:** 15KB gzipped
- **Efficient:** Uses Intersection Observer
- **Bulk:** Perfect for many identical animations
- **Fast:** Minimal setup

## Output Format

Agent returns:

```
Summary
2–3 sentences of implementation approach

Code/Implementation
HTML with data-aos attributes or layout setup

Configuration Notes
- Animation type
- Duration, stagger delay
- Performance impact

Testing Checklist
✓/✗ AOS initialized
✓/✗ Animations smooth
✓/✗ No flicker
✓/✗ Mobile-friendly

Confidence: High/Medium/Low
```

## Common Use Cases

| Use Case | Subtask | Input |
|----------|---------|-------|
| Initialize AOS | setup | layout.tsx |
| Add fade-in | implement | Section component |
| Stagger cards | stagger | Grid with 10+ items |
| Fix jank | optimize | Performance data |
| Quality check | validate | All sections |

## Animation Types

**Direction-based:**
- fade-up, fade-down, fade-left, fade-right
- slide-up, slide-down, slide-left, slide-right
- flip-left, flip-right, flip-up, flip-down

**Scale-based:**
- zoom-in, zoom-out
- bounce-in

**Simple:**
- fade (no direction)

## Configuration

```typescript
{
  duration: 600,           // Animation duration (ms)
  easing: 'ease-out',      // Easing function
  once: true,              // Only animate once (important!)
  offset: 100,             // Trigger point (px from bottom)
  delay: 0,                // Default delay (ms)
  mirror: false,           // Don't re-animate on scroll up
  disable: 'phone',        // Disable on mobile (optional)
  anchorPlacement: 'top-bottom',
}
```

## Performance Tips

- Use `once: true` (don't re-trigger on scroll)
- Disable on mobile: `disable: 'phone'`
- Increase `offset` for fewer simultaneous animations
- Keep `duration` under 800ms for snappy feel

## Related Agents

- **framer-motion** — For component-level animations and gestures
- **gsap-scrolltrigger** — For complex scroll synchronization

## Dependencies

- AOS library (`npm install aos`)
- Next.js 13+ or any React framework
- No TypeScript required
