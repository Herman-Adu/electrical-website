"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { AlertTriangle, Lightbulb } from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

interface ProjectChallengeSolutionProps {
  challenge: string;
  solution: string;
  anchorId?: string;
}

export function ProjectChallengeSolution({
  challenge,
  solution,
  anchorId,
}: ProjectChallengeSolutionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineLeft, lineRight } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 bg-background overflow-hidden"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineLeft={lineLeft}
        lineRight={lineRight}
        showBottom={false}
      />
      <div className="section-content max-w-6xl" ref={containerRef}>
        {/* Header */}
        <motion.div
          id={anchorId}
          className="flex items-center gap-4 mb-12 scroll-mt-36"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px w-8 bg-electric-cyan/50" />
          <h2 className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
            Engineering Excellence
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Challenge */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-500/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-500/40" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">
              The Challenge
            </h3>
            <p className="text-muted-foreground leading-relaxed">{challenge}</p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 rounded-2xl border border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-electric-cyan/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-electric-cyan/40" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-electric-cyan" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">
              Our Solution
            </h3>
            <p className="text-muted-foreground leading-relaxed">{solution}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
