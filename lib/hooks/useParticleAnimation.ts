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
 * useParticleAnimation - Consolidates floating particles/glow effects
 *
 * Useful for:
 * - Ambient glow orbs in backgrounds
 * - Floating particle animations
 * - Decorative light effects
 *
 * Returns:
 * - glowOpacity: MotionValue for controlling opacity
 * - animationStyle: CSSProperties for positioning and sizing
 *
 * @example
 * const { glowOpacity, animationStyle } = useParticleAnimation({
 *   position: { top: '20%', left: '40%' },
 *   size: { width: '300px', height: '300px' },
 *   color: '#00f2ff',
 *   blurIntensity: '100px'
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
 */
export function useParticleAnimation({
  position,
  size,
  color = "#00f2ff",
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
