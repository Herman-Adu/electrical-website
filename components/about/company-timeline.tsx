'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Zap, Award, Users, Building, Star, Shield } from 'lucide-react';

const milestones = [
  {
    year: '2009',
    title: 'Company Founded',
    desc: 'Started as a two-man domestic electrical team in South London with a commitment to quality over volume.',
    icon: Zap,
    highlight: true,
  },
  {
    year: '2011',
    title: 'NICEIC Approved',
    desc: 'Achieved NICEIC Approved Contractor status, cementing our commitment to the highest safety standards.',
    icon: Shield,
    highlight: true,
  },
  {
    year: '2013',
    title: 'Commercial Expansion',
    desc: 'Expanded into commercial electrical installations, completing our first major office fit-out contract.',
    icon: Building,
    highlight: true,
  },
  {
    year: '2016',
    title: 'Team of 12',
    desc: 'Grew to a team of 12 qualified electricians, taking on larger industrial and commercial projects.',
    icon: Users,
    highlight: false,
  },
  {
    year: '2018',
    title: 'Award Recognised',
    desc: 'Named "Best Electrical Contractor" at the London Trades Awards — a milestone that validated our approach.',
    icon: Award,
    highlight: true,
  },
  {
    year: '2020',
    title: 'Community Programme',
    desc: 'Launched our community reinvestment programme, providing free electrical safety checks for vulnerable residents.',
    icon: Users,
    highlight: false,
  },
  {
    year: '2023',
    title: 'Industrial Division',
    desc: 'Opened our dedicated industrial division, handling high-voltage systems and complex distribution networks.',
    icon: Zap,
    highlight: false,
  },
  {
    year: '2024',
    title: '2,400+ Projects',
    desc: 'Surpassed 2,400 completed projects with a 99.7% client satisfaction rating. The journey continues.',
    icon: Star,
    highlight: true,
  },
];

// Hook that returns 'up' | 'down' based on scroll direction
function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setDirection(currentY > lastY.current ? 'down' : 'up');
      lastY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
}

function TimelineNode({
  milestone,
  index,
  isLast,
  scrollDirection,
}: {
  milestone: (typeof milestones)[0];
  index: number;
  isLast: boolean;
  scrollDirection: 'up' | 'down';
}) {
  const Icon = milestone.icon;
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInViewport = useInView(nodeRef, { once: false, margin: '-35% 0px -35% 0px' });

  // Only highlight nodes with highlight: true when they scroll into view
  const isActive = milestone.highlight && isInViewport;

  // Mobile: single column (all on right), Desktop: alternating
  const isEven = index % 2 === 0;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.02 },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.35, delay: index * 0.02 + 0.06, type: 'spring', stiffness: 180 },
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.4, delay: index * 0.02 + 0.15 },
    },
  };

  const Card = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-40px' }}
      className={`p-4 md:p-6 rounded-lg border transition-all duration-300 group cursor-default w-full md:max-w-sm text-left md:text-inherit ${milestone.highlight
          ? 'border-[var(--electric-cyan)]/50 bg-[var(--electric-cyan)]/5'
          : 'border-border bg-card/40'
        } hover:border-[var(--electric-cyan)]/40 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/10`}
    >
      <div className="font-mono text-xs tracking-widest text-[var(--electric-cyan)]/70 mb-2">{milestone.year}</div>
      <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-tight">{milestone.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.desc}</p>
      {milestone.highlight && (
        <div className="mt-3 flex items-center gap-1.5">
          <Star size={12} className="text-[var(--amber-warning)] fill-[var(--amber-warning)] flex-shrink-0" />
          <span className="font-mono text-[10px] text-[var(--amber-warning)] tracking-widest uppercase">Milestone</span>
        </div>
      )}
    </motion.div>
  );

  /* ── Shared icon node ─────────────────────────────────────────── */
  const IconNode = () => (
    <motion.div
      ref={nodeRef}
      variants={nodeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive
          ? 'border-[var(--electric-cyan)] bg-[var(--electric-cyan)]/20 shadow-lg shadow-[var(--electric-cyan)]/30'
          : 'border-border bg-card'
        }`}
    >
      <Icon
        size={16}
        className={`md:size-[18px] transition-colors duration-500 ${isActive ? 'text-[var(--electric-cyan)]' : 'text-muted-foreground'
          }`}
      />
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--electric-cyan)]/30"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );

  /* ── Connecting line ───────────────────────────────────────────── */
  const ConnectingLine = () =>
    !isLast ? (
      <motion.div
        variants={lineVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="w-px flex-1 min-h-[2rem] bg-gradient-to-b from-border to-[var(--electric-cyan)]/20 origin-top mt-2"
      />
    ) : null;

  return (
    <>
      {/* ── MOBILE layout (<md): left spine, card on right ─────────── */}
      <div className="relative flex gap-3 md:hidden">
        <div className="relative flex flex-col items-center flex-shrink-0">
          <IconNode />
          <ConnectingLine />
        </div>
        <div className="flex-1 pb-2">
          <Card />
        </div>
      </div>

      {/* ── DESKTOP layout (md+): centre spine, alternating cards ───── */}
      <div className="hidden md:flex items-start gap-0">
        {/* Left slot */}
        <div className="w-[calc(50%-2rem)] pr-8 flex flex-col items-end text-right">
          {isEven ? <Card /> : <div className="invisible" />}
        </div>

        {/* Centre spine */}
        <div className="relative flex flex-col items-center w-16 flex-shrink-0">
          <IconNode />
          <ConnectingLine />
        </div>

        {/* Right slot */}
        <div className="w-[calc(50%-2rem)] pl-8 flex flex-col items-start text-left">
          {!isEven ? <Card /> : <div className="invisible" />}
        </div>
      </div>
    </>
  );
}

export function CompanyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollDirection = useScrollDirection();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  return (
    <section id="timeline" ref={sectionRef} className="section-container section-padding bg-background">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

      <div className="section-content max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-6 md:w-8 bg-[var(--electric-cyan)]" />
            <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
              Our Journey
            </span>
            <div className="h-px w-6 md:w-8 bg-[var(--electric-cyan)]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            15 Years of <span className="text-[var(--electric-cyan)]">Powering Progress</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From humble beginnings to industry leadership — every year has been built on the same
            foundation of quality and community.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated progress line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-border/40 -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-[var(--electric-cyan)]/60 to-[var(--electric-cyan)]/20"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Mobile progress line - left side */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/40 md:hidden overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-[var(--electric-cyan)]/60 to-[var(--electric-cyan)]/20"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            {milestones.map((milestone, idx) => (
              <TimelineNode
                key={milestone.year}
                milestone={milestone}
                index={idx}
                isLast={idx === milestones.length - 1}
                scrollDirection={scrollDirection}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
