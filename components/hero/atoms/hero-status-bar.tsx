"use client";

import { motion, type Variants } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroStatusBarProps {
  label: string;
  status: string;
  variants?: Variants;
  colorScheme: "blueprint" | "image";
}

const COLOR_SCHEME = {
  blueprint: {
    border: "border-foreground/60 dark:border-foreground/70",
    text: "text-foreground",
  },
  image: {
    border: "border-white",
    text: "text-white",
  },
} as const;

export function HeroStatusBar({
  label,
  status,
  variants,
  colorScheme,
}: HeroStatusBarProps) {
  const scheme = COLOR_SCHEME[colorScheme];

  return (
    <motion.div
      variants={variants}
      className="flex items-center justify-center gap-3 mb-8"
    >
      <div
        className={cn(
          "flex items-center gap-3 border-l-2 pl-4 font-bold",
          scheme.border,
        )}
      >
        <Activity size={14} className="text-electric-cyan animate-pulse" />
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.3em] uppercase font-bold",
            scheme.text,
          )}
        >
          {label} // {status}
        </span>
      </div>
    </motion.div>
  );
}
