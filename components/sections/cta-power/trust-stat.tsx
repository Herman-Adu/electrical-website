"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    let current = 0;
    const increment = Math.ceil(value / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isInView, value]);

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
