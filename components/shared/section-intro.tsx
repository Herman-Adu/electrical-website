"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { SectionIntroData } from "@/types/sections";

function AnimatedWord({
  word,
  index,
  inView,
}: {
  word: string;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0.15, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 8 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="inline-block mr-[0.3em]"
    >
      {word}
    </motion.span>
  );
}

interface SectionIntroProps {
  data: SectionIntroData;
}

export function SectionIntro({ data }: SectionIntroProps) {
  const {
    sectionId,
    label,
    headlineWords,
    headline,
    leadParagraph,
    bodyParagraphs = [],
    pillars = [],
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ["start end", "end start"],
  });

  const lineLeft = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);
  const lineRight = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

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
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      {/* Animated border lines */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-transparent via-electric-cyan/60 to-transparent"
          style={{ width: lineLeft }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-transparent via-electric-cyan/60 to-transparent"
          style={{ width: lineRight }}
        />
      </div>

      <div className="section-content max-w-6xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="h-px w-8 bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
            {label}
          </span>
        </motion.div>

        {/* Animated headline words or static headline */}
        <div className="mb-16">
          {headlineWords && headlineWords.length > 0 ? (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {headlineWords.map((word, i) => (
                <AnimatedWord key={i} word={word} index={i} inView={inView} />
              ))}
            </h2>
          ) : (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6 text-balance"
            >
              {headline}
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl leading-relaxed"
          >
            {leadParagraph}
          </motion.p>
        </div>

        {/* Secondary paragraphs */}
        {bodyParagraphs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl"
          >
            {bodyParagraphs.map((para, idx) => (
              <p key={idx} className="text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </motion.div>
        )}

        {/* Three pillars */}
        {pillars.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-electric-cyan/40 transition-all duration-400 group"
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
                <p className="text-sm text-muted-foreground leading-relaxed">
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
