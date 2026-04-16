"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface UseCyclingTextReturn {
  /** Currently displayed text from items array */
  currentText: string;
  /** Zero-indexed position in items array */
  cycleIndex: number;
  /** True while cycling, false after complete or if prefers-reduced-motion */
  isAnimating: boolean;
}

/**
 * Custom React hook: Automated text cycling with prefers-reduced-motion support
 *
 * Consolidates text-cycling logic used across 9 hero components. Cycles through
 * a string array at a fixed interval, respecting user's motion preferences.
 *
 * **Features:**
 * - Smooth cycling through string array with fixed interval
 * - Stops after last item (no repeat loop)
 * - Respects prefers-reduced-motion by jumping to final item
 * - Automatic cleanup on unmount (no memory leaks)
 * - SSR-safe with client-side guard
 * - Strict TypeScript with zero any types
 *
 * **Performance:**
 * - Uses setInterval internally (not requestAnimationFrame)
 * - Minimal re-renders: only on index change
 * - Cleanup prevents lingering intervals
 * - Works best with 100-500ms intervals
 *
 * **Accessibility:**
 * - respects prefers-reduced-motion: instant skip to final state
 * - No automatic audio or flashing animations
 *
 * @param items - Array of strings to cycle through (empty array safe)
 * @param interval - Milliseconds between cycles (default: 380)
 *
 * @returns Object with:
 *   - currentText: Current string from items array (or empty string if items empty)
 *   - cycleIndex: Current zero-indexed position (0 to items.length - 1)
 *   - isAnimating: True while cycling; false when complete or motion-reduced
 *
 * @throws Never. Handles edge cases gracefully.
 *
 * @example
 * ```typescript
 * const { currentText, cycleIndex, isAnimating } = useCyclingText([
 *   "INITIALIZING",
 *   "LOADING_MODULES",
 *   "CALIBRATING",
 *   "SYSTEM_READY",
 * ], 380);
 *
 * return <span>{currentText}</span>;
 * ```
 */
export function useCyclingText(
  items: string[],
  interval: number = 380,
): UseCyclingTextReturn {
  // Framer Motion hook: true if user prefers reduced motion
  const shouldReduceMotion = useReducedMotion();

  // Current index in cycle
  const [cycleIndex, setCycleIndex] = useState(0);

  // Whether animation is still running (false after complete or if motion-reduced)
  const [isAnimating, setIsAnimating] = useState(!shouldReduceMotion && items.length > 0);

  // Ref to track interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state: current text from items array
  const currentText = items[cycleIndex] ?? "";

  useEffect(() => {
    // Reset index when items change
    setCycleIndex(0);

    // If user prefers reduced motion, jump to final item immediately
    if (shouldReduceMotion) {
      if (items.length > 0) {
        setCycleIndex(items.length - 1);
      }
      setIsAnimating(false);
      return;
    }

    // If empty array, stop
    if (items.length === 0) {
      setIsAnimating(false);
      return;
    }

    // If single item, show it and mark as complete after one interval
    if (items.length === 1) {
      setIsAnimating(false);
      return;
    }

    // Set up interval to cycle through items (only for 2+ items)
    setIsAnimating(true);

    intervalRef.current = setInterval(() => {
      setCycleIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        // Stop after reaching last item
        if (nextIndex >= items.length) {
          setIsAnimating(false);
          return prevIndex; // Don't advance, stay on last item
        }

        return nextIndex;
      });
    }, interval);

    // Cleanup interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items.length, shouldReduceMotion, interval]);

  return {
    currentText,
    cycleIndex,
    isAnimating,
  };
}
