"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroIconBadgeProps {
  icon?: ReactNode;
  children?: ReactNode;
  variants?: Variants;
  colorScheme: "blueprint" | "image";
}

const COLOR_SCHEME = {
  blueprint: {
    border: "border-electric-cyan/50",
  },
  image: {
    border: "border-white",
  },
} as const;

export function HeroIconBadge({
  icon,
  children,
  variants,
  colorScheme,
}: HeroIconBadgeProps) {
  const scheme = COLOR_SCHEME[colorScheme];
  const content = icon ?? children;

  return (
    <motion.div
      variants={variants}
      className="flex justify-center mb-6"
    >
      <div className="relative">
        <div
          className={cn(
            "w-16 h-16 rounded-xl border bg-white/10 flex items-center justify-center backdrop-blur-sm",
            scheme.border,
          )}
        >
          <span className="flex items-center justify-center w-9 h-9">
            {content}
          </span>
        </div>
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-electric-cyan/20"
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
