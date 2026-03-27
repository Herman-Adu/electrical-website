"use server";

import { headers } from "next/headers";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { env } from "@/app/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendUserConfirmation, sendAdminNotification } from "@/lib/email";
import { ZodError } from "zod";

/**
 * Verify Turnstile CAPTCHA token with Cloudflare
 *
 * @param token - The CAPTCHA response token from Cloudflare Turnstile
 * @returns Promise<boolean> - True if token is valid, false if verification fails or token is invalid
 * @throws No throws; always returns boolean. Errors are logged to console.
 *
 * @example
 * const isValid = await verifyTurnstileToken(captchaToken);
 * if (!isValid) {
 *   return { success: false, error: 'CAPTCHA verification failed' };
 * }
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      error_codes?: string[];
    };

    if (!data.success) {
      console.warn("[TURNSTILE_VERIFICATION_FAILED]", {
        errors: data.error_codes,
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[TURNSTILE_VERIFICATION_ERROR]", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}

/**
 * Extract client IP from request headers set by middleware
 *
 * @returns Promise<string> - Client IP address from x-client-ip header, or "unknown"
 *
 * @example
 * const ip = await getClientIp();
 * console.log(ip); // "192.168.1.1" or "unknown"
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-client-ip") || "unknown";
}

/**
 * Extract email domain for logging (not logging full email)
 *
 * @param email - Email address to extract domain from
 * @returns The domain portion of the email (after @), lowercase
 *
 * @example
 * getEmailDomain('user@example.com'); // => 'example.com'
 * getEmailDomain('invalid-email');     // => 'unknown'
 */
function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

/**
 * Convert Zod error to field-specific error response
 *
 * @param error - ZodError with one or more validation errors
 * @returns Object with field name and message, or null if no errors
 *
 * @example
 * const fieldError = getFirstZodFieldError(zodError);
 * if (fieldError) {
 *   console.log(`${fieldError.field}: ${fieldError.message}`);
 * }
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

/**
 * Server Action: Submit Contact Form
 *
 * Processes contact form submissions with CAPTCHA verification, rate limiting, and email notifications.
 *
 * **Flow:**
 * 1. Verify Turnstile CAPTCHA token against Cloudflare
 * 2. Extract client IP from request headers (set by middleware)
 * 3. Validate form data with Zod schema (includes sanitization via .trim())
 * 4. Check IP-based rate limit (configurable window and limit via env)
 * 5. Generate reference code for inquiry tracking
 * 6. Send confirmation email to user
 * 7. Send admin notification email with details
 * 8. Return success response with reference code
 *
 * **Security Features:**
 * - Turnstile CAPTCHA verification prevents automated spam
 * - Zod validation with trim() sanitizes all inputs
 * - IP-based rate limiting prevents abuse from single source
 * - CSRF protection via Next.js server action mechanism
 * - Sensitive data (IPs, emails) never fully logged
 * - Email service failures don't fail the user submission
 *
 * @param formData - Unknown data to validate against ContactFormSchema
 * @param turnstileToken - CAPTCHA response token from Cloudflare Turnstile
 * @returns Promise<ContactResponse> - Success response with reference code or error details
 *
 * @throws Never. All errors are caught and returned as ContactResponse with success: false
 *
 * @example
 * const response = await submitContactInquiry(
 *   {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     projectType: 'commercial',
 *     message: 'Looking for solar installation services',
 *   },
 *   captchaToken
 * );
 *
 * if (response.success) {
 *   console.log(`Inquiry received! Reference: ${response.referenceCode}`);
 * } else {
 *   console.error(`Submission failed: ${response.error}`);
 * }
 */

async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const data = (await response.json()) as {
      success: boolean;
      error_codes?: string[];
    };

    if (!data.success) {
      console.warn("[TURNSTILE_VERIFICATION_FAILED]", {
        errors: data.error_codes,
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[TURNSTILE_VERIFICATION_ERROR]", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-client-ip") || "unknown";
}

function getEmailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "unknown";
}

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
  turnstileToken: string,
): Promise<ContactResponse> {
  try {
    // Verify Turnstile token first
    if (!turnstileToken || !(await verifyTurnstileToken(turnstileToken))) {
      return {
        success: false,
        error: "CAPTCHA verification failed. Please try again.",
      };
    }

    // Validate form data - Zod handles trimming and type coercion
    const validatedData = contactFormSchema.parse(formData);

    // Get client IP for rate limiting
    const clientIp = await getClientIp();

    // Rate limit configuration from env
    const rateLimitWindow = env.CONTACT_RATE_LIMIT_WINDOW_HOURS * 3600000;
    const rateLimit = env.CONTACT_RATE_LIMIT;

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
      message: `Your inquiry has been received. Reference: ${referenceCode}. Our team will respond within ${env.CONTACT_RESPONSE_TIME_HOURS} hours.`,
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
