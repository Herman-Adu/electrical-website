'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Lightbulb, Users, Star, Zap } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    short: 'We say what we mean and do what we say.',
    full: 'Honesty and transparency guide every interaction — from the first site visit to the final sign-off. We never oversell, underdeliver, or cut corners.',
    color: 'cyan',
  },
  {
    icon: Star,
    title: 'Excellence',
    short: 'Good enough is never good enough.',
    full: 'We hold ourselves to the highest professional standards, constantly seeking to improve our methods, knowledge, and outcomes for every client.',
    color: 'amber',
  },
  {
    icon: Heart,
    title: 'Community',
    short: 'We build more than just circuits.',
    full: 'Our work creates real impact in the communities we serve. We invest in local apprenticeships, charitable partnerships, and free safety initiatives.',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'Teamwork',
    short: 'Our greatest asset is our people.',
    full: 'A culture of mutual respect, shared responsibility, and collective pride. When one of us succeeds, all of us succeed.',
    color: 'amber',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    short: 'We embrace tomorrow\'s technology today.',
    full: 'From smart systems to sustainable solutions, we actively invest in emerging electrical technology to deliver better, faster, and more efficient outcomes.',
    color: 'cyan',
  },
  {
    icon: Zap,
    title: 'Reliability',
    short: 'On time. On budget. Without compromise.',
    full: 'We show up when we say we will, complete work when we commit to, and deliver within the agreed price. Reliability isn\'t a feature — it\'s our baseline.',
    color: 'amber',
  },
];

export function CoreValues() {
  return (
    <SectionWrapper
      id="core-values"
      variant="full"
    > id="core-values" className="section-container section-padding bg-background">
      <div className="absolute inset-0 blueprint-grid-fine opacity-25 pointer-events-none" />

      <div className="section-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[var(--electric-cyan)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
              How We Operate
            </span>
            <div className="h-px w-8 bg-[var(--electric-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Core <span className="text-[var(--electric-cyan)]">Values</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Not words on a wall. These are the principles we live and work by — every project, every day.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon;
            const isCyan = value.color === 'cyan';
            const accentColor = isCyan ? 'var(--electric-cyan)' : 'var(--amber-warning)';
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: false }}
                className="group relative p-8 rounded-2xl border border-border bg-card/40 hover:border-[var(--electric-cyan)]/30 transition-all duration-400 cursor-default overflow-hidden"
              >
                {/* Hover background fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${isCyan ? 'rgba(0,242,255,0.04)' : 'rgba(245,158,11,0.04)'}, transparent 70%)` }}
                />

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-border group-hover:border-[var(--electric-cyan)]/40 transition-colors" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-border group-hover:border-[var(--electric-cyan)]/40 transition-colors" />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300"
                  style={{ borderColor: `${accentColor}30`, background: `${accentColor}10` }}
                >
                  <Icon size={24} style={{ color: accentColor }} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: false }}
          className="mt-12 text-center font-mono text-sm tracking-widest uppercase text-muted-foreground/50"
        >
          We Live These Daily — Not Just Display Them
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
