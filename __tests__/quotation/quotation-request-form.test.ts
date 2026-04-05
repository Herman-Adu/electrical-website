import { describe, expect, it, vi } from "vitest";
import { submitQuotationRequestFormCore } from "../../features/quotation/api/quotation-request-form-action";

const noopSubmit = async () => ({ success: true as const });

describe("submitQuotationRequestForm", () => {
  it("returns error when payload field is missing", async () => {
    const formData = new FormData();

    const result = await submitQuotationRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/invalid submission payload/i);
  });

  it("returns error when payload is invalid JSON", async () => {
    const formData = new FormData();
    formData.set("payload", "not-json");

    const result = await submitQuotationRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unable to process form payload/i);
  });

  it("returns fieldErrors when payload fails schema validation", async () => {
    const formData = new FormData();
    formData.set("payload", JSON.stringify({ contact: { fullName: "A" } }));

    const result = await submitQuotationRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/highlighted fields/i);
    expect(result.fieldErrors).toBeDefined();
    expect(Object.keys(result.fieldErrors || {}).length).toBeGreaterThan(0);
  });

  it("passes valid payload to submitQuotationRequest and maps success response", async () => {
    const formData = new FormData();
    const validPayload = {
      contact: {
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: "07911123456",
      },
      projectType: {
        projectCategory: "commercial",
        projectType: "office-fit-out",
        propertyType: "office",
      },
      scope: {
        projectDescription: "Install distribution board and lighting upgrades.",
        estimatedSize: "medium",
        services: ["electrical-installation"],
        hasDrawings: false,
        needsDesign: true,
      },
      site: {
        addressLine1: "1 High Street",
        city: "London",
        postcode: "SW1A 1AA",
        hasExistingElectrical: true,
        requiresAsbestosSurvey: false,
      },
      budget: {
        budgetRange: "15k-50k",
        timeline: "1-3-months",
        flexibleOnBudget: false,
        flexibleOnTimeline: true,
      },
      additional: {
        complianceRequirements: ["bs7671"],
        preferredContactMethod: "email",
        marketingConsent: false,
        termsAccepted: true,
      },
      turnstileToken: "token-123",
    };
    formData.set("payload", JSON.stringify(validPayload));

    const submitQuotationRequest = vi.fn(async () => ({
      success: true as const,
      requestId: "QR-TEST-123",
    }));

    const result = await submitQuotationRequestFormCore(
      { success: false },
      formData,
      submitQuotationRequest,
    );

    expect(submitQuotationRequest).toHaveBeenCalledTimes(1);
    expect(submitQuotationRequest).toHaveBeenCalledWith(validPayload);
    expect(result).toEqual({
      success: true,
      requestId: "QR-TEST-123",
      error: undefined,
      fieldErrors: undefined,
    });
  });
});
