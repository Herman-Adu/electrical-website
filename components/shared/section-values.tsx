"use client";

import React from "react";
import { motion } from "framer-motion";
import { getIcon } from "./icon-map";
import type { SectionValuesData } from "@/types/sections";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, idx) => {
            const Icon = getIcon(value.icon);
            const isCyan = value.color === "cyan" || !value.color;
            const accentColor = isCyan
              ? "hsl(174 100% 50%)"
              : "hsl(37 100% 49%)";
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl border border-border bg-card/40 hover:border-electric-cyan/30 transition-all duration-400 cursor-default overflow-hidden"
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

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    borderColor: `${accentColor}30`,
                    background: `${accentColor}10`,
                  }}
                >
                  <Icon size={24} style={{ color: accentColor }} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {value.title}
                </h3>

                {/* Short tagline */}
                <p className="font-mono text-xs tracking-wide text-muted-foreground/70 mb-4 italic">
                  {value.short}
                </p>

                {/* Full description — revealed on hover */}
                <p className="text-sm text-muted-foreground leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32 overflow-hidden transition-all duration-400">
                  {value.full}
                </p>

                {/* Static short description visible when not hovered */}
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:hidden transition-all duration-200">
                  {value.full.slice(0, 80)}...
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `${accentColor}` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Tagline */}
        {tagline && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center font-mono text-sm tracking-widest uppercase text-muted-foreground/50"
          >
            {tagline}
          </motion.div>
        )}
      </div>
    </section>
  );
}
