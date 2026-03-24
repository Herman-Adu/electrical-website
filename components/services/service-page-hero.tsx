'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export interface ServicePageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundImageAlt: string;
  cta?: {
    label: string;
    onClick?: () => void;
  };
}

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

export function ServicePageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundImageAlt,
  cta,
}: ServicePageHeroProps) {
  const scrollToContent = () => {
    const next = document.querySelector('section[id]');
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={backgroundImageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60 bg-gradient-to-b from-black/75 via-black/55 to-black/75" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--electric-cyan)]/70">
            {subtitle}
          </span>
          <span className="h-px w-12 bg-[var(--electric-cyan)]/60" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-white"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg lg:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        {cta && (
          <motion.button
            variants={itemVariants}
            onClick={cta.onClick}
            className="px-8 py-4 rounded-2xl bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] font-bold uppercase tracking-widest hover:bg-[var(--electric-cyan)]/20 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/10 transition-all duration-300"
          >
            {cta.label}
          </motion.button>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 hover:text-[var(--electric-cyan)] transition-colors cursor-pointer"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Explore</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
