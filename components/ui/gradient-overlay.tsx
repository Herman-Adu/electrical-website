import * as React from "react";
import { cn } from "@/lib/utils";

export type GradientOverlayDirection =
  | "to-t"
  | "to-r"
  | "to-b"
  | "to-l"
  | "to-br";
export type GradientOverlayColors = "electric-cyan" | "amber" | "custom";
export type GradientOverlayPosition =
  | "inset"
  | "top"
  | "bottom"
  | "left"
  | "right";

/**
 * Props for the reusable `GradientOverlay` component.
 */
export interface GradientOverlayProps {
  /** Gradient direction token. */
  direction?: GradientOverlayDirection;
  /** Preset color profile for overlay rendering. */
  colors?: GradientOverlayColors;
  /**
   * Overlay intensity from 0 to 100.
   * Higher values increase all alpha stops.
   */
  intensity?: number;
  /** Overlay placement helper for common absolute positions. */
  position?: GradientOverlayPosition;
  /** Custom color stop RGB values used when `colors` is set to `custom`. */
  customStops?: {
    from: [number, number, number];
    via: [number, number, number];
    to: [number, number, number];
  };
  /** Additional Tailwind classes for fine-grained override control. */
  className?: string;
}

const directionMap: Record<GradientOverlayDirection, string> = {
  "to-t": "to top",
  "to-r": "to right",
  "to-b": "to bottom",
  "to-l": "to left",
  "to-br": "to bottom right",
};

const positionMap: Record<GradientOverlayPosition, string> = {
  inset: "inset-0",
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
  left: "left-0 top-0 bottom-0",
  right: "right-0 top-0 bottom-0",
};

type ColorStopValue = [number, number, number] | string;

const presetRgbStops: Record<
  Exclude<GradientOverlayColors, "custom">,
  {
    from: ColorStopValue;
    via: ColorStopValue;
    to: ColorStopValue;
  }
> = {
  "electric-cyan": {
    from: "var(--electric-cyan)",
    via: "var(--electric-cyan-mid)",
    to: "var(--electric-cyan-strong)",
  },
  amber: {
    from: [251, 191, 36],
    via: [245, 158, 11],
    to: [217, 119, 6],
  },
};

function clampIntensity(intensity: number): number {
  return Math.max(0, Math.min(100, intensity));
}

function withAlpha(color: ColorStopValue, alpha: number): string {
  if (Array.isArray(color)) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  }

  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

/**
 * Reusable absolute gradient overlay for backgrounds and readability layers.
 *
 * The component is pointer-events disabled and uses inline `linear-gradient`
 * generation so intensity and custom RGB stops can be configured safely.
 */
export function GradientOverlay({
  direction = "to-b",
  colors = "electric-cyan",
  intensity = 35,
  position = "inset",
  customStops,
  className,
}: GradientOverlayProps) {
  const normalizedIntensity = clampIntensity(intensity) / 100;
  const colorStops =
    colors === "custom"
      ? (customStops ?? {
          from: [0, 243, 189] as [number, number, number],
          via: [0, 201, 157] as [number, number, number],
          to: [0, 110, 86] as [number, number, number],
        })
      : presetRgbStops[colors];

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(${directionMap[direction]}, ${withAlpha(
      colorStops.from,
      normalizedIntensity * 0.75,
    )} 0%, ${withAlpha(colorStops.via, normalizedIntensity * 0.4)} 50%, ${withAlpha(
      colorStops.to,
      normalizedIntensity * 0.1,
    )} 100%)`,
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10",
        positionMap[position],
        className,
      )}
      style={style}
    />
  );
}
