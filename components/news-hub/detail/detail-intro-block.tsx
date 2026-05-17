"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedWord } from "@/components/shared/animated-word";
import type { NewsPillarItem } from "@/types/news";

interface DetailIntroBlockProps {
  intro: string[];
  title?: string;
  eyebrow?: string;
  body?: string[];
  pillars?: NewsPillarItem[];
}

export function DetailIntroBlock({
  intro,
  title = "Overview",
  eyebrow,
  body,
  pillars,
}: DetailIntroBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-50px" });

  const words = title.split(" ");

  return (
    <section id="overview" ref={sectionRef} className="space-y-8">
      {/* Eyebrow */}
      {eyebrow && (
        <motion.div
          className="flex items-center gap-3"
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-electric-cyan">
            {eyebrow}
          </span>
        </motion.div>
      )}

      {/* Animated headline */}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {words.map((word, i) => (
          <AnimatedWord
            key={`${word}-${i}`}
            word={word}
            index={i}
            active={inView}
            className="inline-block mr-[0.3em]"
          />
        ))}
      </h2>

      {/* Lead paragraph */}
      {intro[0] && (
        <motion.p
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg leading-relaxed text-foreground/80"
        >
          {intro[0]}
        </motion.p>
      )}

      {/* Remaining intro paragraphs */}
      {intro.slice(1).map((paragraph, idx) => (
        <motion.p
          key={`intro-${idx + 1}`}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.35 + idx * 0.05 }}
          className="text-base leading-8 text-foreground/80"
        >
          {paragraph}
        </motion.p>
      ))}

      {/* Body 2-col */}
      {body && body.length > 0 && (
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {body.map((para, idx) => (
            <p key={idx} className="text-foreground/70 leading-relaxed">
              {para}
            </p>
          ))}
        </motion.div>
      )}

      {/* Pillar cards */}
      {pillars && pillars.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.num}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative p-8 rounded-2xl border border-electric-cyan/30 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm hover:border-electric-cyan/40 transition-all duration-300 group"
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
              <p className="text-sm text-foreground/70 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
