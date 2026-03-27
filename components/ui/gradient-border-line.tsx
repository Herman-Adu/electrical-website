import * as React from "react";
import { cn } from "@/lib/utils";

export type GradientBorderLineVariant = "electric-cyan" | "amber" | "gradient";
export type GradientBorderLinePosition = "top" | "bottom" | "left" | "right";

/**
 * Props for the reusable `GradientBorderLine` component.
 */
export interface GradientBorderLineProps {
  /** Color treatment for the animated gradient line. */
  variant?: GradientBorderLineVariant;
  /** Line anchoring position within its absolutely positioned container. */
  position?: GradientBorderLinePosition;
  /** Line thickness in px/rem/etc. Accepts number (px) or CSS size string. */
  height?: number | string;
  /**
   * Global line opacity.
   *
   * Accepts either decimal values (`0-1`) or percentage values (`0-100`).
   */
  opacity?: number;
  /** Additional Tailwind classes for layout/visual overrides. */
  className?: string;
}

const variantClassMap: Record<GradientBorderLineVariant, string> = {
  "electric-cyan": "from-transparent via-electric-cyan/70 to-transparent",
  amber: "from-transparent via-amber-400/70 to-transparent",
  gradient: "from-electric-cyan/0 via-ring/70 to-amber-400/70",
};

const positionClassMap: Record<
  GradientBorderLinePosition,
  { anchor: string; direction: string }
> = {
  top: {
    anchor: "top-0 left-0 right-0",
    direction: "bg-linear-to-r",
  },
  bottom: {
    anchor: "bottom-0 left-0 right-0",
    direction: "bg-linear-to-r",
  },
  left: {
    anchor: "left-0 top-0 bottom-0",
    direction: "bg-linear-to-b",
  },
  right: {
    anchor: "right-0 top-0 bottom-0",
    direction: "bg-linear-to-b",
  },
};

function normalizeOpacity(value: number): number {
  if (value <= 0) {
    return 0;
  }

  if (value <= 1) {
    return value;
  }

  return Math.min(value / 100, 1);
}

/**
 * Reusable animated gradient line for section borders and separators.
 *
 * This component is absolutely positioned and intentionally pointer-events safe,
 * making it suitable for decorative top/bottom/side edge accents.
 */
export function GradientBorderLine({
  variant = "electric-cyan",
  position = "top",
  height = "1px",
  opacity = 100,
  className,
}: GradientBorderLineProps) {
  const thickness = typeof height === "number" ? `${height}px` : height;
  const isHorizontal = position === "top" || position === "bottom";

  const style: React.CSSProperties = {
    opacity: normalizeOpacity(opacity),
    ...(isHorizontal ? { height: thickness } : { width: thickness }),
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 animate-pulse",
        positionClassMap[position].anchor,
        positionClassMap[position].direction,
        variantClassMap[variant],
        className,
      )}
      style={style}
    />
  );
}
