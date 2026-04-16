"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

interface UseAnimatedCounterOptions {
  /**
   * The target value to count to
   */
  value: number;
  /**
   * Whether the animation should be active (e.g., element is in view)
   */
  shouldAnimate?: boolean;
  /**
   * Duration of the animation in milliseconds
   * @default 2000
   */
  duration?: number;
}

interface UseAnimatedCounterReturn {
  /**
   * Framer Motion motion value for the animated count
   */
  motionValue: ReturnType<typeof useMotionValue<number>>;
  /**
   * Callback ref to check if animation is complete
   */
  isAnimating: React.MutableRefObject<boolean>;
}

/**
 * Hook to animate a numeric counter from 0 to a target value using Framer Motion.
 * Uses requestAnimationFrame internally for smooth 60fps animations without re-render thrashing.
 *
 * @example
 * const { motionValue } = useAnimatedCounter({ value: 100, shouldAnimate: true });
 * return <motion.span>{motionValue}</motion.span>;
 */
export function useAnimatedCounter({
  value,
  shouldAnimate = true,
  duration = 2000,
}: UseAnimatedCounterOptions): UseAnimatedCounterReturn {
  const motionValue = useMotionValue<number>(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) {
      motionValue.set(0);
      isAnimating.current = false;
      return;
    }

    isAnimating.current = true;

    // Use Framer Motion's animate function with requestAnimationFrame for smooth updates
    const animation = animate(motionValue, value, {
      duration: duration / 1000, // Framer Motion uses seconds
      ease: "easeOut",
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    return () => {
      // Cleanup: stop animation if component unmounts
      animation.stop();
      isAnimating.current = false;
    };
  }, [value, shouldAnimate, duration, motionValue]);

  return { motionValue, isAnimating };
}
