"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface DetailInfographicBlockProps {
  src: string;
  alt: string;
  caption?: string;
}

export function DetailInfographicBlock({
  src,
  alt,
  caption,
}: DetailInfographicBlockProps) {
  return (
    <motion.section
      id="infographic"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-electric-cyan/40 to-transparent" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          Infographic
        </h2>
        <div className="h-px flex-1 bg-linear-to-l from-electric-cyan/40 to-transparent" />
      </div>
      <div className="rounded-xl overflow-hidden border border-electric-cyan/20 bg-card/30">
        <div className="relative w-full">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          />
        </div>
        {caption && (
          <p className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 border-t border-electric-cyan/10 text-center">
            {caption}
          </p>
        )}
      </div>
    </motion.section>
  );
}
