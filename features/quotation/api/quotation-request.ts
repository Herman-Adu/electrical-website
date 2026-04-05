"use server";

import { headers } from "next/headers";
import { env } from "@/app/env";
import {
  completeQuotationSchema,
  type CompleteQuotationInput,
} from "../schemas/quotation-schemas";
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer";
import { sendQuotationRequestEmails } from "./quotation-email-service";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter";
import { securityCheck } from "@/lib/security/csrf";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import {
  buildFieldErrors,
  submitQuotationRequestFormCore,
} from "./quotation-request-form-action";
import type {
  QuotationFormActionState,
  QuotationSubmissionResult,
} from "@/lib/actions/action.types";

function generateQuotationRequestId(): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `QR-${timestamp}-${uuid}`;
}

export async function submitQuotationRequestForm(
  previousState: QuotationFormActionState,
  formData: FormData,
): Promise<QuotationFormActionState> {
  return submitQuotationRequestFormCore(
    previousState,
    formData,
    submitQuotationRequest,
  );
}

export async function submitQuotationRequest(
  data: CompleteQuotationInput,
): Promise<QuotationSubmissionResult> {
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
    const rateLimitResult = rateLimiters.quotationRequest.check(clientId);

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
      logContext: "quotation",
    });

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
        return {
          success: true,
          requestId: `QR-${Date.now()}-BLOCKED`,
        };
      }
    }

    const sanitizedData = sanitizeQuotationFormData(data);

    const validationResult = completeQuotationSchema.safeParse(sanitizedData);

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

    const requestId = generateQuotationRequestId();

    await sendQuotationRequestEmails({
      formData: validationResult.data,
      requestId,
    });

    return {
      success: true,
      requestId,
    };
  } catch (error) {
    console.error("[action] Quotation action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

function sanitizeQuotationFormData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = data as Record<string, any>;

  return {
    contact: {
      fullName: sanitizeInput.text(formData.contact?.fullName || ""),
      email: sanitizeInput.email(formData.contact?.email || ""),
      phone: sanitizeInput.phone(formData.contact?.phone || ""),
      company: formData.contact?.company
        ? sanitizeInput.text(formData.contact.company)
        : undefined,
    },
    projectType: {
      projectCategory: formData.projectType?.projectCategory || "",
      projectType: formData.projectType?.projectType || "",
      propertyType: formData.projectType?.propertyType || "",
    },
    scope: {
      projectDescription: sanitizeInput.text(
        formData.scope?.projectDescription || "",
      ),
      estimatedSize: formData.scope?.estimatedSize || "",
      services: Array.isArray(formData.scope?.services)
        ? formData.scope.services
        : [],
      hasDrawings: Boolean(formData.scope?.hasDrawings),
      needsDesign: Boolean(formData.scope?.needsDesign),
    },
    site: {
      addressLine1: sanitizeInput.address(formData.site?.addressLine1 || ""),
      addressLine2: formData.site?.addressLine2
        ? sanitizeInput.address(formData.site.addressLine2)
        : undefined,
      city: sanitizeInput.text(formData.site?.city || ""),
      county: formData.site?.county
        ? sanitizeInput.text(formData.site.county)
        : undefined,
      postcode: sanitizeInput.postcode(formData.site?.postcode || ""),
      siteAccessNotes: formData.site?.siteAccessNotes
        ? sanitizeInput.text(formData.site.siteAccessNotes)
        : undefined,
      hasExistingElectrical: Boolean(
        formData.site?.hasExistingElectrical ?? true,
      ),
      requiresAsbestosSurvey: Boolean(formData.site?.requiresAsbestosSurvey),
    },
    budget: {
      budgetRange: formData.budget?.budgetRange || "",
      timeline: formData.budget?.timeline || "",
      preferredStartDate: formData.budget?.preferredStartDate || undefined,
      flexibleOnBudget: Boolean(formData.budget?.flexibleOnBudget),
      flexibleOnTimeline: Boolean(formData.budget?.flexibleOnTimeline ?? true),
    },
    additional: {
      complianceRequirements: Array.isArray(
        formData.additional?.complianceRequirements,
      )
        ? formData.additional.complianceRequirements
        : [],
      specialRequirements: formData.additional?.specialRequirements
        ? sanitizeInput.text(formData.additional.specialRequirements)
        : undefined,
      preferredContactMethod: formData.additional?.preferredContactMethod || "",
      howDidYouHear: formData.additional?.howDidYouHear || undefined,
      marketingConsent: Boolean(formData.additional?.marketingConsent),
      termsAccepted: Boolean(formData.additional?.termsAccepted),
    },
    turnstileToken:
      typeof formData.turnstileToken === "string"
        ? formData.turnstileToken
        : "",
  };
}
