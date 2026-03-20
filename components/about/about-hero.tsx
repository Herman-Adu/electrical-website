'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronDown } from 'lucide-react';
import { BlueprintBackground } from '@/components/hero/blueprint-background';
import { SectionWrapper } from '@/components/ui/section-wrapper';

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

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '2,400+', label: 'Projects Completed' },
  { value: '99.7%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Emergency Support' },
];

export function AboutHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusText, setStatusText] = useState('INITIALIZING');
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    const statuses = ['INITIALIZING', 'LOADING_PROFILE', 'VERIFYING_RECORDS', 'SYSTEM_READY'];
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

  const scrollToContent = () => {
    const next = document.getElementById('company-intro');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SectionWrapper
      id="about-hero"
      variant="full"
    >
      ref={scrollRef}
      className="section-container section-safe-top section-safe-bottom relative min-h-screen w-full flex flex-col items-center justify-center"
    >
      <BlueprintBackground />

      {/* Animated circuit lines - decorative */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1440 900" fill="none">
          <motion.path
            d="M0 450 H400 L450 400 H800 L850 450 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: 'easeOut' }}
          />
          <motion.path
            d="M0 550 H300 L350 500 H700 L800 600 H1440"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 1.2, ease: 'easeOut' }}
          />
          <motion.path
            d="M200 0 V200 L250 250 V600 L200 650 V900"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
          />
          <motion.path
            d="M1200 0 V150 L1240 190 V500 L1200 540 V900"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1.4, ease: 'easeOut' }}
          />
          {/* Node dots */}
          {[[450, 400], [850, 450], [350, 500], [700, 600], [250, 250], [250, 600], [1240, 190], [1240, 500]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="var(--electric-cyan)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </svg>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/40 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
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
              Profile // {statusText}
            </span>
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--electric-cyan)]/70">
            Intact Electrical Innovations
          </span>
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-foreground"
        >
          <span className="block">Built on</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-cyan)] via-cyan-400 to-blue-500">
            Trust &amp; Craft
          </span>
          <span className="block">Since 2009</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Where engineering excellence meets genuine community commitment.
          Delivering gold-standard electrical solutions across commercial,
          industrial, and residential sectors.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md hover:border-[var(--electric-cyan)]/50 transition-all duration-300 group"
            >
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--electric-cyan)]/30 rounded-tr group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
              <div className="text-2xl font-black font-mono text-[var(--electric-cyan)] mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Technical metadata */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50 uppercase"
        >
          <span>Est. 2009</span>
          <span className="hidden sm:inline">|</span>
          <span>NICEIC Approved</span>
          <span className="hidden sm:inline">|</span>
          <span>London &amp; Home Counties</span>
          <span className="hidden sm:inline">|</span>
          <span>Part P Certified</span>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/30"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 4) * 18}%` }}
            animate={{ y: [0, -25, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors cursor-pointer"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Our Story</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>
    </SectionWrapper>
  );
}
