'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Home, Building2, Factory } from 'lucide-react';

const CTAPowerClient = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ['start end', 'end start'],
  });

  // Circuit trace animation (draw effect)
  const circuitOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const circuitScale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  // Trust stats animation
  const statsY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  // Headline stagger animation
  const headlineY = useTransform(scrollYProgress, [0.2, 0.4], [60, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  // Domain badges animation
  const badgesY = useTransform(scrollYProgress, [0.3, 0.5], [60, 0]);
  const badgesOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);

  const domains = [
    { name: 'Residential', icon: Home },
    { name: 'Commercial', icon: Building2 },
    { name: 'Industrial', icon: Factory },
  ];

  const stats = [
    { number: '25+', label: 'Years Experience' },
    { number: '2,500+', label: 'Projects Completed' },
    { number: '100%', label: 'Safety Compliance' },
  ];

  const TrustStat = ({ number, label, delay }: { number: string; label: string; delay: number }) => {
    const [count, setCount] = useState(0);
    const targetNum = parseInt(number);

    useEffect(() => {
      if (!isInView) return;
      let current = 0;
      const increment = Math.ceil(targetNum / 30);
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          setCount(targetNum);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 50);
      return () => clearInterval(timer);
    }, [isInView]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay, duration: 0.6 }}
        className="text-center"
      >
        <div className="text-3xl font-bold text-[var(--electric-cyan)] font-mono">
          {count}{number.includes('+') ? '+' : '%'}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-wider mt-2">{label}</div>
      </motion.div>
    );
  };

  return (
    <section
      ref={containerRef}
      id="power-vision"
      className="relative min-h-screen py-32 px-4 bg-[var(--deep-slate)] overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Single Electrical Schematic - draws itself on scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side schematic */}
        <motion.svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-64 lg:w-96 h-auto opacity-20"
          viewBox="0 0 200 400"
          fill="none"
          style={{ opacity: circuitOpacity }}
        >
          {/* Main vertical line */}
          <motion.path
            d="M100 0 L100 60"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          {/* Resistor symbol */}
          <motion.path
            d="M100 60 L105 65 L95 75 L105 85 L95 95 L105 105 L95 115 L100 120"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          {/* Continuation */}
          <motion.path
            d="M100 120 L100 180"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          {/* Capacitor symbol */}
          <motion.path
            d="M85 180 L115 180 M85 190 L115 190"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          />
          {/* Branch to ground */}
          <motion.path
            d="M100 190 L100 250 M80 250 L120 250 M88 260 L112 260 M96 270 L104 270"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
          {/* Connection nodes */}
          <motion.circle
            cx="100" cy="60" r="4"
            fill="var(--electric-cyan)"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          />
          <motion.circle
            cx="100" cy="180" r="4"
            fill="var(--electric-cyan)"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />
        </motion.svg>

        {/* Right side schematic */}
        <motion.svg
          className="absolute right-0 top-1/3 w-48 lg:w-72 h-auto opacity-15"
          viewBox="0 0 150 300"
          fill="none"
          style={{ opacity: circuitOpacity }}
        >
          {/* Switch symbol */}
          <motion.path
            d="M75 20 L75 50 M75 50 L95 70"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
          <motion.circle
            cx="75" cy="70" r="3"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />
          {/* Inductor coil */}
          <motion.path
            d="M75 73 L75 90 Q85 95 75 105 Q65 110 75 120 Q85 125 75 135 Q65 140 75 150 L75 170"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          />
          {/* Output line */}
          <motion.path
            d="M75 170 L75 220 L120 220"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
          {/* Arrow indicator */}
          <motion.path
            d="M115 215 L120 220 L115 225"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.8 }}
          />
        </motion.svg>

        {/* Subtle gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--deep-slate)] to-transparent" />
      </div>

      {/* Live Connection Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-8 right-8 lg:top-16 lg:right-16 flex items-center gap-2 text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--electric-cyan)] animate-pulse" />
        <span className="text-slate-400 font-mono text-xs uppercase tracking-wide">Systems Ready</span>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Trust Stats */}
        <motion.div
          style={{ y: statsY, opacity: statsOpacity }}
          className="grid grid-cols-3 gap-8 mb-20 pb-12 border-b border-slate-700/50"
        >
          {stats.map((stat, idx) => (
            <TrustStat key={idx} number={stat.number} label={stat.label} delay={0.1 * idx} />
          ))}
        </motion.div>

        {/* Main Headline */}
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Ready to Power</span>
            <br />
            <span className="bg-gradient-to-r from-[var(--electric-cyan)] to-[var(--amber-warning)] bg-clip-text text-transparent">
              Your Vision?
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From precision engineering to complete installation, we deliver electrical solutions tailored to your domain. Let's build something extraordinary.
          </p>
        </motion.div>

        {/* Domain Badges */}
        <motion.div
          style={{ y: badgesY, opacity: badgesOpacity }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {domains.map((domain, idx) => (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)',
              }}
              className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:border-[var(--electric-cyan)] transition-colors cursor-pointer"
            >
              <span className="text-sm font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <domain.icon size={16} className="text-[var(--electric-cyan)]" />
                {domain.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary Button with Micro-interactions */}
          <motion.div
            whileHover="hover"
            whileTap="tap"
            className="relative group"
          >
            <Link href="/contact">
              <motion.button
                className="relative px-8 py-4 font-semibold uppercase tracking-wider text-sm rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #00f2ff 0%, #00f2ff 100%)',
                  color: '#020617',
                }}
                variants={{
                  hover: {
                    scale: 1.05,
                  },
                  tap: {
                    scale: 0.95,
                  },
                }}
              >
                {/* Shimmer effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  animate={{
                    x: ['0%', '200%'],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />

                {/* Particle burst on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--amber-warning)] rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[var(--amber-warning)] rounded-full"
                />

                {/* Button content */}
                <motion.div
                  className="relative flex items-center gap-2"
                  variants={{
                    hover: {
                      x: 4,
                    },
                  }}
                >
                  Get Started
                  <motion.span
                    variants={{
                      hover: {
                        x: 4,
                      },
                    }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.div>
              </motion.button>
            </Link>

            {/* Glow halo */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-[var(--electric-cyan)] opacity-0 blur-xl -z-10 group-hover:opacity-20 transition-opacity"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Secondary Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/#smart-living">
              <motion.button
                className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:text-[var(--electric-cyan)] transition-colors flex items-center gap-2"
                whileHover={{
                  x: 4,
                }}
              >
                View Our Work
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)] to-transparent"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
};

export function CTAPower() {
  return <CTAPowerClient />;
}
