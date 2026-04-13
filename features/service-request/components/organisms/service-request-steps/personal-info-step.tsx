/**
 * ORGANISM: PersonalInfoStep (Step 1 of 5)
 *
 * This is an organism - a complex component that combines atoms and molecules
 * into a complete, functional section of the interface.
 *
 * ATOMIC DESIGN PRINCIPLE:
 * Organisms are where atoms and molecules come together to form distinct
 * sections of an interface. They:
 * - Combine multiple atoms/molecules
 * - Contain business logic and data handling
 * - Represent a complete section/feature
 * - Are context-specific but can still be reusable
 *
 * COMPOSITION PATTERN:
 * 1. Import atoms (FormInput) from components/atoms/
 * 2. Use Zustand store for state management
 * 3. Use Zod schema for validation via react-hook-form
 * 4. Handle form submission by updating store and navigating
 *
 * HOW TO EXTEND THIS PATTERN:
 * - Copy this file as a template for new steps
 * - Replace the schema and store update function
 * - Update the form fields to match your data structure
 * - Keep the same validation and navigation pattern
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FormInput } from "@/components/atoms/form-input";
import { useFormStore } from "../../../hooks/use-form-store";
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from "../../../schemas/schemas";

export function PersonalInfoStep() {
  // Get data and actions from Zustand store
  const { data, updatePersonalInfo, nextStep } = useFormStore();

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data.personalInfo,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Handle form submission
  const onSubmit = (formData: PersonalInfoInput) => {
    // Update Zustand store with new data
    updatePersonalInfo(formData);
    // Move to next step
    nextStep();
  };

  const onError = (_errors: Record<string, unknown>) => {
    // Validation errors are displayed inline via form field error states
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
            Personal Information
          </h2>
          <p className="text-foreground/70">
            Let's start with your basic contact information
          </p>
        </div>

        {/* Form Fields - Using Atoms */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* First Name - FormInput Atom */}
          <FormInput
            label="First Name"
            type="text"
            placeholder="John"
            error={errors.firstName?.message}
            required
            {...register("firstName")}
          />

          {/* Last Name - FormInput Atom */}
          <FormInput
            label="Last Name"
            type="text"
            placeholder="Doe"
            error={errors.lastName?.message}
            required
            {...register("lastName")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Email - FormInput Atom */}
          <FormInput
            label="Email Address"
            type="email"
            placeholder="john.doe@example.com"
            error={errors.email?.message}
            helperText="We'll send your service confirmation here"
            required
            {...register("email")}
          />

          {/* Phone - FormInput Atom */}
          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="555-123-4567"
            error={errors.phone?.message}
            helperText="Format: 555-123-4567"
            required
            {...register("phone")}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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
