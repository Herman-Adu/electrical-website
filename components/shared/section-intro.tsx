"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { SectionIntroData } from "@/types/sections";
import { AnimatedWord } from "@/components/shared/animated-word";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
    credentialStrip,
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25, once: false });

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />
      <div className="section-content max-w-6xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            {label}
          </span>
        </motion.div>

        {/* Animated headline words or static headline */}
        <div className="mb-8">
          {headlineWords && headlineWords.length > 0 ? (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {headlineWords.map((word, i) => (
                <AnimatedWord
                  key={`${word}-${i}`}
                  word={word}
                  index={i}
                  active={inView}
                  className="inline-block mr-[0.3em]"
                />
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
            className="text-lg dark:text-foreground/70 w-full leading-relaxed"
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
            className="grid md:grid-cols-2 gap-8 mb-12 w-full"
          >
            {bodyParagraphs.map((para, idx) => (
              <p key={idx} className="dark:text-foreground/70 leading-relaxed">
                {para}
              </p>
            ))}
          </motion.div>
        )}

        {/* Three pillars */}
        {pillars.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {pillars.map((pillar, idx) => (
              <ScrollReveal
                key={pillar.num}
                direction="up"
                blur
                delay={(idx % 3) * 0.07}
                duration={0.65}
                distance={40}
              >
                <motion.div className="relative p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-[hsl(174_100%_35%)]/80 dark:hover:border-electric-cyan/40 transition-all duration-400 group">
                  {/* Corner brackets */}
                  <div className="absolute rounded-tl-xl top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/30 group-hover:border-[hsl(174_100%_35%)] dark:group-hover:border-electric-cyan/60 transition-colors" />
                  <div className="absolute rounded-br-xl bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/30 group-hover:border-[hsl(174_100%_35%)] dark:group-hover:border-electric-cyan/60 transition-colors" />

                  <div className="font-mono text-4xl font-bold text-[hsl(174_100%_35%)]/20 dark:text-electric-cyan/20 mb-4 group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan/60 transition-colors">
                    {pillar.num}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm dark:text-foreground/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Credential strip */}
        {credentialStrip && credentialStrip.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {credentialStrip.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 font-mono text-[10px] tracking-[0.2em] uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan opacity-70 flex-shrink-0" />
                {badge}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
