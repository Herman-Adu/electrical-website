/**
 * ANIMATION: PulseCircle
 *
 * Pulsing circle effect for active elements.
 * Creates a radar-like pulse animation.
 */

"use client"

import { motion } from "framer-motion"

interface PulseCircleProps {
  size?: number
  color?: string
  duration?: number
}

export function PulseCircle({ size = 100, color = "oklch(0.745 0.153 72.338)", duration = 2 }: PulseCircleProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: size,
            height: size,
            borderColor: color,
          }}
          initial={{
            scale: 0.8,
            opacity: 0.6,
          }}
          animate={{
            scale: [0.8, 1.5, 2],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * (duration / 3),
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
