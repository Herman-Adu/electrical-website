import { describe, expect, it } from "vitest";
import {
  propertyInfoSchema,
  serviceDetailsSchema,
  personalInfoSchema,
  schedulePreferencesSchema,
} from "../../features/service-request/schemas/schemas";

describe("service-request schemas", () => {
  it("passes personalInfo schema for valid contact info", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "Herman",
      lastName: "Adu",
      email: "herman@adudev.co.uk",
      phone: "07850153097",
    });

    expect(result.success).toBe(true);
  });

  it("fails personalInfo schema for invalid phone", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "Herman",
      lastName: "Adu",
      email: "herman@adudev.co.uk",
      phone: "not-a-phone",
    });

    expect(result.success).toBe(false);
  });

  it("fails serviceDetails schema when description is too short", () => {
    const result = serviceDetailsSchema.safeParse({
      serviceType: "electrical-repair",
      urgency: "routine",
      description: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("fails propertyInfo schema for invalid postcode", () => {
    const result = propertyInfoSchema.safeParse({
      address: "1 High Street",
      city: "London",
      state: "London",
      zipCode: "INVALID",
      propertyType: "residential",
    });

    expect(result.success).toBe(false);
  });

  it("passes schedulePreferences schema with valid payload", () => {
    const result = schedulePreferencesSchema.safeParse({
      preferredDate: "2026-04-15",
      preferredTimeSlot: "morning",
      flexibleScheduling: false,
    });

    expect(result.success).toBe(true);
  });

  it("passes schedulePreferences schema with flexible scheduling and alternative date", () => {
    const result = schedulePreferencesSchema.safeParse({
      preferredDate: "2026-04-15",
      preferredTimeSlot: "afternoon",
      flexibleScheduling: true,
      alternativeDate: "2026-04-16",
    });

    expect(result.success).toBe(true);
  });
});
