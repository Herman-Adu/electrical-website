import { describe, expect, it } from "vitest";
import {
  completeServiceRequestSchema,
  propertyInfoSchema,
  serviceContactSchema,
  serviceDetailsSchema,
} from "../../features/service-request/schemas/service-request-schemas";

describe("service-request schemas", () => {
  it("passes contact schema for valid contact info", () => {
    const result = serviceContactSchema.safeParse({
      fullName: "Herman Adu",
      email: "herman@adudev.co.uk",
      phone: "07850153097",
      company: "Adu Dev",
    });

    expect(result.success).toBe(true);
  });

  it("fails contact schema for invalid phone", () => {
    const result = serviceContactSchema.safeParse({
      fullName: "Herman Adu",
      email: "herman@adudev.co.uk",
      phone: "not-a-phone",
    });

    expect(result.success).toBe(false);
  });

  it("fails service details when description is too short", () => {
    const result = serviceDetailsSchema.safeParse({
      serviceType: "electrical-repair",
      urgency: "routine",
      description: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("fails property info schema for invalid postcode", () => {
    const result = propertyInfoSchema.safeParse({
      propertyType: "house",
      addressLine1: "1 High Street",
      city: "London",
      postcode: "INVALID",
      preferredDate: "2026-04-05",
      preferredTimeSlot: "morning",
      flexibleScheduling: false,
    });

    expect(result.success).toBe(false);
  });

  it("requires turnstile token in complete schema", () => {
    const result = completeServiceRequestSchema.safeParse({
      contact: {
        fullName: "Herman Adu",
        email: "herman@adudev.co.uk",
        phone: "07850153097",
      },
      serviceDetails: {
        serviceType: "electrical-repair",
        urgency: "urgent",
        description: "Lighting circuit intermittently trips and needs testing.",
      },
      propertyInfo: {
        propertyType: "house",
        addressLine1: "1 High Street",
        city: "London",
        postcode: "SW1A 1AA",
        preferredDate: "2026-04-05",
        preferredTimeSlot: "morning",
        flexibleScheduling: false,
      },
      turnstileToken: "",
    });

    expect(result.success).toBe(false);
  });

  it("passes complete schema with valid payload", () => {
    const result = completeServiceRequestSchema.safeParse({
      contact: {
        fullName: "Herman Adu",
        email: "herman@adudev.co.uk",
        phone: "07850153097",
      },
      serviceDetails: {
        serviceType: "electrical-repair",
        urgency: "urgent",
        description: "Lighting circuit intermittently trips and needs testing.",
      },
      propertyInfo: {
        propertyType: "house",
        addressLine1: "1 High Street",
        city: "London",
        postcode: "SW1A 1AA",
        preferredDate: "2026-04-05",
        preferredTimeSlot: "morning",
        flexibleScheduling: true,
        alternativeDate: "2026-04-06",
      },
      turnstileToken: "token-ok",
    });

    expect(result.success).toBe(true);
  });
});
