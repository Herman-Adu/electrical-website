'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BlueprintBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--deep-slate)]">
      {/* Primary Grid - 40px */}
      <div 
        className="absolute inset-0 h-full w-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--electric-cyan) 1px, transparent 1px),
            linear-gradient(to bottom, var(--electric-cyan) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Secondary Grid - 10px (finer detail) */}
      <div 
        className="absolute inset-0 h-full w-full opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--electric-cyan) 1px, transparent 1px),
            linear-gradient(to bottom, var(--electric-cyan) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px'
        }}
      />

      {/* Radial Gradient Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--deep-slate) 70%)'
        }}
      />

      {/* Top gradient fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, var(--deep-slate), transparent)'
        }}
      />

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: 'linear-gradient(to top, var(--deep-slate), transparent)'
        }}
      />

      {/* Animated scan line effect */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: '100vh' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent pointer-events-none"
      />

      {/* Corner technical markers */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[var(--electric-cyan)]/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-[var(--electric-cyan)]/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[var(--electric-cyan)]/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[var(--electric-cyan)]/20" />

      {/* Technical coordinate labels */}
      <div className="absolute top-6 left-20 font-mono text-[8px] text-[var(--electric-cyan)]/30 tracking-widest">
        X:0000 Y:0000
      </div>
      <div className="absolute top-6 right-20 font-mono text-[8px] text-[var(--electric-cyan)]/30 tracking-widest">
        SECTOR_A1
      </div>
    </div>
  );
}
