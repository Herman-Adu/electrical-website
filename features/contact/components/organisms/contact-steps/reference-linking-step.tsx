/**
 * ORGANISM: ReferenceLinkingStep (Step 3 of 5)
 *
 * Allows users to link their inquiry to existing service requests or quotes
 */

"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, FileText, Receipt, Info } from "lucide-react";
import { FormInput } from "@/components/atoms/form-input";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { Button } from "@/components/ui/button";
import { useContactStore } from "../../../hooks/use-contact-store";
import {
  referenceLinkingSchema,
  type ReferenceLinkingInput,
} from "../../../schemas/contact-schemas";

const referenceTypeOptions = [
  {
    value: "service-request",
    label: "Service Request",
    icon: FileText,
    pattern: "SR-XXXXXXXXXXXXX-XXXXXX",
    description: "Reference from a previous service request",
  },
  {
    value: "quote-request",
    label: "Quote Request",
    icon: Receipt,
    pattern: "QR-XXXXXXXXXXXXX-XXXXXX",
    description: "Reference from a quotation",
  },
];

export function ReferenceLinkingStep() {
  const { referenceLinking, updateReferenceLinking, nextStep, prevStep } =
    useContactStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ReferenceLinkingInput>({
    resolver: zodResolver(referenceLinkingSchema),
    defaultValues: referenceLinking,
    mode: "onChange",
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const hasExistingReference = watch("hasExistingReference");
  const selectedReferenceType = watch("referenceType");

  const onSubmit = (data: ReferenceLinkingInput) => {
    updateReferenceLinking(data);
    nextStep();
  };

  const handleReferenceChoice = (hasReference: boolean) => {
    setValue("hasExistingReference", hasReference, { shouldValidate: true });
    if (!hasReference) {
      setValue("referenceType", "none", { shouldValidate: true });
      setValue("referenceId", "", { shouldValidate: true });
      setValue("referenceDescription", "", { shouldValidate: true });
    } else {
      setValue("referenceType", undefined, { shouldValidate: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-electric-cyan" />
            <h2 className="text-xl font-semibold text-foreground">
              Reference Linking
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Link your inquiry to an existing service request or quote for faster
            resolution.
          </p>
        </div>

        {/* Toggle Reference */}
        <Controller
          name="hasExistingReference"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Do you have an existing reference number?{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleReferenceChoice(true)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    field.value === true
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <p className="font-medium text-sm text-foreground">Yes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I want to link this inquiry to an existing request or quote
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleReferenceChoice(false)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    field.value === false
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <p className="font-medium text-sm text-foreground">No</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a new inquiry without a previous reference
                  </p>
                </button>
              </div>
              {errors.hasExistingReference && (
                <p className="text-sm text-destructive">
                  {errors.hasExistingReference.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Reference Details */}
        <AnimatePresence mode="wait">
          {hasExistingReference && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Reference Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Reference Type
                </label>
                <Controller
                  name="referenceType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {referenceTypeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={`p-4 rounded-lg border text-left transition-all ${
                              field.value === option.value
                                ? "border-accent bg-accent/10 ring-1 ring-accent"
                                : "border-border hover:border-accent/50 hover:bg-accent/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon
                                className={`h-5 w-5 shrink-0 ${
                                  field.value === option.value
                                    ? "text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div>
                                <p className="font-medium text-sm text-foreground">
                                  {option.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {option.description}
                                </p>
                                <code className="text-xs text-accent/70 mt-2 block font-mono">
                                  {option.pattern}
                                </code>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Reference ID Input */}
              {selectedReferenceType && selectedReferenceType !== "none" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <FormInput
                    label="Reference ID"
                    placeholder={
                      selectedReferenceType === "service-request"
                        ? "SR-1234567890123-ABC123"
                        : "QR-1234567890123-XYZ789"
                    }
                    error={errors.referenceId?.message}
                    helperText="Enter the reference ID from your confirmation email"
                    {...register("referenceId")}
                  />

                  <FormTextarea
                    label="Brief Description (Optional)"
                    placeholder="Briefly describe what this reference relates to..."
                    rows={3}
                    error={errors.referenceDescription?.message}
                    helperText="Help us quickly identify your previous request"
                    {...register("referenceDescription")}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-electric-cyan shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Where to find your reference?
              </p>
              <p className="text-xs text-muted-foreground">
                Your reference number can be found in the confirmation email you
                received after submitting a service request or quote. It starts
                with SR- or QR- followed by numbers and letters.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            type="submit"
            className="min-w-35"
            disabled={!isValid || isSubmitting}
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
