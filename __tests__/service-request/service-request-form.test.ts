import { describe, expect, it, vi } from "vitest";
import { submitServiceRequestFormCore } from "../../features/service-request/api/service-request-form-action";

const noopSubmit = async () => ({ success: true as const });

describe("submitServiceRequestForm", () => {
  it("returns error when payload field is missing", async () => {
    const formData = new FormData();

    const result = await submitServiceRequestFormCore(
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

    const result = await submitServiceRequestFormCore(
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

    const result = await submitServiceRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/highlighted fields/i);
    expect(result.fieldErrors).toBeDefined();
    expect(Object.keys(result.fieldErrors || {}).length).toBeGreaterThan(0);
  });

  it("passes valid payload to submitServiceRequest and maps success response", async () => {
    const formData = new FormData();
    const validPayload = {
      contact: {
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: "07911123456",
      },
      serviceDetails: {
        serviceType: "electrical-repair",
        urgency: "urgent",
        description: "Socket circuit tripping repeatedly and needs inspection.",
      },
      propertyInfo: {
        propertyType: "house",
        addressLine1: "1 High Street",
        city: "London",
        postcode: "SW1A 1AA",
        preferredDate: "2026-04-05",
        preferredTimeSlot: "afternoon",
        flexibleScheduling: false,
      },
      turnstileToken: "token-123",
    };

    formData.set("payload", JSON.stringify(validPayload));

    const submitServiceRequest = vi.fn(async () => ({
      success: true as const,
      requestId: "SR-TEST-123",
    }));

    const result = await submitServiceRequestFormCore(
      { success: false },
      formData,
      submitServiceRequest,
    );

    expect(submitServiceRequest).toHaveBeenCalledTimes(1);
    expect(submitServiceRequest).toHaveBeenCalledWith(validPayload);
    expect(result).toEqual({
      success: true,
      requestId: "SR-TEST-123",
      error: undefined,
      fieldErrors: undefined,
    });
  });
});
