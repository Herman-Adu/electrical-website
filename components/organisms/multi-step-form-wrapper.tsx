/**
 * ORGANISM: MultiStepFormWrapper
 *
 * A generic wrapper for multi-step forms that provides:
 * - Progress indication
 * - Step management
 * - Animation transitions
 * - Consistent styling
 *
 * This is used by both the electrical service form and quotation form.
 */

"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { FormProgressIndicator } from "@/components/molecules/form-progress-indicator";
import type { FormStepConfig } from "@/lib/forms/types";

interface MultiStepFormWrapperProps {
  title: string;
  description: string;
  steps: FormStepConfig[];
  currentStep: number;
  children: ReactNode;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  progressAnchorId?: string;
  showRequiredFieldsNote?: boolean;
}

export function MultiStepFormWrapper({
  title,
  description,
  steps,
  currentStep,
  children,
  className,
  onStepClick,
  progressAnchorId,
  showRequiredFieldsNote = true,
}: MultiStepFormWrapperProps) {
  const hasHeader = Boolean(title || description);

  return (
    <div className={className}>
      {/* Form Header */}
      {hasHeader && (
        <div className="text-center mb-8">
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      <div id={progressAnchorId}>
        <FormProgressIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
          onStepClick={onStepClick}
        />
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
        {showRequiredFieldsNote && (
          <p className="mb-6 text-xs text-muted-foreground">
            Fields marked <span className="text-destructive">*</span> are
            required.
          </p>
        )}
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
}
