"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/types/projects";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectKpiGrid } from "@/components/projects/project-kpi-grid";

interface ProjectDetailHeroProps {
  project: Project;
  categorySlug: string;
}

export function ProjectDetailHero({
  project,
  categorySlug,
}: ProjectDetailHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const [showStickyBreadcrumb, setShowStickyBreadcrumb] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Show sticky breadcrumb after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBreadcrumb(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky breadcrumb strip */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: showStickyBreadcrumb ? 0 : -100,
          opacity: showStickyBreadcrumb ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <nav
          aria-label="Breadcrumb"
          className="section-content max-w-6xl py-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground overflow-x-auto scrollbar-none"
        >
          <Link
            href="/projects"
            className="shrink-0 hover:text-electric-cyan transition-colors"
          >
            Projects
          </Link>
          <span className="shrink-0 text-muted-foreground/40">/</span>
          <Link
            href="/projects/category"
            className="shrink-0 hover:text-electric-cyan transition-colors"
          >
            Categories
          </Link>
          <span className="shrink-0 text-muted-foreground/40">/</span>
          <Link
            href={`/projects/category/${categorySlug}`}
            className="shrink-0 hover:text-electric-cyan transition-colors"
          >
            {project.categoryLabel}
          </Link>
          <span className="shrink-0 text-muted-foreground/40">/</span>
          <span className="text-electric-cyan truncate max-w-[200px]">
            {project.title}
          </span>
        </nav>
      </motion.div>

      {/* Hero section */}
      <section ref={containerRef} className="relative min-h-[50vh] sm:min-h-[70vh] md:min-h-[80vh] overflow-hidden flex items-center justify-center">
        {/* Full-bleed image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: shouldReduce ? 0 : imageY }}
        >
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Radial vignette overlay — darkens edges, keeps centre visible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* FEATURED ribbon */}
        {project.isFeatured && (
          <div className="absolute top-6 right-6 z-20">
            <motion.div
              className="px-4 py-1.5 rounded-md border border-electric-cyan/30 bg-electric-cyan/10 backdrop-blur-sm"
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className="font-mono text-[9px] tracking-[0.2em] text-electric-cyan uppercase font-bold">
                Featured Project
              </span>
            </motion.div>
          </div>
        )}

        {/* Bottom badges */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 z-20">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ProjectStatusBadge status={project.status} />
          </motion.div>

          <motion.span
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 border border-white/20 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm"
            initial={shouldReduce ? {} : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            {project.categoryLabel}
          </motion.span>
        </div>

        {/* Centered content overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="section-content max-w-3xl">
            {/* Breadcrumb */}
            <motion.nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 flex-wrap"
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
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
              <Link
                href={`/projects/category/${categorySlug}`}
                className="hover:text-electric-cyan transition-colors"
              >
                {project.categoryLabel}
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-electric-cyan">{project.title}</span>
            </motion.nav>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.1]"
              initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {project.title}
            </motion.h1>

            {/* Client sector */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-3"
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="h-px w-6 bg-electric-cyan/50" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/70">
                {project.clientSector} Sector
              </span>
              <span className="h-px w-6 bg-electric-cyan/50" />
            </motion.div>

            {/* Description */}
            <motion.p
              className="mt-6 text-base sm:text-lg leading-relaxed text-white/80 drop-shadow-md"
              initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {project.description}
            </motion.p>

            {/* KPI stats — part of hero overlay */}
            <motion.div
              className="mt-10 pt-8 border-t border-white/20"
              initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ProjectKpiGrid kpis={project.kpis} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
