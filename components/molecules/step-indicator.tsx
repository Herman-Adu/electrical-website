"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || isCurrent;
          const nextStepCompleted =
            index < steps.length - 1 &&
            (completedSteps.includes(steps[index + 1].number) ||
              currentStep > step.number);

          return (
            <li
              key={step.number}
              className="relative flex-1 flex flex-col items-center"
            >
              {/* Connector line between steps - positioned to connect bulbs edge to edge */}
              {index < steps.length - 1 && (
                <div
                  className="absolute h-[2px] z-0"
                  style={{
                    top: "18px", // Center of the bulb (36px/2 on mobile, scales with bulb)
                    left: "calc(50% + 18px)", // Start from right edge of current bulb
                    right: "calc(-50% + 18px)", // End at left edge of next bulb
                  }}
                >
                  <div className="h-full w-full bg-border">
                    <motion.div
                      className="h-full bg-gradient-to-r from-electric-cyan to-electric-cyan/40"
                      initial={{ width: "0%" }}
                      animate={{ width: nextStepCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Step button with light bulb */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.number)}
                disabled={!isClickable}
                className={cn(
                  "relative z-10 flex flex-col items-center w-full",
                  "transition-all duration-200",
                  isClickable && "cursor-pointer group",
                  !isClickable && "cursor-not-allowed opacity-60",
                )}
              >
                {/* Light bulb container with responsive sizing */}
                <div className="relative w-9 h-9 min-[460px]:w-12 min-[460px]:h-12">
                  {isCurrent && (
                    <>
                      {/* Outer glow ring - scaled for mobile */}
                      <motion.div
                        className="absolute inset-[-8px] min-[460px]:inset-[-14px] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, oklch(0.85 0.22 168 / 0.35) 0%, oklch(0.8 0.2 168 / 0.2) 40%, transparent 70%)",
                          filter: "blur(8px)",
                        }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.65, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Middle glow layer */}
                      <motion.div
                        className="absolute inset-[-5px] min-[460px]:inset-[-8px] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, oklch(0.9 0.24 168 / 0.4) 0%, oklch(0.85 0.22 168 / 0.25) 50%, transparent 70%)",
                          filter: "blur(6px)",
                        }}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{
                          scale: [0.7, 1.0, 0.7],
                          opacity: [0.5, 0.7, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Inner bright core glow */}
                      <motion.div
                        className="absolute inset-[-2px] min-[460px]:inset-[-4px] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, oklch(0.95 0.25 168 / 0.5) 0%, transparent 60%)",
                          filter: "blur(3px)",
                        }}
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{
                          scale: [0.6, 1, 0.6],
                          opacity: [0.6, 0.8, 0.6],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  )}

                  <motion.svg
                    viewBox="0 0 48 48"
                    className={cn(
                      "relative z-10 w-full h-full transition-all duration-300",
                      isClickable && "group-hover:scale-110",
                    )}
                  >
                    {/* Bulb base/socket */}
                    <rect
                      x="18"
                      y="32"
                      width="12"
                      height="8"
                      rx="1"
                      className={cn(
                        "transition-colors duration-500",
                        isCompleted || isCurrent
                          ? "fill-electric-cyan/80"
                          : "fill-muted",
                      )}
                    />

                    <motion.path
                      d="M24 8C19.5817 8 16 11.5817 16 16C16 18.7614 17.3433 21.1845 19.4 22.6V28C19.4 29.3255 20.4745 30.4 21.8 30.4H26.2C27.5255 30.4 28.6 29.3255 28.6 28V22.6C30.6567 21.1845 32 18.7614 32 16C32 11.5817 28.4183 8 24 8Z"
                      className={cn(
                        "transition-all duration-500",
                        isCompleted
                          ? "fill-electric-cyan/40 stroke-electric-cyan"
                          : isCurrent
                            ? "fill-electric-cyan/50 stroke-electric-cyan"
                            : "fill-background stroke-muted-foreground/50",
                      )}
                      strokeWidth="1.5"
                      initial={false}
                      animate={
                        isCurrent
                          ? {
                              fill: [
                                "oklch(0.85 0.22 168 / 0.3)",
                                "oklch(0.9 0.24 168 / 0.6)",
                                "oklch(0.85 0.22 168 / 0.3)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: isCurrent ? Number.POSITIVE_INFINITY : 0,
                        ease: "easeInOut",
                      }}
                    />

                    {(isCompleted || isCurrent) && (
                      <motion.path
                        d="M24 14V22M21 18H27"
                        className="stroke-electric-cyan"
                        strokeWidth={isCurrent ? "3" : "2"}
                        strokeLinecap="round"
                        initial={{
                          opacity: 0,
                          filter: "drop-shadow(0 0 0px oklch(0.9 0.24 168))",
                        }}
                        animate={{
                          opacity: isCompleted ? 1 : [0.6, 1, 0.6],
                          filter: isCurrent
                            ? [
                                "drop-shadow(0 0 3px oklch(0.9 0.24 168)) drop-shadow(0 0 6px oklch(0.85 0.22 168 / 0.6))",
                                "drop-shadow(0 0 8px oklch(0.95 0.25 168)) drop-shadow(0 0 12px oklch(0.9 0.24 168 / 0.8))",
                                "drop-shadow(0 0 3px oklch(0.9 0.24 168)) drop-shadow(0 0 6px oklch(0.85 0.22 168 / 0.6))",
                              ]
                            : "drop-shadow(0 0 3px oklch(0.9 0.24 168))",
                        }}
                        transition={{
                          duration: isCurrent ? 1.5 : 0.5,
                          repeat: isCurrent ? Number.POSITIVE_INFINITY : 0,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {isCurrent && (
                      <motion.circle
                        cx="24"
                        cy="18"
                        r="10"
                        className="fill-electric-cyan/30"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          scale: [0.8, 1.1, 0.8],
                          opacity: [0.25, 0.45, 0.25],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {isCompleted && (
                      <motion.circle
                        cx="24"
                        cy="18"
                        r="12"
                        className="fill-electric-cyan/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Check mark for completed steps */}
                    {isCompleted && (
                      <motion.path
                        d="M20 18L23 21L28 16"
                        className="stroke-electric-cyan"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    )}
                  </motion.svg>

                  {/* Active step number badge - scaled for mobile */}
                  {!isCompleted && (
                    <div
                      className={cn(
                        "absolute -top-0.5 -right-0.5 min-[460px]:-top-1 min-[460px]:-right-1",
                        "w-4 h-4 min-[460px]:w-5 min-[460px]:h-5 rounded-full",
                        "flex items-center justify-center",
                        "text-[10px] min-[460px]:text-xs font-bold",
                        "transition-all duration-300",
                        isCurrent
                          ? "bg-electric-cyan text-white dark:text-black scale-100"
                          : "bg-muted text-muted-foreground scale-90",
                      )}
                    >
                      {step.number}
                    </div>
                  )}
                </div>

                {/* Step label - hidden on very small screens */}
                <div className="text-center mt-2 w-full max-w-[50px] min-[460px]:max-w-[80px] sm:max-w-[120px]">
                  <motion.div
                    className={cn(
                      "text-[10px] min-[460px]:text-xs sm:text-sm font-medium transition-colors duration-300 leading-tight",
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                          ? "text-electric-cyan/80 dark:text-electric-cyan/70"
                          : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </motion.div>
                  {step.description && (
                    <div className="text-[9px] sm:text-xs text-muted-foreground hidden min-[460px]:block mt-0.5 leading-tight">
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
