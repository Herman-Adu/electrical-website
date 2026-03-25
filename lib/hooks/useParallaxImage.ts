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
 * useParallaxImage - Consolidates parallax scroll + brightness/saturation effects
 *
 * Manages:
 * - Scroll progress tracking via useScroll
 * - Brightness transformation (darker -> lit)
 * - Saturation transformation (desaturated -> vivid)
 * - Combined filter effect generation
 * - Smooth spring animations
 *
 * @example
 * const { imageFilter } = useParallaxImage({
 *   targetRef: containerRef,
 *   initialBrightness: 0.3,
 *   maxBrightness: 1
 * });
 *
 * return <motion.div style={{ filter: imageFilter }} />;
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
