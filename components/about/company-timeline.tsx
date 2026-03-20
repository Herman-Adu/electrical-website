'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
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
    highlight: false,
  },
  {
    year: '2013',
    title: 'Commercial Expansion',
    desc: 'Expanded into commercial electrical installations, completing our first major office fit-out contract.',
    icon: Building,
    highlight: false,
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
  const isEven = index % 2 === 0;

  // When scrolling down: slide in from outside edge → centre
  // When scrolling up: reverse — slide back out to outside edge
  const exitX = isEven ? -60 : 60;

  const cardVariants = {
    hidden: (dir: 'up' | 'down') => ({
      opacity: 0,
      x: dir === 'down' ? exitX : 0,
      y: dir === 'down' ? 0 : -20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 },
    },
    exit: (dir: 'up' | 'down') => ({
      opacity: 0,
      x: dir === 'up' ? exitX : 0,
      y: dir === 'up' ? 0 : 20,
      transition: { duration: 0.35, ease: 'easeIn' },
    }),
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: index * 0.04 + 0.1, type: 'spring', stiffness: 200 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.25 } },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.45, delay: index * 0.04 + 0.25 },
    },
    exit: { scaleY: 0, transition: { duration: 0.25 } },
  };

  const Card = ({ side }: { side: 'left' | 'right' }) => (
    <motion.div
      custom={scrollDirection}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, margin: '-60px' }}
      className={`p-6 rounded-xl border transition-all duration-300 group cursor-default max-w-sm ${
        side === 'left' ? 'ml-auto' : ''
      } ${
        milestone.highlight
          ? 'border-[var(--electric-cyan)]/50 bg-[var(--electric-cyan)]/5'
          : 'border-border bg-card/40'
      } hover:border-[var(--electric-cyan)]/40 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/10`}
    >
      <div className="font-mono text-xs tracking-widest text-[var(--electric-cyan)]/70 mb-2">{milestone.year}</div>
      <h3 className="text-lg font-bold text-foreground mb-2">{milestone.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.desc}</p>
      {milestone.highlight && (
        <div className={`mt-3 flex items-center gap-1.5 ${side === 'left' ? 'justify-end' : ''}`}>
          <Star size={12} className="text-[var(--amber-warning)] fill-[var(--amber-warning)]" />
          <span className="font-mono text-[10px] text-[var(--amber-warning)] tracking-widest uppercase">Milestone</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="relative flex items-start gap-0">
      {/* Left content — even items */}
      <div className={`w-[calc(50%-2rem)] pr-8 ${isEven ? 'flex flex-col items-end text-right' : 'invisible'}`}>
        {isEven && <Card side="left" />}
      </div>

      {/* Centre spine */}
      <div className="relative flex flex-col items-center w-16 flex-shrink-0">
        <motion.div
          variants={nodeVariants}
          custom={scrollDirection}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: false }}
          className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
            milestone.highlight
              ? 'border-[var(--electric-cyan)] bg-[var(--electric-cyan)]/20 shadow-lg shadow-[var(--electric-cyan)]/30'
              : 'border-border bg-card'
          }`}
        >
          <Icon
            size={18}
            className={milestone.highlight ? 'text-[var(--electric-cyan)]' : 'text-muted-foreground'}
          />
          {milestone.highlight && (
            <motion.div
              className="absolute inset-0 rounded-full border border-[var(--electric-cyan)]/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {!isLast && (
          <motion.div
            variants={lineVariants}
            custom={scrollDirection}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false }}
            className="w-px flex-1 min-h-[3rem] bg-gradient-to-b from-border to-[var(--electric-cyan)]/20 origin-top mt-2"
          />
        )}
      </div>

      {/* Right content — odd items */}
      <div className={`w-[calc(50%-2rem)] pl-8 ${!isEven ? 'flex flex-col items-start text-left' : 'invisible'}`}>
        {!isEven && <Card side="right" />}
      </div>
    </div>
  );
}

export function CompanyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollDirection = useScrollDirection();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-28 px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[var(--electric-cyan)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">Our Journey</span>
            <div className="h-px w-8 bg-[var(--electric-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            15 Years of <span className="text-[var(--electric-cyan)]">Powering Progress</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From humble beginnings to industry leadership — every year has been built on the
            same foundation of quality and community.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated progress line */}
          <div className="absolute left-1/2 top-6 bottom-6 w-px bg-border/40 -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-[var(--electric-cyan)]/60 to-[var(--electric-cyan)]/20"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-8">
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
