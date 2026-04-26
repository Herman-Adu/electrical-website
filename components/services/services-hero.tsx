"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

const serviceCategories = [
  { label: "Commercial", slug: "commercial", color: "cyan" },
  { label: "Industrial", slug: "industrial", color: "cyan" },
  { label: "Residential", slug: "residential", color: "cyan" },
  { label: "Emergency", slug: "emergency", color: "amber" },
];

interface ServicesHeroProps {
  activeService?: string;
}

export function ServicesHero({ activeService }: ServicesHeroProps = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_SERVICES",
    "SCANNING_CAPABILITIES",
    "SYSTEMS_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToGrid = () => {
    const el = document.getElementById("services-grid");
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
          {/* Status Label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-foreground/60 dark:border-foreground pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-foreground uppercase font-bold">
                Services // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Status Label Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              Professional Electrical Solutions
            </span>
            <span className="h-px w-12 bg-electric-cyan" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block">Engineering</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Excellence
            </span>
            <span className="block">Delivered</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Comprehensive electrical solutions from high-voltage industrial
            systems to intelligent residential installations — all backed by 15+
            years of precision engineering.
          </motion.p>

          {/* Category pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
          >
            {serviceCategories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
              >
                <Link
                  href={`/services/${cat.slug}`}
                  className={cn(
                    "px-4 py-2 rounded-xl border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                    activeService === cat.slug
                      ? "bg-foreground/20 dark:bg-white/15 border-muted-foreground/20 dark:border-[hsl(174_100%_35%)] backdrop-blur-md text-foreground dark:text-electric-cyan transition-all duration-300 shadow-[0_0_20px_rgba(0,211,165,0.4)]"
                      : "bg-foreground/20 dark:bg-white/15 border-muted-foreground/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-electric-cyan dark:hover:border-electric-cyan transition-all duration-300",
                  )}
                >
                  {cat.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-foreground/80"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline">|</span>
            <span>6 Service Lines</span>
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
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground dark:text-foreground/80 font-bold hover:text-electric-cyan dark:hover:text-electric-cyan transition-colors duration-300"
          aria-label="Scroll to services"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore Services
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
