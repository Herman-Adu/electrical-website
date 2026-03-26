"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Activity, ChevronDown, Layers } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";

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

  useEffect(() => {
    setIsLoaded(true);
    const statuses = [
      "INITIALIZING",
      "LOADING_SECTORS",
      "SCANNING_CATEGORIES",
      "SYSTEMS_READY",
    ];
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
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-container section-safe-top section-safe-bottom relative min-h-[65vh] w-full flex flex-col items-center justify-center">
      <BlueprintBackground />

      {/* Circuit overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          viewBox="0 0 1440 700"
          fill="none"
        >
          {/* Primary circuit path */}
          <motion.path
            d="M0 280 H300 L380 200 H700 L780 280 H1100 L1180 200 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, delay: 0.5, ease: "easeOut" }}
          />
          {/* Secondary circuit path */}
          <motion.path
            d="M0 480 H200 L280 420 H560 L640 480 H900 L980 420 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, delay: 0.9, ease: "easeOut" }}
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
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.4, delay: 2 + i * 0.15 }}
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
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ delay: 1.6 + i * 0.1, duration: 0.3 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4, 0.8] }}
              transition={{
                delay: 2.2 + i * 0.2,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-30 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Status label */}
        <motion.div
          variants={flickerVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
            <Activity size={14} className="text-electric-cyan animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
              Projects // {statusText}
            </span>
          </div>
        </motion.div>

        {/* Breadcrumb */}
        <motion.nav
          variants={itemVariants}
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-8"
        >
          <Link
            href="/projects"
            className="hover:text-electric-cyan transition-colors"
          >
            Projects
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-electric-cyan">Categories</span>
        </motion.nav>

        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl border border-electric-cyan/30 bg-electric-cyan/5 flex items-center justify-center backdrop-blur-sm">
              <Layers className="w-9 h-9 text-electric-cyan" />
            </div>
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-electric-cyan/20"
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-5"
        >
          <span className="h-px w-12 bg-electric-cyan/60" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/70">
            {categoryCount} Specialist Sectors
          </span>
          <span className="h-px w-12 bg-electric-cyan/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.92] mb-6 text-foreground"
        >
          <span className="block">Browse by</span>
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-cyan-400 to-blue-500">
            Sector
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-light leading-relaxed"
        >
          Each sector represents a distinct area of electrical engineering
          expertise. Explore our project portfolio by the type of environment
          we&apos;ve transformed.
        </motion.p>

        {/* Action */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-full border border-border bg-background/50 backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase text-muted-foreground hover:border-electric-cyan/40 hover:text-electric-cyan transition-all duration-300"
          >
            ← All Projects
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase text-electric-cyan hover:bg-electric-cyan/20 transition-all duration-300"
          >
            Start a Project
          </Link>
        </motion.div>

        {/* Meta bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50 uppercase"
        >
          <span>NICEIC Approved</span>
          <span className="hidden sm:inline">|</span>
          <span>Part P Certified</span>
          <span className="hidden sm:inline">|</span>
          <span>24/7 Emergency</span>
          <span className="hidden sm:inline">|</span>
          <span>15+ Years Experience</span>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
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

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        onClick={scrollToCategories}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-muted-foreground hover:text-electric-cyan transition-colors cursor-pointer"
        aria-label="Scroll to categories"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
          Browse Sectors
        </span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
