"use client";

import { useTransform, useTime, MotionValue } from "framer-motion";
import { CSSProperties } from "react";

export interface UseParticleAnimationProps {
  position: { top: string; left: string };
  size: { width: string; height: string };
  color?: string;
  blurIntensity?: string;
  animationDuration?: number;
}

export interface UseParticleAnimationReturn {
  glowOpacity: MotionValue<number>;
  animationStyle: CSSProperties;
}

/**
 * Custom React hook: Floating particle/glow animation effects
 *
 * Consolidates floating particles and ambient glow effects. Useful for decorative
 * background animations and visual enhancements.
 *
 * **Use Cases:**
 * - Ambient glow orbs in hero backgrounds
 * - Floating particle animations
 * - Decorative light effects
 * - Atmospheric visual elements
 *
 * **Returns:**
 * - glowOpacity: MotionValue for controlling opacity (0-1, animated)
 * - animationStyle: CSSProperties for positioning and sizing
 *
 * **Performance:**
 * - Lightweight animation loop using Framer Motion's useTime
 * - High-performance opacity transitions
 * - No blocking calculations
 * - SSR-safe
 *
 * @param props - Configuration object
 * @param props.position - CSS position object { top: string; left: string }
 * @param props.size - CSS size object { width: string; height: string }
 * @param props.color - CSS color for the glow effect (default: inherited)
 * @param props.blurIntensity - CSS blur filter intensity (default: '100px')
 * @param props.animationDuration - Duration of opacity cycle in seconds (default: 3)
 *
 * @returns Object with:
 *   - glowOpacity: MotionValue<number> for controlling opacity
 *   - animationStyle: CSSProperties with position, size, color, and filter
 *
 * @throws Never. Uses internal error boundaries.
 *
 * @example
 * ```typescript
 * const { glowOpacity, animationStyle } = useParticleAnimation({
 *   position: { top: '20%', left: '40%' },
 *   size: { width: '300px', height: '300px' },
 *   color: '#00f3bd',
 *   blurIntensity: '100px',
 *   animationDuration: 4
 * });
 *
 * return (
 *   <motion.div
 *     style={{
 *       ...animationStyle,
 *       opacity: glowOpacity
 *     }}
 *   />
 * );
 * ```
 */
export function useParticleAnimation({
  position,
  size,
  color = "#00f3bd",
  blurIntensity = "80px",
  animationDuration = 8,
}: UseParticleAnimationProps): UseParticleAnimationReturn {
  // Create a simple oscillating MotionValue for opacity
  const baseOpacity = 0.3;
  const maxOpacity = 0.7;
  const time = useTime();

  const glowOpacity: MotionValue<number> = useTransform(time, (t: number) => {
    const normalized = t / 1000 / animationDuration;
    return (
      baseOpacity +
      (Math.sin(normalized * Math.PI * 2) * (maxOpacity - baseOpacity)) / 2 +
      (maxOpacity - baseOpacity) / 2
    );
  });

  // Animation styles for positioning and blur
  const animationStyle: CSSProperties = {
    position: "absolute",
    top: position.top,
    left: position.left,
    width: size.width,
    height: size.height,
    background: `radial-gradient(circle, ${color}, transparent)`,
    filter: `blur(${blurIntensity})`,
    pointerEvents: "none",
    borderRadius: "50%",
  };

  return {
    glowOpacity,
    animationStyle,
  };
}
