'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

function AnimatedProgressRing({
  value,
  inView,
  size = 120,
  strokeWidth = 8
}: {
  value: number;
  inView: boolean;
  size?: number;
  strokeWidth?: number;
}) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setProgress(value);
        clearInterval(timer);
      } else {
        setProgress(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#00f2ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white font-mono">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

function DimmerSlider({ label, defaultValue, delay, inView }: { label: string; defaultValue: number; delay: number; inView: boolean }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-amber-500/40 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        <span className="text-xs font-mono text-amber-400">{value}%</span>
      </div>
      <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-600/50 to-amber-400/50 blur-sm"
          style={{ width: `${value}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </motion.div>
  );
}

function EnergyGraph({ delay, inView }: { delay: number; inView: boolean }) {
  // kWh values per day
  const data = [3.2, 2.1, 3.8, 2.6, 1.9, 1.6, 2.0];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...data);
  const total = data.reduce((a, b) => a + b, 0).toFixed(1);
  const peakIdx = data.indexOf(maxVal);
  const chartHeight = 80; // Fixed pixel height for bars

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 pb-5 border border-white/20"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-white font-medium">Weekly Usage</span>
        <span className="text-xs font-mono text-[var(--electric-cyan)]">kWh</span>
      </div>

      {/* Total stat */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        viewport={{ once: true }}
        className="mb-3"
      >
        <span className="text-xl font-bold text-white font-mono">{total}</span>
        <span className="text-xs text-white ml-1">kWh this week</span>
      </motion.div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2" style={{ height: chartHeight }}>
        {data.map((value, idx) => {
          const barHeight = Math.round((value / maxVal) * chartHeight);
          const isPeak = idx === peakIdx;
          return (
            <div key={days[idx]} className="flex-1 flex flex-col items-center justify-end h-full">
              {/* kWh label above bar */}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.5 + idx * 0.05 }}
                viewport={{ once: true }}
                className={`text-[9px] font-mono mb-1 ${isPeak ? 'text-amber-400' : 'text-white'}`}
              >
                {value}
              </motion.span>
              {/* Bar */}
              <motion.div
                className={`w-full rounded-t-sm ${isPeak
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-gradient-to-t from-[var(--electric-cyan)]/50 to-[var(--electric-cyan)]'
                  }`}
                initial={{ height: 0 }}
                animate={inView ? { height: barHeight } : { height: 0 }}
                transition={{
                  duration: 0.8,
                  delay: delay + 0.1 * idx,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex justify-between gap-2 mt-2">
        {days.map((d) => (
          <div key={d} className="flex-1 text-center">
            <span className="text-[10px] text-slate-500">{d}</span>
          </div>
        ))}
      </div>

      {/* Divider + footer stat */}
      <div className="mt-3 pt-3 border-t border-slate-700/40 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Avg / day</span>
        <span className="text-xs font-mono text-[var(--electric-cyan)]">
          {(Number(total) / 7).toFixed(1)} kWh
        </span>
      </div>
    </motion.div>
  );
}

export function SmartLiving() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ['start end', 'end start'],
  });

  // Smooth spring for brightness transition
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Before/after brightness transition (lights off to lights on)
  const brightness = useTransform(smoothProgress, [0.1, 0.35, 0.5], [0.15, 0.6, 1]);
  const saturation = useTransform(smoothProgress, [0.1, 0.35, 0.5], [0, 0.5, 1]);

  // Derive a single filter string from brightness only (saturation applied via separate transform)
  const imageFilter = useTransform(
    [brightness, saturation] as const,
    ([b, s]: number[]) => `brightness(${b}) saturate(${s})`
  );

  // Parallax for floating UI elements at different speeds
  const uiY1 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const uiY2 = useTransform(scrollYProgress, [0, 1], ['30%', '-10%']);
  const uiY3 = useTransform(scrollYProgress, [0, 1], ['15%', '-25%']);

  // Content parallax
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Ambient glow intensity
  const glowOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
      <section
      id="smart-living"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[var(--deep-black)] section-padding"
      style={{ position: 'relative' }}
    >
      {/* Background Image with Before/After Brightness Transition */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="relative w-full h-full"
          style={{ filter: imageFilter }}
        >
          <Image
            src="/images/smart-living-interior.jpg"
            alt="Modern smart home interior with professional lighting"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Ambient Glow Effects from Light Fixtures */}
        <motion.div
          className="absolute top-[15%] left-[30%] w-64 h-64 rounded-full bg-amber-500/20 blur-3xl"
          style={{ opacity: glowOpacity }}
        />
        <motion.div
          className="absolute top-[20%] right-[25%] w-48 h-48 rounded-full bg-amber-400/15 blur-2xl"
          style={{ opacity: glowOpacity }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[45%] w-56 h-56 rounded-full bg-amber-300/10 blur-3xl"
          style={{ opacity: glowOpacity }}
        />
      </div>

      {/* Warm Light Scan Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"
          animate={{
            top: ['-10%', '110%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-20 w-full"
        style={{ y: contentY }}
      >
        <div className="section-content w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="h-px w-8 bg-amber-500" />
                <span className="font-mono text-xs tracking-widest uppercase text-amber-400">
                  Smart Living
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Intelligent Lighting
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-[#00f2ff] bg-clip-text text-transparent">
                  For Modern Living
                </span>
              </motion.h2>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <p className="text-lg text-slate-200 leading-relaxed">
                  Transform your home with smart lighting systems that adapt to your
                  lifestyle. Experience perfect ambiance at every moment while
                  significantly reducing your energy footprint.
                </p>
              </motion.div>

              {/* Energy Savings Stat with Animated Progress Ring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <AnimatedProgressRing value={40} inView={inView} />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Energy Savings</h3>
                  <p className="text-white text-sm">
                    Average reduction in residential electricity costs with our smart lighting solutions
                  </p>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <button className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.03]">
                  <span className="relative z-10 flex items-center gap-3">
                    Schedule Consultation
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </motion.div>
            </div>

            {/* Right Side - Floating Smart Home UI Elements */}
            {/* Mobile: natural stacking flow. Desktop: absolute parallax positioning */}
            <div className="flex flex-col gap-4 lg:relative lg:h-[600px] lg:block">

              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="lg:absolute lg:top-1/3 lg:-left-8 lg:w-52"
                style={{ y: uiY3 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white">Status</p>
                      <p className="text-sm font-semibold text-white">All Systems Active</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white">Connected Lights</span>
                      <span className="text-[var(--electric-cyan)] font-mono">24</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white">Scenes Active</span>
                      <span className="text-amber-400 font-mono">Evening</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white">Auto Schedule</span>
                      <span className="text-green-400 font-mono">ON</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Dimmer Controls */}
              <motion.div
                className="space-y-3 lg:absolute lg:top-0 lg:right-0 lg:w-64"
                style={{ y: uiY1 }}
              >
                <DimmerSlider label="Living Room" defaultValue={75} delay={0.5} inView={inView} />
                <DimmerSlider label="Kitchen" defaultValue={90} delay={0.6} inView={inView} />
                <DimmerSlider label="Bedroom" defaultValue={40} delay={0.7} inView={inView} />
              </motion.div>

              {/* Energy Graph */}
              <motion.div
                className="lg:absolute lg:bottom-20 lg:right-8 lg:w-56"
                style={{ y: uiY2 }}
              >
                <EnergyGraph delay={0.8} inView={inView} />
              </motion.div>

              {/* Floating Ambient Indicators - desktop only, hidden on mobile */}
              <motion.div
                className="hidden lg:block absolute top-1/4 right-1/3"
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
              </motion.div>

              <motion.div
                className="hidden lg:block absolute bottom-1/3 left-1/4"
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--electric-cyan)] shadow-lg shadow-[var(--electric-cyan)]/50" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
