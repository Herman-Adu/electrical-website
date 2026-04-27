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

export default function ProjectsLoading() {
  return (
    <main className="section-container section-safe-top section-safe-bottom">
      <motion.div
        className="section-content max-w-6xl space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="h-6 w-48 rounded bg-muted/60" />
        <motion.div variants={item} className="h-14 w-full max-w-3xl rounded bg-muted/60" />
        <motion.div variants={item} className="h-96 w-full rounded-2xl bg-muted/60" />
        <motion.div
          variants={container}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={item} className="h-44 rounded-2xl bg-muted/60" />
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}
