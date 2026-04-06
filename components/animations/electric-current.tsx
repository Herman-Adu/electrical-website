/**
 * ANIMATION: ElectricCurrent
 *
 * SVG-based electric current animation that flows along a path.
 * Uses stroke-dashoffset animation for a flowing electricity effect.
 */

"use client"

import { motion } from "framer-motion"

interface ElectricCurrentProps {
  className?: string
}

export function ElectricCurrent({ className }: ElectricCurrentProps) {
  return (
    <svg className={className} viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main current path */}
      <motion.path
        d="M0 100 Q200 50 400 100 T800 100"
        stroke="url(#electricGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          pathLength: { duration: 2, ease: "easeInOut" },
          opacity: { duration: 2, times: [0, 0.1, 0.9, 1] },
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1,
        }}
      />

      {/* Secondary glow path */}
      <motion.path
        d="M0 100 Q200 50 400 100 T800 100"
        stroke="url(#electricGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1,
        }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.745 0.153 72.338)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.745 0.153 72.338)" stopOpacity="1" />
          <stop offset="100%" stopColor="oklch(0.745 0.153 72.338)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
