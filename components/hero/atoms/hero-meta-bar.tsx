"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroMetaBarProps {
  items: readonly string[];
  variants?: Variants;
  colorScheme: "blueprint" | "image";
}

const COLOR_SCHEME = {
  blueprint: {
    text: "text-foreground/80",
  },
  image: {
    text: "text-white/80",
  },
} as const;

export function HeroMetaBar({ items, variants, colorScheme }: HeroMetaBarProps) {
  const scheme = COLOR_SCHEME[colorScheme];

  return (
    <motion.div
      variants={variants}
      className={cn(
        "flex flex-wrap justify-center gap-8 font-mono font-bold text-[10px] tracking-[0.2em] uppercase",
        scheme.text,
      )}
    >
      {items.map((item, index) => (
        <>
          <span key={item}>{item}</span>
          {index < items.length - 1 ? (
            <span
              key={`sep-${index}`}
              className="hidden sm:inline opacity-40"
            >
              |
            </span>
          ) : null}
        </>
      ))}
    </motion.div>
  );
}
