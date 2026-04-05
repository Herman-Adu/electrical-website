import { z } from "zod";

const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/;
const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export const serviceContactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  company: z.string().max(100, "Company name is too long").optional(),
});

export const serviceDetailsSchema = z.object({
  serviceType: z.enum(
    [
      "electrical-repair",
      "electrical-installation",
      "power-outage",
      "fuse-board-upgrade",
      "lighting",
      "safety-inspection",
      "emergency-callout",
      "other",
    ],
    { required_error: "Please select a service type" },
  ),
  urgency: z.enum(["routine", "urgent", "emergency"], {
    required_error: "Please select an urgency level",
  }),
  description: z
    .string()
    .min(10, "Please provide more detail about your request")
    .max(2000, "Description is too long"),
});

export const propertyInfoSchema = z.object({
  propertyType: z.enum(
    [
      "house",
      "flat",
      "bungalow",
      "office",
      "shop",
      "warehouse",
      "factory",
      "other",
    ],
    { required_error: "Please select a property type" },
  ),
  addressLine1: z
    .string()
    .min(5, "Please enter a valid address")
    .max(100, "Address is too long"),
  addressLine2: z.string().max(100, "Address line 2 is too long").optional(),
  city: z
    .string()
    .min(2, "Please enter a valid city")
    .max(50, "City name is too long"),
  county: z.string().max(50, "County name is too long").optional(),
  postcode: z
    .string()
    .regex(ukPostcodeRegex, "Please enter a valid UK postcode"),
  accessInstructions: z
    .string()
    .max(500, "Access instructions are too long")
    .optional(),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTimeSlot: z.enum(["morning", "afternoon", "evening", "anytime"], {
    required_error: "Please select a preferred time slot",
  }),
  flexibleScheduling: z.boolean().default(false),
  alternativeDate: z.string().optional(),
});

export const completeServiceRequestSchema = z.object({
  contact: serviceContactSchema,
  serviceDetails: serviceDetailsSchema,
  propertyInfo: propertyInfoSchema,
  turnstileToken: z.string().min(1, "Verification token is required"),
});

export type ServiceContactInput = z.infer<typeof serviceContactSchema>;
export type ServiceDetailsInput = z.infer<typeof serviceDetailsSchema>;
export type PropertyInfoInput = z.infer<typeof propertyInfoSchema>;
export type CompleteServiceRequestInput = z.infer<
  typeof completeServiceRequestSchema
>;
