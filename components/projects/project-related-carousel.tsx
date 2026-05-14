"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type PanInfo,
} from "framer-motion";
import { MapPin, GripHorizontal } from "lucide-react";
import { useAnimatedBorders } from "@/lib/use-animated-borders";
import type { Project } from "@/types/projects";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();
}

interface ProjectRelatedCarouselProps {
  projects: Project[];
  categorySlug: string;
  heading?: string;
  anchorId?: string;
  embedded?: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export function ProjectRelatedCarousel({
  projects,
  categorySlug,
  heading = "Related Projects",
  anchorId,
  //embedded,
}: ProjectRelatedCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const { sectionRef } = useAnimatedBorders();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [showHint, setShowHint] = useState(true);

  // Calculate drag constraints based on container and content width
  useEffect(() => {
    if (!containerRef.current) return;

    const calculateConstraints = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxDrag = Math.max(0, scrollWidth - clientWidth);

      setDragConstraints({
        left: -maxDrag,
        right: 0,
      });
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [projects.length]);

  // Hide drag hint after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Return null if no projects
  if (projects.length === 0) return null;

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    _info: PanInfo,
  ) => {
    setShowHint(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background section-padding"
      aria-label="Related projects"
    >
      {/*  <AnimatedBorders shouldReduce={shouldReduce} lineLeft={lineLeft} lineRight={lineRight} showBottom={false} /> */}
      {/* Header */}
      <div
        id={anchorId}
        className="section-content max-w-6xl mb-6 scroll-mt-36"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-electric-cyan/50" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
              {heading}
            </h2>
          </div>

          {/* Drag hint */}
          <motion.div
            className="flex items-center gap-2 text-muted-foreground/60"
            initial={{ opacity: 1 }}
            animate={{ opacity: showHint ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <GripHorizontal className="h-4 w-4" />
            <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
              Drag to Explore
            </span>
          </motion.div>
        </div>
      </div>

      {/* Carousel container */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={containerRef}
          drag={shouldReduce ? false : "x"}
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="flex gap-4 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        >
          {/* Left padding spacer */}
          <div className="shrink-0 w-[calc((100vw-80rem)/2+1rem)] max-w-16 min-w-0 hidden xl:block" />

          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              custom={index}
              variants={shouldReduce ? {} : cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="shrink-0 w-72 sm:w-[300px]"
            >
              <Link
                href={`/projects/category/${categorySlug}/${project.slug}`}
                className="group flex flex-col rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,189,0.08)]"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 w-full shrink-0 overflow-hidden">
                  <Image
                    src={project.coverImage.src}
                    alt={project.coverImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="300px"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <div className="space-y-2.5">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-electric-cyan">
                        {project.categoryLabel}
                      </span>
                      <ProjectStatusBadge status={project.status} />
                    </div>

                    {/* Date */}
                    <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">
                      {formatDate(project.publishedAt)}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-electric-cyan">
                      {project.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs leading-5 text-foreground/60 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/50">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {project.kpis.location}
                      </span>
                      <span className="text-foreground/30">·</span>
                      <span>{project.categoryLabel}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-electric-cyan transition-all group-hover:bg-electric-cyan/20 group-hover:shadow-[0_0_15px_rgba(0,243,189,0.15)]">
                      View Project →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Right padding spacer */}
          <div className="shrink-0 w-4 sm:w-6 lg:w-8" />
        </motion.div>

        {/* linear fade edges */}
        <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
