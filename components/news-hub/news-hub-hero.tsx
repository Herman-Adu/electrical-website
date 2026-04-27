"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import type { NewsCategory, NewsCategorySlug } from "@/types/news";

interface NewsHubHeroProps {
  categories: NewsCategory[];
  activeCategory: NewsCategorySlug;
  totalArticles: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

export function NewsHubHero({
  categories,
  activeCategory,
  totalArticles,
}: NewsHubHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_EDITORIAL",
    "INDEXING_STORIES",
    "SYSTEMS_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToFeed = () => {
    const el = document.getElementById("news-hub-intro");
    if (el) scrollToElementWithOffset(el, { pageType: "article" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
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
              d="M0 320 H320 L420 230 H740 L840 320 H1160 L1260 250 H1440"
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
                  : { duration: 2.6, delay: 0.5, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 470 H260 L360 390 H620 L760 510 H980 L1120 430 H1440"
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
                  : { duration: 2.6, delay: 0.95, ease: "easeOut" }
              }
            />
            {[
              [420, 230],
              [840, 320],
              [1260, 250],
              [360, 390],
              [760, 510],
              [1120, 430],
            ].map(([cx, cy], index) => (
              <motion.circle
                key={index}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 1.5 + index * 0.09, duration: 0.3 }
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
                  className="absolute size-1 rounded-full bg-electric-cyan/30"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${22 + (i % 3) * 20}%`,
                  }}
                  animate={{ y: [0, -18, 0], opacity: [0.15, 0.45, 0.15] }}
                  transition={{
                    duration: 3 + i * 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
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
          className="mx-auto max-w-5xl px-4 text-center"
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

          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-electric-cyan/80 font-bold" />
            <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase font-bold">
              Editorial Systems
            </span>
            <span className="h-px w-12 bg-electric-cyan/80 font-bold" />
          </motion.div>

          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block">Editorial</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Command Centre
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Live editorial hub for campaigns, case studies, insights, and
            partner updates. Powered by typed content models ready for scalable
            CMS integration.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/news-hub"
              className={cn(
                "rounded-xl border px-4 py-2 font-mono text-[11px] tracking-widest uppercase backdrop-blur-sm transition-all duration-300",
                activeCategory === "all"
                  ? "bg-white/20 dark:bg-white/15 border-[hsl(174_100%_35%)] dark:border-electric-cyan backdrop-blur-md text-[hsl(174_100%_35%)] dark:text-electric-cyan transition-all duration-300 shadow-[0_0_20px_rgba(0,211,165,0.4)]"
                  : "bg-white/20 dark:bg-white/15 border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300",
              )}
            >
              All Stories
            </Link>
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={
                  shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }
                }
                animate={
                  shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { delay: 0.4 + index * 0.08, duration: 0.3 }
                }
              >
                <Link
                  href={`/news-hub?category=${category.slug}`}
                  className={cn(
                    "rounded-xl border px-4 py-2 font-mono text-[11px] tracking-widest uppercase backdrop-blur-sm transition-all duration-300",
                    activeCategory === category.slug
                      ? "bg-foreground/20 dark:bg-white/15 border-[hsl(174_100%_35%)] dark:border-electric-cyan backdrop-blur-md text-foreground dark:text-electric-cyan transition-all duration-300 shadow-[0_0_20px_rgba(0,211,165,0.4)]"
                      : "bg-foreground/20 dark:bg-white/15 border-foreground/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300",
                  )}
                >
                  {category.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-foreground/80"
          >
            <span>{totalArticles} Seeded Stories</span>
            <span className="hidden opacity-40 sm:inline">|</span>
            <span>Category-first Routing</span>
            <span className="hidden opacity-40 sm:inline">|</span>
            <span>SSR + SSG Delivery</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToFeed}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground dark:text-foreground/80 font-bold hover:text-electric-cyan dark:hover:text-electric-cyan transition-colors duration-300"
          aria-label="Explore News Hub"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore Stories
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
