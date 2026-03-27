"use client";

import type { ReactNode, RefObject } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";
import type {
  HeroParallaxSize,
  HeroSafeArea,
} from "@/components/hero/use-hero-parallax";

const HERO_SIZE_CLASSES: Record<HeroParallaxSize, string> = {
  screen: "min-h-[100svh]",
  tall: "min-h-[70svh] md:min-h-[78svh]",
  compact: "min-h-[65svh] md:min-h-[72svh]",
};

const HERO_SAFE_AREA_CLASSES: Record<HeroSafeArea, string> = {
  immersive: "",
  page: "section-safe-top section-safe-bottom",
};

export interface HeroParallaxShellProps {
  sectionRef: RefObject<HTMLElement | null>;
  size?: HeroParallaxSize;
  safeArea?: HeroSafeArea;
  className?: string;
  background?: ReactNode;
  backgroundFrameStyle?: MotionStyle;
  backgroundClassName?: string;
  overlay?: ReactNode;
  decor?: ReactNode;
  content?: ReactNode;
  contentStyle?: MotionStyle;
  contentClassName?: string;
  scrollIndicator?: ReactNode;
  scrollIndicatorClassName?: string;
}

export function HeroParallaxShell({
  sectionRef,
  size = "compact",
  safeArea = "page",
  className,
  background,
  backgroundFrameStyle,
  backgroundClassName,
  overlay,
  decor,
  content,
  contentStyle,
  contentClassName,
  scrollIndicator,
  scrollIndicatorClassName,
}: HeroParallaxShellProps) {
  return (
    <section
      ref={sectionRef}
      className={cn(
        "section-container relative flex w-full flex-col items-center justify-center overflow-hidden",
        HERO_SIZE_CLASSES[size],
        HERO_SAFE_AREA_CLASSES[safeArea],
        className,
      )}
    >
      {background ? (
        <motion.div
          className={cn(
            "absolute z-0 will-change-transform",
            backgroundClassName,
          )}
          style={backgroundFrameStyle}
        >
          <div className="relative h-full w-full">{background}</div>
        </motion.div>
      ) : null}

      {overlay ? (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {overlay}
        </div>
      ) : null}

      {decor ? (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          {decor}
        </div>
      ) : null}

      {content ? (
        <motion.div
          style={contentStyle}
          className={cn("relative z-30 w-full", contentClassName)}
        >
          {content}
        </motion.div>
      ) : null}

      {scrollIndicator ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-8 z-40 flex justify-center",
            scrollIndicatorClassName,
          )}
        >
          {scrollIndicator}
        </div>
      ) : null}
    </section>
  );
}
