'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const words = [
  'Intact', 'Electrical', 'Innovations', 'was', 'founded', 'on', 'a', 'single',
  'belief:', 'that', 'exceptional', 'electrical', 'work', 'changes', 'lives.',
];

const pillars = [
  { num: '01', title: 'Precision Engineering', desc: 'Every circuit, every connection, engineered to exacting standards with zero compromise on quality or safety.' },
  { num: '02', title: 'Community First', desc: 'We reinvest in the communities we serve — from apprenticeship programmes to charitable initiatives that power local growth.' },
  { num: '03', title: 'Trusted Partnership', desc: 'Our clients are partners. We communicate transparently, deliver consistently, and stand behind every job we complete.' },
];

function AnimatedWord({ word, index, inView }: { word: string; index: number; inView: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0.15, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 8 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="inline-block mr-[0.3em]"
    >
      {word}
    </motion.span>
  );
}

export function CompanyIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  const lineLeft = useTransform(scrollYProgress, [0.1, 0.4], ['0%', '100%']);
  const lineRight = useTransform(scrollYProgress, [0.1, 0.4], ['0%', '100%']);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper
      id="company-intro"
      variant="full"
    >
      id="company-intro"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      {/* Animated border lines */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/60 to-transparent"
          style={{ width: lineLeft }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/60 to-transparent"
          style={{ width: lineRight }}
        />
      </div>

      <div className="section-content max-w-6xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="h-px w-8 bg-[var(--electric-cyan)]" />
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
            Our Story
          </span>
        </motion.div>

        {/* Animated headline words */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            {words.map((word, i) => (
              <AnimatedWord key={i} word={word} index={i} inView={inView} />
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: false }}
            className="text-lg text-muted-foreground max-w-3xl leading-relaxed"
          >
            From a two-man operation wiring domestic extensions in South London to a
            multi-disciplinary team delivering complex commercial and industrial
            installations nationwide — our journey has always been guided by
            integrity, craftsmanship, and a deep respect for the communities we
            operate in.
          </motion.p>
        </div>

        {/* Secondary paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: false }}
          className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl"
        >
          <p className="text-muted-foreground leading-relaxed">
            Every project we undertake — whether rewiring a family home or designing
            an industrial power distribution network — receives the same unwavering
            attention to detail. We don&apos;t cut corners. We don&apos;t make promises we
            can&apos;t keep. And we don&apos;t leave a job until it&apos;s right.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our team of fully qualified, NICEIC-approved electricians brings decades
            of combined experience to every project. Backed by industry-leading
            certifications and a culture of continuous improvement, we are the
            trusted choice for clients who demand the very best.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: false }}
              className="relative p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-[var(--electric-cyan)]/40 transition-all duration-400 group"
            >
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />

              <div className="font-mono text-4xl font-bold text-[var(--electric-cyan)]/20 mb-4 group-hover:text-[var(--electric-cyan)]/30 transition-colors">
                {pillar.num}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
