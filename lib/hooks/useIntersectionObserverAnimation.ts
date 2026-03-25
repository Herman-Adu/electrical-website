"use client";

import { RefObject, useEffect, useState } from "react";

export interface UseIntersectionObserverAnimationProps {
  ref: RefObject<HTMLElement | null>;
  threshold?: number | number[];
  margin?: string;
}

export interface UseIntersectionObserverAnimationReturn {
  inView: boolean;
  hasAnimated: boolean;
}

/**
 * useIntersectionObserverAnimation - Consolidates mounted state + scroll detection
 *
 * Replaces common pattern of:
 * ```
 * const [mounted, setMounted] = useState(false);
 * const [inView, setInView] = useState(false);
 * useEffect(() => setMounted(true), []);
 * useEffect(() => {
 *   const observer = new IntersectionObserver(...);
 *   // ...
 * }, []);
 * ```
 *
 * Returns:
 * - inView: Current visibility state
 * - hasAnimated: True after first animation (for "once" animations)
 *
 * @example
 * const { inView, hasAnimated } = useIntersectionObserverAnimation({
 *   ref: containerRef,
 *   threshold: 0.3,
 *   margin: '0px'
 * });
 *
 * return (
 *   <motion.div
 *     initial={{ opacity: 0 }}
 *     animate={inView ? { opacity: 1 } : { opacity: 0 }}
 *   />
 * );
 */
export function useIntersectionObserverAnimation({
  ref,
  threshold = 0.3,
  margin = "0px",
}: UseIntersectionObserverAnimationProps): UseIntersectionObserverAnimationReturn {
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mount effect - prevents hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Single useEffect managing both IntersectionObserver + cleanup
  useEffect(() => {
    if (!isMounted || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyInView = entry.isIntersecting;
        setInView(isCurrentlyInView);

        // Track that animation has occurred
        if (isCurrentlyInView) {
          setHasAnimated(true);
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin: margin,
      },
    );

    const currentElement = ref.current;
    observer.observe(currentElement);

    return () => {
      observer.unobserve(currentElement);
      observer.disconnect();
    };
  }, [isMounted, threshold, margin, ref]);

  // Return false initially (before mount) to prevent hydration mismatch
  return {
    inView: isMounted ? inView : false,
    hasAnimated,
  };
}
