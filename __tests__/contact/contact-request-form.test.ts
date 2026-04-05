import { describe, expect, it, vi } from "vitest";
import { submitContactRequestFormCore } from "../../features/contact/api/contact-request-form-action";

const noopSubmit = async () => ({ success: true as const });

describe("submitContactRequestForm", () => {
  it("returns error when payload field is missing", async () => {
    const formData = new FormData();

    const result = await submitContactRequestFormCore(
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

    const result = await submitContactRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unable to process form payload/i);
  });

  it("returns fieldErrors when payload fails schema validation", async () => {
    const formData = new FormData();
    formData.set("payload", JSON.stringify({ contactInfo: { fullName: "A" } }));

    const result = await submitContactRequestFormCore(
      { success: false },
      formData,
      noopSubmit,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/highlighted fields/i);
    expect(result.fieldErrors).toBeDefined();
    expect(Object.keys(result.fieldErrors || {}).length).toBeGreaterThan(0);
  });

  it("passes valid payload to submitContactRequest and maps success response", async () => {
    const formData = new FormData();
    const validPayload = {
      contactInfo: {
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: "07911123456",
      },
      inquiryType: {
        inquiryType: "general-inquiry",
        sector: "residential",
        priority: "normal",
      },
      referenceLinking: {
        hasExistingReference: false,
      },
      messageDetails: {
        subject: "Request for electrical inspection",
        message:
          "I need an electrical inspection for a residential property next week.",
        preferredContactMethod: "email",
        bestTimeToContact: "morning",
      },
      turnstileToken: "token-123",
    };
    formData.set("payload", JSON.stringify(validPayload));

    const submitContactRequest = vi.fn(async () => ({
      success: true as const,
      referenceId: "CR-TEST-123",
    }));

    const result = await submitContactRequestFormCore(
      { success: false },
      formData,
      submitContactRequest,
    );

    expect(submitContactRequest).toHaveBeenCalledTimes(1);
    expect(submitContactRequest).toHaveBeenCalledWith(validPayload);
    expect(result).toEqual({
      success: true,
      referenceId: "CR-TEST-123",
      error: undefined,
      fieldErrors: undefined,
    });
  });
});
