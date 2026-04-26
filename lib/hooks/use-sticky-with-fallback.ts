"use client";

import { useEffect, useRef, useState } from "react";

interface UseStickyWithFallbackOptions {
  /** CSS selector for the element to apply sticky-to-fixed hybrid positioning */
  selector: string;
  /** CSS top value when in sticky position (e.g., 150px for projects, 132px for news) */
  stickyOffset: number;
  /** z-index when switched to fixed positioning (default: 50) */
  fixedZIndex?: number;
  /** z-index when in sticky positioning (default: 10) */
  stickyZIndex?: number;
}

/**
 * Custom hook for sticky-to-fixed positioning hybrid pattern.
 *
 * Uses IntersectionObserver to detect when the grid cell (containing block) of a sticky element
 * scrolls off the viewport. When detected:
 * - Sets CSS variables to switch from `position: sticky` to `position: fixed`
 * - Maintains proper positioning via `--toc-position-mode`, `--toc-top`, `--toc-z-index`
 * - Defers setup until after hydration (React 19 safety)
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * export function ProjectDetailPage() {
 *   useStickyWithFallback({
 *     selector: '[data-sticky-toc="true"]',
 *     stickyOffset: 150,
 *   });
 *
 *   return (
 *     <aside
 *       data-sticky-toc="true"
 *       className="[--toc-position-mode:sticky] [--toc-top:150px] [--toc-z-index:10]"
 *       style={{
 *         position: 'var(--toc-position-mode, sticky)',
 *         top: 'var(--toc-top, 150px)',
 *         zIndex: 'var(--toc-z-index, 10)',
 *       }}
 *     >
 *       TOC content here
 *     </aside>
 *   );
 * }
 * ```
 */
export function useStickyWithFallback({
  selector,
  stickyOffset,
  fixedZIndex = 50,
  stickyZIndex = 10,
}: UseStickyWithFallbackOptions): void {
  const [isMounted, setIsMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const isFixedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Mount effect: defer observer setup until after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Observer setup: only runs after isMounted = true
  useEffect(() => {
    if (!isMounted) return;

    if (typeof window === "undefined") return;

    // Find the target element
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) {
      console.warn(`[useStickyWithFallback] Element not found with selector: ${selector}`);
      return;
    }

    targetRef.current = target;

    // Callback: invoked when intersection changes
    const handleIntersectionChange: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          // Element's containing block is in viewport: use sticky positioning
          isFixedRef.current = false;
          target.style.setProperty("--toc-position-mode", "sticky");
          target.style.setProperty("--toc-top", `${stickyOffset}px`);
          target.style.setProperty("--toc-z-index", String(stickyZIndex));
        } else {
          // Element's containing block left viewport: switch to fixed positioning
          isFixedRef.current = true;
          target.style.setProperty("--toc-position-mode", "fixed");
          target.style.setProperty("--toc-z-index", String(fixedZIndex));
          updateFixedPosition();
        }
      }
    };

    // Create and observe: IntersectionObserver with no root/margin
    // (checks if target's containing block is in viewport)
    observerRef.current = new IntersectionObserver(handleIntersectionChange, {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });

    observerRef.current.observe(target);

    // Track scroll position and update fixed top while in fixed mode
    const handleScroll = () => {
      if (isFixedRef.current && targetRef.current) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          updateFixedPosition();
          rafIdRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      targetRef.current = null;
    };
  }, [isMounted, selector, stickyOffset, fixedZIndex, stickyZIndex]);

  /**
   * Update the fixed position based on current scroll position.
   * When fixed, the element's top should match its original sticky offset.
   */
  function updateFixedPosition() {
    if (!targetRef.current || !isFixedRef.current) return;

    // Fixed positioning: top = stickyOffset (same as sticky offset)
    // This keeps the element aligned as if it were still sticky
    targetRef.current.style.setProperty("--toc-top", `${stickyOffset}px`);
  }
}
