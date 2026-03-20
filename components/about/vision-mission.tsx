'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Target, ArrowRight } from 'lucide-react';

const visionPoints = [
  { label: 'Innovation', text: 'Pioneering smart electrical systems that set the standard for the next generation of infrastructure.' },
  { label: 'Sustainability', text: 'Leading the transition to energy-efficient electrical solutions that reduce carbon footprint across all sectors.' },
  { label: 'Leadership', text: 'Recognised nationally as the benchmark for excellence in electrical engineering and contractor standards.' },
];

const missionPillars = [
  { title: 'Safety', desc: 'Zero compromise on electrical safety, from initial design to final certification.' },
  { title: 'Quality', desc: 'Workmanship that exceeds British Standards on every single project, without exception.' },
  { title: 'Community', desc: 'Reinvesting in the communities we serve through training, employment and charitable programmes.' },
  { title: 'Innovation', desc: 'Continuously adopting new technologies and methods that deliver better outcomes for clients.' },
];

function TerminalText({ text, trigger }: { text: string; trigger: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-[var(--electric-cyan)] animate-pulse ml-0.5 align-middle" />}
    </span>
  );
}

export function VisionMission() {
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const [visionTriggered, setVisionTriggered] = useState(false);
  const [missionTriggered, setMissionTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });
  const dividerScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  useEffect(() => {
    const visObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisionTriggered(true);
    }, { threshold: 0.4 });
    const misObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setMissionTriggered(true);
    }, { threshold: 0.4 });
    if (visionRef.current) visObs.observe(visionRef.current);
    if (missionRef.current) misObs.observe(missionRef.current);
    return () => { visObs.disconnect(); misObs.disconnect(); };
  }, []);

  return (
    <section id="vision-mission" ref={sectionRef} className="relative py-28 px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 blueprint-grid-fine opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* VISION */}
          <div ref={visionRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl border border-[var(--electric-cyan)]/40 bg-[var(--electric-cyan)]/10 flex items-center justify-center">
                  <Eye size={18} className="text-[var(--electric-cyan)]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/60 mb-0.5">Looking Ahead</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Vision</h2>
                </div>
              </div>

              {/* Terminal statement */}
              <div className="p-6 rounded-xl border border-[var(--electric-cyan)]/30 bg-[var(--electric-cyan)]/5 mb-8 font-mono text-sm leading-relaxed">
                <div className="text-[var(--electric-cyan)]/50 text-xs mb-2 tracking-widest">
                  {'> VISION_2030.md'}
                </div>
                <div className="text-foreground text-base leading-relaxed">
                  <TerminalText
                    text="To be the UK&apos;s most trusted electrical engineering partner — recognised not just for the quality of our installations, but for the lasting positive impact we create in every community we touch."
                    trigger={visionTriggered}
                  />
                </div>
              </div>

              {/* Vision points */}
              <div className="space-y-5">
                {visionPoints.map((point, idx) => (
                  <motion.div
                    key={point.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: false }}
                    className="flex gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[var(--electric-cyan)]/40 transition-colors">
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-[var(--electric-cyan)] transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">{point.label}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{point.text}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Animated divider — visible on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-28 bottom-28 w-px -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-transparent via-[var(--electric-cyan)]/30 to-transparent"
              style={{ scaleY: dividerScale, transformOrigin: 'top', height: '100%' }}
            />
          </div>

          {/* MISSION */}
          <div ref={missionRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: false }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl border border-[var(--amber-warning)]/40 bg-[var(--amber-warning)]/10 flex items-center justify-center">
                  <Target size={18} className="text-[var(--amber-warning)]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--amber-warning)]/60 mb-0.5">Every Day</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
                </div>
              </div>

              {/* Terminal statement */}
              <div className="p-6 rounded-xl border border-[var(--amber-warning)]/30 bg-[var(--amber-warning)]/5 mb-8 font-mono text-sm leading-relaxed">
                <div className="text-[var(--amber-warning)]/50 text-xs mb-2 tracking-widest">
                  {'> MISSION_STATEMENT.md'}
                </div>
                <div className="text-foreground text-base leading-relaxed">
                  <TerminalText
                    text="To deliver safe, reliable, and innovative electrical solutions that exceed client expectations — while building stronger communities through honest work, continuous learning, and unwavering integrity."
                    trigger={missionTriggered}
                  />
                </div>
              </div>

              {/* Mission pillars */}
              <div className="grid grid-cols-2 gap-4">
                {missionPillars.map((pillar, idx) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: false }}
                    className="p-5 rounded-xl border border-border bg-card/40 hover:border-[var(--amber-warning)]/30 hover:bg-[var(--amber-warning)]/5 transition-all duration-300 group"
                  >
                    <div className="font-bold text-foreground mb-2 group-hover:text-[var(--amber-warning)] transition-colors">
                      {pillar.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
