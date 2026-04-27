/**
 * ORGANISM: PropertyInfoStep (Step 3 of 5)
 *
 * This step collects property and location information.
 * Follows the same pattern as previous steps.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { FormInput } from "@/components/atoms/form-input";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { RadioGroup } from "@/components/atoms/radio-group";
import { useFormStore } from "../../../hooks/use-form-store";
import {
  propertyInfoSchema,
  type PropertyInfoInput,
} from "../../../schemas/schemas";

const PROPERTY_TYPE_OPTIONS = [
  {
    value: "residential",
    label: "Residential",
    description: "Home, apartment, or condo",
  },
  {
    value: "commercial",
    label: "Commercial",
    description: "Office, retail, or industrial property",
  },
];

export function PropertyInfoStep() {
  const { data, updatePropertyInfo, nextStep, prevStep } = useFormStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<PropertyInfoInput>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      ...data.propertyInfo,
      propertyType: data.propertyInfo.propertyType || undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (formData: PropertyInfoInput) => {
    updatePropertyInfo(formData);
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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-electric-cyan/10 text-electric-cyan">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Property Information
            </h2>
          </div>
          <p className="text-muted-foreground">
            Where should our electrician meet you?
          </p>
        </div>

        {/* Property Type */}
        <Controller
          name="propertyType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Property Type"
              options={PROPERTY_TYPE_OPTIONS}
              error={errors.propertyType?.message}
              showRequiredHelper
              required
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        {/* Street Address */}
        <FormInput
          label="Street Address"
          type="text"
          placeholder="123 Main Street"
          error={errors.address?.message}
          required
          {...register("address")}
        />

        {/* City, County, Postcode */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <FormInput
              label="City"
              type="text"
              placeholder="London"
              error={errors.city?.message}
              required
              {...register("city")}
            />
          </div>

          <FormInput
            label="County"
            type="text"
            placeholder="Greater London"
            error={errors.county?.message}
            {...register("county")}
          />

          <FormInput
            label="Postcode"
            type="text"
            placeholder="SW1A 1AA"
            error={errors.postcode?.message}
            required
            {...register("postcode")}
          />
        </div>

        {/* Access Instructions */}
        <FormTextarea
          label="Access Instructions (Optional)"
          placeholder="Any special instructions for accessing your property? (gate code, parking, etc.)"
          rows={3}
          error={errors.accessInstructions?.message}
          {...register("accessInstructions")}
        />

        {/* Navigation */}
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
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed electric-glow-sm"
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
