"use client";

import { motion } from "framer-motion";

type PulseVariant = "live" | "featured" | "breaking";

interface ContentPulseIndicatorProps {
  /** Label text to display */
  label?: string;
  /** Visual variant */
  variant?: PulseVariant;
}

const variantConfig: Record<
  PulseVariant,
  { dotColor: string; ringColor: string; textColor: string }
> = {
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

/**
 * Animated pulse indicator for live feeds, featured content, etc.
 * Shared across News Hub and Projects sections.
 */
export function ContentPulseIndicator({
  label = "Live",
  variant = "live",
}: ContentPulseIndicatorProps) {
  const config = variantConfig[variant];

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
