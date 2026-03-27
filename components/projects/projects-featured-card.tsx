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
import { ProjectMetaRow } from "@/components/projects/project-meta-row";

const tagVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

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
        className="grid gap-0 lg:grid-cols-[1.2fr_1fr]"
        id="projects-grid"
      >
        {/* Left: Image with parallax */}
        <div className="relative min-h-[280px] lg:min-h-[400px] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ y: shouldReduce ? 0 : imageY }}
          >
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              fill
              className="object-cover scale-110"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* FEATURED holographic ribbon */}
          <div className="absolute top-0 left-0 overflow-hidden">
            <motion.div
              className="relative -translate-x-1/4 -translate-y-1/4 rotate-[-45deg] origin-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="px-10 py-1.5 bg-gradient-to-r from-electric-cyan/50 via-electric-cyan/30 to-transparent backdrop-blur-sm border-b border-electric-cyan/30">
                <span className="font-mono text-[8px] tracking-[0.3em] text-electric-cyan uppercase font-bold">
                  Featured
                </span>
              </div>
            </motion.div>
          </div>

          {/* Status badge */}
          <motion.div
            className="absolute bottom-4 left-4"
            initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ProjectStatusBadge status={project.status} />
          </motion.div>
        </div>

        {/* Right: Content panel */}
        <div className="relative bg-card/60 backdrop-blur-sm p-6 lg:p-8">
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-electric-cyan/20 rounded-tr-xl" />

          {/* Header */}
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-electric-cyan/80"
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Featured Project // {project.clientSector}
          </motion.p>

          <motion.h2
            className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground leading-tight"
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {project.title}
          </motion.h2>

          <motion.p
            className="mt-4 text-sm leading-relaxed text-muted-foreground"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {project.description}
          </motion.p>

          {/* KPIs as 2x2 grid */}
          <motion.div
            className="mt-6 grid grid-cols-2 gap-3"
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
                className="rounded-lg border border-border/50 bg-muted/30 p-3 transition-all duration-300 hover:border-electric-cyan/30"
              >
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {kpi.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Progress bar with animation */}
          <div ref={progressRef} className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Progress
              </span>
              <span className="font-mono text-sm font-bold text-electric-cyan">
                {project.progress}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
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

          {/* Tags with stagger */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                custom={i}
                variants={shouldReduce ? {} : tagVariants}
                initial="hidden"
                animate="visible"
                className="rounded-md border border-border/50 bg-muted/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/projects/category/${project.category}/${project.slug}`}
              className="group inline-flex items-center gap-2 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan transition-all duration-300 hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,242,255,0.15)]"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:border-electric-cyan/30 hover:text-electric-cyan"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </ProjectCardShell>
  );
}
