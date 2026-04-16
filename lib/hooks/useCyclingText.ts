"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface UseCyclingTextProps {
  /**
   * Array of text items to cycle through
   */
  items: string[];
  /**
   * Total duration to cycle through all items in milliseconds
   * @default 3000
   */
  duration?: number;
  /**
   * Optional custom interval in milliseconds
   * If not provided, calculated from duration / items.length
   */
  interval?: number;
}

export interface UseCyclingTextReturn {
  /**
   * Currently displayed text
   */
  currentText: string;
  /**
   * Current index in the items array
   */
  currentIndex: number;
}

/**
 * Hook to cycle through an array of text strings.
 *
 * Consolidates text-cycling logic used in multiple hero components.
 * Respects prefers-reduced-motion preference.
 *
 * @param props Configuration object
 * @param props.items Array of text strings to cycle through
 * @param props.duration Total duration to show all items (default: 3000ms)
 * @param props.interval Optional custom interval between items (overrides duration-based calculation)
 *
 * @returns Object with currentText and currentIndex
 *
 * @example
 * const { currentText } = useCyclingText({
 *   items: ["INITIALIZING", "LOADING_MODULES", "CALIBRATING", "SYSTEM_READY"],
 *   duration: 1600, // 400ms per item
 * });
 *
 * return <span>{currentText}</span>;
 */
export function useCyclingText({
  items,
  duration = 3000,
  interval: customInterval,
}: UseCyclingTextProps): UseCyclingTextReturn {
  const shouldReduceMotion = useReducedMotion();
  const [currentText, setCurrentText] = useState(items[0] ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If user prefers reduced motion, show final item only
    if (shouldReduceMotion) {
      setCurrentText(items[items.length - 1] ?? "");
      setCurrentIndex(items.length - 1);
      return;
    }

    // Calculate interval from duration if not provided
    const intervalDuration = customInterval ?? duration / items.length;

    let index = 0;
    const timer = setInterval(() => {
      index++;
      if (index < items.length) {
        setCurrentText(items[index]);
        setCurrentIndex(index);
      } else {
        clearInterval(timer);
      }
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [items, duration, customInterval, shouldReduceMotion]);

  return {
    currentText,
    currentIndex,
  };
}
