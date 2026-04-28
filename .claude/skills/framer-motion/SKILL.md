---
name: framer-motion
description: Use this skill WHENEVER building smooth component animations, entrance/exit animations, gesture-driven interactions, or reusable animation components. Triggers on "smooth transition", "motion component", "entrance animation", "gesture", "animation variant", "smooth state change". Provides production-grade Framer Motion patterns for Next.js 16 App Router with zero configuration overhead.
argument-hint: "[describe the animation or interaction needed]"
disable-model-invocation: true
---

## Session Preflight

`pnpm docker:mcp:memory:open electrical-website-state` — check active phase and existing animation patterns before generating new ones.

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

For complex animation systems (multiple coordinated components, shared layout), delegate via `Agent(subagent_type='general-purpose')`.

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

Patterns 4–7 (gesture interactions, state-driven, page transitions, reusable variants library) are in [`patterns.md`](patterns.md).

## Key Concepts

Always use `viewport={{ once: true }}` with `whileInView` — without it the animation re-fires on every scroll entry.

Common easing values: `'easeOut'` (fast start), `'easeInOut'` (slow both ends), `[0.4, 0, 0.2, 1]` (custom cubic-bezier), `{ type: 'spring', stiffness: 400 }` (physics).

Variants pattern — define once, share across components:
```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
<motion.div variants={variants} initial="hidden" animate="visible" exit="exit" />
```

## Anti-Patterns (Performance Issues)

Using `animate` on many elements without viewport check:
```typescript
// Animates even when not in view (wasted)
<motion.div animate={{ opacity: 1 }} />
// Use whileInView instead:
<motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }} />
```

Layout animations on large components:
```typescript
// Expensive layout calculations
<motion.div layout animate={{ width: 200 }} />
// Use transform instead (GPU-accelerated):
<motion.div animate={{ scaleX: 2 }} />
```

## Implementation Checklist

- [ ] Framer Motion installed (`pnpm add framer-motion`)
- [ ] All animations use `motion.` components
- [ ] Scroll animations use `whileInView` with `once: true`
- [ ] Variants defined for reusable patterns
- [ ] Staggered animations use `staggerChildren`
- [ ] Page transitions use `AnimatePresence`
- [ ] Gesture animations use appropriate handlers
- [ ] No `layout` animations on large elements
- [ ] Respects `prefers-reduced-motion` (optional)
- [ ] Test with `PLAYWRIGHT_REUSE_SERVER=true pnpm test` when dev server is running on port 3000

## Quick Fixes for Choppy Animations

1. Add `viewport={{ once: true }}` to `whileInView`
2. Use `ease: 'easeOut'` instead of linear
3. Reduce `duration` if animation feels slow
4. Use `transform` instead of `layout`
5. Avoid animating too many properties at once

## References

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Variants API](https://www.framer.com/motion/variants/)
- [Easing Functions](https://www.framer.com/motion/transition/)
- [AnimatePresence](https://www.framer.com/motion/animate-presence/)
