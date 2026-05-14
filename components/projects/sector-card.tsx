"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectCategory } from "@/types/projects";

interface SectorCardProps {
  category: ProjectCategory;
  projectCount: number;
  recentProjectTitle: string;
  coverImageSrc: string;
  coverImageAlt: string;
  description?: string;
}

export function SectorCard({
  category,
  projectCount,
  recentProjectTitle,
  coverImageSrc,
  coverImageAlt,
  description,
}: SectorCardProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduce ? undefined : "hover"}
      initial="rest"
      animate="rest"
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72 border border-transparent hover:border-electric-cyan/40 hover:shadow-[0_0_30px_rgba(0,243,189,0.12)] transition-all duration-300"
    >
      <Link href={`/projects/category/${category.slug}`} className="absolute inset-0 z-20" aria-label={`Browse ${category.label} projects`} />
      <Image
        src={coverImageSrc}
        alt={coverImageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/5 transition-colors duration-300" />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{category.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">
            {projectCount}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/70 line-clamp-1">{recentProjectTitle}</p>

        <motion.div
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.22 }}
        >
          {description && (
            <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-2">{description}</p>
          )}
          <p className="mt-2 text-xs font-semibold text-electric-cyan">
            Browse {projectCount} project{projectCount !== 1 ? "s" : ""} →
          </p>
        </motion.div>

        <motion.p
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
          transition={{ duration: 0.15 }}
          className="mt-2 text-xs font-medium text-cyan-400"
        >
          View {projectCount} project{projectCount !== 1 ? "s" : ""} →
        </motion.p>
      </div>
    </motion.div>
  );
}
