'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface ServiceCTABlockProps {
  title: string;
  description: string;
  primaryCTA: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  delay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 120 },
  },
};

export function ServiceCTABlock({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  delay = 0,
}: ServiceCTABlockProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className="section-container section-padding relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 dark:bg-gradient-to-r dark:from-[var(--electric-cyan)]/5 dark:via-transparent dark:to-[var(--electric-cyan)]/5 bg-gradient-to-r from-[var(--electric-cyan)]/3 via-transparent to-[var(--electric-cyan)]/3 rounded-3xl" />

      <div className="section-content max-w-3xl mx-auto text-center">
        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-4">
          {title}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-muted-foreground mb-12 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={primaryCTA.href || '#'}
            onClick={primaryCTA.onClick}
            className="px-8 py-4 rounded-2xl bg-[var(--electric-cyan)] text-black font-bold uppercase tracking-widest hover:bg-[var(--electric-cyan)]/90 transition-all duration-300 flex items-center gap-2 group"
          >
            {primaryCTA.label}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>

          {secondaryCTA && (
            <a
              href={secondaryCTA.href || '#'}
              onClick={secondaryCTA.onClick}
              className="px-8 py-4 rounded-2xl border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] font-bold uppercase tracking-widest hover:bg-[var(--electric-cyan)]/10 hover:border-[var(--electric-cyan)]/50 transition-all duration-300 flex items-center gap-2 group"
            >
              {secondaryCTA.label}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
