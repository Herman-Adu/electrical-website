"use client";

import React from "react";
import { motion } from "framer-motion";
import { getIcon } from "./icon-map";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { SectionValuesData } from "@/types/sections";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

// Framer Motion variants for staggered card content reveals
const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

interface SectionValuesProps {
  data: SectionValuesData;
}

export function SectionValues({ data }: SectionValuesProps) {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  const {
    sectionId,
    label,
    headline,
    headlineHighlight,
    description,
    values,
    tagline,
  } = data;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="absolute inset-0 blueprint-grid-fine opacity-25 pointer-events-none" />

      <div className="section-content">
        {/* Header */}
        <ScrollReveal direction="down" blur delay={0} duration={0.65} distance={40}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                {label}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {headlineHighlight ? (
                <>
                  {headline.replace(headlineHighlight, "")}{" "}
                  <span className="text-electric-cyan">{headlineHighlight}</span>
                </>
              ) : (
                headline
              )}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </ScrollReveal>

        {/* Values grid — all cards equal height via CSS Grid minmax */}
        <div className="values-grid">
          {values.map((value, idx) => {
            const Icon = getIcon(value.icon);
            const isCyan = value.color === "cyan" || !value.color;
            const accentColor = isCyan
              ? "hsl(174 100% 50%)"
              : "hsl(37 100% 49%)";

            return (
              <ScrollReveal
                key={value.title}
                direction="up"
                blur
                delay={idx * 0.05}
                duration={0.65}
                distance={40}
              >
                <motion.div
                  data-testid="section-value-card"
                  className="group relative p-8 rounded-2xl border border-border bg-card/40 hover:border-electric-cyan/30 transition-all duration-400 overflow-hidden flex flex-col h-full"
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  viewport={{ once: true }}
                  style={{ contain: 'content' }}
                >
                  {/* Hover background fill */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${isCyan ? "rgba(0,243,189,0.04)" : "rgba(245,158,11,0.04)"}, transparent 70%)`,
                    }}
                  />

                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-border group-hover:border-electric-cyan/40 transition-colors" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-border group-hover:border-electric-cyan/40 transition-colors" />

                  {/* Icon — staggered reveal */}
                  <motion.div
                    variants={childVariants}
                    className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300"
                    style={{
                      borderColor: `${accentColor}30`,
                      background: `${accentColor}10`,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <Icon size={24} style={{ color: accentColor }} />
                  </motion.div>

                  {/* Title — staggered reveal */}
                  <motion.div variants={childVariants} style={{ willChange: 'opacity, transform' }}>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                  </motion.div>

                  {/* Short tagline — staggered reveal */}
                  <motion.div variants={childVariants} style={{ willChange: 'opacity, transform' }}>
                    <p className="font-mono text-xs tracking-wide text-muted-foreground/70 mb-4 italic">
                      {value.short}
                    </p>
                  </motion.div>

                  {/* Full description — always visible, grows to fill available space with min-height floor */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 min-h-15">
                    {value.full}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `${accentColor}` }}
                  />
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Tagline */}
        {tagline && (
          <ScrollReveal direction="up" blur delay={0.21} duration={0.65} distance={40}>
            <div className="mt-12 text-center font-mono text-sm tracking-widest uppercase text-muted-foreground/50">
              {tagline}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
