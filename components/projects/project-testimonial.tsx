"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { ProjectTestimonial } from "@/types/projects";

interface ProjectTestimonialCardProps {
  testimonial: ProjectTestimonial;
  heading?: string;
  title?: string;
  description?: string;
  anchorId?: string;
  embedded?: boolean;
}

export function ProjectTestimonialCard({
  testimonial,
  heading = "Client Testimonial",
  title = "Straight From the Client.",
  description = "The measure of our work is the confidence our clients carry forward. Here's what they had to say.",
  anchorId,
  //embedded,
}: ProjectTestimonialCardProps) {
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
        showBottom={true}
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

        {/* Card — constrained to max-w-4xl */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative p-8 sm:p-12 rounded-2xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-linear-to-br from-[hsl(174_100%_35%)]/5 dark:from-electric-cyan/5 via-transparent to-transparent backdrop-blur-sm"
          >
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[hsl(174_100%_35%)]/40 dark:border-electric-cyan/40" />

            {/* Quote icon */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-14 h-14 rounded-full border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 flex items-center justify-center mb-8"
            >
              <Quote className="w-6 h-6 text-[hsl(174_100%_35%)] dark:text-electric-cyan" />
            </motion.div>

            {/* Quote text */}
            <motion.blockquote
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-8 italic"
            >
              &ldquo;{testimonial.quote}&rdquo;
            </motion.blockquote>

            {/* Attribution */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {/* Avatar */}
              {testimonial.image ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30">
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
              )}

              <div>
                <p className="font-bold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan/70 mt-1">
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
