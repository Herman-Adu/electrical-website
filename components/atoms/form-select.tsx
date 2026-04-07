/**
 * ATOMIC COMPONENT: FormSelect
 *
 * A styled select dropdown that matches our FormInput design.
 * Like all atoms, it's self-contained and reusable.
 */

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, helperText, options, className, required, ...props },
    ref,
  ) => {
    const hasValue = Boolean(props.value);
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          required={required}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg",
            "bg-background border border-input",
            "text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "focus:shadow-[0_0_10px_oklch(0.745_0.153_72.338_/_0.2)]",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error &&
              "border-destructive focus:ring-destructive focus:shadow-[0_0_10px_oklch(0.577_0.245_27.325_/_0.2)]",
            !error && hasValue && "border-accent/50",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
