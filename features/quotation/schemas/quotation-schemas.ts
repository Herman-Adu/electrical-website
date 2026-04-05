/**
 * QUOTATION FORM VALIDATION SCHEMAS
 *
 * Zod schemas for the quotation request form.
 * Covers residential, commercial, and industrial projects.
 */

import { z } from "zod";

// UK Phone validation - accepts mobile and landline
const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/;

// UK Postcode validation
const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

// Step 1: Contact Information
export const quotationContactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  company: z.string().max(100, "Company name is too long").optional(),
});

// Step 2: Project Type
export const quotationProjectTypeSchema = z.object({
  projectCategory: z.enum(["residential", "commercial", "industrial"], {
    required_error: "Please select a project category",
  }),
  projectType: z.enum(
    [
      // Residential
      "new-build",
      "renovation",
      "extension",
      "rewire",
      "smart-home",
      // Commercial
      "office-fit-out",
      "retail-installation",
      "warehouse-electrical",
      "lighting-upgrade",
      // Industrial
      "factory-installation",
      "machinery-wiring",
      "power-distribution",
      "safety-systems",
      // General
      "other",
    ],
    {
      required_error: "Please select a project type",
    },
  ),
  propertyType: z.enum(
    [
      "house",
      "flat",
      "bungalow",
      "office",
      "shop",
      "warehouse",
      "factory",
      "restaurant",
      "hotel",
      "other",
    ],
    {
      required_error: "Please select a property type",
    },
  ),
});

// Step 3: Project Scope
export const quotationScopeSchema = z.object({
  projectDescription: z
    .string()
    .min(20, "Please provide more detail about your project")
    .max(2000, "Description is too long"),
  estimatedSize: z.enum(["small", "medium", "large", "very-large"], {
    required_error: "Please estimate the project size",
  }),
  services: z
    .array(
      z.enum([
        "electrical-installation",
        "lighting-design",
        "power-distribution",
        "data-cabling",
        "security-systems",
        "fire-alarm",
        "emergency-lighting",
        "ev-charging",
        "solar-pv",
        "smart-automation",
        "testing-certification",
        "maintenance-contract",
        "other",
      ]),
    )
    .min(1, "Please select at least one service"),
  hasDrawings: z.boolean().default(false),
  needsDesign: z.boolean().default(false),
});

// Step 4: Site Information
export const quotationSiteSchema = z.object({
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
  siteAccessNotes: z.string().max(500, "Notes are too long").optional(),
  hasExistingElectrical: z.boolean().default(true),
  requiresAsbestosSurvey: z.boolean().default(false),
});

// Step 5: Budget & Timeline
export const quotationBudgetSchema = z.object({
  budgetRange: z.enum(
    [
      "under-5k",
      "5k-15k",
      "15k-50k",
      "50k-100k",
      "100k-250k",
      "over-250k",
      "unsure",
    ],
    {
      required_error: "Please select a budget range",
    },
  ),
  timeline: z.enum(
    [
      "urgent",
      "1-month",
      "1-3-months",
      "3-6-months",
      "6-12-months",
      "flexible",
    ],
    {
      required_error: "Please select a timeline",
    },
  ),
  preferredStartDate: z.string().optional(),
  flexibleOnBudget: z.boolean().default(false),
  flexibleOnTimeline: z.boolean().default(true),
});

// Step 6: Additional Requirements
export const quotationAdditionalSchema = z.object({
  complianceRequirements: z
    .array(
      z.enum([
        "bs7671",
        "part-p",
        "eicr",
        "fire-regulations",
        "health-safety",
        "environmental",
        "none",
      ]),
    )
    .default([]),
  specialRequirements: z
    .string()
    .max(1000, "Requirements are too long")
    .optional(),
  preferredContactMethod: z.enum(["email", "phone", "either"], {
    required_error: "Please select a preferred contact method",
  }),
  howDidYouHear: z
    .enum([
      "search-engine",
      "social-media",
      "referral",
      "repeat-customer",
      "advertisement",
      "other",
    ])
    .optional(),
  marketingConsent: z.boolean().default(false),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Complete quotation form schema
export const completeQuotationSchema = z.object({
  contact: quotationContactSchema,
  projectType: quotationProjectTypeSchema,
  scope: quotationScopeSchema,
  site: quotationSiteSchema,
  budget: quotationBudgetSchema,
  additional: quotationAdditionalSchema,
  turnstileToken: z.string().min(1, "Verification token is required"),
});

// Type exports
export type QuotationContactInput = z.infer<typeof quotationContactSchema>;
export type QuotationProjectTypeInput = z.infer<
  typeof quotationProjectTypeSchema
>;
export type QuotationScopeInput = z.infer<typeof quotationScopeSchema>;
export type QuotationSiteInput = z.infer<typeof quotationSiteSchema>;
export type QuotationBudgetInput = z.infer<typeof quotationBudgetSchema>;
export type QuotationAdditionalInput = z.infer<
  typeof quotationAdditionalSchema
>;
export type CompleteQuotationInput = z.infer<typeof completeQuotationSchema>;
