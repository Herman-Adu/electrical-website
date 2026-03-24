'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronDown } from 'lucide-react';
import { BlueprintBackground } from '@/components/hero/blueprint-background';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, damping: 25, stiffness: 120 },
  },
};

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

const serviceCategories = [
  { label: 'Commercial', color: 'cyan' },
  { label: 'Industrial', color: 'cyan' },
  { label: 'Residential', color: 'cyan' },
  { label: 'Emergency', color: 'amber' },
];

export function ServicesHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusText, setStatusText] = useState('INITIALIZING');

  useEffect(() => {
    setIsLoaded(true);
    const statuses = ['INITIALIZING', 'LOADING_SERVICES', 'SCANNING_CAPABILITIES', 'SYSTEMS_READY'];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < statuses.length) {
        setStatusText(statuses[idx]);
      } else {
        clearInterval(interval);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  const scrollToGrid = () => {
    const el = document.getElementById('services-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-container section-safe-top section-safe-bottom relative min-h-[70vh] w-full flex flex-col items-center justify-center">
      <BlueprintBackground />

      {/* Circuit overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1440 700" fill="none">
          <motion.path
            d="M0 350 H350 L400 300 H750 L800 350 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.6, ease: 'easeOut' }}
          />
          <motion.path
            d="M0 450 H250 L300 400 H600 L700 500 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 1, ease: 'easeOut' }}
          />
          {[[400, 300], [800, 350], [300, 400], [600, 500]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="var(--electric-cyan)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
        className="relative z-30 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Status label */}
        <motion.div variants={flickerVariants} className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-3 border-l-2 border-[var(--electric-cyan)] pl-4">
            <Activity size={14} className="text-[var(--electric-cyan)] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Services // {statusText}
            </span>
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--electric-cyan)]/70">
            What We Do
          </span>
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-foreground"
        >
          <span className="block">Engineering</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-cyan)] via-cyan-400 to-blue-500">
            Excellence
          </span>
          <span className="block">Delivered</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Comprehensive electrical solutions from high-voltage industrial systems
          to intelligent residential installations — all backed by 15+ years of precision engineering.
        </motion.p>

        {/* Category pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {serviceCategories.map((cat) => (
            <div
              key={cat.label}
              className="px-4 py-2 rounded-full border border-[var(--electric-cyan)]/25 bg-[var(--electric-cyan)]/5 backdrop-blur-sm"
            >
              <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
                {cat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Meta */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50 uppercase"
        >
          <span>NICEIC Approved</span>
          <span className="hidden sm:inline">|</span>
          <span>Part P Certified</span>
          <span className="hidden sm:inline">|</span>
          <span>24/7 Emergency</span>
          <span className="hidden sm:inline">|</span>
          <span>6 Service Lines</span>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/30"
            style={{ left: `${12 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={scrollToGrid}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors cursor-pointer"
        aria-label="Scroll to services"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Explore Services</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
