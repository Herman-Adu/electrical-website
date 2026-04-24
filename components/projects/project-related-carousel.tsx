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
import { ArrowRight, MapPin, GripHorizontal } from "lucide-react";
import { useAnimatedBorders } from "@/lib/use-animated-borders";
import type { Project } from "@/types/projects";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

interface ProjectRelatedCarouselProps {
  projects: Project[];
  categorySlug: string;
  heading?: string;
  anchorId?: string;
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
      className="relative section-padding bg-background overflow-hidden"
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
          <div className="shrink-0 w-[calc((100vw-80rem)/2+1rem)] max-w-[4rem] min-w-0 hidden xl:block" />

          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              custom={index}
              variants={shouldReduce ? {} : cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="shrink-0 w-[280px] sm:w-[320px]"
            >
              <Link
                href={`/projects/category/${categorySlug}/${project.slug}`}
                className="group block rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,189,0.06)]"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              >
                {/* Image */}
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <Image
                    src={project.coverImage.src}
                    alt={project.coverImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="320px"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Status badge */}
                  <div className="absolute bottom-2 left-2">
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-electric-cyan">
                    {project.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{project.kpis.location}</span>
                  </div>

                  {/* Arrow CTA */}
                  <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-electric-cyan/60 transition-all duration-300 group-hover:text-electric-cyan">
                    <span>View Project</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Right padding spacer */}
          <div className="shrink-0 w-4 sm:w-6 lg:w-8" />
        </motion.div>

        {/* Gradient fade edges */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
