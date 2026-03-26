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

      {/* Hero section — full viewport height */}
      <section ref={containerRef} className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
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

        {/* Dark blue tint overlay — matches reference */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(2,12,28,0.65) 0%, rgba(2,12,28,0.75) 60%, rgba(2,12,28,0.9) 100%)" }}
        />

        {/* Top-left: status badge */}
        <div className="absolute top-6 left-6 z-20">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ProjectStatusBadge status={project.status} />
          </motion.div>
        </div>

        {/* Top-right: category + featured */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
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

        {/* Centered content overlay */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 text-center py-32">
          <div className="max-w-4xl w-full mx-auto">

            {/* Eyebrow — sector label */}
            <motion.div
              className="mb-6 flex items-center justify-center gap-3"
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="h-px w-8 bg-electric-cyan/60" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-electric-cyan">
                {project.clientSector} Sector
              </span>
              <span className="h-px w-8 bg-electric-cyan/60" />
            </motion.div>

            {/* Two-tone title — first word white, rest electric cyan */}
            <motion.h1
              className="font-black uppercase tracking-tight leading-[1.0] text-4xl sm:text-6xl md:text-7xl"
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
              className="mt-8 text-base sm:text-lg leading-relaxed text-white/75 max-w-2xl mx-auto"
              initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {project.description}
            </motion.p>

            {/* KPI stats — compact inline style matching reference */}
            <motion.div
              className="mt-12"
              initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ProjectKpiGrid kpis={project.kpis} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumb section — below hero */}
      <div className="section-content max-w-6xl py-8">
        <motion.nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground flex-wrap"
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
          <span className="text-muted-foreground/40">/</span>
          <Link
            href="/projects/category"
            className="hover:text-electric-cyan transition-colors"
          >
            Categories
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link
            href={`/projects/category/${categorySlug}`}
            className="hover:text-electric-cyan transition-colors"
          >
            {project.categoryLabel}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-electric-cyan">{project.title}</span>
        </motion.nav>
      </div>
    </>
  );
}
