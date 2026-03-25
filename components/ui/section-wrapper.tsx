import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionWrapper - Universal container for all page sections
 *
 * ARCHITECTURE:
 * - Handles viewport height, vertical centering, and fluid padding
 * - Background layer (z-0) for images/videos
 * - Overlay layer (z-10) for gradient effects
 * - Content layer (z-20) for actual content
 *
 * SINGLE RESPONSIBILITY:
 * - This component handles ONLY external layout (centering, spacing)
 * - Child components handle ONLY their internal content
 * - NO component should add external margins/padding
 *
 * FLUID SPACING:
 * - Uses CSS clamp() for truly responsive padding
 * - No breakpoint jumps - smooth scaling
 * - Always equal top/bottom = always vertically centered
 */

export interface SectionWrapperProps {
  /** Section ID for navigation anchors */
  id?: string;
  /** Section content - should NOT include external margins */
  children: React.ReactNode;
  /** Background element (image, video, gradient) - rendered at z-0 */
  background?: React.ReactNode;
  /** Enable gradient overlay on background - rendered at z-10 */
  overlay?: boolean;
  /** Custom overlay gradient (default: subtle darkening) */
  overlayGradient?: string;
  /** Section variant affecting min-height */
  variant?: "full" | "short" | "auto";
  /** Additional classes for the section element (use sparingly) */
  className?: string;
  /** Ref forwarding for scroll animations */
  sectionRef?: React.RefObject<HTMLElement | null>;
  /** Custom styles for animation transforms */
  style?: React.CSSProperties;
}

/**
 * SectionWrapper provides consistent vertical centering and fluid spacing
 * for all page sections. Components inside should NEVER add external padding.
 */
export function SectionWrapper({
  id,
  children,
  background,
  overlay = false,
  overlayGradient,
  variant = "full",
  className,
  sectionRef,
  style,
}: SectionWrapperProps) {
  // Variant-based min-height
  const variantClasses = {
    full: "min-h-screen", // 100svh - full viewport
    short: "min-h-[80vh]", // 80vh - shorter sections
    auto: "min-h-0", // Auto - content determines height
  };

  // Default overlay gradient
  const defaultOverlay =
    "bg-linear-to-b from-black/40 via-black/20 to-black/60";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        // Base structure
        "section-fluid relative overflow-hidden",
        // Variant-based height
        variantClasses[variant],
        // Custom classes (use sparingly)
        className,
      )}
      style={style}
    >
      {/* Background Layer - z-0 */}
      {background && <div className="absolute inset-0 z-0">{background}</div>}

      {/* Overlay Layer - z-10 */}
      {overlay && (
        <div
          className={cn(
            "absolute inset-0 z-10 pointer-events-none",
            overlayGradient || defaultOverlay,
          )}
        />
      )}

      {/* Content Layer - z-20 */}
      <div className="relative z-20 w-full">
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}

/**
 * Export variant types for external use
 */
export type SectionVariant = "full" | "short" | "auto";
