"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "150+", label: "Projects Completed" },
  { value: "99.7%", label: "Client Satisfaction" },
  { value: "24/7", label: "Emergency Support" },
];

export function AboutHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_PROFILE",
    "VERIFYING_RECORDS",
    "SYSTEM_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToContent = () => {
    const next = document.getElementById("company-intro");
    if (next) scrollToElementWithOffset(next, { pageType: "default" });
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
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 1440 900"
            fill="none"
          >
            <motion.path
              d="M0 450 H400 L450 400 H800 L850 450 H1440"
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
                  : { duration: 2.5, delay: 0.8, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 550 H300 L350 500 H700 L800 600 H1440"
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
                  : { duration: 2.5, delay: 1.2, ease: "easeOut" }
              }
            />
            <motion.path
              d="M200 0 V200 L250 250 V600 L200 650 V900"
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
                  : { duration: 2, delay: 1, ease: "easeOut" }
              }
            />
            <motion.path
              d="M1200 0 V150 L1240 190 V500 L1200 540 V900"
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
                  : { duration: 2, delay: 1.4, ease: "easeOut" }
              }
            />
            {[
              [450, 400],
              [850, 450],
              [350, 500],
              [700, 600],
              [250, 250],
              [250, 600],
              [1240, 190],
              [1240, 500],
            ].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 1.5 + i * 0.1, duration: 0.3 }
                }
              />
            ))}
          </svg>

          {!shouldReduceMotion ? (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/40 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          ) : null}

          {!shouldReduceMotion ? (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-electric-cyan/30"
                  style={{
                    left: `${10 + i * 11}%`,
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
                Profile // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              Nexgen Electrical Innovations
            </span>
            <span className="h-px w-12 bg-electric-cyan" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block">Powering the</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Next Generation
            </span>
            <span className="block">of Innovation</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Where engineering excellence meets genuine community commitment.
            Delivering gold-standard electrical solutions across commercial,
            industrial, and residential sectors.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative p-5 rounded-xl border bg-foreground/20 dark:bg-white/15 border-muted-foreground/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 group"
              >
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-foreground/50  dark:border-electric-cyan/30 rounded-tr dark:group-hover:border-electric-cyan/60 transition-colors" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-foreground/50  dark:border-electric-cyan/30 rounded-bl dark:group-hover:border-electric-cyan/60 transition-colors" />

                <div className="text-2xl font-black font-mono dark:text-electric-cyan mb-1">
                  {stat.value}
                </div>
                <div className="text-xs dark:text-foreground font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Technical metadata */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-foreground/80"
          >
            <span>Est. 2009</span>
            <span className="hidden sm:inline">|</span>
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline">|</span>
            <span>London &amp; Home Counties</span>
            <span className="hidden sm:inline">|</span>
            <span>Part P Certified</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToContent}
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
