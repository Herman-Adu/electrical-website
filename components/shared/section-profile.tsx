"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

import Image from "next/image";
import {
  Linkedin,
  Twitter,
  Mail,
  CheckCircle,
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
    image,
    socialLinks = [],
    reversed = false,
  } = data;

  const shouldReduce = useReducedMotion();
  const { sectionRef, lineScale } = useAnimatedBorders();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const brightness = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55],
    [0.5, 0.85, 1],
  );
  const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

  const textInitialX = reversed ? -50 : 50;
  const imageInitialX = reversed ? 50 : -50;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="absolute inset-0 blueprint-grid-fine opacity-20 pointer-events-none z-0" />

      <div
        className={`absolute top-0 bottom-0 w-1/2 ${
          reversed ? "right-0" : "left-0"
        } bg-card/20 border-${reversed ? "l" : "r"} border-border/30 z-0`}
      />

      <div className="section-content relative z-10">
        <div
          className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-12 lg:gap-20 items-center`}
        >
          <motion.div
            initial={{ opacity: 0, x: imageInitialX }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="w-full md:w-5/12 shrink-0"
          >
            <div className="relative p-2">
              <div className="absolute -inset-6 border border-[--electric-cyan]/08 rounded-3xl" />

              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[hsl(174_100%_35%)] dark:border-electric-cyan/60 rounded-tl-xl z-10 p2" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-[hsl(174_100%_35%)] dark:border-electric-cyan/60 rounded-tr-xl z-10" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-[hsl(174_100%_35%)] dark:border-electric-cyan/60 rounded-bl-xl z-10" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[hsl(174_100%_35%)] dark:border-electric-cyan/60 rounded-br-xl z-10" />

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

                <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[--electric-cyan]/10 to-transparent" />
              </div>

              {credentials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-wrap gap-3 my-4 mb-4"
                >
                  {credentials.map((cred) => (
                    <div
                      key={cred}
                      className="flex items-center gap-2 text-xs  text-foreground/80"
                    >
                      <CheckCircle
                        size={14}
                        className="text-[hsl(174_100%_35%)] dark:text-electric-cyan shrink-0"
                      />
                      {cred}
                    </div>
                  ))}
                </motion.div>
              )}

              {socialLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex gap-3 mt-2"
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
                        className="w-10 h-10 mb-2 rounded-full border border-border flex items-center justify-center text-[hsl(174_100%_35%)] dark:text-foreground/60 hover:text-electric-cyan hover:border-electric-cyan/50 hover:bg-electric-cyan/10 hover:shadow-lg hover:shadow-(--electric-cyan)/15 transition-all duration-300"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="w-full md:w-7/12 relative z-20 bg-background/40 backdrop-blur-sm rounded-xl p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-80px" }}
              className="flex items-center gap-3 mb-6 font-semibold"
            >
              <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                {label}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: textInitialX }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl lg:text-5xl font-black text-foreground mb-2 text-balance"
            >
              {name}
            </motion.h2>

            {title && (
              <motion.p
                initial={{ opacity: 0, x: textInitialX }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-80px" }}
                className="font-mono text-sm  tracking-widest uppercase font-semibold dark:text-electric-cyan/80 mb-8"
              >
                {title}
              </motion.p>
            )}

            <div className="space-y-4 mb-8">
              {bio.map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: textInitialX * 0.6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + idx * 0.1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="text-foreground/60 leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
