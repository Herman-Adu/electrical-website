"use client";

import { motion } from "framer-motion";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  inView: boolean;
  duration?: number;
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

/**
 * AnimatedCounter component using Framer Motion for smooth 60fps animations.
 * Replaces setInterval with requestAnimationFrame for jank-free number animations.
 */
export function AnimatedCounter({
  value,
  suffix,
  inView,
  duration = 2000,
}: AnimatedCounterProps) {
  const { motionValue } = useAnimatedCounter({
    value,
    shouldAnimate: inView,
    duration,
  });

  // Transform the motion value to a formatted number string
  const displayValue = useTransform<number, string>(motionValue, (latest: number) => {
    if (value % 1 === 0) {
      // Integer: use NUMBER_FORMATTER
      return NUMBER_FORMATTER.format(Math.floor(latest));
    } else {
      // Decimal: keep one decimal place
      return latest.toFixed(1);
    }
  });

  return (
    <span className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}
