"use server";

import { headers } from "next/headers";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendUserConfirmation, sendAdminNotification } from "@/lib/email";
import { ZodError } from "zod";

/**
 * Server Action: Submit Contact Form
 *
 * Flow:
 * 1. Extract client IP from headers (set by middleware)
 * 2. Validate data with Zod (schema includes sanitization via .trim())
 * 3. Check rate limit (IP-based)
 * 4. Send confirmation email to user
 * 5. Send admin notification email
 * 6. Return success/error response
 *
 * Security:
 * - Zod validation with trim() sanitizes inputs
 * - Rate limiting prevents spam
 * - CSRF protected by Next.js server action mechanism
 * - No sensitive data in logs
 * - IP validation via middleware
 */

/**
 * Extract client IP from request headers set by middleware
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-client-ip") || "unknown";
}

/**
 * Extract email domain for logging (not logging full email)
 */
function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

/**
 * Convert Zod error to field-specific error response
 */
function getFirstZodFieldError(error: ZodError): {
  field: keyof ContactFormData;
  message: string;
} | null {
  if (error.errors.length === 0) return null;

  const firstError = error.errors[0];
  const field = firstError.path[0] as keyof ContactFormData;
  return { field, message: firstError.message };
}

export async function submitContactInquiry(
  formData: unknown,
): Promise<ContactResponse> {
  try {
    // Validate form data - Zod handles trimming and type coercion
    const validatedData = contactFormSchema.parse(formData);

    // Get client IP for rate limiting
    const clientIp = await getClientIp();

    // Rate limit configuration from env
    const rateLimitWindow =
      parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_HOURS || "1") * 3600000;
    const rateLimit = parseInt(process.env.CONTACT_RATE_LIMIT || "3");

    // Generate reference code for tracking
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const referenceCode = `NEX-${timestamp}${random}`
      .toUpperCase()
      .substring(0, 12);

    // Check rate limit
    if (!(await checkRateLimit(clientIp, rateLimit, rateLimitWindow))) {
      console.warn("[CONTACT_RATE_LIMIT_EXCEEDED]", {
        referenceCode,
        ip: clientIp === "unknown" ? "unknown" : "***",
        emailDomain: getEmailDomain(validatedData.email),
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: "Too many submissions. Please try again in an hour.",
      };
    }

    // Log submission received
    console.log("[CONTACT_INQUIRY_RECEIVED]", {
      referenceCode,
      projectType: validatedData.projectType,
      emailDomain: getEmailDomain(validatedData.email),
      timestamp: new Date().toISOString(),
    });

    // Send user confirmation email
    const confirmationResult = await sendUserConfirmation(
      validatedData.email,
      referenceCode,
    );

    if (!confirmationResult.success) {
      console.warn("[USER_CONFIRMATION_EMAIL_FAILED]", {
        referenceCode,
        emailDomain: getEmailDomain(validatedData.email),
        error: confirmationResult.error,
      });
      // Don't fail to user - email service may be temporary issue
    }

    // Send admin notification email
    const adminResult = await sendAdminNotification({
      ...validatedData,
      referenceCode,
      ipAddress: clientIp === "unknown" ? undefined : clientIp,
    });

    if (!adminResult.success) {
      console.error("[ADMIN_NOTIFICATION_EMAIL_FAILED]", {
        referenceCode,
        error: adminResult.error,
      });
      // Still return success to user - notification failure shouldn't block
    }

    // Success response
    return {
      success: true,
      referenceCode,
      message: `Your inquiry has been received. Reference: ${referenceCode}. Our team will respond within ${process.env.CONTACT_RESPONSE_TIME_HOURS || 2} hours.`,
    };
  } catch (error) {
    // Handle Zod validation errors with field-level detail
    if (error instanceof ZodError) {
      const fieldError = getFirstZodFieldError(error);

      if (fieldError) {
        return {
          success: false,
          error: fieldError.message,
          field: fieldError.field,
        };
      }

      return {
        success: false,
        error: "Please check all required fields and try again",
      };
    }

    // Handle other errors
    console.error("[CONTACT_INQUIRY_ERROR]", {
      error: error instanceof Error ? error.message : String(error),
      type: error?.constructor.name,
    });

    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
