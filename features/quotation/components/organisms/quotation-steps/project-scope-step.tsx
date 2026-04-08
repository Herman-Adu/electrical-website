/**
 * QUOTATION STEP: ProjectScopeStep
 *
 * Collects detailed project requirements including description,
 * estimated size, required services, and design needs.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  quotationScopeSchema,
  type QuotationScopeInput,
} from "../../../schemas/quotation-schemas";
import { cn } from "@/lib/utils";

const projectSizeOptions = [
  {
    value: "small",
    label: "Small",
    description: "Single room or minor works",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Multiple rooms or moderate scope",
  },
  {
    value: "large",
    label: "Large",
    description: "Whole property or significant works",
  },
  {
    value: "very-large",
    label: "Very Large",
    description: "Major project or multiple properties",
  },
];

const serviceOptions = [
  { value: "electrical-installation", label: "Electrical Installation" },
  { value: "lighting-design", label: "Lighting Design & Installation" },
  { value: "power-distribution", label: "Power Distribution" },
  { value: "data-cabling", label: "Data & Network Cabling" },
  { value: "security-systems", label: "Security Systems" },
  { value: "fire-alarm", label: "Fire Alarm Systems" },
  { value: "emergency-lighting", label: "Emergency Lighting" },
  { value: "ev-charging", label: "EV Charging Points" },
  { value: "solar-pv", label: "Solar PV Installation" },
  { value: "smart-automation", label: "Smart Home / Building Automation" },
  { value: "testing-certification", label: "Testing & Certification" },
  { value: "maintenance-contract", label: "Maintenance Contract" },
  { value: "other", label: "Other Services" },
];

interface ProjectScopeStepProps {
  defaultValues?: Partial<QuotationScopeInput>;
  onSubmit: (data: QuotationScopeInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export function ProjectScopeStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
}: ProjectScopeStepProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<QuotationScopeInput>({
    resolver: zodResolver(quotationScopeSchema),
    defaultValues: {
      services: [],
      hasDrawings: false,
      needsDesign: false,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const selectedServices = watch("services") || [];

  const toggleService = (service: string) => {
    const current = selectedServices;
    const updated = current.includes(
      service as QuotationScopeInput["services"][number],
    )
      ? current.filter((s) => s !== service)
      : [...current, service as QuotationScopeInput["services"][number]];
    setValue("services", updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Project Scope"
        description="Describe your project requirements in detail."
        icon={<ClipboardList className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          {/* Project Description */}
          <FormTextarea
            label="Project Description"
            placeholder="Please describe your project in detail. Include any specific requirements, constraints, or goals you have in mind..."
            rows={5}
            error={errors.projectDescription?.message}
            helperText="Required field"
            required
            {...register("projectDescription")}
          />

          {/* Estimated Size */}
          <Controller
            name="estimatedSize"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Estimated Project Size"
                options={projectSizeOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.estimatedSize?.message}
                showRequiredHelper
                required
              />
            )}
          />

          {/* Services Required */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Services Required <span className="text-destructive">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              Select all services you need for your project
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {serviceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleService(option.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all",
                    selectedServices.includes(
                      option.value as QuotationScopeInput["services"][number],
                    )
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-input hover:border-accent/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      selectedServices.includes(
                        option.value as QuotationScopeInput["services"][number],
                      )
                        ? "bg-accent border-accent"
                        : "border-input",
                    )}
                  >
                    {selectedServices.includes(
                      option.value as QuotationScopeInput["services"][number],
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
            {errors.services && (
              <p className="text-sm text-destructive">
                {errors.services.message}
              </p>
            )}
            {!selectedServices.length && (
              <p className="text-xs text-destructive">Required</p>
            )}
          </div>

          {/* Additional Options */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormCheckbox
              label="I have drawings/plans available"
              description="Architectural or electrical drawings for the project"
              {...register("hasDrawings")}
            />

            <FormCheckbox
              label="I need design assistance"
              description="Help with electrical design and layout planning"
              {...register("needsDesign")}
            />
          </div>
        </div>
      </FormStepContainer>
    </form>
  );
}
