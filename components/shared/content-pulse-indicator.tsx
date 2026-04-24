"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PulseVariant = "live" | "featured" | "breaking";

interface ContentPulseIndicatorProps {
  /** Label text to display */
  label?: string;
  /** Visual variant */
  variant?: PulseVariant;
}

/**
 * Animated pulse indicator for live feeds, featured content, etc.
 * Shared across News Hub and Projects sections.
 */
export function ContentPulseIndicator({
  label = "Live",
  variant = "live",
}: ContentPulseIndicatorProps) {
  // Determine colors based on variant
  const getDotColor = () => {
    switch (variant) {
      case "live":
      case "featured":
        return "bg-[hsl(174_100%_35%)] bg-electric-cyan dark:bg-white";
      case "breaking":
        return "bg-amber-warning";
    }
  };

  const getRingColor = () => {
    switch (variant) {
      case "live":
        return "bg-[hsl(174_100%_35%)]/30 bg-electric-cyan/60 dark:bg-white/60";
      case "featured":
        return "bg-[hsl(174_100%_35%)]/20 dark:bg-electric-cyan/20";
      case "breaking":
        return "bg-amber-warning/30";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "live":
      case "featured":
        return "text-electric-cyan font-bold";
      case "breaking":
        return "text-amber-warning";
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative flex h-3 w-3 items-center justify-center">
        <motion.span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full",
            getRingColor(),
          )}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            getDotColor(),
          )}
        />
      </div>
      <span
        className={cn(
          "font-mono text-[9px] uppercase tracking-[0.2em]",
          getTextColor(),
        )}
      >
        {label}
      </span>
    </div>
  );
}
