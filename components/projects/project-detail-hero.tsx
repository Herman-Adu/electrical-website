"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown, Activity } from "lucide-react";
import type { Project } from "@/types/projects";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectKpiGrid } from "@/components/projects/project-kpi-grid";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { HERO_H1_DETAIL_PROJECT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";

interface ProjectDetailHeroProps {
  project: Project;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

/**
 * Project detail hero section with parallax image, status badge, and KPIs.
 * Breadcrumb is rendered separately via ContentBreadcrumb in the page.
 */
export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const shouldReduce = useReducedMotion();
  const { sectionRef, backgroundFrameStyle, contentStyle } = useHeroParallax({
    size: "tall",
    contentTravel: { desktop: 0, mobile: 0 },
  });

  const scrollToProjectContent = () => {
    const target = document.getElementById("project-content");
    if (target) scrollToElementWithOffset(target, { pageType: "default" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          className="object-cover"
          //sizes="80vw"
          priority
        />
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,12,28,0.65) 0%, rgba(2,12,28,0.75) 60%, rgba(2,12,28,0.9) 100%)",
          }}
        />
      }
      decor={
        <>
          {/* Top-left: status badge */}
          <div className="absolute top-6 left-6">
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <ProjectStatusBadge status={project.status} />
            </motion.div>
          </div>

          {/* Top-right: category + featured */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {project.isFeatured && (
              <motion.div
                className="px-3 py-1 rounded-md border border-electric-cyan/30 bg-electric-cyan/10 backdrop-blur-sm"
                initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <span className="font-mono text-[9px] tracking-[0.2em] text-electric-cyan uppercase font-bold">
                  Featured
                </span>
              </motion.div>
            )}
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 border border-white/20 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-sm"
              initial={shouldReduce ? {} : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              {project.categoryLabel}
            </motion.span>
          </div>
        </>
      }
      content={
        <div className="w-full px-4 text-center py-8 sm:py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-5xl px-4 text-center"
          >
            {/* Status indicator */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="flex items-center gap-3 border-l-2 border-white pl-4 font-bold">
                <Activity
                  size={14}
                  className="text-electric-cyan animate-pulse"
                />
                <span className="font-mono text-[10px] tracking-[0.3em] text-white uppercase font-bold">
                  Project // Active
                </span>
              </div>
            </motion.div>

            {/* Eyebrow — sector label */}
            <motion.div
              className="mb-6 flex items-center justify-center gap-3"
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="h-px w-8 bg-electric-cyan/60 font-bold" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase font-bold text-electric-cyan">
                {project.clientSector} Sector
              </span>
              <span className="h-px w-8 bg-electric-cyan/60 font-bold" />
            </motion.div>

            {/* Two-tone title — first half white, rest electric cyan */}
            <motion.h1
              className={HERO_H1_DETAIL_PROJECT}
              initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {(() => {
                const words = project.title.split(" ");
                const half = Math.ceil(words.length / 2);
                const firstHalf = words.slice(0, half).join(" ");
                const secondHalf = words.slice(half).join(" ");
                return (
                  <>
                    <span className="text-white">{firstHalf}</span>
                    {secondHalf && (
                      <>
                        {" "}
                        <span className="text-electric-cyan">{secondHalf}</span>
                      </>
                    )}
                  </>
                );
              })()}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-8 text-base sm:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto"
              initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {project.description}
            </motion.p>

            {/* KPI stats */}
            <motion.div
              className="mt-12 mb-12"
              initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ProjectKpiGrid kpis={project.kpis} />
            </motion.div>

            {/* Meta */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-white/70 font-bold uppercase"
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
        </div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          onClick={scrollToProjectContent}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/60 transition-colors hover:text-electric-cyan"
          aria-label="Scroll to project details"
          type="button"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Project Details
          </span>
          <ChevronDown
            size={20}
            className={shouldReduce ? "" : "animate-bounce"}
          />
        </motion.button>
      }
    />
  );
}
