"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import type { ProjectCategory, ProjectCategorySlug } from "@/types/projects";

interface ProjectsHeroProps {
  categories: ProjectCategory[];
  activeCategory: ProjectCategorySlug;
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

export function ProjectsHero({
  categories,
  activeCategory,
}: ProjectsHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_PROJECTS",
    "SCANNING_PORTFOLIO",
    "SYSTEMS_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToGrid = () => {
    const el = document.getElementById("projects-grid");
    if (el) scrollToElementWithOffset(el);
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
              d="M0 350 H350 L400 300 H750 L800 350 H1440"
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
                  : { duration: 2.5, delay: 0.6, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 450 H250 L300 400 H600 L700 500 H1440"
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
                  : { duration: 2.5, delay: 1, ease: "easeOut" }
              }
            />
            {[
              [400, 300],
              [800, 350],
              [300, 400],
              [600, 500],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 1.4 + i * 0.1, duration: 0.3 }
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
                    left: `${12 + i * 14}%`,
                    top: `${20 + (i % 3) * 20}%`,
                  }}
                  animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
                  transition={{
                    duration: 3 + i * 0.5,
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
          {/* Status label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Projects // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan/60" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/70">
              Our Portfolio
            </span>
            <span className="h-px w-12 bg-electric-cyan/60" />
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block">Engineered</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-(--electric-cyan-mid) to-(--electric-cyan-strong)">
              Delivery
            </span>
            <span className="block">Proven Results</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-foreground/70 dark:text-white/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            A data-driven portfolio of industrial, commercial, and critical
            infrastructure electrical projects delivered with strict safety,
            quality, and performance standards.
          </motion.p>

          {/* Category pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            <Link
              href="/projects"
              className={cn(
                "px-4 py-2 rounded-full border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                activeCategory === "all"
                  ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_15px_rgba(0,243,189,0.15)]"
                  : "border-electric-cyan/25 bg-electric-cyan/5 text-electric-cyan/70 hover:border-electric-cyan/40 hover:text-electric-cyan",
              )}
            >
              All Projects
            </Link>
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
              >
                <Link
                  href={`/projects?category=${category.slug}`}
                  className={cn(
                    "px-4 py-2 rounded-full border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                    activeCategory === category.slug
                      ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_15px_rgba(0,243,189,0.15)]"
                      : "border-electric-cyan/25 bg-electric-cyan/5 text-electric-cyan/70 hover:border-electric-cyan/40 hover:text-electric-cyan",
                  )}
                >
                  {category.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-foreground/40 dark:text-white/40 uppercase"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>4 Active Projects</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToGrid}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground/50 transition-colors hover:text-electric-cyan dark:text-white/50"
          aria-label="Explore Projects"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore Projects
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

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};
