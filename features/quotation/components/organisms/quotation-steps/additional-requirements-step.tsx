/**
 * QUOTATION STEP: AdditionalRequirementsStep
 *
 * Collects compliance requirements, special needs,
 * contact preferences, and terms acceptance.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { FormSelect } from "@/components/atoms/form-select";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  quotationAdditionalSchema,
  type QuotationAdditionalInput,
} from "../../../schemas/quotation-schemas";
import { cn } from "@/lib/utils";

const complianceOptions = [
  { value: "bs7671", label: "BS 7671 (18th Edition)" },
  { value: "part-p", label: "Part P Building Regulations" },
  { value: "eicr", label: "EICR Certification" },
  { value: "fire-regulations", label: "Fire Safety Regulations" },
  { value: "health-safety", label: "Health & Safety Compliance" },
  { value: "environmental", label: "Environmental Standards" },
  { value: "none", label: "None / Not Sure" },
];

const contactMethodOptions = [
  {
    value: "email",
    label: "Email",
    description: "Prefer to be contacted by email",
  },
  {
    value: "phone",
    label: "Phone",
    description: "Prefer to be contacted by phone",
  },
  {
    value: "either",
    label: "Either",
    description: "Happy to be contacted by email or phone",
  },
];

const howDidYouHearOptions = [
  { value: "", label: "Please select..." },
  { value: "search-engine", label: "Search Engine (Google, Bing, etc.)" },
  { value: "social-media", label: "Social Media" },
  { value: "referral", label: "Referral / Word of Mouth" },
  { value: "repeat-customer", label: "I'm a Repeat Customer" },
  { value: "advertisement", label: "Advertisement" },
  { value: "other", label: "Other" },
];

interface AdditionalRequirementsStepProps {
  defaultValues?: Partial<QuotationAdditionalInput>;
  onSubmit: (data: QuotationAdditionalInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export function AdditionalRequirementsStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = true,
  isSubmitting = false,
}: AdditionalRequirementsStepProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<QuotationAdditionalInput>({
    resolver: zodResolver(quotationAdditionalSchema),
    defaultValues: {
      complianceRequirements: [],
      marketingConsent: false,
      termsAccepted: false,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const selectedCompliance = watch("complianceRequirements") || [];

  const toggleCompliance = (value: string) => {
    const current = selectedCompliance;
    const updated = current.includes(
      value as QuotationAdditionalInput["complianceRequirements"][number],
    )
      ? current.filter((c) => c !== value)
      : [
          ...current,
          value as QuotationAdditionalInput["complianceRequirements"][number],
        ];
    setValue("complianceRequirements", updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Additional Requirements"
        description="Any final details to help us prepare your quotation."
        icon={<Settings className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
        isSubmitting={isSubmitting}
        submitLabel="Submit Quotation Request"
      >
        <div className="space-y-6">
          {/* Compliance Requirements */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Compliance Requirements
            </label>
            <p className="text-sm text-muted-foreground">
              Select any specific compliance or certification requirements
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {complianceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleCompliance(option.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all",
                    selectedCompliance.includes(
                      option.value as QuotationAdditionalInput["complianceRequirements"][number],
                    )
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-input hover:border-accent/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      selectedCompliance.includes(
                        option.value as QuotationAdditionalInput["complianceRequirements"][number],
                      )
                        ? "bg-accent border-accent"
                        : "border-input",
                    )}
                  >
                    {selectedCompliance.includes(
                      option.value as QuotationAdditionalInput["complianceRequirements"][number],
                    ) && (
                      <svg
                        className="w-3 h-3 text-accent-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <FormTextarea
            label="Special Requirements or Notes"
            placeholder="Any additional information that would help us prepare your quotation..."
            rows={4}
            error={errors.specialRequirements?.message}
            {...register("specialRequirements")}
          />

          {/* Preferred Contact Method */}
          <Controller
            name="preferredContactMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Preferred Contact Method"
                options={contactMethodOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.preferredContactMethod?.message}
                showRequiredHelper
                required
              />
            )}
          />

          {/* How Did You Hear */}
          <Controller
            name="howDidYouHear"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="How did you hear about us?"
                options={howDidYouHearOptions}
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />

          {/* Consent and Terms */}
          <div className="space-y-4 pt-4 border-t border-border">
            <FormCheckbox
              label="I'd like to receive marketing communications"
              description="Occasional updates about services, offers, and industry news"
              {...register("marketingConsent")}
            />

            <div
              className={cn(
                "rounded-lg border p-3 transition-colors",
                watch("termsAccepted")
                  ? "border-accent/40"
                  : "border-destructive/50",
              )}
            >
              <FormCheckbox
                label="I accept the terms and conditions"
                description="By submitting this form, you agree to our terms of service and privacy policy"
                error={errors.termsAccepted?.message}
                {...register("termsAccepted")}
              />
            </div>
          </div>
        </div>
      </FormStepContainer>
    </form>
  );
}
