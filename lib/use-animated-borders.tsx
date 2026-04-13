import { useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

/**
 * Hook that provides a scroll-linked scaleX value for animated border lines.
 *
 * Timeline (keyed to scrollYProgress where 0 = section top hits viewport bottom,
 * 1 = section bottom hits viewport top):
 *   0.00 → 0.30  line scales in  (section entering)
 *   0.30 → 0.70  line holds at full width (section visible)
 *   0.70 → 1.00  line scales out (section exiting)
 *
 * Using scaleX with transformOrigin:"center" means the animation is direction-
 * agnostic — scrolling up reverses the same keyframes naturally, no React state
 * or scroll-direction detection required.
 */
export function useAnimatedBorders() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Keyframe: draw-in → hold → retract.  Works identically in both scroll directions.
  const lineScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0],
  );

  return { sectionRef, shouldReduce, lineScale };
}

/**
 * Animated top (and optional bottom) border lines.
 * Must be placed inside a positioned parent with `overflow-hidden`.
 */
export function AnimatedBorders({
  shouldReduce,
  lineScale,
  showBottom = true,
}: {
  shouldReduce: boolean | null;
  lineScale: MotionValue<number>;
  showBottom?: boolean;
}) {
  // Derived MotionValues — must be called unconditionally (before any early return)
  // Maps lineScale 0→1 to clip percentage 50%→0%
  // Result: inset(0 50% 0 50%) = nothing visible → inset(0 0% 0 0%) = fully visible
  // Both sides use the same percentage, guaranteeing left/right symmetry.
  const half = useTransform(lineScale, (v: number) => 50 - v * 50);
  const clipPath = useMotionTemplate`inset(0 ${half}% 0 ${half}%)`;

  if (shouldReduce) {
    return (
      <>
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
          <div className="h-full w-full bg-linear-to-r/srgb from-background/0 via-muted-foreground to-background/0 dark:via-electric-cyan/60" />
        </div>
        {showBottom && (
          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <div className="h-full w-full bg-linear-to-r/srgb from-background/0 via-muted-foreground to-background/0 dark:via-electric-cyan/60" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-full bg-linear-to-r/srgb from-background/0 via-muted-foreground/40 to-background/0 dark:via-electric-cyan/60"
          style={{ clipPath }}
        />
      </div>
      {showBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <motion.div
            className="h-full w-full bg-linear-to-r/srgb from-background/0 via-electric-cyan/60 to-background/0"
            style={{ clipPath }}
          />
        </div>
      )}
    </>
  );
}
