"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroEyebrowProps {
  text: string;
  variants?: Variants;
  colorScheme: "blueprint" | "image";
}

const COLOR_SCHEME = {
  blueprint: {
    line: "bg-electric-cyan/80",
    label: "text-electric-cyan/80",
  },
  image: {
    line: "bg-electric-cyan",
    label: "text-electric-cyan",
  },
} as const;

export function HeroEyebrow({ text, variants, colorScheme }: HeroEyebrowProps) {
  const scheme = COLOR_SCHEME[colorScheme];

  return (
    <motion.div
      variants={variants}
      className="mb-6 flex items-center justify-center gap-4"
    >
      <span className={cn("h-px w-12 font-bold", scheme.line)} />
      <span
        className={cn(
          "font-mono text-xs tracking-[0.3em] uppercase font-bold",
          scheme.label,
        )}
      >
        {text}
      </span>
      <span className={cn("h-px w-12 font-bold", scheme.line)} />
    </motion.div>
  );
}
