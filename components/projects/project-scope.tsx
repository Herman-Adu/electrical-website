"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Zap,
  Shield,
  Settings,
  Lightbulb,
  Gauge,
  Wrench,
  CheckCircle,
  Award,
} from "lucide-react";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { ProjectScope } from "@/types/projects";

const iconMap = {
  Zap,
  Shield,
  Settings,
  Lightbulb,
  Gauge,
  Wrench,
  CheckCircle,
  Award,
};

interface ProjectScopeGridProps {
  items: ProjectScope[];
  heading?: string;
}

export function ProjectScopeGrid({
  items,
  heading = "Scope of Work",
}: ProjectScopeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineLeft, lineRight } = useAnimatedBorders();

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 bg-card/30 overflow-hidden">
      <AnimatedBorders shouldReduce={shouldReduce} lineLeft={lineLeft} lineRight={lineRight} />
      <div className="section-content max-w-6xl" ref={containerRef}>
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px w-8 bg-electric-cyan/50" />
          <h2 className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
            {heading}
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Zap;

            return (
              <motion.div
                key={item.title}
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,255,0.06)]"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-electric-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/10">
                  <Icon className="w-6 h-6 text-electric-cyan/70 transition-colors duration-300 group-hover:text-electric-cyan" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-foreground mb-2 transition-colors duration-300 group-hover:text-electric-cyan">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
