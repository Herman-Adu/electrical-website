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
  Battery,
  Network,
  Building,
  Layers,
  LayoutGrid,
  Car,
  Building2,
  Cable,
  Warehouse,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { ProjectScope } from "@/types/projects";
//import { cn } from "@/lib/utils";

const iconMap: Record<ProjectScope["icon"], LucideIcon> = {
  Zap,
  Shield,
  Settings,
  Lightbulb,
  Gauge,
  Wrench,
  CheckCircle,
  Award,
  Battery,
  Network,
  Building,
  Layers,
  LayoutGrid,
  Car,
  Building2,
  Cable,
  Warehouse,
  Thermometer,
};

interface ProjectScopeGridProps {
  items: ProjectScope[];
  heading?: string;
  title?: string;
  description?: string;
  anchorId?: string;
  embedded?: boolean;
}

export function ProjectScopeGrid({
  items,
  heading = "Scope of Work",
  title = "Precision Engineering, Comprehensive Delivery.",
  description = "Every project demands a tailored approach. Our scope encompasses the full spectrum of electrical infrastructure — from initial assessment through final commissioning — ensuring seamless integration and long-term reliability.",
  anchorId,
  //embedded,
}: ProjectScopeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineScale } = useAnimatedBorders();

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-card/30 section-padding"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="section-content max-w-6xl" ref={containerRef}>
        {/* Eyebrow */}
        <motion.div
          id={anchorId}
          className="flex items-center gap-4 mb-6 scroll-mt-36"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px w-8 bg-electric-cyan/50" />
          <h2 className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
            {heading}
          </h2>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 max-w-3xl"
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-foreground dark:text-foreground/70 leading-relaxed max-w-4xl mb-12"
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2  gap-6">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Zap;

            return (
              <motion.div
                key={item.title}
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-border bg-linear-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,189,0.06)]"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/10">
                  <Icon className="w-6 h-6 text-electric-cyan/70 transition-colors duration-300 group-hover:text-electric-cyan" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-foreground dark:text-foreground/70 mb-2 transition-colors duration-300 group-hover:text-electric-cyan">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground dark:text-foreground/70 leading-relaxed">
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
