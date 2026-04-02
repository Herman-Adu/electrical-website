"use client";

import { useReducedMotion } from "framer-motion";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import { ProjectKpiGrid } from "@/components/projects";
import type { ProjectKpis } from "@/types/projects";

interface ProjectKpiSectionProps {
  kpis: ProjectKpis;
}

export function ProjectKpiSection({ kpis }: ProjectKpiSectionProps) {
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineLeft, lineRight } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative section-container section-padding-sm bg-background overflow-hidden"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineLeft={lineLeft}
        lineRight={lineRight}
      />
      <div className="section-content max-w-6xl">
        <ProjectKpiGrid kpis={kpis} />
      </div>
    </section>
  );
}
