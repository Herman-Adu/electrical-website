'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Heart, Users, BookOpen, Home, Shield } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const initiatives = [
  { icon: BookOpen, title: 'Apprenticeship Programme', desc: 'Funding and mentoring 4 apprentices per year from local schools and colleges.' },
  { icon: Shield, title: 'Free Safety Checks', desc: 'Providing complimentary electrical safety inspections for elderly and vulnerable residents.' },
  { icon: Home, title: 'Community Hall Upgrades', desc: 'Donating installation services to upgrade electrical systems in local community spaces.' },
  { icon: Users, title: 'Local Employment', desc: 'Over 90% of our team live within 10 miles of our projects — we employ locally, always.' },
];

const communityStats = [
  { value: '500+', label: 'Volunteer Hours Annually' },
  { value: '24', label: 'Apprentices Trained' },
  { value: '£50k+', label: 'Community Investment' },
  { value: '12', label: 'Partner Charities' },
];

/**
 * CommunitySection - Uses SectionWrapper for consistent vertical centering
 * 
 * This component handles ONLY its internal content presentation.
 * All external layout (centering, padding) is handled by SectionWrapper.
 */
export function CommunitySection() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ['start end', 'end start'],
  });

  // Smooth spring for brightness transition
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Brightness transition (darker to lit)
  const brightness = useTransform(smoothProgress, [0.1, 0.35, 0.5], [0.3, 0.7, 1]);
  const saturation = useTransform(smoothProgress, [0.1, 0.35, 0.5], [0.5, 0.8, 1]);

  const imageFilter = useTransform(
    [brightness, saturation] as const,
    ([b, s]: number[]) => `brightness(${b}) saturate(${s})`
  );

  // Ambient glow intensity
  const glowOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  // Background component for SectionWrapper
  const BackgroundLayer = (
    <>
      {/* Main Image with Brightness Transition */}
      <motion.div
        className="relative w-full h-full"
        style={{ filter: imageFilter }}
      >
        <Image
          src="/images/community-hero.jpg"
          alt="Intact Electrical team volunteering in the community"
          fill
          className="object-cover"
          priority
          loading="eager"
        />
      </motion.div>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep-black)] via-[var(--deep-black)]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--deep-black)]/40 via-transparent to-[var(--deep-black)]/40" />

      {/* Ambient Glow Effects */}
      <motion.div
        className="absolute top-[20%] left-[25%] w-64 h-64 rounded-full bg-[var(--electric-cyan)]/10 blur-3xl"
        style={{ opacity: glowOpacity }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[20%] w-48 h-48 rounded-full bg-amber-500/10 blur-2xl"
        style={{ opacity: glowOpacity }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent z-10"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </>
  );

  return (
    <SectionWrapper
      id="community"
      sectionRef={containerRef}
      background={BackgroundLayer}
      variant="full"
    >
      {/* Header Card - Glassmorphic */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-2xl mb-12"
      >
        <div className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <Heart size={14} className="text-[var(--electric-cyan)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
              Giving Back
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-balance leading-tight">
            <span className="bg-gradient-to-r from-amber-400 to-[var(--electric-cyan)] bg-clip-text text-transparent">
              Powered by Community,{' '}
            </span>
            <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-amber-400 bg-clip-text text-transparent">
              Built for People
            </span>
          </h2>
          <p className="text-white/90 text-base md:text-lg leading-relaxed">
            We believe a business is only as strong as the community it serves. That&apos;s
            why we don&apos;t just work in our communities — we actively invest in them.
          </p>
        </div>
      </motion.div>

      {/* Stats Row - Glassmorphic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12"
      >
        {communityStats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[var(--electric-cyan)]/40 transition-all duration-300"
          >
            <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-[var(--electric-cyan)] mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-white/80 leading-tight">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Initiatives Grid - Glassmorphic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {initiatives.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[var(--electric-cyan)]/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl border border-[var(--electric-cyan)]/30 bg-[var(--electric-cyan)]/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[var(--electric-cyan)]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent" />
    </SectionWrapper>
  );
}
