"use client";

import { motion } from "framer-motion";

export interface HubCircuitProps {
  shouldReduceMotion: boolean;
}

const JUNCTION_CIRCLES: ReadonlyArray<[number, number]> = [
  [420, 230],
  [840, 320],
  [1260, 250],
  [360, 390],
  [760, 510],
  [1120, 430],
];

const FLOATING_DOTS: ReadonlyArray<{
  cx: number;
  cy: number;
  r: number;
  keyframes: { opacity: number[] };
}> = [
  { cx: 380, cy: 210, r: 1.5, keyframes: { opacity: [0.2, 1, 0.2] } },
  { cx: 800, cy: 340, r: 2, keyframes: { opacity: [0.4, 1, 0.4] } },
  { cx: 1220, cy: 270, r: 1.5, keyframes: { opacity: [0.1, 0.8, 0.1] } },
  { cx: 400, cy: 410, r: 2, keyframes: { opacity: [0.3, 1, 0.3] } },
  { cx: 720, cy: 490, r: 1.5, keyframes: { opacity: [0.2, 0.9, 0.2] } },
  { cx: 1080, cy: 450, r: 2, keyframes: { opacity: [0.4, 1, 0.4] } },
];

export function HubCircuit({ shouldReduceMotion }: HubCircuitProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        viewBox="0 0 1440 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* P1 — primary horizontal circuit trace */}
        <motion.path
          d="M0 320 H320 L420 230 H740 L840 320 H1160 L1260 250 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="1"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.6, delay: 0.5, ease: "easeOut" }
          }
        />

        {/* P2 — secondary horizontal circuit trace */}
        <motion.path
          d="M0 470 H260 L360 390 H620 L760 510 H980 L1120 430 H1440"
          stroke="var(--electric-cyan)"
          strokeWidth="0.5"
          fill="none"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.6, delay: 0.95, ease: "easeOut" }
          }
        />

        {/* Junction circles — filled, animate opacity */}
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
                : { delay: 1.5 + index * 0.09, duration: 0.3 }
            }
          />
        ))}

        {/* Floating dots — blinking near path intersections */}
        {FLOATING_DOTS.map((dot, index) => (
          <motion.circle
            key={`dot-${index}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="var(--electric-cyan)"
            animate={
              shouldReduceMotion
                ? { opacity: 0.3 }
                : { opacity: dot.keyframes.opacity }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }
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
