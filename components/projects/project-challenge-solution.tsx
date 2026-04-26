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
  heading?: string;
  title?: string;
  description?: string;
  anchorId?: string;
  embedded?: boolean;
}

export function ProjectChallengeSolution({
  challenge,
  solution,
  heading = "Engineering Excellence",
  title = "Meeting Every Challenge Head On.",
  description = "Complex electrical projects rarely follow a straight line. Our engineers thrive in high-constraint environments — designing solutions that protect operations, meet deadlines, and stand the test of time.",
  anchorId,
  embedded,
}: ProjectChallengeSolutionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineScale } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background section-padding"
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
          <div className="h-px w-8 bg-[hsl(174_100%_35%)]/50 dark:bg-electric-cyan/50" />
          <h2 className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
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
            <p className="text-foreground/70 leading-relaxed">{challenge}</p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 rounded-2xl border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 backdrop-blur-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-lg border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-[hsl(174_100%_35%)] dark:text-electric-cyan" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">
              Our Solution
            </h3>
            <p className="text-foreground/70 leading-relaxed">{solution}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
