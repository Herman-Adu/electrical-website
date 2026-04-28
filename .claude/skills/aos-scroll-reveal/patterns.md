# AOS Scroll Reveal — Extended Patterns

Less-common patterns. Reference from SKILL.md when patterns 1–3 are insufficient.

## Pattern 4: Directional Animations

**When to use:** Different entrance directions for visual variety

```typescript
// Use different AOS animations for directional effect
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
    AOS.refresh();
  }, [projects]);

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
// But this element animates faster with a longer delay
<div
  data-aos="fade-in"
  data-aos-duration="300"
  data-aos-delay="500"
  data-aos-offset="200"
  data-aos-easing="ease-in-out"
  data-aos-once="true"
>
  Custom-configured element
</div>
```
