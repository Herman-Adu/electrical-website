"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown, Layers } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";

interface NewsHubCategoriesHeroProps {
  categoryCount: number;
}

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

export function NewsHubCategoriesHero({
  categoryCount,
}: NewsHubCategoriesHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING");
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    setIsLoaded(true);
    const statuses = [
      "INITIALIZING",
      "LOADING_LANES",
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
  }, [shouldReduce]);

  const scrollToCategories = () => {
    const el = document.getElementById("categories-grid");
    if (el) scrollToElementWithOffset(el);
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
            {[380, 780, 1180].map((x, index) => (
              <motion.line
                key={index}
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
                    : { duration: 0.4, delay: 2 + index * 0.15 }
                }
              />
            ))}
            {[
              [380, 200],
              [700, 280],
              [780, 280],
              [1100, 280],
              [280, 420],
              [640, 480],
              [980, 420],
            ].map(([cx, cy], index) => (
              <motion.circle
                key={index}
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
                    : { delay: 1.6 + index * 0.1, duration: 0.3 }
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
        </>
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mx-auto max-w-4xl px-4 text-center"
        >
          <motion.div
            variants={flickerVariants}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                News Hub // {statusText}
              </span>
            </div>
          </motion.div>

          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="mb-8 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] text-foreground/60 uppercase dark:text-white/60"
          >
            <Link
              href="/news-hub"
              className="transition-colors hover:text-electric-cyan"
            >
              News Hub
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-electric-cyan">Categories</span>
          </motion.nav>

          <motion.div
            variants={itemVariants}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
                <Layers className="h-9 w-9 text-electric-cyan" />
              </div>
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

          <motion.div
            variants={itemVariants}
            className="mb-5 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-electric-cyan/60" />
            <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/70 uppercase">
              {categoryCount} Content Lanes
            </span>
            <span className="h-px w-12 bg-electric-cyan/60" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            <span className="block">Browse</span>
            <span className="block bg-linear-to-r from-electric-cyan via-[var(--electric-cyan)] to-electric-cyan/80 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,243,189,0.3)]">
              All Categories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg"
          >
            Six dedicated editorial lanes built for growth, fast discovery, and
            seamless CMS migration. Each category is a full publishing route.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/news-hub"
              className="rounded-full border border-foreground/20 bg-foreground/5 px-5 py-2.5 font-mono text-[11px] tracking-widest text-foreground uppercase backdrop-blur-sm transition-all duration-300 hover:border-electric-cyan/50 hover:text-electric-cyan dark:border-white/20 dark:bg-white/10 dark:text-white"
            >
              ← All News
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-5 py-2.5 font-mono text-[11px] tracking-widest text-electric-cyan uppercase backdrop-blur-sm transition-all duration-300 hover:bg-electric-cyan/20"
            >
              Start a Campaign
            </Link>
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
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground/50 transition-colors hover:text-electric-cyan dark:text-white/50"
          aria-label="Scroll to categories"
          type="button"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Browse Categories
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
