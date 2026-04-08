"use client";

/**
 * ATOMIC COMPONENT: RadioGroup
 *
 * Custom radio buttons with label and description support.
 */

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  options: RadioOption[];
  error?: string;
  helperText?: string;
  showRequiredHelper?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      showRequiredHelper = false,
      value,
      onValueChange,
      className,
      required,
      ...props
    },
    ref,
  ) => {
    const shouldShowRequiredHelper = showRequiredHelper && !error && !value;

    return (
      <div className="space-y-3">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer",
                "transition-all duration-200",
                value === option.value
                  ? "border-accent bg-accent/5"
                  : "border-input hover:border-accent/50",
                className,
              )}
            >
              <input
                ref={ref}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onValueChange?.(e.target.value)}
                className="mt-0.5 h-4 w-4 text-accent focus:ring-accent"
                {...props}
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {shouldShowRequiredHelper && (
          <p className="text-xs text-destructive">Required</p>
        )}

        {helperText && !error && !shouldShowRequiredHelper && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
