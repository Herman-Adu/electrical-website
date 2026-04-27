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

export default function CategoryProjectsLoading() {
  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <motion.div
          className="section-content max-w-5xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Breadcrumb skeleton */}
          <motion.div variants={item} className="mb-6 h-3 w-48 rounded bg-muted/40" />

          {/* Header skeleton */}
          <motion.div variants={item} className="mb-10 space-y-3">
            <div className="h-2.5 w-20 rounded bg-electric-cyan/20" />
            <div className="h-9 w-72 rounded bg-muted/40" />
            <div className="h-4 w-96 rounded bg-muted/30" />
          </motion.div>

          {/* Grid skeleton */}
          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                variants={item}
                className="rounded-lg border border-border/40 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-5 w-48 rounded bg-muted/40" />
                  <div className="h-5 w-20 rounded bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-muted/30" />
                  <div className="h-3 w-4/5 rounded bg-muted/30" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-40 rounded bg-muted/25" />
                  <div className="h-3 w-36 rounded bg-muted/25" />
                  <div className="h-3 w-32 rounded bg-muted/25" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
