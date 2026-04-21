"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Zap, Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "./blueprint-background";
import { MouseGlow } from "./mouse-glow";
import { CircuitSVG } from "./circuit-svg";
import { HeroParallaxShell } from "./hero-parallax-shell";
import { useHeroParallax } from "./use-hero-parallax";
import { HERO_H1_SCREEN } from "./hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";

const isClient = typeof window !== "undefined";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
    },
  },
} as const;

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.5, 1, 0.8, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.3, 0.5, 0.7, 1],
    },
  },
};

/**
 * Slide-in animation for hero text elements
 * - Uses translateX/Y for smooth entrance from sides
 * - Combines with opacity for elegant appearance
 * - Staggered for visual rhythm
 */
const slideInVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
    },
  },
};

/**
 * Scale and glow animation for CTA buttons
 * - Minimal scale for professional feel (1 → 1.05)
 * - Uses will-change for GPU acceleration
 * - Paired with shadow glow effect
 */
const buttonHoverVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * Animated stats container variant
 * - Fades in after main content
 * - Staggered children for individual counter animations
 */
const statsContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.8,
    },
  },
};

export function Hero() {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "screen" });
  const surgeOverlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Boot sequence effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_MODULES",
    "CALIBRATING",
    "SYSTEM_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 400);

  // GSAP circuit draw-in animation only (parallax handled by shared Framer system)
  useEffect(() => {
    if (!isClient || !sectionRef.current) return;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      const circuitPaths =
        sectionRef.current?.querySelectorAll(".circuit-path");
      circuitPaths?.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength?.() || 1000;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.5,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => {
      ctx?.revert();
    };
  }, [sectionRef]);

  // Power Surge Animation
  const triggerSurge = () => {
    if (!surgeOverlayRef.current || !heroContentRef.current) return;

    const tl = gsap.timeline();
    const electricText = heroContentRef.current.querySelector(".text-electric");

    tl.to(surgeOverlayRef.current, {
      opacity: 0.9,
      duration: 0.05,
      repeat: 4,
      yoyo: true,
      ease: "none",
    }).to(
      heroContentRef.current,
      {
        scale: 1.02,
        duration: 0.1,
      },
      "<",
    );

    if (electricText) {
      tl.to(
        electricText,
        {
          textShadow: "0 0 30px hsl(174 100% 50%), 0 0 60px hsl(174 100% 50%)",
          duration: 0.1,
        },
        "<",
      );
    }

    tl.to(surgeOverlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    }).to(
      heroContentRef.current,
      {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.3",
    );

    if (electricText) {
      tl.to(
        electricText,
        {
          textShadow: "0 0 10px hsl(174 80% 45%)",
          duration: 0.5,
        },
        "-=0.3",
      );
    }
  };

  const scrollToContent = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      scrollToElementWithOffset(servicesSection, { pageType: "default" });
    }
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="screen"
      safeArea="page"
      background={<BlueprintBackground showScanLine={!shouldReduceMotion} />}
      backgroundFrameStyle={backgroundFrameStyle}
      decor={
        <>
          {!shouldReduceMotion ? <MouseGlow /> : null}
          <CircuitSVG />
          <div
            ref={surgeOverlayRef}
            className="fixed inset-0 z-50 pointer-events-none bg-electric-cyan opacity-0 mix-blend-overlay"
          />
        </>
      }
      content={
        <motion.div
          ref={heroContentRef}
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
            <div className="flex items-center gap-3 border-l-2 border-slate-500/30 dark:border-electric-cyan pl-4 font-semibold">
              <Activity
                size={14}
                className="text-slate-500/70 dark:text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-slate-500/60 dark:text-electric-cyan/80 uppercase">
                Status // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={slideInVariants} className={HERO_H1_SCREEN}>
            <span className="block">Powering the</span>
            <span className="block text-electric text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-[hsl(174_80%_45%)] to-[hsl(174_100%_35%)]">
              Next Generation
            </span>
            <span className="block">of Innovation</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Expert electrical engineering and installations for commercial and
            industrial frontiers. Precision-engineered power solutions delivered
            with absolute excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={triggerSurge}
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              className="group relative px-8 py-4 bg-foreground dark:bg-electric-cyan text-primary-foreground rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgb(100,116,139,0.3)] dark:hover:shadow-[0_0_30px_rgb(0,243,189,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm">
                Initiate System
                <Zap size={18} className="group-hover:animate-pulse" />
              </span>
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </motion.button>

            <button className="px-8 py-4 border dark:border-electric-cyan/30 rounded-xl font-bold text-foreground font-bold uppercase tracking-widest hover:border-electric-cyan hover:text-electric-cyan transition-all duration-300 text-sm">
              Our Solutions
            </button>
          </motion.div>

          {/* Technical Metadata */}
          <motion.div
            variants={statsContainerVariants}
            className="mt-16 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground dark:text-foreground/80 uppercase"
          >
            <span>Est. 2024</span>
            <span className="hidden sm:inline">|</span>
            <span>Commercial & Industrial</span>
            <span className="hidden sm:inline">|</span>
            <span>24/7 Operations</span>
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
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground/70 transition-colors hover:text-electric-cyan"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground dark:text-foreground/80 font-bold">
            Scroll
          </span>
          <ChevronDown
            size={20}
            className={
              shouldReduceMotion
                ? ""
                : "animate-bounce text-muted-foreground dark:text-foreground/80"
            }
          />
        </motion.button>
      }
    />
  );
}
