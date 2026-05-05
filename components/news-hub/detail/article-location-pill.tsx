"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ArticleLocationPillProps {
  location: string;
}

export function ArticleLocationPill({ location }: ArticleLocationPillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-flex"
    >
      <span className="flex items-center gap-1.5 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-electric-cyan">
        {/* Map pin icon */}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 0.5C3.34 0.5 2 1.84 2 3.5C2 5.75 5 9.5 5 9.5C5 9.5 8 5.75 8 3.5C8 1.84 6.66 0.5 5 0.5ZM5 4.75C4.31 4.75 3.75 4.19 3.75 3.5C3.75 2.81 4.31 2.25 5 2.25C5.69 2.25 6.25 2.81 6.25 3.5C6.25 4.19 5.69 4.75 5 4.75Z"
            fill="currentColor"
          />
        </svg>
        {location}
      </span>
    </motion.div>
  );
}
