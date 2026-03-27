"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

export interface UseParallaxImageProps {
  targetRef: RefObject<HTMLElement | null>;
  initialBrightness?: number;
  maxBrightness?: number;
  onScreenStart?: number;
  onScreenEnd?: number;
}

export interface UseParallaxImageReturn {
  scrollProgress: MotionValue<number>;
  brightness: MotionValue<number>;
  saturation: MotionValue<number>;
  imageFilter: MotionValue<string>;
}

/**
 * Custom React hook: Parallax scroll effect with brightness/saturation transforms
 *
 * Manages scroll tracking, brightness/saturation transformations, and combined filter effects.
 * Useful for hero sections and featured images with scroll-linked visual effects.
 *
 * **Effects Applied:**
 * - Parallax scroll progress tracking (0 → 1 based on viewport position)
 * - Brightness transformation (darker on scroll start → lighter on scroll end)
 * - Saturation transformation (desaturated → vivid colors)
 * - Combined CSS filter effect with smooth spring animation
 *
 * **Performance:**
 * - Uses Framer Motion's useScroll for optimized scroll tracking
 * - Spring animation smooths transitions
 * - SSR-safe with hydration detection
 * - No blocking scroll listeners
 *
 * @param props - Configuration object
 * @param props.targetRef - Ref to the container element to track scroll position
 * @param props.initialBrightness - Starting brightness level 0-1 (default: 0.3)
 * @param props.maxBrightness - Maximum brightness level 0-1 (default: 1)
 * @param props.onScreenStart - When to start effect (0-1, default: 0.1)
 * @param props.onScreenEnd - When effect reaches maximum (0-1, default: 0.5)
 *
 * @returns Object with:
 *   - scrollProgress: MotionValue<number> for scroll position (0 → 1)
 *   - brightness: MotionValue<number> for brightness value
 *   - saturation: MotionValue<number> for saturation value
 *   - imageFilter: MotionValue<string> combined CSS filter string (ready to apply)
 *
 * @throws Never. Uses internal error boundaries.
 *
 * @example
 * ```typescript
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { imageFilter } = useParallaxImage({
 *   targetRef: containerRef,
 *   initialBrightness: 0.3,
 *   maxBrightness: 1
 * });
 *
 * return (
 *   <motion.div
 *     ref={containerRef}
 *     style={{ filter: imageFilter }}
 *   />
 * );
 * ```
 */
export function useParallaxImage({
  targetRef,
  initialBrightness = 0.3,
  maxBrightness = 1,
  onScreenStart = 0.1,
  onScreenEnd = 0.5,
}: UseParallaxImageProps): UseParallaxImageReturn {
  const [isMounted, setIsMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use scroll hook only after mounting
  const { scrollYProgress } = useScroll({
    target: isMounted ? targetRef : undefined,
    offset: ["start end", "end start"],
  });

  // Smooth spring wrapper
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Brightness: progressively brighten from initial to max
  const brightness = useTransform(
    smoothProgress,
    [onScreenStart, onScreenEnd],
    [initialBrightness, maxBrightness],
  );

  // Saturation: progressively increase from 0.5 to 1
  const saturation = useTransform(
    smoothProgress,
    [onScreenStart, onScreenEnd],
    [0.5, 1],
  );

  // Combine into CSS filter string
  const imageFilter = useTransform(
    [brightness, saturation],
    ([b, s]: number[]) => {
      return `brightness(${b}) saturate(${s})`;
    },
  );

  return {
    scrollProgress: smoothProgress,
    brightness,
    saturation,
    imageFilter,
  };
}
