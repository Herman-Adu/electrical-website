/**
 * ANIMATION: SparkEffect
 *
 * Small spark particles that appear and fade around an element.
 * Creates an electric energy effect.
 */

"use client"

import { motion } from "framer-motion"

interface SparkEffectProps {
  count?: number
  color?: string
}

export function SparkEffect({ count = 5, color = "oklch(0.745 0.153 72.338)" }: SparkEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i
        const distance = 40 + Math.random() * 20

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
            style={{ backgroundColor: color }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * distance,
              y: Math.sin((angle * Math.PI) / 180) * distance,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}
