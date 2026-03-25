"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Building2 } from "lucide-react";
import { iconMap } from "@/components/shared/icon-map";
import type { IconName } from "@/types/sections";

export interface ServiceSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  imagePosition?: "left" | "right";
  features: Array<{
    icon: IconName;
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

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

export function ServiceSection({
  id,
  title,
  description,
  image,
  imagePosition = "left",
  features,
  cta,
  delay = 0,
}: ServiceSectionProps) {
  const containerClasses =
    imagePosition === "left"
      ? "flex flex-col-reverse md:flex-row gap-8 md:gap-12"
      : "flex flex-col-reverse md:flex-row-reverse gap-8 md:gap-12";

  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
      className="section-container section-padding"
    >
      <div className={`section-content ${containerClasses}`}>
        {/* Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 }}
            className="flex-1 relative min-h-75 md:min-h-100 rounded-2xl overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 dark:bg-linear-to-tr dark:from-black/40 dark:to-transparent bg-linear-to-tr from-black/20 to-transparent" />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: imagePosition === "left" ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2 }}
          className="flex-1 flex flex-col justify-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => {
              const IconComponent = iconMap[feature.icon] || Building2;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.3 + idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <IconComponent
                    size={24}
                    className="text-electric-cyan shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          {cta && (
            <motion.a
              href={cta.href || "#"}
              onClick={cta.onClick}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.4 }}
              className="inline-flex items-center gap-2 w-fit px-6 py-3 rounded-lg border border-electric-cyan/30 text-electric-cyan font-semibold hover:bg-electric-cyan/10 hover:border-electric-cyan/50 transition-all duration-300 group"
            >
              {cta.label}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
