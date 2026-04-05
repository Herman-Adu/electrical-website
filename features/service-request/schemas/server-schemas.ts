/**
 * SERVER-SIDE VALIDATION SCHEMAS
 *
 * Separate schemas for server-side validation with stricter rules.
 * NEVER trust client-side validation alone.
 */

import { z } from "zod"

// UK Phone validation - accepts mobile and landline
// Mobile: 07xxx xxx xxx or +44 7xxx xxx xxx
// Landline: 01xxx xxxxxx, 02x xxxx xxxx, 03xxx xxxxxx, +44 1xxx, +44 2x, +44 3xxx
const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/

// UK Postcode validation - comprehensive
const ukPostcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i

export const serverPersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name too short")
    .max(50, "First name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in first name"),

  lastName: z
    .string()
    .min(2, "Last name too short")
    .max(50, "Last name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in last name"),

  email: z.string().email("Invalid email").max(254, "Email too long").toLowerCase(),

  phone: z.string().regex(ukPhoneRegex, "Invalid UK phone number format"),
})

export const serverServiceDetailsSchema = z.object({
  serviceType: z.enum([
    "electrical-repair",
    "installation",
    "inspection",
    "upgrade",
    "lighting",
    "wiring",
    "other",
  ]),

  urgency: z.enum(["routine", "urgent", "emergency"]),

  description: z.string().min(10, "Description too short").max(500, "Description too long"),
})

export const serverPropertyInfoSchema = z.object({
  address: z.string().min(5, "Address too short").max(200, "Address too long"),

  city: z
    .string()
    .min(2, "City name too short")
    .max(100, "City name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in city name"),

  county: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in county name")
    .optional(),

  postcode: z
    .string()
    .regex(ukPostcodeRegex, "Invalid UK postcode")
    .transform((val) => val.toUpperCase().replace(/\s+/g, " ").trim()),

  propertyType: z.enum(["residential", "commercial"]),

  accessInstructions: z.string().max(200, "Access instructions too long").optional(),
})

export const serverSchedulePreferencesSchema = z.object({
  preferredDate: z.string().refine((date) => {
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d >= today
  }, "Preferred date must be in the future"),

  preferredTimeSlot: z.enum(["morning", "afternoon", "evening"]),

  alternativeDate: z
    .string()
    .refine((date) => {
      if (!date) return true
      const d = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return d >= today
    }, "Alternative date must be in the future")
    .optional(),

  flexibleScheduling: z.boolean(),
})

export const serverCompleteFormSchema = z.object({
  personalInfo: serverPersonalInfoSchema,
  serviceDetails: serverServiceDetailsSchema,
  propertyInfo: serverPropertyInfoSchema,
  schedulePreferences: serverSchedulePreferencesSchema,
})

// Business rule validations
export const validateBusinessRules = (data: z.infer<typeof serverCompleteFormSchema>) => {
  const errors: string[] = []

  // Rule: Emergency services can't be scheduled for future dates
  if (data.serviceDetails.urgency === "emergency") {
    const preferredDate = new Date(data.schedulePreferences.preferredDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    if (preferredDate >= tomorrow) {
      errors.push("Emergency services must be scheduled within 24 hours")
    }
  }

  // Rule: Commercial properties require additional verification (placeholder for future)
  if (data.propertyInfo.propertyType === "commercial") {
    // Future: Add commercial verification logic
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export type ServerCompleteFormInput = z.infer<typeof serverCompleteFormSchema>
