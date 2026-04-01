"use client";

import { motion } from "framer-motion";

interface NewsGridBackgroundProps {
  variant?: "default" | "dense" | "subtle";
  showGlow?: boolean;
}

export function NewsGridBackground({
  variant = "default",
  showGlow = true,
}: NewsGridBackgroundProps) {
  const gridConfig = {
    default: "blueprint-grid",
    dense: "blueprint-grid-fine",
    subtle: "blueprint-grid opacity-50",
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base grid */}
      <div className={`absolute inset-0 ${gridConfig[variant]}`} />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan/50 to-transparent"
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Corner glow effects */}
      {showGlow && (
        <>
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-electric-cyan/10 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-electric-cyan/10 blur-[100px]" />
        </>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}
