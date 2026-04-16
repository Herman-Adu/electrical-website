---
name: framer-motion
description: Use this skill WHENEVER building smooth component animations, entrance/exit animations, gesture-driven interactions, or reusable animation components. Triggers on "smooth transition", "motion component", "entrance animation", "gesture", "animation variant", "smooth state change". Provides production-grade Framer Motion patterns for Next.js 16 App Router with zero configuration overhead.
argument-hint: "[describe the animation or interaction needed]"
disable-model-invocation: true
---

## Live Context (auto-injected)

Current UI components: !`find components -type f -name "*.tsx" | head -10 2>/dev/null || echo "No components detected"`
Existing animation patterns: !`grep -r "motion\|animate" components --include="*.tsx" 2>/dev/null | wc -l || echo "No animations found"`

# Framer Motion Skill

**Purpose:** Build smooth, professional component animations with zero flicker

**Use When:**
- Animating component entrance/exit
- Building gesture-driven interactions (hover, tap, drag)
- Creating smooth state transitions
- Reusing animation patterns across components
- Staggering animations on lists
- Page transitions

## Core Advantage Over Alternatives

**Why Framer Motion over CSS:**
- Orchestrated animations (sync multiple elements)
- Gesture detection built-in
- No layout thrashing
- Responsive animations
- Accessibility-first (respects prefers-reduced-motion)

**Why Framer Motion over GSAP for component animations:**
- React-native (no hooks complexity)
- Smaller bundle (~50KB)
- Layout animations (shared layout)
- Faster for simple cases
- Better TypeScript support

## Execution Method

1. **Choose animation type**
   - Simple entrance/exit → Use `whileInView`
   - State change → Use `animate` with conditions
   - Gesture → Use `whileHover`, `whileTap`, `whileDrag`
   - List animation → Use variants + staggerChildren
   - Page transition → Use `AnimatePresence`

2. **Implement the pattern**
   - Define initial, animate, exit states
   - Use variants for reusability
   - Wrap in viewport observer for scroll triggers
   - Add viewport settings for performance

3. **Verify quality**
   - No console warnings
   - Smooth 60fps
   - Respects prefers-reduced-motion
   - Accessible on touch devices

## Pattern 1: Simple Entrance Animation

**When to use:** Component fades in smoothly on load or when entering viewport

```typescript
'use client';

import { motion } from 'framer-motion';

export function FadeInComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Content fades in smoothly
    </motion.div>
  );
}
```

## Pattern 2: Entrance on Scroll (whileInView)

**When to use:** Component animates when scrolling into view (preferred over scroll listeners)

```typescript
'use client';

import { motion } from 'framer-motion';

export function ScrollReveal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} // Key: only once
      transition={{ duration: 0.6 }}
    >
      Animates when scrolled into view
    </motion.div>
  );
}
```

## Pattern 3: Staggered List Animation

**When to use:** Multiple items animate in sequence (cards, list items)

```typescript
'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,      // 100ms between each child
      delayChildren: 0.2,        // Start after 200ms
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function ProjectList({ projects }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {projects.map((project) => (
        <motion.li key={project.id} variants={itemVariants}>
          <ProjectCard project={project} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## Pattern 4: Gesture Interactions (Hover, Tap, Drag)

**When to use:** Interactive components with hover/tap feedback

```typescript
'use client';

import { motion } from 'framer-motion';

export function InteractiveButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}      // Scale on hover
      whileTap={{ scale: 0.95 }}         // Scale on click
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="px-6 py-2 rounded-lg bg-blue-500 text-white"
    >
      Click me
    </motion.button>
  );
}
```

## Pattern 5: Conditional Animation (State-Driven)

**When to use:** Animation based on state changes (menu open/close, loading)

```typescript
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function ToggleMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, x: 0 },
          closed: { opacity: 0, x: -100 },
        }}
        transition={{ duration: 0.3 }}
      >
        Menu items
      </motion.nav>
    </>
  );
}
```

## Pattern 6: Page Transitions (AnimatePresence)

**When to use:** Routes change, animate old page out and new page in

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Pattern 7: Reusable Variants Library

**When to use:** Same animations across multiple components

```typescript
// lib/animations/variants.ts
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { delay, duration: 0.5 },
  }),
};

export const slideInVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: (delay: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
};

// Usage in component
<motion.div
  variants={fadeInVariants}
  initial="hidden"
  whileInView="visible"
  custom={0.2}  // Passed as delay
  viewport={{ once: true }}
/>
```

## Key Concepts

### whileInView (Scroll Animations)

```typescript
// ✅ CORRECT: Animates when entering viewport, only once
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}  // Critical for performance
/>

// ❌ WRONG: Re-animates every time comes into view
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: false }}  // Bad performance
/>
```

### Easing Functions

```typescript
transition={{ ease: 'easeOut' }}     // Fast start, slow end
transition={{ ease: 'easeInOut' }}   // Slow start and end
transition={{ ease: [0.4, 0, 0.2, 1] }} // Custom cubic-bezier
transition={{ ease: 'circOut' }}     // Smooth, bouncy
transition={{ type: 'spring', stiffness: 400 }} // Spring physics
```

### Variants

```typescript
// Reusable animation definitions
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Use in component
<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
/>
```

## Anti-Patterns (Performance Issues)

❌ **Using `animate` on many elements without viewport check**
```typescript
// DON'T: Animates even when not in view (wasted)
<motion.div animate={{ opacity: 1 }} />
```

✅ **Use whileInView for scroll-triggered animations**
```typescript
// DO: Only animates when in view
<motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }} />
```

❌ **Layout animations on large components**
```typescript
// DON'T: Expensive layout calculations
<motion.div layout animate={{ width: 200 }} />
```

✅ **Use transform instead of layout**
```typescript
// DO: Fast, GPU-accelerated
<motion.div animate={{ scaleX: 2 }} />
```

## Implementation Checklist

- [ ] Framer Motion installed (`npm install framer-motion`)
- [ ] All animations use `motion.` components
- [ ] Scroll animations use `whileInView` with `once: true`
- [ ] Variants defined for reusable patterns
- [ ] Staggered animations use `staggerChildren`
- [ ] Page transitions use `AnimatePresence`
- [ ] Gesture animations use appropriate handlers
- [ ] No `layout` animations on large elements
- [ ] Respects `prefers-reduced-motion` (optional)
- [ ] Test: 60fps smooth, no jank, accessible on touch

## Quick Fixes for Choppy Animations

1. ✅ Add `viewport={{ once: true }}` to `whileInView`
2. ✅ Use `ease: 'easeOut'` instead of linear
3. ✅ Reduce `duration` if animation feels slow
4. ✅ Use `transform` instead of `layout`
5. ✅ Avoid animating too many properties at once

## References

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Variants API](https://www.framer.com/motion/variants/)
- [Easing Functions](https://www.framer.com/motion/transition/)
- [AnimatePresence](https://www.framer.com/motion/animate-presence/)
