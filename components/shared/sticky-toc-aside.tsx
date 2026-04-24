"use client";

import { ReactNode } from "react";
import { useStickyWithFallback } from "@/lib/hooks/use-sticky-with-fallback";

interface StickyTocAsideProps {
  /** Content to render inside the aside (TOC, KPIs, etc.) */
  children: ReactNode;
  /** CSS sticky offset (150px for projects, 132px for news) */
  stickyOffset: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Wrapper component that applies sticky-to-fixed hybrid positioning to an aside element.
 *
 * Uses IntersectionObserver to detect when the grid cell scrolls off the viewport,
 * automatically switching from sticky to fixed positioning via CSS variables.
 *
 * This solves the CSS sticky limitation where sticky elements are bounded by their
 * containing block. When the containing block (grid cell, ~4511px) scrolls off,
 * this hook switches to fixed positioning to keep the aside visible.
 *
 * @example
 * ```tsx
 * <StickyTocAside stickyOffset={150}>
 *   <ContentToc items={tocItems} />
 *   <ProjectDetailsCard />
 * </StickyTocAside>
 * ```
 */
export function StickyTocAside({
  children,
  stickyOffset,
  className = "",
}: StickyTocAsideProps) {
  // Activate sticky-to-fixed hybrid positioning
  useStickyWithFallback({
    selector: '[data-sticky-toc="true"]',
    stickyOffset,
  });

  return (
    <aside
      data-sticky-toc="true"
      className={`hidden xl:flex xl:flex-col xl:gap-6 sticky mt-2 min-h-[calc(100vh-${stickyOffset}px)] ${className}`}
      style={
        {
          position: "var(--toc-position-mode, sticky)",
          top: `var(--toc-top, ${stickyOffset}px)`,
          zIndex: "var(--toc-z-index, 10)",
        } as any
      }
    >
      {children}
    </aside>
  );
}
