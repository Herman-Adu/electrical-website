"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/projects";
import { ProjectCardShell } from "@/components/projects/project-card-shell";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

const tagVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

/**
 * ProjectsFeaturedCard - Responsive featured project showcase
 *
 * Responsive layout strategy:
 * - Mobile (default): Single column, stacked layout
 * - Tablet (md): Enhanced spacing, improved typography
 * - Desktop (lg): Two-column grid [1.2fr_1fr]
 *
 * Breakpoint coverage:
 * - Image height: min-h-[200px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[400px]
 * - Content padding: p-4 sm:p-5 md:p-6 lg:p-8
 * - Typography: Responsive scaling for all text elements
 * - Touch targets: All buttons ≥ 44px height (py-2.5)
 */
export function ProjectsFeaturedCard({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const isProgressInView = useInView(progressRef, { once: true, amount: 0.5 });

  return (
    <ProjectCardShell className="overflow-hidden p-0">
      <div
        ref={containerRef}
        className="grid gap-0 md:gap-0 lg:grid-cols-2"
        id="projects-grid"
      >
        {/* Left: Image with parallax - Responsive height */}
        <div className="relative min-h-50 sm:min-h-70 md:min-h-87.5 lg:min-h-100 2xl:min-h-120 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ y: shouldReduce ? 0 : imageY }}
          >
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              fill
              className="object-cover scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* FEATURED holographic ribbon - Responsive positioning */}
          <div className="absolute top-0 left-0 overflow-hidden">
            <motion.div
              className="relative -translate-x-1/4 -translate-y-1/4 -rotate-45 origin-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="px-8 sm:px-10 py-1 sm:py-1.5 bg-linear-to-r from-electric-cyan/50 via-electric-cyan/30 to-transparent backdrop-blur-sm border-b border-electric-cyan/30">
                <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.3em] text-electric-cyan uppercase font-bold">
                  Featured
                </span>
              </div>
            </motion.div>
          </div>

          {/* Status badge - Responsive positioning */}
          <motion.div
            className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4"
            initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ProjectStatusBadge status={project.status} />
          </motion.div>
        </div>

        {/* Right: Content panel - Responsive padding and layout */}
        <div className="relative bg-card/60 backdrop-blur-sm p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col">
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 border-t-2 border-r-2 border-electric-cyan/20 rounded-tr-xl" />

          {/* Header - Responsive typography */}
          <motion.p
            className="font-mono text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.16em] sm:tracking-[0.18em] text-electric-cyan/80"
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Featured Project // {project.clientSector}
          </motion.p>

          {/* Title - Full responsive scaling */}
          <motion.h2
            className="mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight text-foreground leading-tight"
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {project.title}
          </motion.h2>

          {/* Description - Responsive sizing */}
          <motion.p
            className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-foreground dark:text-foreground/80"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {project.description}
          </motion.p>

          {/* KPIs as responsive grid - 2x2 on mobile, scales on larger screens */}
          <motion.div
            className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-2 gap-2 sm:gap-3"
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {[
              { label: "Budget", value: project.kpis.budget },
              { label: "Timeline", value: project.kpis.timeline },
              { label: "Capacity", value: project.kpis.capacity },
              { label: "Location", value: project.kpis.location },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-border/50 bg-muted/30 p-2 sm:p-3 transition-all duration-300 hover:border-electric-cyan/30"
              >
                <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-foreground dark:text-foreground/80">
                  {kpi.label}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-bold text-foreground truncate">
                  {kpi.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Progress bar with animation */}
          <div ref={progressRef} className="mt-4 sm:mt-5 md:mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Progress
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-electric-cyan">
                {project.progress}%
              </span>
            </div>
            <div className="h-1.5 sm:h-2 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-electric-cyan to-electric-cyan/70"
                initial={{ width: 0 }}
                animate={{
                  width: isProgressInView ? `${project.progress}%` : 0,
                }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          {/* Tags with stagger - Responsive text size */}
          <div className="mt-3 sm:mt-4 md:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                custom={i}
                variants={shouldReduce ? {} : tagVariants}
                initial="hidden"
                animate="visible"
                className="rounded-md border border-border/50 bg-muted/30 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-foreground dark:text-foreground/80 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* CTAs - Touch-friendly sizing with responsive layout */}
          <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href={`/projects/category/${project.category}/${project.slug}`}
              className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-electric-cyan transition-all duration-300 hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,189,0.15)] min-h-[44px] w-full sm:w-auto"
            >
              View Details
              <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-foreground transition-all duration-300 hover:border-electric-cyan/30 hover:text-electric-cyan min-h-[44px] w-full sm:w-auto"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </ProjectCardShell>
  );
}
