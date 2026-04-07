/**
 * VALIDATION SCHEMAS WITH ZOD
 *
 * Zod provides type-safe validation that works seamlessly with TypeScript.
 * These schemas are used with react-hook-form for real-time validation.
 *
 * BENEFITS:
 * - Type inference - TypeScript types are automatically generated from schemas
 * - Runtime validation - Catches errors before form submission
 * - Custom error messages - User-friendly validation feedback
 * - Composable - Schemas can be combined and reused
 */

import { z } from "zod";
import { getUrgencyScheduleValidationError } from "../lib/urgency-schedule";

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
});

// Step 2: Service Details Schema
export const serviceDetailsSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type"),

  urgency: z.enum(["routine", "urgent", "emergency"]),

  description: z
    .string()
    .min(10, "Please provide at least 10 characters describing your needs")
    .max(500, "Description must be less than 500 characters"),
});

// Step 3: Property Information Schema
export const propertyInfoSchema = z.object({
  address: z.string().min(5, "Please enter a valid street address"),

  city: z.string().min(2, "Please enter a valid city name"),

  county: z.string().min(2, "Please enter a valid county").optional(),

  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
      "Please enter a valid UK postcode (e.g., SW1A 1AA, EC1A 1BB)",
    ),

  propertyType: z.enum(["residential", "commercial"]),

  accessInstructions: z
    .string()
    .max(200, "Access instructions must be less than 200 characters")
    .optional(),
});

// Step 4: Schedule Preferences Schema
export const schedulePreferencesSchema = z.object({
  preferredDate: z.string().min(1, "Please select a preferred date"),

  preferredTimeSlot: z.enum(["morning", "afternoon", "evening"]),

  alternativeDate: z.string().optional(),

  flexibleScheduling: z.boolean(),
});

// Combined schema for final validation (Step 5: Review)
export const completeFormSchema = z
  .object({
    personalInfo: personalInfoSchema,
    serviceDetails: serviceDetailsSchema,
    propertyInfo: propertyInfoSchema,
    schedulePreferences: schedulePreferencesSchema,
    gdprConsent: z.literal(true, {
      errorMap: () => ({
        message: "You must consent to data processing before submitting",
      }),
    }),
    privacyTermsAccepted: z.literal(true, {
      errorMap: () => ({
        message: "You must confirm Privacy Policy and Terms before submitting",
      }),
    }),
  })
  .superRefine((data, context) => {
    const urgencyDateError = getUrgencyScheduleValidationError({
      urgency: data.serviceDetails.urgency,
      preferredDate: data.schedulePreferences.preferredDate,
    });

    if (urgencyDateError) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["schedulePreferences", "preferredDate"],
        message: urgencyDateError,
      });
    }
  });

// Export types inferred from schemas
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ServiceDetailsInput = z.infer<typeof serviceDetailsSchema>;
export type PropertyInfoInput = z.infer<typeof propertyInfoSchema>;
export type SchedulePreferencesInput = z.infer<
  typeof schedulePreferencesSchema
>;
export type CompleteFormInput = z.infer<typeof completeFormSchema>;
export type ServiceRequestData = CompleteFormInput;
