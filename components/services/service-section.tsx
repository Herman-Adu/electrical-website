'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LucideIcon, ArrowRight } from 'lucide-react';

export interface ServiceSectionProps {
  id: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  imagePosition?: 'left' | 'right';
  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  delay?: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 120 },
  },
};

export function ServiceSection({
  id,
  title,
  description,
  image,
  imagePosition = 'left',
  features,
  cta,
  delay = 0,
}: ServiceSectionProps) {
  const containerClasses =
    imagePosition === 'left'
      ? 'flex flex-col md:flex-row gap-8 md:gap-12'
      : 'flex flex-col md:flex-row-reverse gap-8 md:gap-12';

  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay }}
      className="section-container py-16 sm:py-20 md:py-24"
    >
      <div className={containerClasses}>
        {/* Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 }}
            className="flex-1 relative min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 dark:bg-gradient-to-tr dark:from-black/40 dark:to-transparent bg-gradient-to-tr from-black/20 to-transparent" />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: imagePosition === 'left' ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2 }}
          className="flex-1 flex flex-col justify-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">{title}</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.3 + idx * 0.1 }}
                className="flex gap-4 items-start"
              >
                <feature.icon
                  size={24}
                  className="text-[var(--electric-cyan)] flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          {cta && (
            <motion.a
              href={cta.href || '#'}
              onClick={cta.onClick}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.4 }}
              className="inline-flex items-center gap-2 w-fit px-6 py-3 rounded-lg border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] font-semibold hover:bg-[var(--electric-cyan)]/10 hover:border-[var(--electric-cyan)]/50 transition-all duration-300 group"
            >
              {cta.label}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
