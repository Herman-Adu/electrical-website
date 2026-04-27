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

export default function NewsHubLoading() {
  return (
    <main className="section-standard bg-background">
      <motion.div
        className="section-content max-w-6xl space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="h-12 w-40 rounded-full bg-muted/60" />
        <motion.div variants={item} className="h-20 max-w-3xl rounded-3xl bg-muted/60" />
        <motion.div variants={container} className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={item} className="h-40 rounded-3xl bg-muted/60" />
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}
