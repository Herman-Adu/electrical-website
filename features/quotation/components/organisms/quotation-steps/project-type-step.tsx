/**
 * QUOTATION STEP: ProjectTypeStep
 *
 * Collects project category (residential/commercial/industrial),
 * specific project type, and property type.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { FormSelect } from "@/components/atoms/form-select";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  quotationProjectTypeSchema,
  type QuotationProjectTypeInput,
} from "../../../schemas/quotation-schemas";

const projectCategoryOptions = [
  {
    value: "residential",
    label: "Residential",
    description: "Homes, flats, and domestic properties",
  },
  {
    value: "commercial",
    label: "Commercial",
    description: "Offices, shops, restaurants, and business premises",
  },
  {
    value: "industrial",
    label: "Industrial",
    description: "Factories, warehouses, and manufacturing facilities",
  },
];

const residentialProjectTypes = [
  { value: "new-build", label: "New Build" },
  { value: "renovation", label: "Renovation / Refurbishment" },
  { value: "extension", label: "Extension" },
  { value: "rewire", label: "Full Rewire" },
  { value: "smart-home", label: "Smart Home Installation" },
  { value: "other", label: "Other" },
];

const commercialProjectTypes = [
  { value: "office-fit-out", label: "Office Fit-Out" },
  { value: "retail-installation", label: "Retail Installation" },
  { value: "warehouse-electrical", label: "Warehouse Electrical" },
  { value: "lighting-upgrade", label: "Lighting Upgrade" },
  { value: "other", label: "Other" },
];

const industrialProjectTypes = [
  { value: "factory-installation", label: "Factory Installation" },
  { value: "machinery-wiring", label: "Machinery Wiring" },
  { value: "power-distribution", label: "Power Distribution" },
  { value: "safety-systems", label: "Safety Systems" },
  { value: "other", label: "Other" },
];

const residentialPropertyTypes = [
  { value: "house", label: "House" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "other", label: "Other" },
];

const commercialPropertyTypes = [
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop / Retail" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "other", label: "Other" },
];

const industrialPropertyTypes = [
  { value: "warehouse", label: "Warehouse" },
  { value: "factory", label: "Factory" },
  { value: "other", label: "Other" },
];

interface ProjectTypeStepProps {
  defaultValues?: Partial<QuotationProjectTypeInput>;
  onSubmit: (data: QuotationProjectTypeInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export function ProjectTypeStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
}: ProjectTypeStepProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<QuotationProjectTypeInput>({
    resolver: zodResolver(quotationProjectTypeSchema),
    defaultValues,
    mode: "onChange",
  });

  const projectCategory = watch("projectCategory");

  // Get project types based on category
  const getProjectTypes = () => {
    switch (projectCategory) {
      case "residential":
        return residentialProjectTypes;
      case "commercial":
        return commercialProjectTypes;
      case "industrial":
        return industrialProjectTypes;
      default:
        return [];
    }
  };

  // Get property types based on category
  const getPropertyTypes = () => {
    switch (projectCategory) {
      case "residential":
        return residentialPropertyTypes;
      case "commercial":
        return commercialPropertyTypes;
      case "industrial":
        return industrialPropertyTypes;
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Project Type"
        description="Tell us about your project category and type."
        icon={<Building2 className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          {/* Project Category */}
          <Controller
            name="projectCategory"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Project Category"
                options={projectCategoryOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.projectCategory?.message}
                showRequiredHelper
                required
              />
            )}
          />

          {/* Project Type (conditional) */}
          {projectCategory && (
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="projectType"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Project Type"
                    options={[
                      { value: "", label: "Select project type..." },
                      ...getProjectTypes(),
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={errors.projectType?.message}
                    helperText="Required field"
                    required
                  />
                )}
              />

              <Controller
                name="propertyType"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Property Type"
                    options={[
                      { value: "", label: "Select property type..." },
                      ...getPropertyTypes(),
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={errors.propertyType?.message}
                    helperText="Required field"
                    required
                  />
                )}
              />
            </div>
          )}
        </div>
      </FormStepContainer>
    </form>
  );
}
