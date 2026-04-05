"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ElectricBorderProps {
  isActive: boolean
}

/**
 * Electric Border Animation
 * Animated electric current flowing around step circle border
 * Sparks appear when the current completes the circuit
 */
export function ElectricBorder({ isActive }: ElectricBorderProps) {
  const [showSpark, setShowSpark] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setShowSpark(true)
      setTimeout(() => setShowSpark(false), 300)
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

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

      {/* Small spark bursts when current completes circle */}
      {showSpark && (
        <>
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const distance = 25

            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent"
                style={{
                  left: "50%",
                  top: "50%",
                  boxShadow: "0 0 4px oklch(0.9 0.25 85)",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            )
          })}
        </>
      )}

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
