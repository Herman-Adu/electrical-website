"use client";

import { useRef } from "react";
import { useTransform } from "framer-motion";
import { useParallaxImage } from "@/lib/hooks/useParallaxImage";
import { useIntersectionObserverAnimation } from "@/lib/hooks/useIntersectionObserverAnimation";
import { BackgroundLayer } from "./smart-living/background-layer";
import { ContentPanel } from "./smart-living/content-panel";

export function SmartLiving() {
  const containerRef = useRef<HTMLElement>(null);
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

  const contentY = useTransform(scrollProgress, [0, 1], ["0%", "10%"]);

  const glowOpacity = useTransform(scrollProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      id="smart-living"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-(--deep-black) section-padding-tall"
      style={{ position: "relative" }}
    >
      <BackgroundLayer imageFilter={imageFilter} glowOpacity={glowOpacity} />
      <ContentPanel
        contentY={contentY}
        uiY1={uiY1}
        uiY2={uiY2}
        uiY3={uiY3}
        inView={inView}
      />

      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
