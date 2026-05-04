"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { getIcon } from "./icon-map";
import type { SectionFeaturesData } from "@/types/sections";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";

interface SectionFeaturesProps {
  data: SectionFeaturesData;
}

export function SectionFeatures({ data }: SectionFeaturesProps) {
  const {
    sectionId,
    label,
    headline,
    headlineHighlight,
    description,
    pillars,
    checklist = [],
    partners = [],
    background = "default",
  } = data;

  const bgClass = background === "dark" ? "bg-slate-dark" : "bg-background";
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={`section-container section-padding ${bgClass}`}
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-electric-cyan/20"
            style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{
              duration: 4 + i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="section-content">
        {/* Header */}
        <ScrollReveal direction="down" blur delay={0} duration={0.65}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6 md:w-8 bg-electric-cyan" />
              <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                {label}
              </span>
              <div className="h-px w-6 md:w-8 bg-electric-cyan" />
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
            <p className="text-base sm:text-lg lg:text-xl text-foreground/90 dark:text-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </ScrollReveal>

        {/* Feature pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = getIcon(pillar.icon);
            return (
              <ScrollReveal
                key={pillar.title}
                direction="up"
                blur
                delay={(idx % 4) * 0.07}
                duration={0.65}
                distance={40}
                once
              >
                <div
                  className={`relative p-7 rounded-2xl border transition-all duration-300 group ${
                    pillar.highlight
                      ? "border-electric-cyan/60 bg-electric-cyan/8 shadow-lg shadow-electric-cyan/15"
                      : "border-border bg-card/50 hover:border-electric-cyan/30"
                  }`}
                >
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${
                    pillar.highlight
                      ? "border-electric-cyan/40 bg-electric-cyan/15"
                      : "border-border bg-card group-hover:border-electric-cyan/30"
                  } transition-all duration-300`}
                >
                  <Icon
                    size={22}
                    className={
                      pillar.highlight
                        ? "text-electric-cyan"
                        : "text-muted-foreground group-hover:text-electric-cyan transition-colors"
                    }
                  />
                </div>

                <h3 className="text-base font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                {pillar.highlight && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
                    <span className="font-mono text-[10px] text-electric-cyan tracking-widest uppercase">
                      Core Commitment
                    </span>
                  </div>
                )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Two column: checks + partners */}
        {(checklist.length > 0 || partners.length > 0) && (
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Checklist */}
            {checklist.length > 0 && (
              <ScrollReveal direction="left" blur delay={0} duration={0.65}>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    What You Always Receive
                  </h3>
                  <div className="space-y-3">
                    {checklist.map((check, idx) => (
                      <ScrollReveal
                        key={check}
                        direction="left"
                        delay={idx * 0.07}
                        duration={0.65}
                        distance={20}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle
                            size={16}
                            className="text-electric-cyan shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-muted-foreground">
                            {check}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Partners / accreditations */}
            {partners.length > 0 && (
              <ScrollReveal direction="right" blur delay={0} duration={0.65}>
                <div>
                  <h3 className="text-xl font-bold text-[hsl(174_100%_35%)] dark:text-foreground mb-6">
                    Our Accreditations &amp; Partners
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {partners.map((partner, idx) => (
                      <ScrollReveal
                        key={partner.name}
                        direction="up"
                        blur
                        delay={(idx % 3) * 0.07}
                        duration={0.65}
                        distance={30}
                      >
                        <div className="group aspect-square cursor-default rounded-xl border border-border bg-card/40 transition-all duration-300 hover:border-electric-cyan/40 hover:bg-electric-cyan/5 flex flex-col items-center justify-center gap-1">
                          <span className="font-mono text-lg font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan/60 transition-colors group-hover:text-electric-cyan">
                            {partner.abbr}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium tracking-wide text-center leading-tight px-2">
                            {partner.name}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
