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
import type { ActionResult } from "@/lib/actions/action.types";

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

  expectedHostnames.add(new URL(env.NEXT_PUBLIC_SITE_URL).hostname.toLowerCase());

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
      console.warn("[quotation] Turnstile verification failed", {
        errorCodes,
      });

      return {
        success: false,
        error: mapTurnstileFailure(errorCodes),
      };
    }

    const receivedHostname = payload.hostname?.toLowerCase();

    if (receivedHostname && !expectedHostnames.includes(receivedHostname)) {
      console.warn("[quotation] Turnstile hostname mismatch", {
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
    console.warn("[quotation] Turnstile verification error", {
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

export async function submitQuotationRequest(
  formData: unknown,
): Promise<ActionResult<{ requestId: string }>> {
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
    const rateLimitResult = rateLimiters.quotationRequest.check(clientId);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error:
          "Too many requests. Please wait a few minutes before trying again.",
      };
    }

    const turnstileToken =
      formData &&
      typeof formData === "object" &&
      "turnstileToken" in (formData as Record<string, unknown>)
        ? String((formData as Record<string, unknown>).turnstileToken ?? "")
        : "";

    const turnstileResult = await verifyTurnstileToken(
      turnstileToken,
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
    if (formData && typeof formData === "object" && "website" in formData) {
      const hp = (formData as Record<string, unknown>).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        return {
          success: true,
          data: { requestId: `QR-${Date.now()}-BLOCKED` },
        };
      }
    }

    const sanitizedData = sanitizeQuotationFormData(formData);

    const validationResult = completeQuotationSchema.safeParse(sanitizedData);

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

    const uuid = crypto.randomUUID().split("-")[0].toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const requestId = `QR-${timestamp}-${uuid}`;

    const emailResults = await sendQuotationRequestEmails({
      formData: validationResult.data,
      requestId,
    });

    return {
      success: true,
      data: { requestId },
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
