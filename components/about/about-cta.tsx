'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Youtube, BookOpen } from 'lucide-react';

const whyUs = [
  'NICEIC Approved Contractor — fully verified and independently audited',
  'Fixed price quotes with zero hidden charges or surprises',
  'All work certified to BS 7671 18th Edition with full documentation',
  'Emergency response within 2 hours, 24 hours a day, 365 days a year',
  'Directly employed, directly accountable — no subcontractors',
  '99.7% client satisfaction rating across 2,400+ completed projects',
];

const socials = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', handle: '@IntactElectrical' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', handle: '@intact.electrical' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', handle: 'Intact Electrical' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', handle: '@IntactElec' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', handle: 'Intact TV' },
];

const article = {
  tag: 'Featured Article',
  title: 'The True Cost of Cheap Electrical Work',
  excerpt: 'We break down why cutting corners on electrical installations risks more than just your budget — and what to look for when choosing a contractor.',
  readTime: '4 min read',
};

export function AboutCTA() {
  const surgeRef = useRef<HTMLDivElement>(null);

  const handleCTA = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="why-choose-us" className="section-container section-padding bg-background">
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/40 to-transparent" />

      <div className="section-content">

        {/* Why Choose Us */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[var(--electric-cyan)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">The Difference</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 text-balance">
              Why Choose <span className="text-[var(--electric-cyan)]">Intact?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              There are thousands of electricians. There are very few Intact Electrical Innovations.
              Here&apos;s exactly what sets us apart.
            </p>
            <div className="space-y-4">
              {whyUs.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  viewport={{ once: false }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={16} className="text-[var(--electric-cyan)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured article card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="relative p-8 rounded-2xl border border-[var(--electric-cyan)]/30 bg-card/60 hover:border-[var(--electric-cyan)]/60 transition-all duration-300 group overflow-hidden">
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[var(--electric-cyan)]/5 to-transparent" />
              
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[var(--electric-cyan)]/30 group-hover:border-[var(--electric-cyan)]/60 transition-colors" />

              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} className="text-[var(--electric-cyan)]" />
                <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]/70">{article.tag}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-balance leading-snug">{article.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground/60">{article.readTime}</span>
                <button className="flex items-center gap-2 text-sm text-[var(--electric-cyan)] font-medium hover:gap-3 transition-all duration-200">
                  Read Article <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="mb-24"
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-border" />
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Follow Our Work</span>
              <div className="h-px w-8 bg-border" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Stay Connected</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  viewport={{ once: false }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card/40 hover:border-[var(--electric-cyan)]/40 hover:bg-[var(--electric-cyan)]/5 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/10 transition-all duration-300 group"
                >
                  <Icon size={18} className="text-muted-foreground group-hover:text-[var(--electric-cyan)] transition-colors" />
                  <div>
                    <div className="text-xs font-medium text-foreground">{social.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground/60">{social.handle}</div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative text-center py-20 px-8 rounded-3xl border border-[var(--electric-cyan)]/30 bg-[var(--electric-cyan)]/5 overflow-hidden"
        >
          {/* Blueprint grid inside CTA */}
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

          {/* Animated corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--electric-cyan)]/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--electric-cyan)]/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--electric-cyan)]/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--electric-cyan)]/50" />

          {/* Floating particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--electric-cyan)]/30"
              style={{ left: `${20 + i * 20}%`, top: `${20 + (i % 2) * 60}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap size={14} className="text-[var(--electric-cyan)] animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
                Ready to Start?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5 text-balance">
              Let&apos;s Build Something <span className="text-[var(--electric-cyan)]">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether it&apos;s a domestic rewire or a full industrial installation — bring us your project.
              We&apos;ll bring the expertise, integrity, and commitment it deserves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                ref={surgeRef}
                onClick={handleCTA}
                className="group relative px-10 py-5 bg-[var(--electric-cyan)] text-background font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] active:scale-95 rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Project
                  <Zap size={16} className="group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </button>

              <button
                onClick={() => window.location.href = '/contact'}
                className="px-10 py-5 border border-border text-foreground font-bold uppercase tracking-widest hover:border-[var(--electric-cyan)] hover:text-[var(--electric-cyan)] transition-all duration-300 text-sm rounded-sm"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
