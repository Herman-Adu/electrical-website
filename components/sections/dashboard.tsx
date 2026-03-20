'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { Zap, Gauge, History, Share2, Activity, Shield } from 'lucide-react';

interface MetricProps {
  label: string;
  targetValue: number;
  unit: string;
  icon: React.ElementType;
  delay?: number;
}

function EnergyMetric({ label, targetValue, unit, icon: Icon, delay = 0 }: MetricProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!countRef.current) return;

    if (!isInView) {
      // Reset when scrolling out
      countRef.current.textContent = '0';
      return;
    }

    // Animate when scrolling in
    const target = { value: 0 };
    gsap.to(target, {
      value: targetValue,
      duration: 2,
      delay: delay,
      ease: 'power2.out',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(target.value).toString();
        }
      },
    });
  }, [isInView, targetValue, delay]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="group bg-card border border-border p-6 hover:border-[var(--electric-cyan)]/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size={18} className="text-[var(--electric-cyan)]/60 group-hover:text-[var(--electric-cyan)] transition-colors" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-4">
        <span 
          ref={countRef} 
          className="text-4xl lg:text-5xl font-black text-foreground"
        >
          0
        </span>
        <span className="text-[var(--electric-cyan)] font-mono text-sm uppercase">
          {unit}
        </span>
      </div>

      {/* Live indicator bar */}
      <div className="h-1 w-full bg-slate-800 overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--electric-cyan)] to-transparent"
        />
      </div>
    </motion.div>
  );
}

// System Terminal Component
const LOG_MESSAGES = [
  'CHECKING PHASE_A VOLTAGE... [OK]',
  'SYNCING GRID_ID: NEX-7729...',
  'THERMAL SENSOR 04: 42C [STABLE]',
  'ENCRYPTING DATA UPLINK... [AES-256]',
  'LOAD BALANCER: OPTIMIZING...',
  'SAFETY PROTOCOL 12-B: ACTIVE',
  'ISOLATING HARMONIC DISTORTION...',
  'BACKUP GENERATOR: STANDBY',
  'POWER FACTOR: 0.98 [OPTIMAL]',
  'GRID FREQUENCY: 50.02Hz [NOMINAL]',
];

function SystemTerminal() {
  const [logs, setLogs] = useState<{ text: string; time: string; id: number }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true });
  const logIdRef = useRef(0);

  // Initialize logs only on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    logIdRef.current = 1;
    setLogs([{ text: '> SYSTEM BOOT... INITIALIZING', time: new Date().toLocaleTimeString(), id: 0 }]);
  }, []);

  useEffect(() => {
    if (!isMounted || !isInView) return;

    const interval = setInterval(() => {
      const newMessage = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const time = new Date().toLocaleTimeString();
      const id = logIdRef.current++;
      setLogs((prev) => [...prev.slice(-5), { text: `> ${newMessage}`, time, id }]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isInView, isMounted]);

  return (
    <motion.div
      ref={terminalRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      viewport={{ once: true }}
      className="bg-card border border-border p-4 font-mono overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Diagnostics_Console_v4.2.1
        </span>
      </div>

      {/* Log Output */}
      <div className="h-36 overflow-hidden flex flex-col justify-end relative">
        <div className="text-xs text-slate-600 font-mono" style={{ display: isMounted ? 'none' : 'block' }}>
          &gt; AWAITING SYSTEM BOOT...
        </div>
        <div style={{ display: isMounted ? 'block' : 'none' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-xs mb-1 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <span className="text-slate-700 text-[10px]">[{log.time}]</span>
              <span className="text-[var(--electric-cyan)]/70 hover:text-[var(--electric-cyan)] transition-colors">
                {log.text}
              </span>
            </div>
          ))}
        </div>

        {/* Scan line effect */}
        <motion.div
          animate={{ y: [0, 144, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-[var(--electric-cyan)]/5 to-transparent pointer-events-none"
        />
      </div>

      {/* Terminal Footer */}
      <div className="mt-4 pt-2 border-t border-border/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] text-muted-foreground tracking-widest">LIVE</span>
        </div>
        <span className="text-[9px] text-muted-foreground/60 tracking-widest">
          ENCRYPTION: AES-256 // MQTT_TLS
        </span>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const metrics = [
    { label: 'Active Load', targetValue: 482, unit: 'kW', icon: Zap },
    { label: 'Grid Stability', targetValue: 99, unit: '%', icon: Gauge },
    { label: 'Reactive Power', targetValue: 12, unit: 'kVAR', icon: History },
    { label: 'Assets Online', targetValue: 142, unit: 'Nodes', icon: Share2 },
  ];

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-3" />
      
      {/* Top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
          opacity: 0.2,
        }}
      />

      <div className="section-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--electric-cyan)]/20 mb-6">
                <Activity size={12} className="text-[var(--electric-cyan)] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
                  Live Monitoring
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4">
                Grid <span className="text-[var(--electric-cyan)]">Intelligence</span>
              </h2>
              
              <p className="text-muted-foreground max-w-xl text-base lg:text-lg font-light">
                Real-time monitoring of Nexgen installed assets across the industrial sector. 
                Efficiency is not a goal; it is a constant variable.
              </p>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30">
                <Shield size={14} className="text-emerald-500" />
                <span className="font-mono text-[10px] text-emerald-500 tracking-widest">ALL SYSTEMS NOMINAL</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {metrics.map((metric, index) => (
            <EnergyMetric
              key={metric.label}
              {...metric}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Terminal Section */}
        <SystemTerminal />

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border/50"
        >
          <div className="font-mono text-[9px] text-muted-foreground/60 tracking-widest flex flex-wrap justify-center gap-4">
            <span>PROTOCOL: IEC 61850</span>
            <span className="hidden sm:inline">|</span>
            <span>LATENCY: 12ms</span>
            <span className="hidden sm:inline">|</span>
            <span>UPTIME: 99.97%</span>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${
                  i <= 4 ? 'bg-[var(--electric-cyan)]/40' : 'bg-slate-700'
                }`} 
              />
            ))}
            <span className="font-mono text-[9px] text-slate-600 ml-2">SIGNAL: STRONG</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
