"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

interface LightningArcProps {
  isActive: boolean
  delay?: number
}

/**
 * Lightning Arc Animation Component
 * Creates an animated lightning bolt effect between steps
 * Uses GSAP for complex path animations
 */
export function LightningArc({ isActive, delay = 0 }: LightningArcProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)

  useGSAP(() => {
    if (!isActive || !pathRef.current || !glowRef.current) return

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      delay,
    })

    tl.fromTo(
      [pathRef.current, glowRef.current],
      {
        strokeDashoffset: 100,
      },
      {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
    ).to([pathRef.current, glowRef.current], {
      keyframes: { opacity: [1, 0.6, 1] },
      duration: 0.3,
      ease: "sine.inOut",
    })
  }, { dependencies: [isActive, delay] })

  if (!isActive) {
    return (
      <svg className="absolute top-5 left-[50%] w-full h-1" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M 0 5 L 100 5" stroke="currentColor" strokeWidth="2" fill="none" className="text-border opacity-30" />
      </svg>
    )
  }

  return (
    <svg
      className="absolute top-5 left-[50%] w-full h-4"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      style={{ filter: "drop-shadow(0 0 4px oklch(0.8 0.2 85))" }}
    >
      {/* Glow layer */}
      <path
        ref={glowRef}
        d="M 0 10 L 20 10 L 25 6 L 35 10 L 40 14 L 50 10 L 55 7 L 65 10 L 70 13 L 80 10 L 85 8 L 100 10"
        stroke="oklch(0.85 0.25 85)"
        strokeWidth="4"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="100"
        opacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main lightning path */}
      <path
        ref={pathRef}
        d="M 0 10 L 20 10 L 25 6 L 35 10 L 40 14 L 50 10 L 55 7 L 65 10 L 70 13 L 80 10 L 85 8 L 100 10"
        stroke="oklch(0.9 0.25 85)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="100"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
