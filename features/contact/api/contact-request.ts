/**
 * Contact Form Server Action
 * 
 * Handles contact form submission with validation and email notifications
 */

"use server"

import { headers } from "next/headers"
import { serverContactFormSchema, type CompleteContactFormInput } from "../schemas/contact-schemas"
import { sendContactEmails } from "./contact-email-service"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter"
import { securityCheck } from "@/lib/security/csrf"
import type { ContactSubmissionResult } from "@/lib/actions/action.types"

function generateContactReferenceId(): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return `CR-${timestamp}-${uuid}`
}

export async function submitContactRequest(
  data: CompleteContactFormInput
): Promise<ContactSubmissionResult> {
  try {
    // Security checks
    const security = await securityCheck({ validateOriginHeader: true })
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      }
    }

    // Rate limiting
    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)
    const rateLimitResult = rateLimiters.contactForm.check(clientId)
    
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      }
    }

    // Honeypot check
    if (data && typeof data === "object" && "website" in data) {
      const hp = (data as Record<string, unknown>).website
      if (hp && typeof hp === "string" && hp.length > 0) {
        return { success: true, referenceId: `CR-${Date.now()}-BLOCKED` }
      }
    }

    // Sanitize all string inputs using shared sanitizer
    const sanitizedData = {
      contactInfo: {
        fullName: sanitizeInput.text(data.contactInfo.fullName),
        email: sanitizeInput.email(data.contactInfo.email),
        phone: sanitizeInput.phone(data.contactInfo.phone),
        company: data.contactInfo.company ? sanitizeInput.text(data.contactInfo.company) : undefined,
      },
      inquiryType: {
        inquiryType: data.inquiryType.inquiryType,
        sector: data.inquiryType.sector,
        priority: data.inquiryType.priority,
      },
      referenceLinking: {
        hasExistingReference: data.referenceLinking.hasExistingReference,
        referenceType: data.referenceLinking.referenceType,
        referenceId: data.referenceLinking.referenceId ? sanitizeInput.text(data.referenceLinking.referenceId) : undefined,
        referenceDescription: data.referenceLinking.referenceDescription 
          ? sanitizeInput.text(data.referenceLinking.referenceDescription) 
          : undefined,
      },
      messageDetails: {
        subject: sanitizeInput.text(data.messageDetails.subject),
        message: sanitizeInput.text(data.messageDetails.message),
        preferredContactMethod: data.messageDetails.preferredContactMethod,
        bestTimeToContact: data.messageDetails.bestTimeToContact,
        newsletterOptIn: data.messageDetails.newsletterOptIn,
      },
    }

    // Validate with server-side schema
    const validationResult = serverContactFormSchema.safeParse(sanitizedData)

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(issue.message)
      })

      return {
        success: false,
        error: "Validation failed: " + validationResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", "),
        fieldErrors,
      }
    }

    // Generate reference ID
    const referenceId = generateContactReferenceId()

    // Send emails
    const emailResult = await sendContactEmails({
      ...validationResult.data,
      referenceId,
    })

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send confirmation emails",
      }
    }

    return {
      success: true,
      referenceId,
    }
  } catch (error) {
    console.error("[action] Contact submission error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
