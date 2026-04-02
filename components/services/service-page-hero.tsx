"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Activity } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_IMAGE } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { SectionHeroData } from "@/types/sections";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

interface ServicePageHeroProps {
  data: SectionHeroData;
}

export function ServicePageHero({ data }: ServicePageHeroProps) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const {
    eyebrow,
    headline,
    headlineHighlight,
    subheadline,
    stats = [],
    scrollTargetId,
    scrollLabel = "Explore",
    backgroundImage,
  } = data;

  const scrollToContent = () => {
    const target = scrollTargetId
      ? document.getElementById(scrollTargetId)
      : document.querySelector("section[id]");
    if (target) {
      scrollToElementWithOffset(target);
    }
  };

  // Format headline: can be string or array
  const headlineText = Array.isArray(headline) ? headline.join(" ") : headline;

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        backgroundImage ? (
          <>
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              fill
              className="object-cover"
              priority={backgroundImage.priority}
            />
            <div className="absolute inset-0 dark:bg-linear-to-b dark:from-black/70 dark:via-black/50 dark:to-black/70 bg-linear-to-b from-black/80 via-black/60 to-black/80" />
          </>
        ) : (
          <BlueprintBackground showScanLine={false} />
        )
      }
      backgroundFrameStyle={backgroundFrameStyle}
      decor={
        <>
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 900"
            fill="none"
          >
            <motion.path
              d="M0 450 H400 L450 400 H800 L850 450 H1440"
              stroke="hsl(174 100% 50%)"
              strokeWidth="1"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.5, delay: 0.8, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 550 H300 L350 500 H700 L800 600 H1440"
              stroke="hsl(174 100% 50%)"
              strokeWidth="0.5"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.5, delay: 1.2, ease: "easeOut" }
              }
            />
          </svg>

          {!shouldReduceMotion ? (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-electric-cyan/30"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${15 + (i % 4) * 18}%`,
                  }}
                  animate={{ y: [0, -25, 0], opacity: [0.15, 0.5, 0.15] }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }}
                />
              ))}
            </div>
          ) : null}
        </>
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl px-4 text-center"
        >
          {/* Status indicator */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Services // Active
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          {eyebrow && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span className="h-px w-12 bg-electric-cyan/60" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/70">
                {eyebrow}
              </span>
              <span className="h-px w-12 bg-electric-cyan/60" />
            </motion.div>
          )}

          {/* Main headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_IMAGE}>
            {headlineHighlight ? (
              <>
                {headlineText.split(headlineHighlight)[0]}
                <span className="text-electric-cyan">{headlineHighlight}</span>
                {headlineText.split(headlineHighlight)[1]}
              </>
            ) : (
              headlineText
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {subheadline}
          </motion.p>

          {/* Stats bar */}
          {stats.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-electric-cyan/50 transition-all duration-300 group"
                >
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-electric-cyan/30 rounded-tr group-hover:border-electric-cyan/60 transition-colors" />
                  <div className="text-2xl font-black font-mono text-electric-cyan mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/60 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToContent}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/60 transition-colors hover:text-electric-cyan"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            {scrollLabel}
          </span>
          <ChevronDown
            size={20}
            className={shouldReduceMotion ? "" : "animate-bounce"}
          />
        </motion.button>
      }
    />
  );
}
