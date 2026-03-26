"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectCategorySlug } from "@/types/projects";

interface ProjectsHeroProps {
  categories: ProjectCategory[];
  activeCategory: ProjectCategorySlug;
}

// Animated SVG grid background with slow pulse
function ElectricGridBackground() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Horizontal grid lines */}
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2="1440"
            y2={i * 50}
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            initial={{ opacity: 0.03 }}
            animate={
              shouldReduce
                ? { opacity: 0.03 }
                : { opacity: [0.03, 0.08, 0.03] }
            }
            transition={{
              duration: 4 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
        {/* Vertical grid lines */}
        {[...Array(30)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="600"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            initial={{ opacity: 0.02 }}
            animate={
              shouldReduce
                ? { opacity: 0.02 }
                : { opacity: [0.02, 0.06, 0.02] }
            }
            transition={{
              duration: 5 + i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        ))}
        {/* Circuit nodes */}
        {[
          { x: 200, y: 150 },
          { x: 450, y: 100 },
          { x: 700, y: 200 },
          { x: 950, y: 120 },
          { x: 1200, y: 180 },
          { x: 300, y: 400 },
          { x: 600, y: 450 },
          { x: 900, y: 380 },
          { x: 1100, y: 480 },
        ].map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r="3"
            fill="var(--electric-cyan)"
            initial={{ opacity: 0.1 }}
            animate={
              shouldReduce
                ? { opacity: 0.1 }
                : { opacity: [0.1, 0.4, 0.1] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Scanline sweep effect
function ScanlineEffect() {
  const shouldReduce = useReducedMotion();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!shouldReduce) {
      const timer = setTimeout(() => setHasRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldReduce]);

  if (shouldReduce || hasRun) return null;

  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan to-transparent"
      initial={{ top: 0, opacity: 0.6 }}
      animate={{ top: "100%", opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
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
  const shouldReduce = useReducedMotion();

  return (
    <section className="section-container section-safe-top section-safe-bottom relative min-h-[70vh] flex items-center bg-background overflow-hidden">
      {/* Electric grid background */}
      <ElectricGridBackground />

      {/* Scanline sweep on mount */}
      <ScanlineEffect />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-electric-cyan/20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-electric-cyan/20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-electric-cyan/20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-electric-cyan/20" />

      {/* Content */}
      <motion.div
        className="section-content max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status indicator */}
        <motion.div
          variants={shouldReduce ? {} : itemVariants}
          className="mb-6 inline-flex items-center gap-3"
        >
          <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-cyan" />
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-electric-cyan/80 uppercase">
              Command Centre // Active
            </span>
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          variants={shouldReduce ? {} : itemVariants}
          className="flex items-center gap-4 mb-4"
        >
          <span className="h-px w-10 bg-electric-cyan/50" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-electric-cyan/70">
            Projects Portfolio
          </span>
        </motion.div>

        {/* Headline with stagger */}
        <motion.h1
          variants={shouldReduce ? {} : itemVariants}
          className="max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95]"
        >
          <motion.span
            className="block"
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Engineered Delivery,
          </motion.span>
          <motion.span
            className="block text-electric-cyan"
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
          >
            Measurable Outcomes
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={shouldReduce ? {} : itemVariants}
          className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A data-driven portfolio of industrial, commercial, and critical
          infrastructure electrical projects delivered with strict safety,
          quality, and performance standards.
        </motion.p>

        {/* Category chips */}
        <motion.div
          variants={shouldReduce ? {} : itemVariants}
          className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none"
        >
          <Link
            href="/projects"
            className={cn(
              "shrink-0 rounded-lg border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
              activeCategory === "all"
                ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_15px_rgba(0,242,255,0.15)]"
                : "border-border text-muted-foreground hover:border-electric-cyan/30 hover:text-electric-cyan hover:shadow-[0_0_10px_rgba(0,242,255,0.1)]"
            )}
          >
            All Projects
          </Link>
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
            >
              <Link
                href={`/projects?category=${category.slug}`}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                  activeCategory === category.slug
                    ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_15px_rgba(0,242,255,0.15)]"
                    : "border-border text-muted-foreground hover:border-electric-cyan/30 hover:text-electric-cyan hover:shadow-[0_0_10px_rgba(0,242,255,0.1)]"
                )}
              >
                {category.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={shouldReduce ? {} : itemVariants}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <Link
            href="#projects-grid"
            className="group relative rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan transition-all duration-300 hover:bg-electric-cyan/20 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] overflow-hidden"
          >
            <span className="relative z-10">Explore Grid</span>
            <motion.span
              className="absolute inset-0 bg-electric-cyan/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:border-electric-cyan/30 hover:text-electric-cyan"
          >
            Start a Project
          </Link>
        </motion.div>

        {/* System status bar */}
        <motion.div
          variants={shouldReduce ? {} : itemVariants}
          className="mt-10 flex items-center gap-6 border-t border-border/30 pt-6"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
              Systems Online
            </span>
          </div>
          <div className="h-3 w-px bg-border/50" />
          <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            Last Update: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
