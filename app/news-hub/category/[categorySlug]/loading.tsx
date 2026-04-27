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

export default function NewsCategoryLoading() {
  return (
    <main className="section-standard bg-background">
      <motion.div
        className="section-content max-w-6xl space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="h-8 w-40 rounded-full bg-muted/60" />
        <motion.div variants={item} className="h-14 max-w-2xl rounded-3xl bg-muted/60" />
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div key={i} variants={item} className="h-36 rounded-3xl bg-muted/60" />
        ))}
      </motion.div>
    </main>
  )
}
