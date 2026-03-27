"use client";

import { useEffect, useRef, useState } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";

export type HeroParallaxSize = "screen" | "tall" | "compact";
export type HeroSafeArea = "immersive" | "page";

interface AxisConfig {
  desktop: number;
  mobile: number;
}

interface HeroParallaxPreset {
  background: AxisConfig;
  content: AxisConfig;
  overscan: AxisConfig;
}

const PARALLAX_PRESETS: Record<HeroParallaxSize, HeroParallaxPreset> = {
  screen: {
    background: { desktop: 18, mobile: 12 },
    content: { desktop: -6, mobile: -3 },
    overscan: { desktop: 18, mobile: 22 },
  },
  tall: {
    background: { desktop: 16, mobile: 10 },
    content: { desktop: -5, mobile: -3 },
    overscan: { desktop: 16, mobile: 18 },
  },
  compact: {
    background: { desktop: 14, mobile: 8 },
    content: { desktop: -4, mobile: -2 },
    overscan: { desktop: 14, mobile: 16 },
  },
};

export interface UseHeroParallaxOptions {
  size?: HeroParallaxSize;
  disabled?: boolean;
  mobileBreakpoint?: number;
  offset?: ["start start" | "start end", "end start" | "end end"];
  backgroundTravel?: Partial<AxisConfig>;
  contentTravel?: Partial<AxisConfig>;
  overscan?: Partial<AxisConfig>;
}

export interface UseHeroParallaxResult {
  sectionRef: React.RefObject<HTMLElement | null>;
  shouldReduceMotion: boolean;
  isMobile: boolean;
  backgroundFrameStyle: MotionStyle;
  contentStyle: MotionStyle;
}

export function useHeroParallax({
  size = "compact",
  disabled = false,
  mobileBreakpoint = 767,
  offset = ["start start", "end start"] as const,
  backgroundTravel,
  contentTravel,
  overscan,
}: UseHeroParallaxOptions = {}): UseHeroParallaxResult {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const updateMatch = (event?: MediaQueryListEvent) => {
      setIsMobile(event?.matches ?? mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => {
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, [mobileBreakpoint]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.24,
  });

  const preset = PARALLAX_PRESETS[size];
  const currentBackgroundTravel = isMobile
    ? (backgroundTravel?.mobile ?? preset.background.mobile)
    : (backgroundTravel?.desktop ?? preset.background.desktop);
  const currentContentTravel = isMobile
    ? (contentTravel?.mobile ?? preset.content.mobile)
    : (contentTravel?.desktop ?? preset.content.desktop);
  const currentOverscan = isMobile
    ? (overscan?.mobile ?? preset.overscan.mobile)
    : (overscan?.desktop ?? preset.overscan.desktop);

  const parallaxDisabled = disabled || shouldReduceMotion;
  const activeBackgroundTravel = parallaxDisabled ? 0 : currentBackgroundTravel;
  const activeContentTravel = parallaxDisabled ? 0 : currentContentTravel;
  const activeOverscan = parallaxDisabled ? 0 : currentOverscan;

  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", `${activeBackgroundTravel}%`],
  );
  const contentY = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", `${activeContentTravel}%`],
  );

  return {
    sectionRef,
    shouldReduceMotion,
    isMobile,
    backgroundFrameStyle: {
      top: `${-activeOverscan}%`,
      bottom: `${-activeOverscan}%`,
      left: `${-(activeOverscan / 2)}%`,
      right: `${-(activeOverscan / 2)}%`,
      y: backgroundY,
    },
    contentStyle: {
      y: contentY,
    },
  };
}
