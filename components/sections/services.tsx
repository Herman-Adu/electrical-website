'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Zap, 
  Building2, 
  Factory, 
  Home,
  Gauge, 
  Wrench,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Commercial Installations',
    description: 'Full electrical infrastructure for offices, retail spaces, and commercial complexes including full lighting design, fit-out wiring, and emergency systems.',
    specs: ['High-rise wiring', 'Emergency systems', 'Data centers', 'LED lighting', 'Fit-out wiring'],
    voltage: '440V',
  },
  {
    icon: Factory,
    title: 'Industrial Systems',
    description: 'Heavy-duty electrical solutions for manufacturing plants, warehouses, and processing facilities with full lighting and high-voltage infrastructure.',
    specs: ['Motor controls', 'PLC systems', 'High-voltage', 'Warehouse lighting', 'Panel boards'],
    voltage: '11kV',
  },
  {
    icon: Zap,
    title: 'Power Distribution',
    description: 'Efficient power distribution networks ensuring reliable electricity flow across facilities, from transformer installation to final circuit protection.',
    specs: ['Transformers', 'Switchgear', 'Load balancing', 'Cable management', 'Sub-metering'],
    voltage: '33kV',
  },
  {
    icon: Home,
    title: 'Residential Services',
    description: 'Complete home electrical solutions from new builds to full rewires, EV charger installation, smart home wiring, and solar-ready consumer units.',
    specs: ['Full rewires', 'EV chargers', 'Smart home', 'Solar-ready', 'Consumer units'],
    voltage: '230V',
  },
  {
    icon: Gauge,
    title: 'Energy Management',
    description: 'Smart energy monitoring and optimisation systems to reduce operational costs, improve efficiency, and meet sustainability compliance targets.',
    specs: ['SCADA', 'Metering', 'Analytics', 'Power factor', 'Compliance'],
    voltage: 'Smart',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Repair',
    description: '24/7 emergency response and scheduled preventive maintenance programmes to keep commercial, industrial, and residential systems operational.',
    specs: ['24/7 support', 'Preventive', 'Upgrades', 'Testing', 'Certification'],
    voltage: 'All',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[var(--deep-slate)] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-5" />
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
          opacity: 0.3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--electric-cyan)]/20 mb-6">
            <div className="w-2 h-2 bg-[var(--electric-cyan)] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Core Services
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Engineering <span className="text-[var(--electric-cyan)]">Excellence</span>
          </h2>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-base lg:text-lg font-light">
            Comprehensive electrical solutions designed for the demands of modern 
            commercial and industrial operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative flex flex-col bg-[var(--slate-dark)]/50 border border-slate-800 rounded-2xl p-6 lg:p-8 hover:border-[var(--electric-cyan)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--electric-cyan)]/5"
            >
              {/* Corner accent — inset to respect border-radius */}
              <div className="absolute top-3 right-3 w-10 h-10 border-t border-r border-[var(--electric-cyan)]/20 rounded-tr-xl group-hover:border-[var(--electric-cyan)]/40 transition-colors" />
              
              {/* Voltage badge */}
              <div className="absolute top-4 right-4">
                <span className="font-mono text-[9px] text-[var(--electric-cyan)]/40 group-hover:text-[var(--electric-cyan)]/80 tracking-widest transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">
                  {service.voltage}
                </span>
              </div>

              {/* Icon */}
              <div className="relative mb-6">
                <service.icon 
                  size={32} 
                  className="text-[var(--electric-cyan)] group-hover:text-white transition-colors" 
                />
                <div className="absolute -inset-2 bg-[var(--electric-cyan)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <h3 className="text-lg lg:text-xl font-bold text-white mb-3 group-hover:text-[var(--electric-cyan)] transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>

              {/* Specs — 2 rows */}
              <div className="flex flex-wrap gap-2 mb-6 min-h-[52px] content-start">
                {service.specs.map((spec) => (
                  <span
                    key={spec}
                    className="font-mono text-[10px] px-2 py-1 bg-[var(--pylon-grey)]/50 text-slate-500 tracking-wider rounded"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Learn More — pinned to bottom */}
              <div className="mt-auto flex items-end justify-between">
                <button className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-[var(--electric-cyan)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--electric-cyan)]/5">
                  <span className="font-medium">Learn More</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Index number */}
                <div className="font-mono text-[40px] font-bold text-slate-800/50 group-hover:text-[var(--electric-cyan)]/40 leading-none select-none transition-colors duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,242,255,0.5)]">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 text-slate-500">
            <div className="h-px w-12 bg-slate-700" />
            <span className="relative font-mono text-xs tracking-widest uppercase overflow-hidden">
              <span className="relative z-10">Need a custom solution?</span>
              {/* Shimmer sweep animation */}
              <span 
                className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"
                style={{ backgroundSize: '200% 100%' }}
              />
            </span>
            <div className="h-px w-12 bg-slate-700" />
          </div>
          
          <div className="mt-6">
            <button className="px-8 py-4 rounded-2xl border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] font-bold uppercase tracking-widest hover:bg-[var(--electric-cyan)]/10 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/10 transition-all duration-300">
              Request Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
