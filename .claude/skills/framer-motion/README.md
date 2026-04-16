# Framer Motion Skill

**Build smooth, professional component animations in React.**

## When to Use

Use this skill when you need to:
- Animate component entrance/exit smoothly
- Add hover, tap, or drag interactions
- Stagger animations on lists
- Create page transitions
- Orchestrate multiple elements animating together
- Build reusable animation patterns

**Trigger phrases:**
- "Smooth animation on enter"
- "Animation feels choppy"
- "Stagger list animations"
- "Hover effect"
- "Page transition"
- "Animate state change"

## Installation

```bash
npm install framer-motion
```

## Quick Examples

### Fade In Entrance

```typescript
'use client';
import { motion } from 'framer-motion';

export function FadeInSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

### Scroll-Triggered Reveal

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Appears when scrolled into view
</motion.div>
```

### Staggered List

```typescript
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Hover Effect

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## Key Concepts

### Variants (Reusable Animations)

Define once, use everywhere:

```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={variants} initial="hidden" animate="visible" />
```

### whileInView (Scroll Animations)

Animates when entering viewport. **Always use `once: true`**:

```typescript
<motion.div
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}  // Only animate once
/>
```

### AnimatePresence (Route Transitions)

Wrap page content to animate exits:

```typescript
<AnimatePresence mode="wait">
  <motion.div key={pathname}>
    {children}
  </motion.div>
</AnimatePresence>
```

### Staggered Animations

Children animate in sequence:

```typescript
variants={{
  container: {
    transition: { staggerChildren: 0.1 }
  }
}}
```

## Common Patterns

| Use Case | Pattern |
|----------|---------|
| Fade in on load | `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` |
| Reveal on scroll | `whileInView={{ opacity: 1 }}` + `viewport={{ once: true }}` |
| Hover effect | `whileHover={{ scale: 1.05 }}` |
| Click effect | `whileTap={{ scale: 0.95 }}` |
| List entrance | `staggerChildren: 0.1` |
| Page transition | `AnimatePresence` + `exit` state |
| State toggle | `animate={isOpen ? 'open' : 'closed'}` |

## Performance Tips

1. **Use `whileInView` + `once: true`** for scroll animations
2. **Batch animations** with `staggerChildren` instead of individual timeouts
3. **Animate `transform` only**, not `layout`
4. **Reduce `duration`** for snappier feel (0.3–0.5s typical)
5. **Test on slow devices** (DevTools → CPU throttling)

## Debugging Checklist

- [ ] `motion.` component used (not HTML)
- [ ] Variants defined for reusable patterns
- [ ] `whileInView` has `viewport={{ once: true }}`
- [ ] No console warnings
- [ ] 60fps smooth (DevTools Performance)
- [ ] Works on touch devices (whileTap)
- [ ] Respects `prefers-reduced-motion` (optional)
- [ ] No excessive re-renders (React DevTools Profiler)

## Troubleshooting

**Animation doesn't start?**
- Verify `animate` or `whileInView` is set
- Check element is visible/in viewport
- Ensure no conflicting CSS animations

**Animation feels choppy?**
- Reduce `duration` (0.3–0.5s)
- Use `ease: 'easeOut'`
- Reduce number of animated properties
- Profile with DevTools Performance tab

**Page transition jerky?**
- Use `AnimatePresence mode="wait"`
- Keep `transition.duration` under 0.5s
- Avoid complex animations on large elements

## Resources

- [Framer Motion Official Docs](https://www.framer.com/motion/)
- [Variants & Orchestration](https://www.framer.com/motion/variants/)
- [Easing & Transitions](https://www.framer.com/motion/transition/)
- [Page Transitions](https://www.framer.com/motion/animate-presence/)

## Related Skills

- **gsap-scrolltrigger** — For complex scroll animations with GPU optimization
- **aos-scroll-reveal** — For bulk scroll-reveal animations with minimal setup
