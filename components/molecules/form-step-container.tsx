/**
 * MOLECULE: FormStepContainer
 * 
 * A generic container for form steps that provides consistent
 * layout, animations, and navigation across all multi-step forms.
 */

"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

interface FormStepContainerProps {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  onNext?: () => void
  onPrevious?: () => void
  isFirstStep?: boolean
  isLastStep?: boolean
  isSubmitting?: boolean
  nextLabel?: string
  previousLabel?: string
  submitLabel?: string
  isValid?: boolean
}

export function FormStepContainer({
  title,
  description,
  icon,
  children,
  onNext,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  nextLabel = "Continue",
  previousLabel = "Back",
  submitLabel = "Submit Request",
  isValid = true,
}: FormStepContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-electric-cyan/10 text-electric-cyan">
              {icon}
            </div>
          )}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border">
        {!isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            {previousLabel}
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="submit"
          onClick={onNext}
          disabled={isSubmitting || !isValid}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isLastStep ? (
            submitLabel
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
