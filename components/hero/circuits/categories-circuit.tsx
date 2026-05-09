"use client";

import { motion } from "framer-motion";

export interface CategoriesCircuitProps {
  shouldReduceMotion: boolean;
}

const OPEN_CIRCLES: ReadonlyArray<[number, number]> = [
  [380, 200],
  [700, 280],
  [780, 280],
  [1100, 280],
  [280, 420],
  [640, 480],
  [980, 420],
];

const VERTICAL_ACCENTS: ReadonlyArray<{ x: number; y1: number; y2: number; delay: number }> = [
  { x: 380, y1: 200, y2: 160, delay: 2.0 },
  { x: 780, y1: 280, y2: 240, delay: 2.15 },
  { x: 1180, y1: 200, y2: 160, delay: 2.3 },
];

export function CategoriesCircuit({ shouldReduceMotion }: CategoriesCircuitProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        viewBox="0 0 1440 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* P1 — upper circuit trace */}
        <motion.path
          d="M0 280 H300 L380 200 H700 L780 280 H1100 L1180 200 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="1"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.8, delay: 0.5, ease: "easeOut" }
          }
        />

        {/* P2 — lower circuit trace */}
        <motion.path
          d="M0 480 H200 L280 420 H560 L640 480 H900 L980 420 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="0.5"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.8, delay: 0.9, ease: "easeOut" }
          }
        />

        {/* Vertical accent drop lines at path peaks */}
        {VERTICAL_ACCENTS.map(({ x, y1, y2, delay }, index) => (
          <motion.line
            key={`accent-${index}`}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.4, delay }
            }
          />
        ))}

        {/* Open circles — stroke only */}
        {OPEN_CIRCLES.map(([cx, cy], index) => (
          <motion.circle
            key={`open-circle-${index}`}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="none"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: 1.6 + index * 0.1, duration: 0.3 }
            }
          />
        ))}
      </svg>

      {/* Scanline — only rendered when motion is allowed */}
      {!shouldReduceMotion ? (
        <motion.div
          className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/20 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
    </div>
  );
}
