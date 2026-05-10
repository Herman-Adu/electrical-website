"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Activity, ChevronDown, Layers } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";
import type { TrustIndicatorItem } from "@/components/shared/hero-trust-indicators";
import { CategoriesCircuit } from "@/components/hero/circuits/categories-circuit";

// ---------------------------------------------------------------------------
// Config data
// ---------------------------------------------------------------------------

const CATEGORIES_TRUST_INDICATORS = [
  { icon: 'Gauge',          title: 'Content Lanes',    description: 'Six dedicated editorial channels' },
  { icon: 'BookOpen',       title: 'Expert Editorial', description: 'Every article verified by specialists' },
  { icon: 'Activity',       title: 'Live Updates',     description: 'Real-time campaign and case study delivery' },
  { icon: 'ClipboardCheck', title: 'CMS Ready',        description: 'Category-first routing for scalable CMS' },
] as const satisfies readonly TrustIndicatorItem[];

const CATEGORIES_STATUSES = [
  "INITIALIZING",
  "LOADING_LANES",
  "SCANNING_CATEGORIES",
  "SYSTEMS_READY",
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NewsHubCategoriesHeroProps {
  categoryCount: number;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NewsHubCategoriesHero({
  categoryCount,
}: NewsHubCategoriesHeroProps) {
  // Lazy initializer: true in browser (client component), false during SSR
  const [isLoaded] = useState(() => typeof window !== "undefined");
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });

  const { currentText: statusText } = useCyclingText(CATEGORIES_STATUSES, 380);

  const scrollToCategories = () => {
    const el = document.getElementById("news-categories-intro");
    if (el) scrollToElementWithOffset(el, { pageType: "default" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="compact"
      safeArea="page"
      background={<BlueprintBackground showScanLine={false} />}
      backgroundFrameStyle={backgroundFrameStyle}
      decor={<CategoriesCircuit shouldReduceMotion={shouldReduceMotion} />}
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
                News Hub // {statusText}
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
              href="/news-hub"
              className="hover:text-electric-cyan transition-colors"
            >
              News Hub
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-electric-cyan">Categories</span>
          </motion.nav>

          {/* Icon */}
          {/* <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-xl border border-electric-cyan/50 dark:border-electric-cyan/70 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="flex items-center justify-center w-9 h-9 text-white">
                  <Layers className="w-9 h-9 text-foreground dark:text-white/80" />
                </span>
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
          </motion.div> */}

          {/* Eyebrow */}
          {/* <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan font-bold" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              {categoryCount} Content Lanes
            </span>
            <span className="h-px w-12 bg-electric-cyan font-bold" />
          </motion.div> */}

          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            <span className="block">Browse</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              All Categories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Six dedicated editorial lanes built for growth, fast discovery, and
            seamless CMS migration. Each category is a full publishing route.
          </motion.p>

          <HeroTrustIndicators items={CATEGORIES_TRUST_INDICATORS} />

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
