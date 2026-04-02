import { useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Hook that provides animated top/bottom border line transforms
 * based on scroll position as the element enters view
 */
export function useAnimatedBorders() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineLeft = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);
  const lineRight = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  return { sectionRef, shouldReduce, lineLeft, lineRight };
}

/**
 * Animated top/bottom border component
 * Place inside a section with `overflow-hidden`
 */
export function AnimatedBorders({
  shouldReduce,
  lineLeft,
  lineRight,
  showBottom = true,
}: {
  shouldReduce: boolean | null;
  lineLeft: MotionValue<string>;
  lineRight: MotionValue<string>;
  showBottom?: boolean;
}) {
  if (shouldReduce) return null;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-electric-cyan/60 to-transparent"
          style={{ width: lineLeft }}
        />
      </div>
      {showBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-electric-cyan/60 to-transparent"
            style={{ width: lineRight }}
          />
        </div>
      )}
    </>
  );
}
