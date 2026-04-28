# GSAP ScrollTrigger — Extended Patterns

Less-common patterns. Reference from SKILL.md when patterns 1–2 are insufficient.

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top center',
        markers: false,
      },
    });

    tl.to('.hero-title', { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.5 }, 0.1)
      .to('.hero-cta', { opacity: 1, scale: 1, duration: 0.5 }, 0.2);

    return () => tl.kill();
  }, []);

  return (
    <section ref={ref}>
      <h1 className="hero-title" style={{ opacity: 0, transform: 'translateY(20px)' }}>Title</h1>
      <p className="hero-subtitle" style={{ opacity: 0, transform: 'translateY(20px)' }}>Subtitle</p>
      <button className="hero-cta" style={{ opacity: 0, transform: 'scale(0.8)' }}>CTA</button>
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
    ScrollTrigger.refresh();
  }, [projects]);

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
