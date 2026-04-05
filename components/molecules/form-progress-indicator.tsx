/**
 * MOLECULE: FormProgressIndicator
 *
 * A generic progress indicator for multi-step forms.
 * Shows the current step and overall progress.
 */

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormStepConfig } from "@/lib/forms/types";

interface FormProgressIndicatorProps {
  steps: FormStepConfig[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
}

export function FormProgressIndicator({
  steps,
  currentStep,
  className,
  onStepClick,
}: FormProgressIndicatorProps) {
  const maxIndex = Math.max(steps.length - 1, 1);
  const clampedStep = Math.min(Math.max(currentStep, 0), maxIndex);
  const progress = (clampedStep / maxIndex) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      <div className="px-4">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;
          const isClickable = (isCompleted || isCurrent) && onStepClick;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center gap-2 transition-all",
                isClickable && "cursor-pointer hover:scale-105",
                !isClickable && "cursor-default",
              )}
            >
              {/* Step Circle */}
              <motion.div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-accent text-accent-foreground",
                  isCurrent &&
                    "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background",
                  isPending && "bg-muted text-muted-foreground",
                  isClickable && "hover:ring-2 hover:ring-accent/50",
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </motion.div>

              {/* Step Title (hidden on mobile) */}
              <span
                className={cn(
                  "hidden md:block text-xs text-center max-w-20 truncate",
                  isCurrent
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Step Info (mobile) */}
      <div className="md:hidden text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
        <p className="font-medium text-foreground">
          {steps[currentStep]?.title}
        </p>
      </div>
    </div>
  );
}
