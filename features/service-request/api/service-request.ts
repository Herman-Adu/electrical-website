"use server";

import { headers } from "next/headers";
import { env } from "@/app/env";
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter";
import { securityCheck } from "@/lib/security/csrf";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import {
  completeServiceRequestSchema,
  type CompleteServiceRequestInput,
} from "../schemas/service-request-schemas";
import { sendServiceRequestEmails } from "./service-request-email-service";
import {
  buildFieldErrors,
  submitServiceRequestFormCore,
} from "./service-request-form-action";
import type {
  ServiceRequestFormActionState,
  ServiceRequestSubmissionResult,
} from "@/lib/actions/action.types";

function generateServiceRequestId(): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `SR-${timestamp}-${uuid}`;
}

function violatesEmergencySameDayRule(
  data: CompleteServiceRequestInput,
): boolean {
  if (data.serviceDetails.urgency !== "emergency") {
    return false;
  }

  const preferredDate = new Date(data.propertyInfo.preferredDate);
  if (Number.isNaN(preferredDate.getTime())) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return preferredDate >= tomorrow;
}

function sanitizeServiceRequestData(data: CompleteServiceRequestInput) {
  return {
    contact: {
      fullName: sanitizeInput.text(data.contact.fullName),
      email: sanitizeInput.email(data.contact.email),
      phone: sanitizeInput.phone(data.contact.phone),
      company: data.contact.company
        ? sanitizeInput.text(data.contact.company)
        : undefined,
    },
    serviceDetails: {
      serviceType: data.serviceDetails.serviceType,
      urgency: data.serviceDetails.urgency,
      description: sanitizeInput.text(data.serviceDetails.description),
    },
    propertyInfo: {
      propertyType: data.propertyInfo.propertyType,
      addressLine1: sanitizeInput.address(data.propertyInfo.addressLine1),
      addressLine2: data.propertyInfo.addressLine2
        ? sanitizeInput.address(data.propertyInfo.addressLine2)
        : undefined,
      city: sanitizeInput.text(data.propertyInfo.city),
      county: data.propertyInfo.county
        ? sanitizeInput.text(data.propertyInfo.county)
        : undefined,
      postcode: sanitizeInput.postcode(data.propertyInfo.postcode),
      accessInstructions: data.propertyInfo.accessInstructions
        ? sanitizeInput.text(data.propertyInfo.accessInstructions)
        : undefined,
      preferredDate: data.propertyInfo.preferredDate,
      preferredTimeSlot: data.propertyInfo.preferredTimeSlot,
      flexibleScheduling: data.propertyInfo.flexibleScheduling,
      alternativeDate: data.propertyInfo.alternativeDate,
    },
    turnstileToken: data.turnstileToken,
  };
}

export async function submitServiceRequestForm(
  previousState: ServiceRequestFormActionState,
  formData: FormData,
): Promise<ServiceRequestFormActionState> {
  return submitServiceRequestFormCore(
    previousState,
    formData,
    submitServiceRequest,
  );
}

export async function submitServiceRequest(
  data: CompleteServiceRequestInput,
): Promise<ServiceRequestSubmissionResult> {
  try {
    const security = await securityCheck({ validateOriginHeader: true });
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      };
    }

    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = rateLimiters.serviceRequest.check(clientId);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error:
          "Too many requests. Please wait a few minutes before trying again.",
      };
    }

    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      clientId,
      headersList,
      secretKey: env.TURNSTILE_SECRET_KEY,
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
      logContext: "service",
    });

    if (!turnstileResult.success) {
      return {
        success: false,
        error: turnstileResult.error,
      };
    }

    if (data && typeof data === "object" && "website" in data) {
      const hp = (data as Record<string, unknown>).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        return { success: true, requestId: `SR-${Date.now()}-BLOCKED` };
      }
    }

    const sanitizedData = sanitizeServiceRequestData(data);
    const validationResult =
      completeServiceRequestSchema.safeParse(sanitizedData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed. Please review the highlighted fields.",
        fieldErrors: buildFieldErrors(validationResult.error.issues),
      };
    }

    if (violatesEmergencySameDayRule(validationResult.data)) {
      return {
        success: false,
        error:
          "Emergency requests require same-day service. Please select today or change urgency.",
        fieldErrors: {
          "propertyInfo.preferredDate": [
            "Emergency requests require same-day service.",
          ],
        },
      };
    }

    const requestId = generateServiceRequestId();
    await sendServiceRequestEmails({
      formData: validationResult.data,
      requestId,
    });

    return { success: true, requestId };
  } catch (error) {
    console.error("[action] Service request error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
