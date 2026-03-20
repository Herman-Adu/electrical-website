'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const features = [
  { title: 'Load Analysis', description: 'Comprehensive power requirement assessment' },
  { title: 'CAD Design', description: 'Precision digital blueprints and schematics' },
  { title: 'Safety Audits', description: 'Thorough safety compliance verification' },
  { title: 'Efficiency Tuning', description: 'Optimized power distribution design' },
];

const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '99.9%', label: 'System Uptime' },
  { value: '24/7', label: 'Support Available' },
  { value: '15+', label: 'Years Experience' },
];

export function Schematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!svgRef.current || !isInView) {
      // Reset animation when scrolling out
      const paths = Array.from(svgRef.current?.querySelectorAll('.schematic-path') ?? []) as SVGPathElement[];
      const dots = Array.from(svgRef.current?.querySelectorAll('.schematic-dot') ?? []) as SVGCircleElement[];
      const labels = Array.from(svgRef.current?.querySelectorAll('.schematic-label') ?? []) as SVGTextElement[];
      gsap.set(paths, { strokeDashoffset: (el) => (el as SVGPathElement).getTotalLength?.() ?? 500 });
      gsap.set(dots, { opacity: 0, scale: 0 });
      gsap.set(labels, { opacity: 0 });
      return;
    }

    const paths = Array.from(svgRef.current.querySelectorAll('.schematic-path')) as SVGPathElement[];
    const dots = Array.from(svgRef.current.querySelectorAll('.schematic-dot')) as SVGCircleElement[];
    const labels = Array.from(svgRef.current.querySelectorAll('.schematic-label')) as SVGTextElement[];

    // Hide everything initially
    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: 'center' });
    gsap.set(labels, { opacity: 0 });

    // Set up path draw-in
    paths.forEach((path) => {
      const length = path.getTotalLength?.() ?? 500;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    });

    const tl = gsap.timeline();

    // Draw paths one by one
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: 0.2,
      ease: 'power2.inOut',
    });

    // Pop in junction dots
    tl.to(dots, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: 'back.out(2)',
    }, '-=0.6');

    // Fade in labels
    tl.to(labels, {
      opacity: 0.7,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power1.out',
    }, '-=0.3');

  }, [isInView]);

  return (
    <SectionWrapper
      id="architecture"
      variant="full"
    >
      {/* Top border gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
          opacity: 0.2,
        }}
      />

      <div className="section-content">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--electric-cyan)]/20 mb-6">
              <div className="w-2 h-2 bg-[var(--electric-cyan)] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
                Our Process
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-6">
              Precision <span className="text-[var(--electric-cyan)]">Architecture</span>
            </h2>

            <p className="text-muted-foreground text-base lg:text-lg font-light leading-relaxed mb-8">
              We don't just install; we engineer. Every Nexgen project begins with a 
              high-fidelity digital twin of your electrical infrastructure, ensuring 
              precision before a single wire is laid.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 
                    size={18} 
                    className="text-[var(--electric-cyan)] mt-0.5 flex-shrink-0" 
                  />
                  <div>
                    <span className="text-foreground font-medium text-sm">{feature.title}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <button className="group flex items-center gap-3 px-6 py-3 bg-[var(--electric-cyan)] text-[var(--deep-slate)] font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] transition-all duration-300">
              Start Your Project
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Schematic SVG Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-2 relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow effect behind SVG */}
              <div className="absolute inset-0 bg-[var(--electric-cyan)]/5 blur-3xl rounded-full" />
              
              <svg
                ref={svgRef}
                viewBox="0 0 500 500"
                className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,255,0.15)]"
              >
                {/* Floor Plan / Building Schematic */}
                <g className="schematic-lines">
                  {/* Outer boundary */}
                  <path
                    className="schematic-path"
                    d="M50 50 H450 V450 H50 Z"
                    stroke="var(--electric-cyan)"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                  
                  {/* Inner walls */}
                  <path
                    className="schematic-path"
                    d="M50 200 H250"
                    stroke="var(--electric-cyan)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    className="schematic-path"
                    d="M250 50 V200"
                    stroke="var(--electric-cyan)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    className="schematic-path"
                    d="M250 200 V350 H450"
                    stroke="var(--electric-cyan)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    className="schematic-path"
                    d="M50 350 H250"
                    stroke="var(--electric-cyan)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.5"
                  />
                  
                  {/* Electrical runs */}
                  <path
                    className="schematic-path"
                    d="M100 100 L100 150 L200 150"
                    stroke="var(--electric-cyan)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    className="schematic-path"
                    d="M350 100 L350 280 L400 280"
                    stroke="var(--electric-cyan)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    className="schematic-path"
                    d="M150 280 L150 400 L300 400"
                    stroke="var(--electric-cyan)"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>

                {/* Junction Points */}
                <g>
                  <circle className="schematic-dot" cx="100" cy="100" r="6" fill="var(--electric-cyan)" />
                  <circle className="schematic-dot" cx="200" cy="150" r="4" fill="var(--electric-cyan)" />
                  <circle className="schematic-dot" cx="350" cy="100" r="6" fill="var(--electric-cyan)" />
                  <circle className="schematic-dot" cx="400" cy="280" r="4" fill="var(--electric-cyan)" />
                  <circle className="schematic-dot" cx="150" cy="280" r="6" fill="var(--electric-cyan)" />
                  <circle className="schematic-dot" cx="300" cy="400" r="4" fill="var(--electric-cyan)" />
                  
                  {/* Main distribution point */}
                  <circle className="schematic-dot" cx="250" cy="200" r="10" fill="none" stroke="var(--electric-cyan)" strokeWidth="2" />
                  <circle className="schematic-dot" cx="250" cy="200" r="5" fill="var(--electric-cyan)" />
                </g>

                {/* Labels */}
                <g fill="var(--electric-cyan)" fontSize="10" fontFamily="monospace">
                  <text className="schematic-label" x="80" y="90">PWR_IN</text>
                  <text className="schematic-label" x="330" y="90">DIST_A</text>
                  <text className="schematic-label" x="130" y="270">DIST_B</text>
                  <text className="schematic-label" x="235" y="220">MAIN</text>
                </g>

                {/* Measurement lines */}
                <g className="measurements" stroke="var(--electric-cyan)" strokeWidth="0.5" opacity="0.3">
                  <line x1="50" y1="40" x2="450" y2="40" />
                  <line x1="50" y1="35" x2="50" y2="45" />
                  <line x1="450" y1="35" x2="450" y2="45" />
                  <text x="230" y="35" fill="var(--electric-cyan)" fontSize="8" fontFamily="monospace">400m</text>
                </g>
              </svg>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[var(--electric-cyan)]/30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[var(--electric-cyan)]/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[var(--electric-cyan)]/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[var(--electric-cyan)]/30" />
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-16 border-t border-border"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-black text-[var(--electric-cyan)] mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
