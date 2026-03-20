'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Linkedin, Twitter, Mail, Award, CheckCircle } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/section-wrapper';

export interface DirectorProfileProps {
  name: string;
  title: string;
  credentials: string[];
  bio: string[];
  quote: string;
  imageSrc: string;
  imageAlt: string;
  socialLinks?: { platform: 'linkedin' | 'twitter' | 'email'; url: string }[];
  reversed?: boolean;
  sectionId?: string;
}

const socialIcons = {
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export function DirectorProfile({
  name,
  title,
  credentials,
  bio,
  quote,
  imageSrc,
  imageAlt,
  socialLinks = [],
  reversed = false,
  sectionId,
}: DirectorProfileProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  // Parallax on image
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const brightness = useTransform(scrollYProgress, [0, 0.25, 0.55], [0.5, 0.85, 1]);
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

  // Slide directions based on reversed prop
  const textInitialX = reversed ? -50 : 50;
  const imageInitialX = reversed ? 50 : -50;

  return (
      <SectionWrapper
        id="directors"
        variant="full"
      >
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid-fine opacity-20 pointer-events-none" />

      {/* Alternating background accent */}
      <div
        className={`absolute top-0 bottom-0 w-1/2 ${
          reversed ? 'right-0' : 'left-0'
        } bg-card/20 border-${reversed ? 'l' : 'r'} border-border/30`}
      />

      <div className="section-content">
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-20 items-center`}>

          {/* Image column */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: imageInitialX }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="w-full md:w-5/12 flex-shrink-0"
          >
            <div className="relative">
              {/* Outer frame decoration */}
              <div className="absolute -inset-3 border border-[var(--electric-cyan)]/15 rounded-2xl" />
              <div className="absolute -inset-6 border border-[var(--electric-cyan)]/08 rounded-3xl" />

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[var(--electric-cyan)]/60 rounded-tl-sm z-10" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-[var(--electric-cyan)]/60 rounded-tr-sm z-10" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-[var(--electric-cyan)]/60 rounded-bl-sm z-10" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[var(--electric-cyan)]/60 rounded-br-sm z-10" />

              {/* Image */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                <motion.div className="absolute inset-0 w-full h-[115%]" style={{ filter: brightnessFilter }}>
                  <motion.div className="relative w-full h-full" style={{ y: imageY }}>
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                </motion.div>

                {/* Gradient overlay bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                {/* Electric-cyan ambient glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--electric-cyan)]/10 to-transparent" />
              </div>

              {/* Credential badges below image */}
              <div className="mt-4 flex flex-wrap gap-2">
                {credentials.map((cred) => (
                  <div
                    key={cred}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs font-mono tracking-wide text-muted-foreground"
                  >
                    <Award size={10} className="text-[var(--electric-cyan)]" />
                    {cred}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <div className="w-full md:w-7/12">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-[var(--electric-cyan)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--electric-cyan)]">
                Leadership
              </span>
            </motion.div>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true, margin: '-80px' }}
              className="text-4xl lg:text-5xl font-black text-foreground mb-2 text-balance"
            >
              {name}
            </motion.h2>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, margin: '-80px' }}
              className="font-mono text-sm tracking-widest uppercase text-[var(--electric-cyan)]/80 mb-8"
            >
              {title}
            </motion.p>

            {/* Bio paragraphs */}
            <div className="space-y-4 mb-8">
              {bio.map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: textInitialX * 0.6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + idx * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Signature quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true, margin: '-80px' }}
              className="relative p-6 rounded-xl border border-[var(--electric-cyan)]/30 bg-[var(--electric-cyan)]/5 mb-8"
            >
              {/* Opening quote glyph */}
              <span className="absolute -top-4 left-6 text-5xl font-serif text-[var(--electric-cyan)]/40 leading-none select-none">&ldquo;</span>
              <p className="text-foreground font-medium italic leading-relaxed text-lg">
                {quote}
              </p>
              <span className="font-mono text-xs text-[var(--electric-cyan)]/60 mt-3 block">
                — {name}
              </span>
            </motion.div>

            {/* Highlights list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {credentials.map((cred) => (
                <div key={cred} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-[var(--electric-cyan)] flex-shrink-0" />
                  {cred}
                </div>
              ))}
            </motion.div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true, margin: '-80px' }}
                className="flex gap-3"
              >
                {socialLinks.map(({ platform, url }) => {
                  const Icon = socialIcons[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target={platform !== 'email' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      aria-label={`${name} on ${platform}`}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[var(--electric-cyan)] hover:border-[var(--electric-cyan)]/50 hover:bg-[var(--electric-cyan)]/10 hover:shadow-lg hover:shadow-[var(--electric-cyan)]/15 transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
