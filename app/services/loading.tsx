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

export default function ServicesLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="h-3 w-44 rounded bg-muted/60" />
        <motion.div variants={item} className="h-10 w-2/3 max-w-xl rounded bg-muted/60" />
        <motion.div variants={item} className="h-4 w-full max-w-3xl rounded bg-muted/60" />
      </motion.div>

      <motion.div
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            className="h-52 rounded-lg border border-border bg-muted/30"
          />
        ))}
      </motion.div>
    </main>
  )
}
