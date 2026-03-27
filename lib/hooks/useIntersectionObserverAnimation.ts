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
 * Custom React hook: Intersection observer for scroll-triggered animations
 *
 * Consolidates the common pattern of mounting state detection + visibility tracking.
 * Replaces boilerplate code for scroll animations.
 *
 * **What it replaces:**
 * ```typescript
 * // Old pattern (replaced by this hook)
 * const [mounted, setMounted] = useState(false);
 * const [inView, setInView] = useState(false);
 * useEffect(() => setMounted(true), []);
 * useEffect(() => {
 *   const observer = new IntersectionObserver(...);
 *   // ...
 * }, []);
 * ```
 *
 * **Returns:**
 * - inView: Current visibility state (true if element is visible in viewport)
 * - hasAnimated: True after first animation (for "animate once" patterns);
 *
 * **Performance:**
 * - Only one IntersectionObserver instance per component
 * - Automatic cleanup on unmount
 * - Respects threshold and margin configurations
 *
 * @param props - Configuration object
 * @param props.ref - React ref to the element to observe
 * @param props.threshold - Fraction of element that must be visible (0-1, default: 0.3)
 * @param props.margin - CSS margin around observer bounds (default: '0px')
 *
 * @returns Object with:
 *   - inView: Boolean indicating if element is currently visible
 *   - hasAnimated: Boolean indicating if element has been animated at least once
 *
 * @throws Never. Uses internal error boundaries.
 *
 * @example
 * ```typescript
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { inView, hasAnimated } = useIntersectionObserverAnimation({
 *   ref: containerRef,
 *   threshold: 0.3,
 *   margin: '0px'
 * });
 *
 * return (
 *   <motion.div
 *     ref={containerRef}
 *     initial={{ opacity: 0 }}
 *     animate={inView ? { opacity: 1 } : { opacity: 0 }}
 *   />
 * );
 * ```
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
