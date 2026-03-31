"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface NewsStatCounterProps {
  value: string;
  label: string;
  duration?: number;
}

export function NewsStatCounter({
  value,
  label,
  duration = 2,
}: NewsStatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract numeric part and suffix
  const numericMatch = value.match(/^([\d,.]+)/);
  const numericValue = numericMatch ? parseFloat(numericMatch[1].replace(/,/g, "")) : 0;
  const suffix = value.replace(/^[\d,.]+/, "");

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (latest >= 1000) {
      return Math.round(latest).toLocaleString();
    }
    return Math.round(latest).toString();
  });

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          animate(count, numericValue, {
            duration,
            ease: "easeOut",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [count, numericValue, duration, hasAnimated]);

  return (
    <div className="flex flex-col">
      <span
        ref={ref}
        className="text-4xl font-black tracking-tight text-electric-cyan tabular-nums"
      >
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
        {label}
      </span>
    </div>
  );
}
