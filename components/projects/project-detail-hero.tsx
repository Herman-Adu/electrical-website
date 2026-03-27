"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
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

/** Responsive breadcrumb with expandable middle links on mobile */
function ResponsiveBreadcrumb({
  categorySlug,
  categoryLabel,
  projectTitle,
  variant = "default",
}: {
  categorySlug: string;
  categoryLabel: string;
  projectTitle: string;
  variant?: "default" | "sticky";
}) {
  const [expanded, setExpanded] = useState(false);
  const isSticky = variant === "sticky";

  const textSize = isSticky ? "text-[9px]" : "text-[10px]";
  const tracking = isSticky ? "tracking-[0.14em]" : "tracking-[0.14em]";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 font-mono ${textSize} uppercase ${tracking} text-muted-foreground overflow-hidden`}
    >
      {/* First link — always visible */}
      <Link
        href="/projects"
        className="shrink-0 hover:text-electric-cyan transition-colors"
      >
        Projects
      </Link>
      <span className="shrink-0 text-muted-foreground/40">/</span>

      {/* Desktop: show all middle links */}
      <div className="hidden sm:contents">
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
          {categoryLabel}
        </Link>
        <span className="shrink-0 text-muted-foreground/40">/</span>
      </div>

      {/* Mobile: expandable ellipsis */}
      <div className="sm:hidden flex items-center gap-2">
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={() => setExpanded(true)}
              className="shrink-0 px-2.5 py-1.5 rounded-md bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/20 transition-colors min-h-[32px] flex items-center"
              aria-label="Show full breadcrumb path"
            >
              <span className="text-[10px] tracking-wider">•••</span>
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2 overflow-hidden"
            >
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
                {categoryLabel}
              </Link>
              <button
                onClick={() => setExpanded(false)}
                className="shrink-0 ml-1 p-1 rounded text-muted-foreground/60 hover:text-electric-cyan transition-colors"
                aria-label="Collapse breadcrumb"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="shrink-0 text-muted-foreground/40">/</span>
      </div>

      {/* Last link — always visible, truncated to one line */}
      <span className={`text-electric-cyan truncate min-w-0 ${isSticky ? "font-medium" : ""}`}>
        {projectTitle}
      </span>
    </nav>
  );
}

export function ProjectDetailHero({
  project,
  categorySlug,
}: ProjectDetailHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const staticBreadcrumbRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const [showStickyBreadcrumb, setShowStickyBreadcrumb] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Show sticky breadcrumb only when static breadcrumb scrolls out of viewport
  useEffect(() => {
    const staticBreadcrumb = staticBreadcrumbRef.current;
    if (!staticBreadcrumb) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when static breadcrumb is NOT intersecting (scrolled out)
        setShowStickyBreadcrumb(!entry.isIntersecting);
      },
      {
        // Account for navbar height (~80px) - trigger when breadcrumb goes behind nav
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(staticBreadcrumb);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sticky breadcrumb bar — docks BELOW navbar */}
      <motion.div
        className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-electric-cyan/20 shadow-sm"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: showStickyBreadcrumb ? 0 : -60,
          opacity: showStickyBreadcrumb ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="section-content max-w-6xl py-2.5">
          <ResponsiveBreadcrumb
            categorySlug={categorySlug}
            categoryLabel={project.categoryLabel}
            projectTitle={project.title}
            variant="sticky"
          />
        </div>
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

      {/* Breadcrumb section — below hero (tracked for sticky trigger) */}
      <div ref={staticBreadcrumbRef} className="section-content max-w-6xl py-8">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ResponsiveBreadcrumb
            categorySlug={categorySlug}
            categoryLabel={project.categoryLabel}
            projectTitle={project.title}
            variant="default"
          />
        </motion.div>
      </div>
    </>
  );
}
