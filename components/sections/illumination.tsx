'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { value: 2400, suffix: '+', label: 'Projects Delivered' },
  { value: 15, suffix: ' Years', label: 'Industry Excellence' },
  { value: 99.7, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Emergency Response' },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, inView]);
  
  return (
    <span className="tabular-nums">
      {value % 1 === 0 ? Math.floor(count).toLocaleString() : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export function Illumination() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const brightness = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.3, 0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <section 
      ref={containerRef}
      className="relative h-[90vh] min-h-[600px] overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Parallax Image with Brightness Reveal */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <motion.div 
          className="relative w-full h-[120%]"
          style={{ filter: brightnessFilter }}
        >
          <Image
            src="/images/warehouse-lighting.jpg"
            alt="Industrial warehouse lighting installation"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep-black)] via-[var(--deep-black)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--deep-black)]/80 via-transparent to-[var(--deep-black)]/40" />
      </motion.div>
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/50 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Electric Pulse Border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent" />
      
      {/* Content */}
      <motion.div 
        className="relative z-20 h-full flex items-center"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-[var(--electric-cyan)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
                Illuminating Excellence
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
              Powering the Spaces
              <br />
              <span className="text-[var(--electric-cyan)]">That Power Industry</span>
            </motion.h2>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl"
            >
              From high-bay LED retrofits to complete industrial lighting systems, 
              we deliver solutions that reduce energy costs by up to 60% while 
              maximizing visibility and safety across your facilities.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <button className="group relative px-8 py-4 rounded-2xl border border-[var(--electric-cyan)]/50 text-white font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:border-[var(--electric-cyan)] hover:shadow-lg hover:shadow-[var(--electric-cyan)]/20 hover:scale-[1.03]">
                <span className="relative z-10 flex items-center gap-3">
                  View Our Projects
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-[var(--electric-cyan)]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          >
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="group relative p-6 rounded-2xl bg-[var(--deep-black)]/60 backdrop-blur-md border border-slate-700/50 hover:border-[var(--electric-cyan)]/40 transition-all duration-300"
              >
                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[var(--electric-cyan)]/30 rounded-tr-lg group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
                
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1 font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  {stat.label}
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--electric-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
}
