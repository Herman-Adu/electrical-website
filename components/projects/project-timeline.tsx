"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CheckCircle, Clock, Circle } from "lucide-react";
import { useAnimatedBorders } from "@/lib/use-animated-borders";
import type { ProjectTimelinePhase } from "@/types/projects";

interface ProjectTimelineProps {
  phases: ProjectTimelinePhase[];
  heading?: string;
  anchorId?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    lineColor: "bg-emerald-500",
  },
  "in-progress": {
    icon: Clock,
    color: "text-electric-cyan",
    bgColor: "bg-electric-cyan/10",
    borderColor: "border-electric-cyan/30",
    lineColor: "bg-electric-cyan",
  },
  upcoming: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/30",
    borderColor: "border-border",
    lineColor: "bg-border",
  },
};

export function ProjectTimeline({
  phases,
  heading = "Project Timeline",
  anchorId,
}: ProjectTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduce = useReducedMotion();
  const { sectionRef } = useAnimatedBorders();

  if (phases.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 bg-background overflow-hidden"
    >
      {/*  <AnimatedBorders shouldReduce={shouldReduce} lineLeft={lineLeft} lineRight={lineRight} showBottom={false} /> */}
      <div className="section-content max-w-6xl" ref={containerRef}>
        {/* Header */}
        <motion.div
          id={anchorId}
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-[120px] top-0 bottom-0 w-px">
            <motion.div
              className="w-full bg-gradient-to-b from-electric-cyan/50 via-electric-cyan/30 to-border"
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          {/* Phases */}
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const config = statusConfig[phase.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={phase.phase}
                  initial={shouldReduce ? {} : { opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8"
                >
                  {/* Phase label */}
                  <div className="md:w-[100px] shrink-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {phase.phase}
                    </span>
                    <p className="font-mono text-xs text-electric-cyan/70 mt-1">
                      {phase.duration}
                    </p>
                  </div>

                  {/* Status indicator (desktop) */}
                  <div className="hidden md:flex relative z-10">
                    <motion.div
                      className={`w-10 h-10 rounded-full border-2 ${config.borderColor} ${config.bgColor} flex items-center justify-center`}
                      initial={shouldReduce ? {} : { scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15 + 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </motion.div>

                    {/* Pulse animation for in-progress */}
                    {phase.status === "in-progress" && !shouldReduce && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-electric-cyan"
                        animate={{
                          scale: [1, 1.4],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>

                  {/* Content card */}
                  <div
                    className={`flex-1 p-6 rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm transition-all duration-300 hover:border-electric-cyan/40`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-bold text-foreground">
                        {phase.title}
                      </h3>
                      {/* Mobile status badge */}
                      <div
                        className={`md:hidden flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.borderColor} ${config.bgColor}`}
                      >
                        <Icon className={`w-3 h-3 ${config.color}`} />
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider ${config.color}`}
                        >
                          {phase.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
