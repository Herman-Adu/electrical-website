"use client";

import { motion } from "framer-motion";

interface NewsTickerProps {
  items: string[];
  speed?: number;
}

export function NewsTicker({ items, speed = 30 }: NewsTickerProps) {
  // Duplicate items for seamless loop
  const tickerItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-electric-cyan/20 bg-gradient-to-r from-electric-cyan/5 via-transparent to-electric-cyan/5 py-3">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {tickerItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70"
          >
            <span className="h-1 w-1 rounded-full bg-electric-cyan" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
