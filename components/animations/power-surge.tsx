"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface PowerSurgeProps {
  trigger: number // Increment to trigger animation
}

/**
 * Power Surge Effect
 * Screen flash and particle burst when completing steps
 */
export function PowerSurge({ trigger }: PowerSurgeProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger > 0) {
      setIsActive(true)
      const timer = setTimeout(() => setIsActive(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Screen flash overlay */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              background: [
                "radial-gradient(circle at center, oklch(0.9 0.25 85 / 0) 0%, oklch(0.9 0.25 85 / 0) 100%)",
                "radial-gradient(circle at center, oklch(0.9 0.25 85 / 0.3) 0%, oklch(0.9 0.25 85 / 0) 70%)",
                "radial-gradient(circle at center, oklch(0.9 0.25 85 / 0) 0%, oklch(0.9 0.25 85 / 0) 100%)",
              ],
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          />

          {/* Electric particles */}
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2
              const distance = 100 + Math.random() * 100
              const x = Math.cos(angle) * distance
              const y = Math.sin(angle) * distance

              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: "oklch(0.95 0.25 85)",
                    boxShadow: "0 0 8px oklch(0.9 0.25 85)",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x,
                    y,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: i * 0.02,
                  }}
                />
              )
            })}
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
