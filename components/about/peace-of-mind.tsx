"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Award, ThumbsUp, CheckCircle, Zap } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

const pillars = [
  {
    icon: Shield,
    title: "Fully Licensed & Insured",
    desc: "All work carried out by NICEIC Approved Contractors. Full public liability and professional indemnity insurance on every project.",
    highlight: false,
  },
  {
    icon: Award,
    title: "Workmanship Guaranteed",
    desc: "Every installation backed by our comprehensive workmanship guarantee. If something isn't right, we fix it — no questions asked.",
    highlight: true,
  },
  {
    icon: Clock,
    title: "24/7 Emergency Response",
    desc: "Electrical emergencies don't keep business hours. Our rapid response team is available around the clock, every day of the year.",
    highlight: false,
  },
  {
    icon: ThumbsUp,
    title: "Fixed Price Quotes",
    desc: "No hidden charges. No surprise invoices. We quote clearly, and we deliver to budget. Your financial peace of mind matters to us.",
    highlight: false,
  },
];

const partners = [
  { name: "NICEIC", abbr: "NIC" },
  { name: "Part P", abbr: "P.P" },
  { name: "NAPIT", abbr: "NAP" },
  { name: "ECS Gold", abbr: "ECS" },
  { name: "CHAS", abbr: "CHA" },
  { name: "ISO 9001", abbr: "ISO" },
];

const checks = [
  "Written quotations provided for every job",
  "All work tested to BS 7671 18th Edition",
  "Electrical Installation Certificate issued on completion",
  "Full Part P notification where required",
  "Manufacturer warranties honoured and documented",
  "Annual free safety check for returning clients",
];

export function PeaceOfMind() {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  return (
    <section
      id="peace-of-mind"
      ref={sectionRef}
      className="section-container section-padding bg-slate-dark"
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
              <Zap size={14} className="text-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                Our Promise
              </span>
              <Zap size={14} className="text-electric-cyan" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Peace of Mind,{" "}
              <span className="text-electric-cyan">Guaranteed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
              Your electrical problems, solved with absolute confidence. We
              don&apos;t just complete jobs — we deliver certainty. Here&apos;s
              exactly what you can expect from us.
            </p>
          </div>
        </ScrollReveal>

        {/* Four pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
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
                <div className="absolute top-3 left-3 h-5 w-5 border-t border-l border-electric-cyan/30 transition-colors group-hover:border-electric-cyan/60" />
                <div className="absolute right-3 bottom-3 h-5 w-5 border-r border-b border-electric-cyan/30 transition-colors group-hover:border-electric-cyan/60" />

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
                        : "text-muted-foreground transition-colors group-hover:text-electric-cyan"
                    }
                  />
                </div>

                <h3 className="text-base font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>

                {pillar.highlight && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-electric-cyan animate-pulse" />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-electric-cyan">
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
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Checklist */}
          <ScrollReveal direction="left" blur delay={0} duration={0.65}>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">
                What You Always Receive
              </h3>
              <div className="space-y-3">
                {checks.map((check, idx) => (
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
                        className="mt-0.5 shrink-0 text-electric-cyan"
                      />
                      <span className="text-sm text-muted-foreground">{check}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Trusted partners / accreditations */}
          <ScrollReveal direction="right" blur delay={0} duration={0.65}>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">
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
                      <span className="font-mono text-lg font-bold text-electric-cyan/60 transition-colors group-hover:text-electric-cyan">
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
        </div>
      </div>
    </section>
  );
}
