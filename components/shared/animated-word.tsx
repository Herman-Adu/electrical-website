"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type CommonWordProps = {
  word: string;
  index: number;
  className?: string;
  shouldReduce?: boolean | null;
  inactiveOpacity?: number;
  inactiveY?: number;
};

type AnimatedWordProps = CommonWordProps & {
  active: boolean;
  duration?: number;
  stagger?: number;
};

export function AnimatedWord({
  word,
  index,
  active,
  className,
  shouldReduce = false,
  inactiveOpacity = 0.15,
  inactiveY = 8,
  duration = 0.4,
  stagger = 0.06,
}: AnimatedWordProps) {
  if (shouldReduce) {
    return <span className={className}>{word}</span>;
  }

  return (
    <motion.span
      initial={{ opacity: inactiveOpacity, y: inactiveY }}
      animate={
        active
          ? { opacity: 1, y: 0 }
          : { opacity: inactiveOpacity, y: inactiveY }
      }
      transition={{ duration, delay: index * stagger }}
      className={className}
    >
      {word}
    </motion.span>
  );
}

type ScrollLinkedAnimatedWordProps = CommonWordProps & {
  phase: MotionValue<number>;
  staggerWindow?: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ScrollLinkedAnimatedWord({
  word,
  index,
  phase,
  className,
  shouldReduce = false,
  inactiveOpacity = 0.15,
  inactiveY = 8,
  staggerWindow = 0.16,
}: ScrollLinkedAnimatedWordProps) {
  const start = clamp01(index * staggerWindow);
  const end = clamp01(start + staggerWindow * 2);

  const opacity = useTransform(phase, [start, end], [inactiveOpacity, 1], {
    clamp: true,
  });
  const y = useTransform(phase, [start, end], [inactiveY, 0], { clamp: true });

  if (shouldReduce) {
    return <span className={className}>{word}</span>;
  }

  return (
    <motion.span style={{ opacity, y }} className={className}>
      {word}
    </motion.span>
  );
}
