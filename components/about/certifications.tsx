'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Award, Star } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const certs = [
  { abbr: 'NICEIC', name: 'Approved Contractor', category: 'Safety', level: 'Gold', featured: true },
  { abbr: 'Part P', name: 'Certified Competent Person', category: 'Compliance', level: 'Certified', featured: false },
  { abbr: 'NAPIT', name: 'Registered Member', category: 'Industry Body', level: 'Member', featured: false },
  { abbr: 'ECS', name: 'Gold Card Holder', category: 'Skills', level: 'Gold', featured: true },
  { abbr: 'CHAS', name: 'Accredited Contractor', category: 'Health & Safety', level: 'Accredited', featured: false },
  { abbr: '18th Ed', name: 'BS 7671 Qualified', category: 'Standards', level: 'Qualified', featured: false },
  { abbr: 'ISO 9001', name: 'Quality Management', category: 'Quality', level: 'Certified', featured: true },
  { abbr: 'PAT', name: 'Portable Appliance Testing', category: 'Testing', level: 'Approved', featured: false },
  { abbr: 'IPAF', name: 'Powered Access Licensed', category: 'Safety', level: 'Licensed', featured: false },
];

export function Certifications() {
  return (
    <SectionWrapper
      id="certifications"
      variant="full"
    > id="certifications" className="section-container section-padding bg-background">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/30 to-transparent" />

      <div className="section-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield size={14} className="text-[var(--electric-cyan)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
              Verified & Approved
            </span>
            <Shield size={14} className="text-[var(--electric-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our <span className="text-[var(--electric-cyan)]">Certifications</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every accreditation earned through rigorous examination and continuous professional development.
            These aren&apos;t badges — they&apos;re proof of commitment.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.abbr}
              initial={{ opacity: 0, rotateY: -15, y: 20 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              viewport={{ once: false }}
              className={`relative group rounded-2xl border p-6 transition-all duration-300 cursor-default overflow-hidden ${
                cert.featured
                  ? 'border-[var(--electric-cyan)]/50 bg-[var(--electric-cyan)]/8 hover:shadow-xl hover:shadow-[var(--electric-cyan)]/20'
                  : 'border-border bg-card/40 hover:border-[var(--electric-cyan)]/30 hover:bg-[var(--electric-cyan)]/5'
              }`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/5 to-transparent" />

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />

              {/* Featured star */}
              {cert.featured && (
                <div className="absolute top-3 right-3">
                  <Star size={12} className="text-[var(--amber-warning)] fill-[var(--amber-warning)]" />
                </div>
              )}

              {/* Cert abbreviation */}
              <div className={`font-mono text-2xl font-black mb-3 ${
                cert.featured ? 'text-[var(--electric-cyan)]' : 'text-[var(--electric-cyan)]/60 group-hover:text-[var(--electric-cyan)] transition-colors'
              }`}>
                {cert.abbr}
              </div>

              {/* Category chip */}
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-2">
                {cert.category}
              </div>

              {/* Name */}
              <div className="text-sm font-semibold text-foreground mb-3">{cert.name}</div>

              {/* Level badge */}
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[var(--electric-cyan)] flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{cert.level}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: false }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card/40">
            <Award size={16} className="text-[var(--electric-cyan)]" />
            <span className="text-sm text-muted-foreground">
              All certifications independently verified and maintained through annual audits
            </span>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
