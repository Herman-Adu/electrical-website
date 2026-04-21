import { motion, type MotionValue } from "framer-motion";

type SchematicBackgroundProps = {
  isInView: boolean;
  circuitOpacity: MotionValue<number>;
};

export function SchematicBackground({
  isInView,
  circuitOpacity,
}: SchematicBackgroundProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        .schematic-background-container {
          --schematic-stroke: hsl(174 100% 35%);
        }
        .dark .schematic-background-container {
          --schematic-stroke: #00f3bd;
        }
      `}</style>
      <div className="schematic-background-container">
        <motion.svg
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-64 lg:w-96 h-auto opacity-20"
          viewBox="0 0 200 400"
          fill="none"
          style={{ opacity: circuitOpacity }}
        >
          <motion.path
            d="M100 0 L100 60"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.path
            d="M100 60 L105 65 L95 75 L105 85 L95 95 L105 105 L95 115 L100 120"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          <motion.path
            d="M100 120 L100 180"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          <motion.path
            d="M85 180 L115 180 M85 190 L115 190"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          />
          <motion.path
            d="M100 190 L100 250 M80 250 L120 250 M88 260 L112 260 M96 270 L104 270"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
          <motion.circle
            cx="100"
            cy="60"
            r="4"
            fill="var(--schematic-stroke)"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.3, delay: 0.4 }}
          />
          <motion.circle
            cx="100"
            cy="180"
            r="4"
            fill="var(--schematic-stroke)"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.3, delay: 0.9 }}
          />
        </motion.svg>
      </div>

      <div className="schematic-background-container">
        <motion.svg
          className="hidden md:block absolute right-0 top-1/3 w-48 lg:w-72 h-auto opacity-15"
          viewBox="0 0 150 300"
          fill="none"
          style={{ opacity: circuitOpacity }}
        >
          <motion.path
            d="M75 20 L75 50 M75 50 L95 70"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
          <motion.circle
            cx="75"
            cy="70"
            r="3"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />
          <motion.path
            d="M75 73 L75 90 Q85 95 75 105 Q65 110 75 120 Q85 125 75 135 Q65 140 75 150 L75 170"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          />
          <motion.path
            d="M75 170 L75 220 L120 220"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
          <motion.path
            d="M115 215 L120 220 L115 225"
            stroke="var(--schematic-stroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.8 }}
          />
        </motion.svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-deep-slate to-transparent" />
    </div>
  );
}
