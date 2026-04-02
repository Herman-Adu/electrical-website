"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  Linkedin,
  Twitter,
  Mail,
  Award,
  CheckCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import type { SectionProfileData } from "@/types/sections";

const socialIcons = {
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

interface SectionProfileProps {
  data: SectionProfileData;
}

export function SectionProfile({ data }: SectionProfileProps) {
  const {
    sectionId,
    label,
    name,
    title,
    credentials = [],
    bio,
    quote,
    quoteAttribution,
    image,
    socialLinks = [],
    reversed = false,
    cta,
  } = data;

  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax on image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const brightness = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55],
    [0.5, 0.85, 1],
  );
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

  // Slide directions based on reversed prop
  const textInitialX = reversed ? -50 : 50;
  const imageInitialX = reversed ? 50 : -50;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid-fine opacity-20 pointer-events-none z-0" />

      {/* Alternating background accent */}
      <div
        className={`absolute top-0 bottom-0 w-1/2 ${
          reversed ? "right-0" : "left-0"
        } bg-card/20 border-${reversed ? "l" : "r"} border-border/30 z-0`}
      />

      <div className="section-content relative z-10">
        <div
          className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-12 lg:gap-20 items-center`}
        >
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: imageInitialX }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="w-full md:w-5/12 shrink-0"
          >
            <div className="relative">
              {/* Outer frame decoration */}
              <div className="absolute -inset-3 border border-[--electric-cyan]/15 rounded-2xl" />
              <div className="absolute -inset-6 border border-[--electric-cyan]/08 rounded-3xl" />

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-electric-cyan/60 rounded-tl-sm z-10" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-electric-cyan/60 rounded-tr-sm z-10" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-electric-cyan/60 rounded-bl-sm z-10" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-electric-cyan/60 rounded-br-sm z-10" />

              {/* Image */}
              <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 w-full h-[115%]"
                  style={{ filter: brightnessFilter }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    style={{ y: imageY }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover object-center"
                      priority={image.priority}
                    />
                  </motion.div>
                </motion.div>

                {/* Gradient overlay bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />

                {/* Electric-cyan ambient glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[--electric-cyan]/10 to-transparent" />
              </div>

              {/* Credential badges below image */}
              {credentials.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {credentials.map((cred) => (
                    <div
                      key={cred}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm text-xs font-mono tracking-wide text-muted-foreground"
                    >
                      <Award size={10} className="text-electric-cyan" />
                      {cred}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Text column */}
          <div className="w-full md:w-7/12 relative z-20 bg-background/40 backdrop-blur-sm rounded-xl p-8 lg:p-12">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                {label}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl lg:text-5xl font-black text-foreground mb-2 text-balance"
            >
              {name}
            </motion.h2>

            {/* Title */}
            {title && (
              <motion.p
                initial={{ opacity: 0, x: textInitialX }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-80px" }}
                className="font-mono text-sm tracking-widest uppercase text-electric-cyan/80 mb-8"
              >
                {title}
              </motion.p>
            )}

            {/* Bio paragraphs */}
            <div className="space-y-4 mb-8">
              {bio.map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: textInitialX * 0.6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + idx * 0.1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Signature quote */}
            {quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true, margin: "-80px" }}
                className="relative p-6 rounded-xl border border-electric-cyan/30 bg-electric-cyan/5 mb-8"
              >
                {/* Opening quote glyph */}
                <span className="absolute -top-4 left-6 text-5xl font-serif text-electric-cyan/40 leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-foreground font-medium italic leading-relaxed text-lg">
                  {quote}
                </p>
                <span className="font-mono text-xs text-electric-cyan/60 mt-3 block">
                  — {quoteAttribution || name}
                </span>
              </motion.div>
            )}

            {/* Highlights list */}
            {credentials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true, margin: "-80px" }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {credentials.map((cred) => (
                  <div
                    key={cred}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle
                      size={14}
                      className="text-electric-cyan shrink-0"
                    />
                    {cred}
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA button */}
            {cta && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                viewport={{ once: true, margin: "-80px" }}
                className="mb-8"
              >
                <a
                  href={cta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-electric-cyan text-electric-cyan font-medium hover:bg-electric-cyan hover:text-background transition-all duration-300"
                >
                  {cta.label}
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true, margin: "-80px" }}
                className="flex gap-3"
              >
                {socialLinks.map(({ platform, url }) => {
                  const Icon = socialIcons[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target={platform !== "email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={`${name} on ${platform}`}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-electric-cyan hover:border-electric-cyan/50 hover:bg-electric-cyan/10 hover:shadow-lg hover:shadow-(--electric-cyan)/15 transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
