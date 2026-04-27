"use client"

import { motion } from "framer-motion"

interface ElectricBorderProps {
  isActive: boolean
}

/**
 * Electric Border Animation
 * Animated electric current flowing around step circle border
 * Sparks appear when the current completes the circuit — driven by
 * Framer Motion keyframes rather than setInterval/setTimeout.
 */
export function ElectricBorder({ isActive }: ElectricBorderProps) {
  if (!isActive) return null

  const sparks = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2
    const distance = 25
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    }
  })

  return (
    <>
      {/* Rotating electric current border */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            oklch(0.9 0.25 85 / 0.3) 10%,
            oklch(0.95 0.25 85 / 0.8) 20%,
            oklch(0.9 0.25 85 / 0.3) 30%,
            transparent 40%,
            transparent 100%
          )`,
          padding: "2px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Spark bursts — declarative 2s cycle, no setInterval */}
      {sparks.map(({ x, y }, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent"
          style={{
            left: "50%",
            top: "50%",
            boxShadow: "0 0 4px oklch(0.9 0.25 85)",
          }}
          animate={{
            x: [0, x, 0],
            y: [0, y, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1.7,
            delay: i * 0.02,
          }}
        />
      ))}

      {/* Inner glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "inset 0 0 8px oklch(0.9 0.25 85 / 0.2)",
            "inset 0 0 15px oklch(0.9 0.25 85 / 0.4)",
            "inset 0 0 8px oklch(0.9 0.25 85 / 0.2)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </>
  )
}
