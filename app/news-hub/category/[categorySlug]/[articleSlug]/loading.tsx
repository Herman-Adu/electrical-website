"use client"

import { motion, type Variants } from "framer-motion"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

export default function NewsArticleLoading() {
  return (
    <main className="section-standard bg-background">
      <motion.div
        className="section-content max-w-6xl space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="h-10 w-56 rounded-full bg-muted/60" />
        <motion.div variants={item} className="h-20 max-w-4xl rounded-3xl bg-muted/60" />
        <motion.div variants={container} className="grid gap-4 lg:grid-cols-3">
          <motion.div variants={item} className="h-80 rounded-3xl bg-muted/60 lg:col-span-2" />
          <motion.div variants={container} className="space-y-4">
            <motion.div variants={item} className="h-32 rounded-3xl bg-muted/60" />
            <motion.div variants={item} className="h-32 rounded-3xl bg-muted/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
