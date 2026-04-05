/**
 * Contact Form Server Action
 *
 * Handles contact form submission with validation and email notifications
 */

"use server";

import { headers } from "next/headers";
import { env } from "@/app/env";
import {
  serverContactFormSchema,
  type CompleteContactFormInput,
} from "../schemas/contact-schemas";
import { sendContactEmails } from "./contact-email-service";
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter";
import { securityCheck } from "@/lib/security/csrf";
import {
  buildFieldErrors,
  submitContactRequestFormCore,
} from "./contact-request-form-action";
import type {
  ContactFormActionState,
  ContactSubmissionResult,
} from "@/lib/actions/action.types";

function generateContactReferenceId(): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `CR-${timestamp}-${uuid}`;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
}

const TURNSTILE_VERIFY_TIMEOUT_MS = 8000;

function normalizeHostname(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const firstValue = value
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  if (!firstValue) {
    return null;
  }

  return firstValue.split(":")[0]?.toLowerCase() ?? null;
}

function resolveExpectedTurnstileHostnames(headersList: Headers): string[] {
  const expectedHostnames = new Set<string>();
  const forwardedHost = normalizeHostname(headersList.get("x-forwarded-host"));
  const host = normalizeHostname(headersList.get("host"));

  if (forwardedHost) {
    expectedHostnames.add(forwardedHost);
  }

  if (host) {
    expectedHostnames.add(host);
  }

  expectedHostnames.add(
    new URL(env.NEXT_PUBLIC_SITE_URL).hostname.toLowerCase(),
  );

  return Array.from(expectedHostnames);
}

function mapTurnstileFailure(errorCodes: string[]): string {
  if (errorCodes.includes("timeout-or-duplicate")) {
    return "Verification expired. Please complete verification again.";
  }

  if (
    errorCodes.includes("invalid-input-secret") ||
    errorCodes.includes("missing-input-secret")
  ) {
    return "Verification is currently unavailable. Please try again shortly.";
  }

  return "Verification failed. Please retry and submit again.";
}

async function verifyTurnstileToken(
  token: string,
  clientId: string,
  expectedHostnames: string[],
): Promise<{ success: true } | { success: false; error: string }> {
  if (!env.TURNSTILE_SECRET_KEY) {
    return {
      success: false,
      error: "Verification is unavailable. Please try again shortly.",
    };
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), TURNSTILE_VERIFY_TIMEOUT_MS);

    const verificationBody = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      idempotency_key: crypto.randomUUID(),
    });

    if (clientId !== "unknown") {
      verificationBody.set("remoteip", clientId);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationBody,
        signal: controller.signal,
      },
    );

    const payload = (await response.json()) as TurnstileVerifyResponse;
    const errorCodes = payload["error-codes"] ?? [];

    if (!response.ok || !payload.success) {
      console.warn("[contact] Turnstile verification failed", {
        errorCodes,
      });

      return {
        success: false,
        error: mapTurnstileFailure(errorCodes),
      };
    }

    const receivedHostname = payload.hostname?.toLowerCase();

    if (receivedHostname && !expectedHostnames.includes(receivedHostname)) {
      console.warn("[contact] Turnstile hostname mismatch", {
        expectedHostnames,
        receivedHostname,
      });

      return {
        success: false,
        error: "Verification failed. Please retry and submit again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.warn("[contact] Turnstile verification error", {
      message: error instanceof Error ? error.message : "unknown",
    });

    return {
      success: false,
      error: "Verification service unavailable. Please retry shortly.",
    };
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

export async function submitContactRequestForm(
  previousState: ContactFormActionState,
  formData: FormData,
): Promise<ContactFormActionState> {
  return submitContactRequestFormCore(
    previousState,
    formData,
    submitContactRequest,
  );
}

export async function submitContactRequest(
  data: CompleteContactFormInput,
): Promise<ContactSubmissionResult> {
  try {
    // Security checks
    const security = await securityCheck({ validateOriginHeader: true });
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      };
    }

    // Rate limiting
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const expectedHostnames = resolveExpectedTurnstileHostnames(headersList);
    const rateLimitResult = rateLimiters.contactForm.check(clientId);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      };
    }

    const turnstileResult = await verifyTurnstileToken(
      data.turnstileToken,
      clientId,
      expectedHostnames,
    );

    if (!turnstileResult.success) {
      return {
        success: false,
        error: turnstileResult.error,
      };
    }

    // Honeypot check
    if (data && typeof data === "object" && "website" in data) {
      const hp = (data as Record<string, unknown>).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        return { success: true, referenceId: `CR-${Date.now()}-BLOCKED` };
      }
    }

    // Sanitize all string inputs using shared sanitizer
    const sanitizedData = {
      contactInfo: {
        fullName: sanitizeInput.text(data.contactInfo.fullName),
        email: sanitizeInput.email(data.contactInfo.email),
        phone: sanitizeInput.phone(data.contactInfo.phone),
        company: data.contactInfo.company
          ? sanitizeInput.text(data.contactInfo.company)
          : undefined,
      },
      inquiryType: {
        inquiryType: data.inquiryType.inquiryType,
        sector: data.inquiryType.sector,
        priority: data.inquiryType.priority,
      },
      referenceLinking: {
        hasExistingReference: data.referenceLinking.hasExistingReference,
        referenceType: data.referenceLinking.referenceType,
        referenceId: data.referenceLinking.referenceId
          ? sanitizeInput.text(data.referenceLinking.referenceId)
          : undefined,
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
      turnstileToken: data.turnstileToken,
    };

    // Validate with server-side schema
    const validationResult = serverContactFormSchema.safeParse(sanitizedData);

    if (!validationResult.success) {
      const fieldErrors = buildFieldErrors(validationResult.error.issues);

      return {
        success: false,
        error:
          "Validation failed: " +
          validationResult.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(", "),
        fieldErrors,
      };
    }

    // Generate reference ID
    const referenceId = generateContactReferenceId();

    // Send emails
    const emailResult = await sendContactEmails({
      ...validationResult.data,
      referenceId,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send confirmation emails",
      };
    }

    return {
      success: true,
      referenceId,
    };
  } catch (error) {
    console.error("[action] Contact submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
