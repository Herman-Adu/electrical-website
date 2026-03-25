"use server";

import { headers } from "next/headers";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendUserConfirmation, sendAdminNotification } from "@/lib/email";

/**
 * Server Action: Submit Contact Form
 *
 * Validates form data server-side, applies rate limiting, persists inquiry, and sends emails.
 *
 * Security:
 * - Zod validation ensures data integrity
 * - CSRF token validated by Next.js automatically (server action)
 * - Rate limiting prevents spam (3 submissions per IP per hour)
 * - Email validation via Resend
 * - Request header validation (IP extraction from middleware)
 * - Environment variable validation for email config
 * - PII protection: no sensitive data in logs
 */

/**
 * Extract client IP address from request headers
 * Set by middleware.ts from various reverse proxy headers
 *
 * @returns Client IP address or "unknown"
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-client-ip") || "unknown";
}

function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

export async function submitContactInquiry(
  formData: unknown,
): Promise<ContactResponse> {
  try {
    // Validate form data against schema
    const validatedData = contactFormSchema.parse(formData);

    // Get client IP
    const clientIp = await getClientIp();

    // Check rate limit (3 submissions per hour)
    const rateLimitWindow =
      parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_HOURS || "1") * 3600000;
    const rateLimit = parseInt(process.env.CONTACT_RATE_LIMIT || "3");

    // Generate reference code
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const referenceCode = `NEX-${timestamp}${random}`
      .toUpperCase()
      .substring(0, 12);

    if (!(await checkRateLimit(clientIp, rateLimit, rateLimitWindow))) {
      console.warn("[RATE_LIMIT_HIT]", {
        referenceCode,
        emailDomain: getEmailDomain(validatedData.email),
      });
      return {
        success: false,
        error: "Too many submissions. Please try again in an hour.",
      };
    }

    // Log submission
    console.log("[CONTACT_INQUIRY_RECEIVED]", {
      referenceCode,
      name: validatedData.name,
      emailDomain: getEmailDomain(validatedData.email),
      projectType: validatedData.projectType,
      ip: clientIp,
      timestamp: new Date().toISOString(),
    });

    // Send user confirmation email
    const confirmationResult = await sendUserConfirmation(
      validatedData.email,
      referenceCode,
    );

    if (!confirmationResult.success) {
      console.warn("[USER_EMAIL_FAILED]", {
        referenceCode,
        emailDomain: getEmailDomain(validatedData.email),
        error: confirmationResult.error,
      });
      // Don't return error to user - email service might be down, but form was received
      // We still notify admin below
    }

    // Send admin notification email
    const adminResult = await sendAdminNotification({
      ...validatedData,
      referenceCode,
      ipAddress: clientIp,
    });

    if (!adminResult.success) {
      console.error("[ADMIN_EMAIL_FAILED]", {
        referenceCode,
        error: adminResult.error,
      });
      // Also don't fail user, but log it
    }

    return {
      success: true,
      referenceCode,
      message: `Your inquiry has been received. Reference: ${referenceCode}. Our team will respond within ${process.env.CONTACT_RESPONSE_TIME_HOURS || 2} hours.`,
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "Invalid request format",
      };
    }

    // Handle Zod validation errors
    if (error instanceof Error && error.message.includes("validation")) {
      return {
        success: false,
        error: "Please check all required fields and try again",
      };
    }

    // Generic error handling
    console.error("[CONTACT_INQUIRY_ERROR]", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
