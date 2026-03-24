'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import { getIcon } from './icon-map';
import type { SectionFeaturesData } from '@/types/sections';

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
    background = 'default',
  } = data;

  const bgClass = background === 'dark' ? 'bg-slate-dark' : 'bg-background';

  return (
    <section id={sectionId} className={`section-container section-padding ${bgClass}`}>
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      {/* Electric border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/50 to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/20"
            style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>

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
            <Zap size={14} className="text-[var(--electric-cyan)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
              {label}
            </span>
            <Zap size={14} className="text-[var(--electric-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {headlineHighlight ? (
              <>
                {headline.replace(headlineHighlight, '')}{' '}
                <span className="text-[var(--electric-cyan)]">{headlineHighlight}</span>
              </>
            ) : (
              headline
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">{description}</p>
        </motion.div>

        {/* Feature pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = getIcon(pillar.icon);
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-7 rounded-2xl border transition-all duration-300 group ${
                  pillar.highlight
                    ? 'border-[var(--electric-cyan)]/60 bg-[var(--electric-cyan)]/8 shadow-lg shadow-[var(--electric-cyan)]/15'
                    : 'border-border bg-card/50 hover:border-[var(--electric-cyan)]/30'
                }`}
              >
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${
                    pillar.highlight
                      ? 'border-[var(--electric-cyan)]/40 bg-[var(--electric-cyan)]/15'
                      : 'border-border bg-card group-hover:border-[var(--electric-cyan)]/30'
                  } transition-all duration-300`}
                >
                  <Icon
                    size={22}
                    className={
                      pillar.highlight
                        ? 'text-[var(--electric-cyan)]'
                        : 'text-muted-foreground group-hover:text-[var(--electric-cyan)] transition-colors'
                    }
                  />
                </div>

                <h3 className="text-base font-bold text-foreground mb-3">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>

                {pillar.highlight && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
                    <span className="font-mono text-[10px] text-[var(--electric-cyan)] tracking-widest uppercase">
                      Core Commitment
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Two column: checks + partners */}
        {(checklist.length > 0 || partners.length > 0) && (
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Checklist */}
            {checklist.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-foreground mb-6">What You Always Receive</h3>
                <div className="space-y-3">
                  {checklist.map((check, idx) => (
                    <motion.div
                      key={check}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.07 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle size={16} className="text-[var(--electric-cyan)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{check}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Partners / accreditations */}
            {partners.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-foreground mb-6">Our Accreditations &amp; Partners</h3>
                <div className="grid grid-cols-3 gap-4">
                  {partners.map((partner, idx) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      viewport={{ once: true }}
                      className="aspect-square rounded-xl border border-border bg-card/40 flex flex-col items-center justify-center gap-1 hover:border-[var(--electric-cyan)]/40 hover:bg-[var(--electric-cyan)]/5 transition-all duration-300 group cursor-default"
                    >
                      <span className="font-mono text-lg font-bold text-[var(--electric-cyan)]/60 group-hover:text-[var(--electric-cyan)] transition-colors">
                        {partner.abbr}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium tracking-wide text-center leading-tight px-2">
                        {partner.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
