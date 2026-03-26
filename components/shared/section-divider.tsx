"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface SectionDividerProps {
  /** Label shown centred on the line — optional */
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className = "" }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px" });

  // Track last known Y position to decide direction
  const lastScrollY = useRef<number>(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  const [scrollingDown, setScrollingDown] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrollingDown(current >= lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When scrolling down the line draws left → right (originX 0 → 1).
  // When scrolling up the line draws right → left (originX 1 → 0).
  const originX = scrollingDown ? 0 : 1;

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Full-width line */}
      <motion.div
        key={`${scrollingDown}`} // re-trigger animation when direction changes
        className="relative h-px w-full bg-electric-cyan/30"
        initial={{ scaleX: 0, originX }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${originX * 100}% 50%` }}
      >
        {/* Glowing leading dot */}
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-electric-cyan shadow-[0_0_6px_2px_rgba(0,242,255,0.6)]"
          initial={{ left: scrollingDown ? "0%" : "100%" }}
          animate={
            isInView
              ? { left: scrollingDown ? "100%" : "0%" }
              : { left: scrollingDown ? "0%" : "100%" }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Optional centre label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="absolute inset-x-0 top-0 flex justify-center -translate-y-1/2"
        >
          <span className="px-4 bg-background font-mono text-[9px] tracking-[0.25em] uppercase text-electric-cyan/60">
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
