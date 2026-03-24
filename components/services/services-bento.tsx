'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
  Building2,
  Factory,
  Zap,
  Home,
  Gauge,
  Wrench,
  ArrowRight,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Activity,
  Lightbulb,
  ClipboardCheck,
  Wifi,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ServiceSpec {
  label: string;
  value: string;
}

// ─── Animation Variants ────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 28,
      stiffness: 110,
      delay,
    },
  }),
};

// ─── Window Decoration ─────────────────────────────────────────────────────

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5 mb-4" aria-hidden>
      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
    </div>
  );
}

// ─── Card Shell ────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = '',
  delay = 0,
  glowOnHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glowOnHover?: boolean;
}) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={glowOnHover ? { scale: 1.015 } : undefined}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-card/60 backdrop-blur-md
        ${glowOnHover ? 'hover:border-[var(--electric-cyan)]/30 hover:shadow-xl hover:shadow-[var(--electric-cyan)]/8' : ''}
        transition-all duration-500 ${className}`}
    >
      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--electric-cyan)]/25 pointer-events-none z-20 group-hover:border-[var(--electric-cyan)]/50 transition-colors" aria-hidden />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--electric-cyan)]/25 pointer-events-none z-20 group-hover:border-[var(--electric-cyan)]/50 transition-colors" aria-hidden />
      {children}
    </motion.div>
  );
}

// ─── Card A: Image Hero Card ────────────────────────────────────────────────

function ImageHeroCard({
  title,
  description,
  image,
  voltage,
  icon: Icon,
  specs,
  delay,
  index,
}: {
  title: string;
  description: string;
  image: string;
  voltage: string;
  icon: React.ElementType;
  specs: string[];
  delay: number;
  index: number;
}) {
  return (
    <GlassCard delay={delay} className="flex flex-col h-full min-h-[320px]">
      {/* Image */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />
        {/* Voltage badge */}
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-[var(--electric-cyan)]/30">
          <span className="font-mono text-[10px] tracking-widest text-[var(--electric-cyan)]">{voltage}</span>
        </div>
        {/* Index number */}
        <div className="absolute bottom-3 left-4 font-mono text-4xl font-bold text-white/10 select-none leading-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <WindowDots />
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} className="text-[var(--electric-cyan)] flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
            {title}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specs.map((spec) => (
            <span key={spec} className="font-mono text-[9px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground tracking-wider">
              {spec}
            </span>
          ))}
        </div>
        <button className="group/btn flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors">
          <span className="font-medium">Learn More</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Card B: Text Detail Card ──────────────────────────────────────────────

function TextDetailCard({
  title,
  description,
  icon: Icon,
  specs,
  voltage,
  delay,
  index,
  accentColor = 'cyan',
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  specs: ServiceSpec[];
  voltage: string;
  delay: number;
  index: number;
  accentColor?: 'cyan' | 'amber';
}) {
  const isAmber = accentColor === 'amber';
  const accentClass = isAmber ? 'text-[var(--amber-warning)]' : 'text-[var(--electric-cyan)]';
  const borderClass = isAmber ? 'border-[var(--amber-warning)]/20' : 'border-[var(--electric-cyan)]/20';

  return (
    <GlassCard delay={delay} className="flex flex-col h-full p-5">
      <WindowDots />
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={20} className={`${accentClass} flex-shrink-0`} />
          <span className={`font-mono text-[10px] tracking-widest uppercase ${accentClass} opacity-70`}>
            {voltage}
          </span>
        </div>
        <div className="font-mono text-5xl font-bold text-muted/20 select-none leading-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-[var(--electric-cyan)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{description}</p>

      {/* Spec rows */}
      <div className={`border-t ${borderClass} pt-4 space-y-2`}>
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">{spec.label}</span>
            <span className={`font-mono text-[11px] font-bold ${accentClass}`}>{spec.value}</span>
          </div>
        ))}
      </div>

      <button className="mt-5 group/btn flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors">
        <span className="font-medium">Explore</span>
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </GlassCard>
  );
}

// ─── Card C: Stats Card ────────────────────────────────────────────────────

function StatsCard({ delay }: { delay: number }) {
  const stats = [
    { value: '15+', label: 'Years Experience', icon: Shield },
    { value: '2,400+', label: 'Projects Done', icon: CheckCircle2 },
    { value: '99.7%', label: 'Satisfaction', icon: Activity },
    { value: '24/7', label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <GlassCard delay={delay} className="flex flex-col p-5 h-full">
      <WindowDots />
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
        <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
          Performance Metrics
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col p-3 rounded-xl bg-muted/30 border border-white/5 hover:border-[var(--electric-cyan)]/20 transition-colors"
          >
            <Icon size={14} className="text-[var(--electric-cyan)]/60 mb-2" />
            <span className="font-mono text-2xl font-black text-[var(--electric-cyan)] leading-none mb-1">{value}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Card D: Live Diagnostic / Interactive Card ────────────────────────────

function DiagnosticCard({ delay }: { delay: number }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const messages = [
    '> Scanning distribution bus...',
    '> Voltage: NOMINAL [240V]',
    '> Thermal: Within tolerance',
    '> Load balance: 84.1%',
    '> Status: ALL SYSTEMS GO',
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    let charIdx = 0;
    const fullText = messages.join('\n');

    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayText(fullText.substring(0, charIdx + 1));
        charIdx++;
      } else if (!isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          setDisplayText('');
          charIdx = 0;
          setIsComplete(false);
        }, 2500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isMounted, isComplete]);

  return (
    <GlassCard delay={delay} className="flex flex-col p-5 h-full">
      <WindowDots />
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
        <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
          Live Diagnostics
        </span>
      </div>

      <h3 className="text-lg font-bold text-card-foreground mb-2">System Status Feed</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        Continuous health monitoring with real-time fault detection across all active installations.
      </p>

      <div className="flex-1 min-h-[100px] p-3 rounded-xl bg-black/40 border border-[var(--electric-cyan)]/10 font-mono text-[11px] leading-5 overflow-hidden hover:border-[var(--electric-cyan)]/25 transition-colors">
        <div className="text-[var(--electric-cyan)]/80 whitespace-pre-line">{displayText}</div>
        {isComplete && (
          <span className="inline-block w-2 h-3 bg-[var(--electric-cyan)] animate-pulse ml-0.5" />
        )}
        {!isComplete && displayText.length > 0 && (
          <span className="inline-block w-1.5 h-3 bg-[var(--electric-cyan)]/70 animate-pulse ml-0.5" />
        )}
      </div>

      <button className="mt-4 w-full py-2.5 px-4 rounded-lg bg-transparent border border-[var(--electric-cyan)]/20 text-xs font-mono tracking-widest uppercase text-[var(--electric-cyan)]/70 hover:border-[var(--electric-cyan)]/60 hover:text-[var(--electric-cyan)] hover:shadow-sm hover:shadow-[var(--electric-cyan)]/10 transition-all duration-300">
        View Full Report
      </button>
    </GlassCard>
  );
}

// ─── Card E: Wide CTA Card ─────────────────────────────────────────────────

function CTACard({ delay }: { delay: number }) {
  return (
    <GlassCard delay={delay} glowOnHover={false} className="relative overflow-hidden p-6 sm:p-8">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric-cyan)]/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1">
          <WindowDots />
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-[var(--electric-cyan)]" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
              Custom Solutions
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-card-foreground mb-2 text-balance">
            Need a Bespoke Electrical Solution?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Every project is unique. Our engineering team provides tailored consultations, site surveys, and full-scope project proposals — from concept to commissioning.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <a
            href="/contact"
            className="px-6 py-3 rounded-xl bg-[var(--electric-cyan)] text-primary-foreground font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[var(--electric-cyan)]/30 hover:scale-[1.03] transition-all duration-300"
          >
            Request Consultation
          </a>
          <a
            href="/#services"
            className="px-6 py-3 rounded-xl border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] font-medium text-sm tracking-wide hover:bg-[var(--electric-cyan)]/10 hover:border-[var(--electric-cyan)]/50 transition-all duration-300"
          >
            View Portfolio
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Card F: Emergency Response Card (Wide Image) ──────────────────────────

function EmergencyCard({ delay }: { delay: number }) {
  return (
    <GlassCard delay={delay} className="relative overflow-hidden min-h-[280px] sm:min-h-[320px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/services-emergency.jpg"
          alt="24/7 Emergency electrical response"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </div>

      {/* Voltage badge */}
      <div className="absolute top-12 right-5 z-10 px-2 py-1 rounded bg-[var(--amber-warning)]/20 backdrop-blur-sm border border-[var(--amber-warning)]/40">
        <span className="font-mono text-[10px] tracking-widest text-[var(--amber-warning)]">24/7</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--amber-warning)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--amber-warning)]/80">
            Emergency Response
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Always On Call</h3>
        <p className="text-xs text-white/70 leading-relaxed mb-4">
          Round-the-clock emergency fault diagnosis and rapid response for critical electrical failures.
        </p>
        <button className="flex items-center gap-2 text-sm text-[var(--amber-warning)] hover:text-white transition-colors">
          <span className="font-medium">Get Emergency Help</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Main Bento Grid ────────────────────────────────────────────────────────

const commercialSpecs: ServiceSpec[] = [
  { label: 'Max Voltage', value: '440V' },
  { label: 'Systems', value: 'High-Rise + Retail' },
  { label: 'Response', value: '< 2h' },
];

const industrialSpecs: ServiceSpec[] = [
  { label: 'Max Voltage', value: '11kV' },
  { label: 'Systems', value: 'PLC + Motor Ctrl' },
  { label: 'Uptime', value: '99.9%' },
];

const powerSpecs: ServiceSpec[] = [
  { label: 'Max Voltage', value: '33kV' },
  { label: 'Coverage', value: 'Multi-Zone' },
  { label: 'Monitoring', value: 'SCADA' },
];

const residentialSpecs: ServiceSpec[] = [
  { label: 'Voltage', value: '230V' },
  { label: 'Smart', value: 'EV + Solar Ready' },
  { label: 'Cert', value: 'Part P' },
];

const lightingSpecs: ServiceSpec[] = [
  { label: 'Technology', value: 'LED' },
  { label: 'Energy Saving', value: 'Up to 70%' },
  { label: 'Warranty', value: '5 Years' },
];

const testingSpecs: ServiceSpec[] = [
  { label: 'Standards', value: 'BS 7909 + NICEIC' },
  { label: 'Coverage', value: 'Full Scope' },
  { label: 'Reports', value: 'Certified' },
];

const dataCommunicationsSpecs: ServiceSpec[] = [
  { label: 'Cabling', value: 'Cat6A + Fiber' },
  { label: 'Standards', value: 'ISO/IEC 11801' },
  { label: 'Support', value: '10 Years' },
];

export function ServicesBento() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="services-grid"
      ref={sectionRef}
      className="section-container section-padding bg-background"
      aria-label="Our Services"
    >
      {/* Background */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
          opacity: 0.2,
        }}
      />

      <div className="section-content">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--electric-cyan)]/20 mb-6 rounded-full">
            <div className="w-2 h-2 bg-[var(--electric-cyan)] animate-pulse rounded-full" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Service Catalogue
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4 text-balance">
            Full Spectrum{' '}
            <span className="text-[var(--electric-cyan)]">Electrical</span> Solutions
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-base font-light leading-relaxed">
            From 230V residential circuits to 33kV industrial infrastructure — every project engineered with precision, delivered on time.
          </p>
        </motion.div>

        {/*
          ═══════════════════════════════════════════
          BENTO GRID LAYOUT
          ═══════════════════════════════════════════
          Mobile  (< sm):  1 column
          Tablet  (sm–lg): 2 columns
          Desktop (≥ lg):  4 columns

          Row 1: Commercial (2col wide) | Industrial (1col) | Stats (1col)
          Row 2: Emergency  (1col)      | Power Dist (1col) | Diagnostics (2col wide)
          Row 3: Residential (1col)     | Maintenance (1col) | Wide CTA (2col)
          ═══════════════════════════════════════════
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-auto">

          {/* Row 1 */}

          {/* Commercial — lg: col-span-2 */}
          <div className="sm:col-span-2 lg:col-span-2">
            <ImageHeroCard
              title="Commercial Installations"
              description="Full electrical infrastructure for offices, retail spaces, and commercial complexes — including lighting design, fit-out wiring, data cabling, and emergency systems to BS 7671 standards."
              image="/images/services-commercial.jpg"
              voltage="440V"
              icon={Building2}
              specs={['High-rise wiring', 'Emergency systems', 'Data centres', 'LED lighting', 'Fit-out']}
              delay={0}
              index={0}
            />
          </div>

          {/* Industrial — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Industrial Systems"
              description="Heavy-duty electrical for manufacturing plants, warehouses, and processing facilities with high-voltage infrastructure and motor control."
              icon={Factory}
              specs={industrialSpecs}
              voltage="11kV"
              delay={0.08}
              index={1}
            />
          </div>

          {/* Stats — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <StatsCard delay={0.16} />
          </div>

          {/* Row 2 */}

          {/* Emergency — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <EmergencyCard delay={0.24} />
          </div>

          {/* Power Distribution — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Power Distribution"
              description="Efficient power networks ensuring reliable flow across facilities — from transformer installation to final circuit protection and sub-metering."
              icon={Zap}
              specs={powerSpecs}
              voltage="33kV"
              delay={0.32}
              index={2}
            />
          </div>

          {/* Diagnostics — lg: col-span-2 */}
          <div className="sm:col-span-2 lg:col-span-2">
            <DiagnosticCard delay={0.4} />
          </div>

          {/* Row 3 */}

          {/* Lighting Installation — lg: col-span-2 (featured) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <GlassCard delay={0.48} className="relative overflow-hidden h-full min-h-[300px]">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/services-lighting.jpg"
                  alt="Commercial LED lighting installation"
                  fill
                  className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/70 to-card/30" />
              </div>

              <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between">
                <div>
                  <WindowDots />
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={18} className="text-[var(--electric-cyan)]" />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
                      Lighting Installation
                    </span>
                    <div className="ml-auto flex gap-2">
                      <div className="px-2 py-0.5 rounded border border-green-500/25 bg-green-500/10">
                        <span className="font-mono text-[9px] tracking-widest text-green-400">ECO</span>
                      </div>
                      <div className="px-2 py-0.5 rounded border border-[var(--electric-cyan)]/25 bg-[var(--electric-cyan)]/5">
                        <span className="font-mono text-[9px] tracking-widest text-[var(--electric-cyan)]">LED</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                    High-Performance Commercial Lighting
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-lg">
                    Energy-efficient LED lighting solutions for offices, warehouses, retail spaces, and industrial facilities. 
                    Reduce running costs by up to 70% with professional design, installation, and smart controls — 
                    delivering superior illumination with minimal environmental impact.
                  </p>
                </div>

                {/* Key benefits */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {['Office Spaces', 'Warehouses', 'Retail', 'Industrial', 'Emergency Lighting', 'Controls'].map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] px-2 py-1 rounded bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/20 text-[var(--electric-cyan)]/80 tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats row */}
                  <div className="flex flex-wrap gap-6 pt-3 border-t border-[var(--electric-cyan)]/10">
                    <div className="flex flex-col">
                      <span className="font-mono text-xl font-black text-[var(--electric-cyan)] leading-none">70%</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Energy Savings</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xl font-black text-[var(--electric-cyan)] leading-none">50K+</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Hour Lifespan</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xl font-black text-[var(--electric-cyan)] leading-none">5yr</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Warranty</span>
                    </div>
                    <button className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors">
                      <span className="font-medium">Explore Lighting</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Residential — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Residential Services"
              description="Complete home electrical — new builds, full rewires, EV charger installation, smart home wiring, and solar-ready consumer units."
              icon={Home}
              specs={residentialSpecs}
              voltage="230V"
              delay={0.52}
              index={4}
            />
          </div>

          {/* Maintenance — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Maintenance & Repair"
              description="24/7 emergency response and scheduled preventive maintenance to keep all systems running — with full testing, certification, and NICEIC compliance."
              icon={Wrench}
              specs={[
                { label: 'Availability', value: '24/7' },
                { label: 'Response SLA', value: '< 1h' },
                { label: 'Compliance', value: 'NICEIC' },
              ]}
              voltage="All V"
              delay={0.56}
              index={5}
              accentColor="amber"
            />
          </div>

          {/* Energy Management — lg: col-span-2 */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="h-full">
              <GlassCard delay={0.64} className="relative overflow-hidden h-full min-h-[260px]">
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/services-industrial.jpg"
                    alt="Energy management systems"
                    fill
                    className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40" />
                </div>

                <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    <WindowDots />
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge size={18} className="text-[var(--electric-cyan)]" />
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--electric-cyan)]/70">
                        Energy Management
                      </span>
                      <div className="ml-auto px-2 py-0.5 rounded border border-[var(--electric-cyan)]/25 bg-[var(--electric-cyan)]/5">
                        <span className="font-mono text-[9px] tracking-widest text-[var(--electric-cyan)]">SMART</span>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                      Intelligent Energy Optimisation
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">
                      Smart monitoring and optimisation systems that reduce operational costs, improve efficiency, and meet sustainability compliance targets through SCADA integration and real-time analytics.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    {['SCADA', 'Metering', 'Analytics', 'Power Factor', 'Compliance'].map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] px-2 py-1 rounded bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/20 text-[var(--electric-cyan)]/80 tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                    <button className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors">
                      <span className="font-medium">Learn More</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Testing & Certification — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Testing & Certification"
              description="Comprehensive electrical testing and compliance certification — EICR reports, PAT testing, periodic inspections, and all required compliance documentation."
              icon={ClipboardCheck}
              specs={testingSpecs}
              voltage="All V"
              delay={0.68}
              index={6}
            />
          </div>

          {/* Data & Communications — lg: col-span-1 */}
          <div className="sm:col-span-1 lg:col-span-1">
            <TextDetailCard
              title="Data & Communications"
              description="Structured cabling infrastructure, fiber optics, network installations, and full data centre solutions — future-proofed for growth with enterprise-grade support."
              icon={Wifi}
              specs={dataCommunicationsSpecs}
              voltage="Network"
              delay={0.72}
              index={7}
            />
          </div>

          {/* Row 4: Full-width CTA */}
          <div className="sm:col-span-2 lg:col-span-4">
            <CTACard delay={0.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
