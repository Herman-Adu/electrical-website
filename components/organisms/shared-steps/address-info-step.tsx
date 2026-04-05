/**
 * SHARED STEP: AddressInfoStep
 * 
 * A reusable address information step used by multiple forms.
 * Collects UK address details with postcode validation.
 */

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MapPin } from "lucide-react"
import { FormInput } from "@/components/atoms/form-input"
import { FormStepContainer } from "@/components/molecules/form-step-container"

// UK Postcode validation
const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

const addressInfoSchema = z.object({
  addressLine1: z
    .string()
    .min(5, "Please enter a valid address")
    .max(100, "Address is too long"),
  addressLine2: z
    .string()
    .max(100, "Address line 2 is too long")
    .optional(),
  city: z
    .string()
    .min(2, "Please enter a valid city")
    .max(50, "City name is too long"),
  county: z
    .string()
    .max(50, "County name is too long")
    .optional(),
  postcode: z
    .string()
    .regex(ukPostcodeRegex, "Please enter a valid UK postcode"),
})

export type AddressInfoInput = z.infer<typeof addressInfoSchema>

interface AddressInfoStepProps {
  defaultValues?: Partial<AddressInfoInput>
  onSubmit: (data: AddressInfoInput) => void
  onPrevious?: () => void
  isFirstStep?: boolean
  isLastStep?: boolean
  title?: string
  description?: string
}

export function AddressInfoStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  title = "Site Address",
  description = "Where should we provide the service?",
}: AddressInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddressInfoInput>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues,
    mode: "onChange",
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title={title}
        description={description}
        icon={<MapPin className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="grid gap-6">
          <FormInput
            label="Address Line 1"
            placeholder="123 High Street"
            error={errors.addressLine1?.message}
            required
            {...register("addressLine1")}
          />

          <FormInput
            label="Address Line 2"
            placeholder="Flat 4B (optional)"
            error={errors.addressLine2?.message}
            {...register("addressLine2")}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="City / Town"
              placeholder="London"
              error={errors.city?.message}
              required
              {...register("city")}
            />

            <FormInput
              label="County"
              placeholder="Greater London (optional)"
              error={errors.county?.message}
              {...register("county")}
            />
          </div>

          <div className="md:w-1/2">
            <FormInput
              label="Postcode"
              placeholder="SW1A 1AA"
              error={errors.postcode?.message}
              required
              {...register("postcode")}
            />
          </div>
        </div>
      </FormStepContainer>
    </form>
  )
}
