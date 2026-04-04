import { describe, expect, it } from "vitest";
import {
  contactInfoSchema,
  isValidUkPhoneNumber,
} from "../../features/contact/schemas/contact-schemas";

describe("contact phone validation", () => {
  const validUkNumbers = [
    "07850153097",
    "+447850153097",
    "020 7946 0018",
    "+44 20 7946 0018",
    "01224 234567",
    "07624 123456",
  ];

  const invalidUkNumbers = [
    "07012345678",
    "07612345678",
    "08451234567",
    "12345",
    "+447001234567",
  ];

  it("accepts UK mobile and landline formats", () => {
    for (const phone of validUkNumbers) {
      expect(isValidUkPhoneNumber(phone)).toBe(true);
    }
  });

  it("rejects unsupported or invalid UK ranges", () => {
    for (const phone of invalidUkNumbers) {
      expect(isValidUkPhoneNumber(phone)).toBe(false);
    }
  });

  it("passes step-1 schema for valid contact info", () => {
    const result = contactInfoSchema.safeParse({
      fullName: "Herman Adu",
      email: "herman@adudev.co.uk",
      phone: "07850153097",
      company: "Adu Dev",
    });

    expect(result.success).toBe(true);
  });

  it("fails step-1 schema for invalid phone", () => {
    const result = contactInfoSchema.safeParse({
      fullName: "Herman Adu",
      email: "herman@adudev.co.uk",
      phone: "07012345678",
      company: "Adu Dev",
    });

    expect(result.success).toBe(false);
  });
});
