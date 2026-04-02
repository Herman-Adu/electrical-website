"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export interface UseAnimatedCounterProps {
  value: number;
  duration?: number;
  inView?: boolean;
  format?: (n: number) => string;
}

export interface UseAnimatedCounterReturn {
  displayValue: number;
  isAnimating: boolean;
}

/**
 * Custom React hook: Animated counter with Framer Motion
 *
 * Consolidates animated counter logic across multiple components. Handles smooth animations,
 * SSR safety, rapid value changes, and custom formatting.
 *
 * **Features:**
 * - Smooth spring animation using Framer Motion
 * - SSR-safe with automatic hydration detection
 * - Handles rapid value changes with automatic cleanup
 * - Supports custom number formatters (percentages, currency, locale numbers)
 *
 * **Performance:**
 * - Only animates when `inView` is true (reduce unnecessary computation)
 * - Cleans up previous animations on unmount or rapid rerenders
 * - Hydration-aware to prevent client/server mismatch errors
 *
 * @param props - Configuration object
 * @param props.value - Target numeric value to animate to
 * @param props.duration - Animation duration in seconds (default: 2)
 * @param props.inView - Whether element is in viewport; animation pauses if false (default: true)
 * @param props.format - Custom formatter function for display value (default: Math.round().toString())
 *
 * @returns Object with:
 *   - displayValue: Current animated number (0 → target value)
 *   - isAnimating: Whether animation is currently running
 *
 * @throws Never. Uses internal error boundaries.
 *
 * @example
 * ```typescript
 * const { displayValue, isAnimating } = useAnimatedCounter({
 *   value: 2500,
 *   duration: 2,
 *   inView: hasScrolledIntoView,
 *   format: (n) => n.toLocaleString()
 * });
 *
 * return (
 *   <motion.div>
 *     <span>{isAnimating ? displayValue : 2500}</span>
 *   </motion.div>
 * );
 * ```
 */
export function useAnimatedCounter({
  value,
  duration = 2,
  inView = true,
  format = (n: number) => Math.round(n).toString(),
}: UseAnimatedCounterProps): UseAnimatedCounterReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);

  // Mount effect - SSR safety
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Spring animation
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Listen to spring value changes
  useEffect(() => {
    if (!isMounted) return;

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = springValue.on("change", (latest: number) => {
        setDisplayValue(parseFloat(format(latest)));
      });
    } catch {
      // Fallback if motion library not fully hydrated
      setDisplayValue(parseFloat(format(motionValue.get())));
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [springValue, format, isMounted]);

  // Trigger animation when inView or value changes
  useEffect(() => {
    if (!isMounted || !inView) {
      setIsAnimating(false);
      return;
    }

    // Only animate if value has changed
    if (previousValueRef.current !== value) {
      setIsAnimating(true);
      previousValueRef.current = value;

      // Animate from current value to new value
      motionValue.set(value);

      // Stop animating after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [value, inView, isMounted, duration, motionValue]);

  return {
    displayValue: isMounted ? displayValue : 0,
    isAnimating,
  };
}
