"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMotionValue, useSpring } from "framer-motion";

type TrustStatProps = {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isInView: boolean;
};

export function TrustStat({
  value,
  suffix,
  label,
  delay,
  isInView,
}: TrustStatProps) {
  const [count, setCount] = useState(0);
  const motionValue = useMotionValue(0);

  // Spring animation for smooth 60fps counter
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Listen to spring value changes and update count
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = springValue.on("change", (latest: number) => {
        setCount(Math.round(Math.min(latest, value)));
      });
    } catch {
      // Fallback if motion library not fully hydrated
      setCount(Math.round(motionValue.get()));
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [springValue, value, motionValue]);

  // Trigger animation when isInView changes
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    } else {
      motionValue.set(0);
      setCount(0);
    }
  }, [isInView, value, motionValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-electric-cyan font-mono">
        {count.toLocaleString("en-US")}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
        {label}
      </div>
    </motion.div>
  );
}
