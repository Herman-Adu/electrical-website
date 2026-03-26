"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { ProjectTestimonial } from "@/types/projects";

interface ProjectTestimonialCardProps {
  testimonial: ProjectTestimonial;
}

export function ProjectTestimonialCard({
  testimonial,
}: ProjectTestimonialCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineLeft, lineRight } = useAnimatedBorders();

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 bg-background overflow-hidden">
      <AnimatedBorders shouldReduce={shouldReduce} lineLeft={lineLeft} lineRight={lineRight} showBottom={false} />
      <div className="section-content max-w-4xl" ref={containerRef}>
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative p-8 sm:p-12 rounded-2xl border border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/5 via-transparent to-transparent backdrop-blur-sm"
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-electric-cyan/40" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-electric-cyan/40" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-electric-cyan/40" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-electric-cyan/40" />

          {/* Quote icon */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-14 h-14 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 flex items-center justify-center mb-8"
          >
            <Quote className="w-6 h-6 text-electric-cyan" />
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
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-electric-cyan/30">
                <Image
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center">
                <span className="text-xl font-bold text-electric-cyan">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
            )}

            <div>
              <p className="font-bold text-foreground">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/70 mt-1">
                {testimonial.company}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
