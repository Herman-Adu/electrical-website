import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CTAActionsProps = {
  isInView: boolean;
};

export function CTAActions({ isInView }: CTAActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 justify-center items-center"
    >
      <motion.div whileHover="hover" whileTap="tap" className="relative group">
        <Link href="/contact">
          <motion.button
            className="relative px-8 py-4 font-semibold uppercase tracking-wider text-sm rounded-lg overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00f2ff 0%, #00f2ff 100%)",
              color: "#020617",
            }}
            variants={{
              hover: {
                scale: 1.05,
              },
              tap: {
                scale: 0.95,
              },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-amber-warning rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-amber-warning rounded-full"
            />

            <motion.div
              className="relative flex items-center gap-2"
              variants={{
                hover: {
                  x: 4,
                },
              }}
            >
              Get Started
              <motion.span
                variants={{
                  hover: {
                    x: 4,
                  },
                }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.div>
          </motion.button>
        </Link>

        <motion.div
          className="absolute inset-0 rounded-lg bg-electric-cyan opacity-0 blur-xl -z-10 group-hover:opacity-20 transition-opacity"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Link href="/#smart-living">
          <motion.button
            className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-electric-cyan transition-colors flex items-center gap-2"
            whileHover={{
              x: 4,
            }}
          >
            View Our Work
            <ArrowRight size={16} />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
