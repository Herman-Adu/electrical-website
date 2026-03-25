"use client";

import { useEffect, useState } from "react";

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
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="tabular-nums">
      {value % 1 === 0
        ? NUMBER_FORMATTER.format(Math.floor(count))
        : count.toFixed(1)}
      {suffix}
    </span>
  );
}
