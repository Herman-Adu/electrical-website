"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import {
  Activity,
  ChevronDown,
  Home,
  Lightbulb,
  Zap,
  FolderOpen,
} from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_CATEGORY_IMAGE } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { ProjectCategory } from "@/types/projects";

// Map each category slug to its dedicated hero image and icon
const categoryConfig: Record<
  string,
  { image: string; icon: React.ReactNode; accentWord: string }
> = {
  residential: {
    image: "/images/hero-residential.jpg",
    icon: <Home className="w-8 h-8 text-electric-cyan" />,
    accentWord: "Living",
  },
  "commercial-lighting": {
    image: "/images/hero-commercial-lighting.jpg",
    icon: <Lightbulb className="w-8 h-8 text-electric-cyan" />,
    accentWord: "Illuminated",
  },
  "power-boards": {
    image: "/images/hero-power-boards.jpg",
    icon: <Zap className="w-8 h-8 text-electric-cyan" />,
    accentWord: "Powered",
  },
};

const fallbackConfig = {
  image: "",
  icon: <FolderOpen className="w-8 h-8 text-electric-cyan" />,
  accentWord: "Delivered",
};

interface ProjectCategoryHeroProps {
  category: ProjectCategory;
  projectCount: number;
}

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

export function ProjectCategoryHero({
  category,
  projectCount,
}: ProjectCategoryHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const config = categoryConfig[category.slug] ?? fallbackConfig;
  const hasImage = Boolean(config.image);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_CATEGORY",
    "FETCHING_PROJECTS",
    "CATEGORY_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToProjects = () => {
    const el = document.getElementById("category-projects");
    if (el) scrollToElementWithOffset(el, { pageType: 'default' });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        hasImage ? (
          <>
            <Image
              src={config.image}
              alt={`${category.label} category hero`}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
          </>
        ) : (
          <BlueprintBackground showScanLine={false} />
        )
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.60) 100%)",
          }}
        />
      }
      decor={
        !shouldReduceMotion ? (
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
        ) : null
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
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Category // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 mb-6"
          >
            <Link
              href="/projects"
              className="hover:text-electric-cyan transition-colors"
            >
              Projects
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href="/projects/category"
              className="hover:text-electric-cyan transition-colors"
            >
              Categories
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-electric-cyan">{category.label}</span>
          </motion.nav>

          {/* Category icon */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-xl border border-electric-cyan/40 bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_24px_rgba(0,243,189,0.15)]">
              {config.icon}
            </div>
          </motion.div>

          {/* Project count */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="h-px w-12 bg-electric-cyan/60" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/80">
              {projectCount} Project{projectCount !== 1 ? "s" : ""}
            </span>
            <span className="h-px w-12 bg-electric-cyan/60" />
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_CATEGORY_IMAGE}>
            <span className="block">{category.label}</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-(--electric-cyan-mid) to-(--electric-cyan-strong)">
              {config.accentWord}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            {category.description}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase text-white hover:border-electric-cyan/60 hover:text-electric-cyan transition-all duration-300"
            >
              All Projects
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full border border-electric-cyan/40 bg-electric-cyan/15 backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase text-electric-cyan hover:bg-electric-cyan/25 transition-all duration-300"
            >
              Start a Project
            </Link>
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline text-white/25">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline text-white/25">|</span>
            <span>Quality Assured</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToProjects}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/60 transition-colors hover:text-electric-cyan"
          aria-label="Scroll to projects"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            View Projects
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
