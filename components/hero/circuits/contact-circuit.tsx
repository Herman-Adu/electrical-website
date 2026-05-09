"use client";

import { motion } from "framer-motion";

export interface ContactCircuitProps {
  shouldReduceMotion: boolean;
}

const JUNCTION_CIRCLES: ReadonlyArray<[number, number]> = [
  [540, 260],
  [940, 300],
  [340, 340],
  [700, 420],
];

export function ContactCircuit({ shouldReduceMotion }: ContactCircuitProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* P1 — primary horizontal trace */}
        <motion.path
          d="M0 300 H500 L540 260 H900 L940 300 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="1"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.0, delay: 0.5, ease: "easeOut" }
          }
        />

        {/* P2 — secondary lower trace */}
        <motion.path
          d="M0 380 H300 L340 340 H700 L780 420 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="0.5"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.0, delay: 0.9, ease: "easeOut" }
          }
        />

        {/* Filled junction circles — animate opacity */}
        {JUNCTION_CIRCLES.map(([cx, cy], index) => (
          <motion.circle
            key={`junction-${index}`}
            cx={cx}
            cy={cy}
            r="3"
            fill="var(--electric-cyan)"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: 1.2 + index * 0.1, duration: 0.3 }
            }
          />
        ))}
      </svg>

      {/* Scanline — only rendered when motion is allowed */}
      {!shouldReduceMotion ? (
        <motion.div
          className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/20 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
    </div>
  );
}
