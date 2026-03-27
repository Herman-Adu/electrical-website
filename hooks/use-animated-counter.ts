"use client";

import { useEffect, useState } from "react";

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
  /**
   * Number of animation steps (frames)
   * @default 60
   */
  steps?: number;
}

interface UseAnimatedCounterReturn {
  /**
   * The current animated count value
   */
  count: number;
  /**
   * Whether the animation has completed
   */
  isComplete: boolean;
}

/**
 * Hook to animate a numeric counter from 0 to a target value
 *
 * @example
 * const { count } = useAnimatedCounter({ value: 100, shouldAnimate: true });
 * return <span>{count}</span>;
 */
export function useAnimatedCounter({
  value,
  shouldAnimate = true,
  duration = 2000,
  steps = 60,
}: UseAnimatedCounterOptions): UseAnimatedCounterReturn {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(0);
      setIsComplete(false);
      return;
    }

    const increment = value / steps;
    let current = 0;
    let animationActive = true;

    const timer = setInterval(() => {
      if (!animationActive) return;

      current += increment;
      if (current >= value) {
        setCount(value);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);

    return () => {
      animationActive = false;
      clearInterval(timer);
    };
  }, [value, shouldAnimate, duration, steps]);

  return { count, isComplete };
}
