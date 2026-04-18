"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Award, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

const certs = [
  {
    abbr: "NICEIC",
    name: "Approved Contractor",
    category: "Safety",
    level: "Gold",
    featured: true,
  },
  {
    abbr: "Part P",
    name: "Certified Competent Person",
    category: "Compliance",
    level: "Certified",
    featured: false,
  },
  {
    abbr: "NAPIT",
    name: "Registered Member",
    category: "Industry Body",
    level: "Member",
    featured: false,
  },
  {
    abbr: "ECS",
    name: "Gold Card Holder",
    category: "Skills",
    level: "Gold",
    featured: true,
  },
  {
    abbr: "CHAS",
    name: "Accredited Contractor",
    category: "Health & Safety",
    level: "Accredited",
    featured: false,
  },
  {
    abbr: "18th Ed",
    name: "BS 7671 Qualified",
    category: "Standards",
    level: "Qualified",
    featured: false,
  },
  {
    abbr: "ISO 9001",
    name: "Quality Management",
    category: "Quality",
    level: "Certified",
    featured: true,
  },
  {
    abbr: "PAT",
    name: "Portable Appliance Testing",
    category: "Testing",
    level: "Approved",
    featured: false,
  },
  {
    abbr: "IPAF",
    name: "Powered Access Licensed",
    category: "Safety",
    level: "Licensed",
    featured: false,
  },
];

export function Certifications() {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {
        <AnimatedBorders
          shouldReduce={shouldReduce}
          lineScale={lineScale}
          showBottom={false}
        />
      }
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

      <div className="section-content">
        {/* Header */}
        <ScrollReveal direction="down" blur delay={0} duration={0.65}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield size={14} className="text-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                Verified & Approved
              </span>
              <Shield size={14} className="text-electric-cyan" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Our <span className="text-electric-cyan">Certifications</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Every accreditation earned through rigorous examination and
              continuous professional development. These aren&apos;t badges —
              they&apos;re proof of commitment.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {certs.map((cert, idx) => (
            <ScrollReveal
              key={cert.abbr}
              direction="up"
              blur
              delay={(idx % 3) * 0.07}
              duration={0.65}
              distance={40}
            >
              <div
                className={`relative group rounded-2xl border p-6 transition-all duration-300 cursor-default overflow-hidden ${
                  cert.featured
                    ? "border-electric-cyan/50 bg-electric-cyan/8 hover:shadow-xl hover:shadow-electric-cyan/20"
                    : "border-border bg-card/40 hover:border-electric-cyan/30 hover:bg-electric-cyan/5"
                }`}
              >
              {/* Shimmer effect */}
              {/* <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-electric-cyan/5 to-transparent" /> */}

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-electric-cyan/30 group-hover:border-electric-cyan/60 transition-colors" />

              {/* Featured star */}
              {cert.featured && (
                <div className="absolute top-3 right-3">
                  <Star
                    size={12}
                    className="text-amber-warning fill-amber-warning"
                  />
                </div>
              )}

              {/* Cert abbreviation */}
              <div
                className={`font-mono text-2xl font-black mb-3 ${
                  cert.featured
                    ? "text-electric-cyan"
                    : "text-electric-cyan/60 group-hover:text-electric-cyan transition-colors"
                }`}
              >
                {cert.abbr}
              </div>

              {/* Category chip */}
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-2">
                {cert.category}
              </div>

              {/* Name */}
              <div className="text-sm font-semibold text-foreground mb-3">
                {cert.name}
              </div>

              {/* Level badge */}
              <div className="flex items-center gap-1.5">
                <CheckCircle
                  size={12}
                  className="text-electric-cyan shrink-0"
                />
                <span className="text-xs text-muted-foreground">
                  {cert.level}
                </span>
              </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom statement */}
        <ScrollReveal direction="up" blur delay={0.2} duration={0.65}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card/40">
              <Award size={16} className="text-electric-cyan" />
              <span className="text-sm text-muted-foreground">
                All certifications independently verified and maintained through
                annual audits
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
