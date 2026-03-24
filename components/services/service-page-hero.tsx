'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, Activity } from 'lucide-react';
import { BlueprintBackground } from '@/components/hero/blueprint-background';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 25, stiffness: 120 },
  },
};

interface ServicePageHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  stats?: Array<{ label: string; value: string }>;
  scrollTargetId?: string;
}

export function ServicePageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundImageAlt = 'Service background',
  stats = [],
  scrollTargetId,
}: ServicePageHeroProps) {
  const scrollToContent = () => {
    const target = scrollTargetId
      ? document.getElementById(scrollTargetId)
      : document.querySelector('section[id]');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-container section-safe-top section-safe-bottom relative min-h-screen w-full flex flex-col items-center justify-center">
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-black/70 dark:via-black/50 dark:to-black/70 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>
      ) : (
        <BlueprintBackground />
      )}

      {/* Animated circuit lines */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1440 900" fill="none">
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
        </svg>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-30 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Status indicator */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-3 border-l-2 border-[var(--electric-cyan)] pl-4">
            <Activity size={14} className="text-[var(--electric-cyan)] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Services // Active
            </span>
          </div>
        </motion.div>

        {/* Subtitle/Eyebrow */}
        {subtitle && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--electric-cyan)]/70">
              {subtitle}
            </span>
            <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
          </motion.div>
        )}

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-white"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg lg:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Stats bar */}
        {stats.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[var(--electric-cyan)]/50 transition-all duration-300 group"
              >
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--electric-cyan)]/30 rounded-tr group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
                <div className="text-2xl font-black font-mono text-[var(--electric-cyan)] mb-1">{stat.value}</div>
                <div className="text-xs text-white/60 font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/30"
            style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 4) * 18}%` }}
            animate={{ y: [0, -25, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/60 hover:text-[var(--electric-cyan)] transition-colors cursor-pointer"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Explore</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
