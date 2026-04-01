"use client";

import { motion } from "framer-motion";

interface NewsPulseIndicatorProps {
  label?: string;
  variant?: "live" | "featured" | "breaking";
}

export function NewsPulseIndicator({
  label = "Live",
  variant = "live",
}: NewsPulseIndicatorProps) {
  const variants = {
    live: {
      dotColor: "bg-electric-cyan",
      ringColor: "bg-electric-cyan/30",
      textColor: "text-electric-cyan",
    },
    featured: {
      dotColor: "bg-electric-cyan",
      ringColor: "bg-electric-cyan/20",
      textColor: "text-electric-cyan",
    },
    breaking: {
      dotColor: "bg-amber-warning",
      ringColor: "bg-amber-warning/30",
      textColor: "text-amber-warning",
    },
  };

  const config = variants[variant];

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative flex h-3 w-3 items-center justify-center">
        <motion.span
          className={`absolute inline-flex h-full w-full rounded-full ${config.ringColor}`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dotColor}`}
        />
      </div>
      <span
        className={`font-mono text-[9px] uppercase tracking-[0.2em] ${config.textColor}`}
      >
        {label}
      </span>
    </div>
  );
}
