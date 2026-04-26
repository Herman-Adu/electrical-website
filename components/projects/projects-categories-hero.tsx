"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown, Layers } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { categoriesHeroButtons } from "@/data/projects/categories-hero-buttons";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

interface ProjectsCategoriesHeroProps {
  categoryCount: number;
}

export function ProjectsCategoriesHero({
  categoryCount,
}: ProjectsCategoriesHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING");
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    setIsLoaded(true);
    const statuses = [
      "INITIALIZING",
      "LOADING_SECTORS",
      "SCANNING_CATEGORIES",
      "SYSTEMS_READY",
    ];

    if (shouldReduce) {
      setStatusText(statuses.at(-1) ?? "SYSTEMS_READY");
      return;
    }

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < statuses.length) {
        setStatusText(statuses[idx]);
      } else {
        clearInterval(interval);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  const scrollToCategories = () => {
    const el = document.getElementById("categories-grid");
    if (el) scrollToElementWithOffset(el, { pageType: "default" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="compact"
      safeArea="page"
      background={<BlueprintBackground showScanLine={false} />}
      backgroundFrameStyle={backgroundFrameStyle}
      decor={
        <>
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 700"
            fill="none"
          >
            {/* Primary circuit path */}
            <motion.path
              d="M0 280 H300 L380 200 H700 L780 280 H1100 L1180 200 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="1"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.8, delay: 0.5, ease: "easeOut" }
              }
            />
            {/* Secondary circuit path */}
            <motion.path
              d="M0 480 H200 L280 420 H560 L640 480 H900 L980 420 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="0.5"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2.8, delay: 0.9, ease: "easeOut" }
              }
            />
            {/* Vertical connectors */}
            {[380, 780, 1180].map((x, i) => (
              <motion.line
                key={i}
                x1={x}
                y1={200}
                x2={x}
                y2={160}
                stroke="var(--electric-cyan)"
                strokeWidth="0.5"
                initial={
                  shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
                }
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.4, delay: 2 + i * 0.15 }
                }
              />
            ))}
            {/* Circuit nodes */}
            {[
              [380, 200],
              [700, 280],
              [780, 280],
              [1100, 280],
              [280, 420],
              [640, 480],
              [980, 420],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3.5"
                fill="none"
                stroke="var(--electric-cyan)"
                strokeWidth="1"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 1.6 + i * 0.1, duration: 0.3 }
                }
              />
            ))}
            {/* Filled centre nodes */}
            {[
              [380, 200],
              [780, 280],
              [640, 480],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={`filled-${i}`}
                cx={cx}
                cy={cy}
                r="2"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.4 }
                    : { opacity: [0, 0.8, 0.4, 0.8] }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: 2.2 + i * 0.2,
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />
            ))}
          </svg>

          {!shouldReduceMotion ? (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          ) : null}

          {!shouldReduceMotion ? (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute size-1 rounded-full bg-electric-cyan/25"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${25 + (i % 3) * 18}%`,
                  }}
                  animate={{ y: [0, -18, 0], opacity: [0.12, 0.4, 0.12] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35,
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
          animate={isLoaded ? "visible" : "hidden"}
          className="mx-auto max-w-4xl px-4 text-center"
        >
          {/* Status Label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-foreground/60 dark:border-foreground/70 pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-foreground uppercase font-bold">
                Projects // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase font-bold tracking-[0.14em] text-foreground mb-8"
          >
            <Link
              href="/projects"
              className="hover:text-electric-cyan transition-colors"
            >
              Projects
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-electric-cyan">Categories</span>
          </motion.nav>

          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-xl border border-electric-cyan/50 dark:border-electric-cyan/70 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="flex items-center justify-center w-9 h-9 text-white">
                  <Layers className="w-9 h-9 text-foreground dark:text-white/80" />
                </span>
              </div>
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-electric-cyan/20"
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan font-bold" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              {categoryCount} Specialist Sectors
            </span>
            <span className="h-px w-12 bg-electric-cyan font-bold" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            <span className="block">Browse by</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Sector
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Each sector represents a distinct area of electrical engineering
            expertise. Explore our project portfolio by the type of environment
            we&apos;ve transformed.
          </motion.p>

          {/* Category hero action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {categoriesHeroButtons.map((button, index) => (
              <motion.div
                key={button.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
              >
                <Button
                  asChild
                  className={cn(
                    "px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                    "border-electric-cyan/50 hover:border-electric-cyan dark:hover:border-electric-cyan/70 hover:bg-electric-cyan/15",
                    "text-foreground dark:text-foreground/80 shadow-md shadow-electric-cyan/30 hover:shadow-[0_0_20px_rgba(0,211,165,0.4)]",
                    "hover:text-electric-cyan dark:hover:text-electric-cyan",
                  )}
                >
                  <Link href="/projects">
                    <span>{button.label}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Meta bar */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-foreground/80"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>10+ Years Experience</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          onClick={scrollToCategories}
          className="flex cursor-pointer flex-col items-center gap-2 font-bold text-foreground dark:text-foreground/80 transition-colors dark:hover:text-electric-cyan hover:text-electric-cyan"
          aria-label="Scroll to categories"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Browse Sectors
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
