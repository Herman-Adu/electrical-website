"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LightBulb } from "@/components/animations/light-bulb"
import { ElectricBorder } from "@/components/animations/electric-border"
import { LightningArc } from "@/components/animations/lightning-arc"

interface Step {
  number: number
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (step: number) => void
}

export function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full px-2 sm:px-0">
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          const isClickable = isCompleted || isCurrent
          const nextStepActive =
            index < steps.length - 1 &&
            (completedSteps.includes(steps[index + 1]!.number) || currentStep > step.number)

          // Progress drives bulb brightness: dim for pending, glowing for current, fully lit for completed
          const bulbProgress = isCompleted ? 100 : isCurrent ? 72 : 8

          return (
            <li key={step.number} className="relative flex-1 flex flex-col items-center">
              {/* Lightning arc connector between steps */}
              {index < steps.length - 1 && (
                <div
                  className="absolute z-0"
                  style={{
                    top: "16px",
                    left: "calc(50% + 22px)",
                    right: "calc(-50% + 22px)",
                    height: "20px",
                  }}
                >
                  <LightningArc isActive={nextStepActive} delay={index * 0.15} />
                </div>
              )}

              {/* Step button */}
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
                {/* Light bulb + electric border container */}
                <div className="relative flex items-center justify-center w-10 h-12 min-[460px]:w-14 min-[460px]:h-16">
                  {/* Electric spinning border for active step */}
                  <ElectricBorder isActive={isCurrent} />

                  {/* Scaled LightBulb - 80x100 SVG scaled to fit the container */}
                  <div
                    className={cn(
                      "relative transition-transform duration-200",
                      isClickable && "group-hover:scale-110"
                    )}
                    style={{ overflow: "hidden", width: 40, height: 50 }}
                  >
                    <div style={{ transform: "scale(0.5)", transformOrigin: "0 0", width: 80 }}>
                      <LightBulb progress={bulbProgress} showPercent={false} />
                    </div>
                  </div>

                  {/* Step number badge for non-completed steps */}
                  {!isCompleted && (
                    <div
                      className={cn(
                        "absolute -top-0.5 -right-0.5 min-[460px]:-top-1 min-[460px]:-right-1",
                        "w-4 h-4 min-[460px]:w-5 min-[460px]:h-5 rounded-full",
                        "flex items-center justify-center",
                        "text-[10px] min-[460px]:text-xs font-bold",
                        "transition-all duration-300",
                        isCurrent
                          ? "bg-accent text-accent-foreground scale-100"
                          : "bg-muted text-muted-foreground scale-90",
                      )}
                    >
                      {step.number}
                    </div>
                  )}
                </div>

                {/* Step label */}
                <div className="text-center mt-2 w-full max-w-[50px] min-[460px]:max-w-[80px] sm:max-w-[120px]">
                  <motion.div
                    className={cn(
                      "text-[10px] min-[460px]:text-xs sm:text-sm font-medium transition-colors duration-300 leading-tight",
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground",
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
          )
        })}
      </ol>
    </nav>
  )
}
