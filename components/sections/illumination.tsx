"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserverAnimation } from "../../lib/hooks/useIntersectionObserverAnimation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { BackgroundParallax } from "./illumination/background-parallax";
import { ScanEffects } from "./illumination/scan-effects";
import { StatsGrid, type IlluminationStat } from "./illumination/stats-grid";

const stats: IlluminationStat[] = [
  { value: 2400, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: " Years", label: "Industry Excellence" },
  { value: 99.7, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "Emergency Response" },
];

export function Illumination() {
  const containerRef = useRef<HTMLElement>(null);

  const { inView } = useIntersectionObserverAnimation({
    ref: containerRef,
    threshold: 0.3,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const brightness = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [0.3, 0.7, 1],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

  // Background layer for SectionWrapper
  const BackgroundLayer = (
    <>
      <BackgroundParallax imageY={imageY} brightnessFilter={brightnessFilter} />
      <ScanEffects />
    </>
  );

  return (
    <SectionWrapper
      id="illumination"
      sectionRef={containerRef}
      background={BackgroundLayer}
      variant="full"
      className="min-h-[140svh] md:min-h-screen"
      style={{ position: "relative" }}
    >
      {/* Content */}
      <motion.div
        className="relative z-20 w-full flex flex-col min-h-svh pb-40 md:min-h-0 md:pb-0"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-2xl pt-10 md:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
              Illuminating Excellence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Powering the Spaces
            <br />
            <span className="text-electric-cyan">That Power Industry</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl"
          >
            From high-bay LED retrofits to complete industrial lighting systems,
            we deliver solutions that reduce energy costs by up to 60% while
            maximizing visibility and safety across your facilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <button className="group relative px-8 py-4 rounded-2xl border border-electric-cyan/50 text-white font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:border-electric-cyan hover:shadow-lg hover:shadow-(--electric-cyan)/20 hover:scale-[1.03]">
              <span className="relative z-10 flex items-center gap-3">
                View Our Projects
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-electric-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        <StatsGrid stats={stats} inView={inView} />
      </motion.div>
    </SectionWrapper>
  );
}
