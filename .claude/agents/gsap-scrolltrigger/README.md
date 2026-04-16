# GSAP ScrollTrigger Agent

Specialized sub-agent for diagnosing and fixing scroll-triggered animation problems.

## What This Agent Does

- **Diagnoses** scroll animation flicker, layout shift, and performance issues
- **Fixes** existing animations to use GSAP ScrollTrigger patterns
- **Implements** new smooth scroll-reveal animations
- **Optimizes** scroll animation performance (batching, GPU acceleration)
- **Validates** animation quality (60fps, no jank, proper alignment)

## When Orchestrator Dispatches This Agent

**Parent skill calls this agent when:**

```typescript
// Diagnose why animations flicker
Agent(gsap-scrolltrigger, {
  subtask: 'diagnose',
  target: 'components/sections/hero.tsx',
  intensity: 'full'
});

// Fix existing animation
Agent(gsap-scrolltrigger, {
  subtask: 'fix',
  target: 'components/molecules/project-card.tsx',
  context: 'Animation flickers on scroll due to position animation'
});

// Implement new animation
Agent(gsap-scrolltrigger, {
  subtask: 'implement',
  target: 'New fade-in-up entrance animation',
  intensity: 'full'
});

// Optimize performance
Agent(gsap-scrolltrigger, {
  subtask: 'optimize',
  context: 'Multiple scroll animations causing jank'
});

// Validate animation quality
Agent(gsap-scrolltrigger, {
  subtask: 'validate',
  target: 'Fixed animations in components/',
  context: 'Chrome DevTools performance data'
});
```

## Agent Subtasks

### 1. Diagnose Subtask

**Input:**
- Component file or code snippet
- Description of animation issue
- Optional: Chrome DevTools performance data

**Agent Will:**
- Identify root cause (layout shift, state updates, missing CSS)
- Point to specific problematic lines
- Provide 3–5 recommendations

**Output Example:**
```
Root cause: Animation uses `left` property (layout shift)

Problematic lines:
- Line 45: gsap.to(el, { left: 100 })
- Line 52: No will-change CSS

Recommendations:
1. Change `left: 100` to `x: 100` (transform)
2. Add `will-change: transform;` to CSS
3. Add `once: true` to prevent re-trigger
4. Wrap in useEffect with cleanup
5. Test with DevTools Performance tab
```

### 2. Fix Subtask

**Input:**
- Component code with animation issue
- Description of problem
- Context about expected behavior

**Agent Will:**
- Refactor animation to use ScrollTrigger
- Change animations to transform-only
- Add proper CSS
- Implement useEffect cleanup
- Add once: true for entrance animations

**Output Example:**
```typescript
// Before
gsap.to(element, { left: 100, duration: 0.8 });

// After
'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        once: true,
      },
      x: 100,
      duration: 0.8,
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div ref={ref} className="will-change-transform">
      Content
    </div>
  );
}
```

Changes:
- ✅ `left` → `x` (transform)
- ✅ Added ScrollTrigger
- ✅ Added useEffect + cleanup
- ✅ Added once: true
- ✅ Added will-change CSS class

### 3. Implement Subtask

**Input:**
- Component name or description
- Animation type (fade, slide, stagger, timeline)
- Target elements

**Agent Will:**
- Create complete working component
- Apply appropriate ScrollTrigger pattern
- Add all required CSS
- Provide usage instructions
- Include testing notes

**Output Example:**
```typescript
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Complete, ready-to-use component
```

### 4. Optimize Subtask

**Input:**
- Component directory or list of animations
- Performance issues or goals
- Context about current performance

**Agent Will:**
- Identify all scroll animations
- Find performance bottlenecks
- Batch animations where possible
- Add GPU acceleration
- Recommend reduce-motion support
- Provide optimization report

**Output Example:**
```
Optimization Report

Issues Found:
- 12 scroll animations, each with own ScrollTrigger
- Missing will-change CSS on 8 elements
- No once: true on 5 animations (re-trigger)

Recommendations:
1. Batch animations using gsap.utils.toArray()
   Expected gain: ~30% fewer DOM queries

2. Add will-change CSS to all animate-on-scroll elements
   Expected gain: ~20% smoother animation

3. Add once: true to entrance animations
   Expected gain: ~40% fewer re-renders

4. Add reduce-motion media query support
   Expected gain: Better accessibility
```

### 5. Validate Subtask

**Input:**
- Component or code to validate
- Chrome DevTools performance data (optional)

**Agent Will:**
- Run validation checks
- Verify CSS is correct
- Check for console errors
- Test 60fps smoothness
- Verify no layout shift
- Test various viewport sizes

**Output Format:**
```
Validation Report

✅ ScrollTrigger registered
✅ Uses transform properties only
✅ CSS has will-change
✅ useEffect with cleanup
✅ once: true on entrance animations
❌ Missing will-change on card elements (fix: add to .css)
✅ No console errors
✅ 60fps smooth on scroll
✅ No layout shift detected
✅ Proper alignment

Confidence: High
Issues: 1 minor (will-change CSS)
```

## Key Knowledge

### CSS Pattern
```css
.scroll-animate {
  will-change: transform;     /* GPU acceleration */
  contain: layout style paint; /* Isolate from layout */
  transform: translateZ(0);   /* Force GPU layer */
}
```

### JavaScript Pattern
```typescript
'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useEffect(() => {
  gsap.to(element, {
    scrollTrigger: { trigger: element, once: true },
    // transform properties only
    x: 100, y: 50, opacity: 0.5,
  });

  return () => ScrollTrigger.getAll().forEach((t) => t.kill());
}, []);
```

### Common Patterns

**Fade-In on Scroll:**
```typescript
gsap.to(el, {
  scrollTrigger: { trigger: el, once: true },
  opacity: 1,
  y: 0,
});
```

**Staggered Grid:**
```typescript
const els = gsap.utils.toArray<HTMLElement>('.card');
els.forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, once: true },
    opacity: 1,
    delay: i * 0.1,
  });
});
```

**Synced Timeline:**
```typescript
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.section' },
});
tl.to('.title', { opacity: 1 }, 0)
  .to('.subtitle', { opacity: 1 }, 0.1);
```

## Error Handling

| Issue | Recovery |
|-------|----------|
| Can't find animation code | Ask parent for file path or code snippet |
| Animation already using GSAP | Optimize existing instead of rewrite |
| Performance data missing | Recommend Chrome DevTools profiling |
| Layout shift diagnosis unclear | Suggest computed styles inspection |
| Browser compatibility concerns | ScrollTrigger supports modern browsers |

## Related Agents

- **framer-motion agent** — For smooth component-level animations
- **aos-scroll-reveal agent** — For bulk scroll-reveal animations
