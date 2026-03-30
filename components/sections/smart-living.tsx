"use client";

import { useRef, useEffect, useState } from "react";
import { useTransform } from "framer-motion";
import { useParallaxImage } from "@/lib/hooks/useParallaxImage";
import { useIntersectionObserverAnimation } from "@/lib/hooks/useIntersectionObserverAnimation";
import { BackgroundLayer } from "./smart-living/background-layer";
import { ContentPanel } from "./smart-living/content-panel";

export function SmartLiving() {
  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewportMode = () => setIsDesktop(mediaQuery.matches);

    updateViewportMode();
    mediaQuery.addEventListener("change", updateViewportMode);

    return () => mediaQuery.removeEventListener("change", updateViewportMode);
  }, []);

  const { inView } = useIntersectionObserverAnimation({
    ref: containerRef,
    threshold: 0.2,
  });

  const { scrollProgress } = useParallaxImage({
    targetRef: containerRef,
  });

  const brightness = useTransform(
    scrollProgress,
    [0.1, 0.35, 0.5],
    [0.15, 0.6, 1],
  );
  const saturation = useTransform(
    scrollProgress,
    [0.1, 0.35, 0.5],
    [0, 0.5, 1],
  );

  const imageFilter = useTransform(
    [brightness, saturation] as const,
    ([b, s]: number[]) => `brightness(${b}) saturate(${s})`,
  );

  const uiY1 = useTransform(scrollProgress, [0, 1], ["20%", "-20%"]);
  const uiY2 = useTransform(scrollProgress, [0, 1], ["30%", "-10%"]);
  const uiY3 = useTransform(scrollProgress, [0, 1], ["15%", "-25%"]);

  const contentY = useTransform(scrollProgress, [0, 1], ["0%", "6%"]);

  const glowOpacity = useTransform(scrollProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      id="smart-living"
      ref={containerRef}
      className="section-fluid relative min-h-[100svh] overflow-x-hidden bg-(--deep-black) lg:min-h-screen"
      style={{ position: "relative" }}
    >
      <BackgroundLayer imageFilter={imageFilter} glowOpacity={glowOpacity} />
      <ContentPanel
        contentY={contentY}
        uiY1={uiY1}
        uiY2={uiY2}
        uiY3={uiY3}
        inView={inView}
        enableParallaxMotion={isDesktop}
      />

      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
