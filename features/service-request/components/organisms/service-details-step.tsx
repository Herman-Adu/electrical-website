/**
 * ORGANISM: ServiceDetailsStep (Step 2 of 5)
 *
 * This step demonstrates how to use different atom types together:
 * - FormSelect for dropdowns
 * - RadioGroup for urgency selection
 * - FormTextarea for descriptions
 *
 * PATTERN DEMONSTRATION:
 * Notice how this organism follows the exact same pattern as PersonalInfoStep,
 * but uses different atoms. This consistency makes the codebase predictable
 * and easy to maintain.
 *
 * Key similarities with PersonalInfoStep:
 * 1. Same imports structure (atoms, store, schema)
 * 2. Same validation setup (useForm + zodResolver)
 * 3. Same submission pattern (update store + navigate)
 * 4. Same animation approach (Framer Motion)
 *
 * The only differences are:
 * - Different schema (serviceDetailsSchema)
 * - Different store update function (updateServiceDetails)
 * - Different form fields (but same atomic components)
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FormSelect } from "@/components/atoms/form-select";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { RadioGroup } from "@/components/atoms/radio-group";
import { useFormStore } from "../../hooks/use-form-store";
import {
  serviceDetailsSchema,
  type ServiceDetailsInput,
} from "../../schemas/schemas";

// Service type options for the select dropdown
const SERVICE_TYPE_OPTIONS = [
  { value: "", label: "Select a service type" },
  { value: "electrical-repair", label: "Electrical Repair" },
  { value: "installation", label: "New Installation" },
  { value: "inspection", label: "Safety Inspection" },
  { value: "upgrade", label: "Panel Upgrade" },
  { value: "lighting", label: "Lighting Installation" },
  { value: "wiring", label: "Rewiring" },
  { value: "other", label: "Other Service" },
];

// Urgency options for radio group
const URGENCY_OPTIONS = [
  {
    value: "routine",
    label: "Routine",
    description: "Standard scheduling, within 5-7 business days",
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Priority scheduling, within 24-48 hours",
  },
  {
    value: "emergency",
    label: "Emergency",
    description: "Immediate response, same-day service",
  },
];

export function ServiceDetailsStep() {
  // Get data and actions from Zustand store
  const { data, updateServiceDetails, nextStep, prevStep } = useFormStore();

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<ServiceDetailsInput>({
    resolver: zodResolver(serviceDetailsSchema),
    defaultValues: data.serviceDetails,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Handle form submission
  const onSubmit = (formData: ServiceDetailsInput) => {
    updateServiceDetails(formData);
    nextStep();
  };

  const onError = (_errors: Record<string, unknown>) => {
    // Validation errors are displayed inline by react-hook-form
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Form Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Service Details
          </h2>
          <p className="text-muted-foreground">
            Tell us about the electrical service you need
          </p>
        </div>

        {/* Service Type Select - FormSelect Atom */}
        <FormSelect
          label="Service Type"
          options={SERVICE_TYPE_OPTIONS}
          error={errors.serviceType?.message}
          required
          {...register("serviceType")}
        />

        {/* Urgency Radio Group - RadioGroup Atom */}
        <Controller
          name="urgency"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Service Urgency"
              options={URGENCY_OPTIONS}
              error={errors.urgency?.message}
              required
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        {/* Description Textarea - FormTextarea Atom */}
        <FormTextarea
          label="Service Description"
          placeholder="Please describe the electrical issue or service you need in detail..."
          rows={5}
          error={errors.description?.message}
          helperText="Minimum 10 characters"
          required
          {...register("description")}
        />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-secondary/80"
          >
            <svg
              className="inline-block mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <button
            type="submit"
            disabled={!isValid}
            className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-200 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed electric-glow-sm"
          >
            Continue
            <svg
              className="inline-block ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
