# Framer Motion — Extended Patterns

Less-common patterns. Reference from SKILL.md when patterns 1–3 are insufficient.

## Pattern 4: Gesture Interactions (Hover, Tap, Drag)

**When to use:** Interactive components with hover/tap feedback

```typescript
'use client';

import { motion } from 'framer-motion';

export function InteractiveButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
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
// <motion.div
//   variants={fadeInVariants}
//   initial="hidden"
//   whileInView="visible"
//   custom={0.2}  // Passed as delay
//   viewport={{ once: true }}
// />
```
