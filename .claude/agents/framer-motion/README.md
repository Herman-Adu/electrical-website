# Framer Motion Agent

Specialized sub-agent for building smooth, production-grade component animations.

## When Orchestrator Dispatches This Agent

```typescript
// Implement entrance animation
Agent(framer-motion, {
  subtask: 'implement',
  target: 'HeroSection component',
  context: 'Needs smooth fade-in + slide-up entrance'
});

// Create reusable variants
Agent(framer-motion, {
  subtask: 'create variants',
  context: 'Need consistent animation patterns across all components'
});

// Add gesture interactions
Agent(framer-motion, {
  subtask: 'gesture',
  target: 'ProjectCard component',
  context: 'Add hover scale + tap feedback'
});

// Build staggered list
Agent(framer-motion, {
  subtask: 'stagger',
  target: 'ProjectList with 20 items',
  intensity: 'full'
});

// Validate animation quality
Agent(framer-motion, {
  subtask: 'validate',
  target: 'All animations in components/'
});
```

## What Agent Does

- **Implement:** Creates motion components with proper animation definitions
- **Create Variants:** Builds reusable animation pattern libraries
- **Gesture:** Adds hover, tap, drag interactions with spring physics
- **Stagger:** Coordinates sequential animations for lists/grids
- **Validate:** Tests 60fps smoothness, accessibility, touch support

## Key Patterns

### Simple Animation

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### Variants (Reusable)

```typescript
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
```

### Staggered Children

```typescript
<motion.ul variants={{
  container: { transition: { staggerChildren: 0.1 } }
}}>
  {items.map(item => <motion.li key={item} variants={itemVariants} />)}
</motion.ul>
```

### Gesture Animations

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

### Scroll-Triggered

```typescript
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>
```

## Output Format

Agent returns:

```
Summary
2–3 sentences of approach

Component Code
Complete, working motion component

Implementation Notes
- Animation type
- Duration
- Spring physics (if applicable)

Testing Checklist
✓/✗ Renders without errors
✓/✗ 60fps smooth
✓/✗ Touch device support
✓/✗ Accessibility

Confidence: High/Medium/Low
```

## Common Use Cases

| Use Case | Subtask | Input |
|----------|---------|-------|
| Fade-in entrance | implement | Component + "fade-in" |
| Hover effect | gesture | Component + "hover scale" |
| List stagger | stagger | Component + item count |
| Reusable patterns | create variants | List of animation types |
| Quality check | validate | Component directory |

## Related Agents

- **gsap-scrolltrigger** — For complex scroll animations
- **aos-scroll-reveal** — For bulk reveal animations

## Dependencies

- Framer Motion (`npm install framer-motion`)
- React 16.8+ with hooks
- Next.js 13+ (or any React framework)
