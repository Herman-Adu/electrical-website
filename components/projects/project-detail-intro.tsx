"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ProjectIntroData } from "@/types/projects";
import { AnimatedWord } from "@/components/shared/animated-word";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

interface ProjectDetailIntroProps {
  data: ProjectIntroData;
  anchorId?: string;
  embedded?: boolean;
}

export function ProjectDetailIntro({
  data,
  anchorId,
  embedded,
}: ProjectDetailIntroProps) {
  const {
    label,
    headlineWords,
    leadParagraph,
    bodyParagraphs = [],
    pillars = [],
  } = data;

  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background section-padding-bottom pt-6"
    >
      <AnimatedBorders shouldReduce={shouldReduce} lineScale={lineScale} showBottom={false} />
      <div className="section-content max-w-6xl">
        {/* Section label */}
        <motion.div
          id={anchorId}
          className="flex items-center gap-3 mb-6 scroll-mt-36"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-8 bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-electric-cyan">
            {label}
          </span>
        </motion.div>

        {/* Animated headline words */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            {headlineWords.map((word, i) => (
              <AnimatedWord
                key={`${word}-${i}`}
                word={word}
                index={i}
                active={inView}
                shouldReduce={shouldReduce}
                className="inline-block mr-[0.3em]"
              />
            ))}
          </h2>

          <motion.p
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-foreground dark:text-foreground/70 leading-relaxed"
          >
            {leadParagraph}
          </motion.p>
        </div>

        {/* Secondary paragraphs */}
        {bodyParagraphs.length > 0 && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {bodyParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-foreground dark:text-foreground/70 leading-relaxed"
              >
                {para}
              </p>
            ))}
          </motion.div>
        )}

        {/* Three pillars */}
        {pillars.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-border bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm hover:border-electric-cyan/40 transition-all duration-300 group"
              >
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />

                <div className="font-mono text-4xl font-bold text-electric-cyan/20 mb-4 group-hover:text-electric-cyan/30 transition-colors">
                  {pillar.num}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-foreground dark:text-foreground/70 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
