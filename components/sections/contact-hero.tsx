"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, Mail } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

export function ContactHero() {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="compact"
      safeArea="page"
      background={<BlueprintBackground showScanLine={false} />}
      backgroundFrameStyle={backgroundFrameStyle}
      decor={
        <>
          {/* Horizontal circuit lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 600"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0 300 H500 L540 260 H900 L940 300 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="1"
              fill="none"
              initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, delay: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d="M0 380 H300 L340 340 H700 L780 420 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="0.5"
              fill="none"
              initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, delay: 0.9, ease: "easeOut" }}
            />
            {([
              [540, 260],
              [940, 300],
              [340, 340],
              [700, 420],
            ] as [number, number][]).map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.2 + i * 0.1, duration: 0.3 }}
              />
            ))}
          </svg>

          {/* Scan line */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          )}
        </>
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl px-4 text-center"
        >
          {/* Status label */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity size={12} className="text-electric-cyan animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Contact // Ready
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="h-px w-12 bg-electric-cyan/60" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/70">
              Get in Touch
            </span>
            <span className="h-px w-12 bg-electric-cyan/60" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-5 text-foreground text-balance"
          >
            <span className="block">Start Your</span>
            <span className="block text-electric-cyan">Project</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed text-pretty"
          >
            Ready to power your next innovation? Our engineering team is on hand
            for a comprehensive consultation — commercial, industrial, or
            residential.
          </motion.p>

          {/* Quick contact chips */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 border border-electric-cyan/20 px-4 py-2">
              <Mail size={12} className="text-electric-cyan/60" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                contact@nexgen.com.au
              </span>
            </div>
            <div className="flex items-center gap-2 border border-red-500/30 px-4 py-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Emergency 24/7
              </span>
            </div>
          </motion.div>

          {/* Technical metadata */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline">|</span>
            <span>Response within 2hrs</span>
            <span className="hidden sm:inline">|</span>
            <span>Part P Certified</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
    />
  );
}
