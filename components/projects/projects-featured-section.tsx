"use client";

import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { Project } from "@/types/projects";
import { ProjectsFeaturedCardAnimated } from "./projects-featured-card-animated";

interface ProjectsFeaturedSectionProps {
  project: Project;
}

export function ProjectsFeaturedSection({ project }: ProjectsFeaturedSectionProps) {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  return (
    <section
      id="projects-grid"
      ref={sectionRef}
      className="relative overflow-hidden section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="section-content max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            Featured Project
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
        </div>
        <ProjectsFeaturedCardAnimated project={project} />
      </div>
    </section>
  );
}
