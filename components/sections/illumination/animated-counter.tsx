"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  inView: boolean;
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function AnimatedCounter({
  value,
  suffix,
  inView,
}: AnimatedCounterProps) {
  const { count } = useAnimatedCounter({
    value,
    shouldAnimate: inView,
    duration: 2000,
    steps: 60,
  });

  return (
    <span className="tabular-nums">
      {value % 1 === 0
        ? NUMBER_FORMATTER.format(Math.floor(count))
        : count.toFixed(1)}
      {suffix}
    </span>
  );
}
