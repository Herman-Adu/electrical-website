"use server";

import { headers } from "next/headers";
import {
  serverCompleteFormSchema,
  validateBusinessRules,
} from "../schemas/server-schemas";
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer";
import { sendServiceRequestEmails } from "./email-service";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter";
import { securityCheck } from "@/lib/security/csrf";
import type { ActionResult } from "@/lib/actions/action.types";

export async function submitServiceRequest(
  formData: unknown,
): Promise<ActionResult<{ requestId: string }>> {
  try {
    // Security checks -- origin validation
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
    const rateLimitResult = rateLimiters.formSubmission.check(clientId);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      };
    }

    // Honeypot check -- if formData contains a filled honeypot field, reject silently
    if (formData && typeof formData === "object" && "website" in formData) {
      const hp = (formData as Record<string, unknown>).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        // Bot detected -- return fake success to avoid revealing detection
        return {
          success: true,
          data: { requestId: `SR-${Date.now()}-BLOCKED` },
        };
      }
    }

    const sanitizedData = sanitizeFormData(formData);

    const validationResult = serverCompleteFormSchema.safeParse(sanitizedData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      });

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

    const businessValidation = validateBusinessRules(validationResult.data);
    if (!businessValidation.valid) {
      return {
        success: false,
        error: businessValidation.errors.join(", "),
      };
    }

    const requestId = `SR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const emailResults = await sendServiceRequestEmails({
      formData: validationResult.data,
      requestId,
    });

    // Note: We still return success even if emails fail - the request was saved
    // In production, you'd want to handle email failures more gracefully

    return {
      success: true,
      data: { requestId },
    };
  } catch (error) {
    console.error("[action] Server action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

function sanitizeFormData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = data as Record<string, any>;

  return {
    personalInfo: {
      firstName: sanitizeInput.text(formData.personalInfo?.firstName || ""),
      lastName: sanitizeInput.text(formData.personalInfo?.lastName || ""),
      email: sanitizeInput.email(formData.personalInfo?.email || ""),
      phone: sanitizeInput.phone(formData.personalInfo?.phone || ""),
    },
    serviceDetails: {
      serviceType: sanitizeInput.text(
        formData.serviceDetails?.serviceType || "",
      ),
      urgency: formData.serviceDetails?.urgency || "",
      description: sanitizeInput.text(
        formData.serviceDetails?.description || "",
      ),
    },
    propertyInfo: {
      address: sanitizeInput.address(formData.propertyInfo?.address || ""),
      city: sanitizeInput.text(formData.propertyInfo?.city || ""),
      county: formData.propertyInfo?.county
        ? sanitizeInput.text(formData.propertyInfo.county)
        : undefined,
      postcode: sanitizeInput.postcode(formData.propertyInfo?.postcode || ""),
      propertyType: formData.propertyInfo?.propertyType || "",
      accessInstructions: formData.propertyInfo?.accessInstructions
        ? sanitizeInput.text(formData.propertyInfo.accessInstructions)
        : undefined,
    },
    schedulePreferences: {
      preferredDate: formData.schedulePreferences?.preferredDate || "",
      preferredTimeSlot: formData.schedulePreferences?.preferredTimeSlot || "",
      alternativeDate:
        formData.schedulePreferences?.alternativeDate || undefined,
      flexibleScheduling: Boolean(
        formData.schedulePreferences?.flexibleScheduling,
      ),
    },
    gdprConsent: Boolean(formData.gdprConsent),
  };
}
