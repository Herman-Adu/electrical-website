'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Heart, Users, BookOpen, Home } from 'lucide-react';

const initiatives = [
  { icon: BookOpen, title: 'Apprenticeship Programme', desc: 'Funding and mentoring 4 apprentices per year from local schools and colleges.' },
  { icon: Shield, title: 'Free Safety Checks', desc: 'Providing complimentary electrical safety inspections for elderly and vulnerable residents.' },
  { icon: Home, title: 'Community Hall Upgrades', desc: 'Donating installation services to upgrade electrical systems in local community spaces.' },
  { icon: Users, title: 'Local Employment', desc: 'Over 90% of our team live within 10 miles of our projects — we employ locally, always.' },
];

// Local re-import to avoid circular dependency
function Shield({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const communityStats = [
  { value: '500+', label: 'Volunteer Hours Annually' },
  { value: '24', label: 'Apprentices Trained' },
  { value: '£50k+', label: 'Community Investment' },
  { value: '12', label: 'Partner Charities' },
];

export function CommunitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const brightness = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.35, 0.75, 1]);
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.6]);

  return (
    <section
      id="community"
      ref={sectionRef}
      className="relative min-h-[80vh] overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <motion.div className="relative w-full h-[130%]" style={{ filter: brightnessFilter }}>
          <Image
            src="/images/community-hero.jpg"
            alt="Intact Electrical Innovations team volunteering in the community"
            fill
            className="object-cover"
          />
        </motion.div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </motion.div>

      {/* Scan line */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Border accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 py-28 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with glassmorphic backdrop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-16 max-w-2xl mt-8"
          >
            <div className="p-8 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <Heart size={14} className="text-[var(--electric-cyan)]" />
                <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
                  Giving Back
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-5 text-balance">
                <span className="bg-gradient-to-r from-amber-400 to-[var(--electric-cyan)] bg-clip-text text-transparent">
                  Powered by Community,{' '}
                </span>
                <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-amber-400 bg-clip-text text-transparent">
                  Built for People
                </span>
              </h2>
              <p className="text-foreground/90 text-lg leading-relaxed">
                We believe a business is only as strong as the community it serves. That&apos;s
                why we don&apos;t just work in our communities — we actively invest in them.
              </p>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {communityStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-background/70 backdrop-blur-md border border-white/10 hover:border-[var(--electric-cyan)]/40 transition-all duration-300 group"
              >
                <div className="text-3xl font-black font-mono text-[var(--electric-cyan)] mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/90">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Initiatives */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {initiatives.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-background/70 backdrop-blur-md border border-white/10 hover:border-[var(--electric-cyan)]/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl border border-[var(--electric-cyan)]/30 bg-[var(--electric-cyan)]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[var(--electric-cyan)]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground/90 mb-2">{item.title}</h3>
                  <p className="text-xs text-foreground/90 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
