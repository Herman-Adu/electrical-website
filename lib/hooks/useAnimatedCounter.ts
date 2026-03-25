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
 * useAnimatedCounter - Consolidates animated counter logic across multiple components
 *
 * Handles:
 * - Smooth counter animation using Framer Motion springs
 * - SSR safety (hydration-aware)
 * - Rapid value changes with cleanup
 * - Custom formatters (%, currency, locale numbers, etc.)
 *
 * @example
 * const { displayValue } = useAnimatedCounter({
 *   value: 2500,
 *   duration: 2,
 *   inView: isInView,
 *   format: (n) => n.toLocaleString()
 * });
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
    } catch (e) {
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
