/**
 * Contact Form Validation Schemas
 * 
 * Comprehensive validation for contact form submissions
 * supporting general inquiries, follow-ups, and reference linking
 */

import { z } from "zod"

// UK Phone validation - accepts mobile and landline
const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/

// Reference ID patterns for linking to existing requests
const serviceRequestIdRegex = /^SR-\d{13}-[A-Z0-9]{6}$/
const quoteReferenceIdRegex = /^QR-\d{13}-[A-Z0-9]{6}$/

// Step 1: Contact Information
export const contactInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  company: z
    .string()
    .max(100, "Company name is too long")
    .optional(),
})

export type ContactInfoInput = z.infer<typeof contactInfoSchema>

// Step 2: Inquiry Type
export const inquiryTypeSchema = z.object({
  inquiryType: z.enum([
    "general-inquiry",
    "service-follow-up",
    "quote-follow-up",
    "complaint",
    "feedback",
    "partnership",
    "media-press",
    "careers",
  ]),
  sector: z.enum([
    "residential",
    "commercial",
    "industrial",
    "not-applicable",
  ]),
  priority: z.enum([
    "low",
    "normal",
    "high",
    "urgent",
  ]),
})

export type InquiryTypeInput = z.infer<typeof inquiryTypeSchema>

// Step 3: Reference Linking (Optional)
export const referenceLinkingSchema = z.object({
  hasExistingReference: z.boolean(),
  referenceType: z.enum([
    "service-request",
    "quote-request",
    "none",
  ]).optional(),
  referenceId: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true
      return serviceRequestIdRegex.test(val) || quoteReferenceIdRegex.test(val)
    }, "Please enter a valid Reference ID (SR-xxx or QR-xxx format)"),
  referenceDescription: z
    .string()
    .max(200, "Description is too long")
    .optional(),
})

export type ReferenceLinkingInput = z.infer<typeof referenceLinkingSchema>

// Step 4: Message Details
export const messageDetailsSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(150, "Subject is too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message is too long (max 2000 characters)"),
  preferredContactMethod: z.enum([
    "email",
    "phone",
    "either",
  ]),
  bestTimeToContact: z.enum([
    "morning",
    "afternoon",
    "evening",
    "anytime",
  ]),
  newsletterOptIn: z.boolean().optional(),
})

export type MessageDetailsInput = z.infer<typeof messageDetailsSchema>

// Complete Contact Form Schema
export const completeContactFormSchema = z.object({
  contactInfo: contactInfoSchema,
  inquiryType: inquiryTypeSchema,
  referenceLinking: referenceLinkingSchema,
  messageDetails: messageDetailsSchema,
})

export type CompleteContactFormInput = z.infer<typeof completeContactFormSchema>

// Server-side validation with additional sanitization
export const serverContactFormSchema = z.object({
  contactInfo: z.object({
    fullName: z.string().min(2).max(100).transform(val => val.trim()),
    email: z.string().email().transform(val => val.toLowerCase().trim()),
    phone: z.string().regex(ukPhoneRegex),
    company: z.string().max(100).optional().transform(val => val?.trim()),
  }),
  inquiryType: z.object({
    inquiryType: z.enum([
      "general-inquiry",
      "service-follow-up",
      "quote-follow-up",
      "complaint",
      "feedback",
      "partnership",
      "media-press",
      "careers",
    ]),
    sector: z.enum(["residential", "commercial", "industrial", "not-applicable"]),
    priority: z.enum(["low", "normal", "high", "urgent"]),
  }),
  referenceLinking: z.object({
    hasExistingReference: z.boolean(),
    referenceType: z.enum(["service-request", "quote-request", "none"]).optional(),
    referenceId: z.string().optional(),
    referenceDescription: z.string().max(200).optional(),
  }),
  messageDetails: z.object({
    subject: z.string().min(5).max(150).transform(val => val.trim()),
    message: z.string().min(20).max(2000).transform(val => val.trim()),
    preferredContactMethod: z.enum(["email", "phone", "either"]),
    bestTimeToContact: z.enum(["morning", "afternoon", "evening", "anytime"]),
    newsletterOptIn: z.boolean().optional(),
  }),
})

export type ServerContactFormInput = z.infer<typeof serverContactFormSchema>
