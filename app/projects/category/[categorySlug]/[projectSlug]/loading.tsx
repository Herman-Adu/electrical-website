"use client"

import { motion, type Variants } from "framer-motion"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

export default function CategoryProjectDetailLoading() {
  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <motion.div
          className="section-content max-w-6xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Breadcrumb skeleton */}
          <motion.div variants={item} className="mb-6 h-3 w-72 rounded bg-muted/40" />

          {/* Card skeleton */}
          <motion.div
            variants={item}
            className="rounded-lg border border-border/50 overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="min-h-[280px] sm:min-h-[360px] bg-muted/30" />

            {/* Body skeleton */}
            <motion.div
              variants={container}
              className="p-6 sm:p-8 space-y-6"
            >
              <motion.div variants={item} className="h-8 w-96 rounded bg-muted/40" />
              <motion.div variants={item} className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/30" />
                <div className="h-4 w-5/6 rounded bg-muted/30" />
                <div className="h-4 w-4/6 rounded bg-muted/30" />
              </motion.div>

              {/* KPI grid skeleton */}
              <motion.div
                variants={container}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/10 border border-border/40"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={i} variants={item} className="space-y-1">
                    <div className="h-2.5 w-16 rounded bg-muted/30" />
                    <div className="h-4 w-20 rounded bg-muted/40" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Tags skeleton */}
              <motion.div variants={item} className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-5 w-16 rounded bg-muted/30" />
                ))}
              </motion.div>

              {/* CTAs skeleton */}
              <motion.div variants={item} className="flex gap-3">
                <div className="h-10 w-40 rounded bg-muted/30" />
                <div className="h-10 w-48 rounded bg-electric-cyan/10" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
