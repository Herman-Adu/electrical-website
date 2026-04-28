"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/types/projects";
import { ProjectsFeaturedCard } from "./projects-featured-card";

interface ProjectsFeaturedCardAnimatedProps {
  project: Project;
}

export function ProjectsFeaturedCardAnimated({
  project,
}: ProjectsFeaturedCardAnimatedProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative rounded-xl">
      {!shouldReduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl z-10"
          animate={{
            boxShadow: [
              "0 0 0px rgba(0,243,189,0), inset 0 0 0px rgba(0,243,189,0)",
              "0 0 20px rgba(0,243,189,0.25), inset 0 0 8px rgba(0,243,189,0.06)",
              "0 0 8px rgba(0,243,189,0.1), inset 0 0 2px rgba(0,243,189,0.02)",
              "0 0 20px rgba(0,243,189,0.25), inset 0 0 8px rgba(0,243,189,0.06)",
              "0 0 0px rgba(0,243,189,0), inset 0 0 0px rgba(0,243,189,0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1,
          }}
        />
      )}
      {!shouldReduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-electric-cyan/60 dark:border-electric-cyan/50 z-10"
            initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            style={{ originX: 0, originY: 0 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-electric-cyan/60 dark:border-electric-cyan/50 z-10"
            initial={{ opacity: 0, scaleX: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            style={{ originX: 1, originY: 1 }}
          />
        </>
      )}
      <ProjectsFeaturedCard project={project} />
    </div>
  );
}
