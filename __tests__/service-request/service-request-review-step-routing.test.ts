import { describe, expect, it } from "vitest";

/**
 * Helper function to resolve field path to step number
 * Maps form field paths to conceptual steps
 */
function resolveStepFromFieldPath(fieldPath: string): number {
  if (fieldPath.startsWith("personalInfo") || fieldPath === "turnstileToken")
    return 0;
  if (fieldPath.startsWith("serviceDetails")) return 1;
  if (fieldPath.startsWith("propertyInfo")) return 2;
  if (fieldPath.startsWith("schedulePreferences")) return 3;
  return 3; // Default fallback
}

describe("resolveStepFromFieldPath (service-request)", () => {
  it("maps contact fields to step 0", () => {
    expect(resolveStepFromFieldPath("contact.email")).toBe(0);
    expect(resolveStepFromFieldPath("turnstileToken")).toBe(0);
  });

  it("maps service details fields to step 1", () => {
    expect(resolveStepFromFieldPath("serviceDetails.urgency")).toBe(1);
  });

  it("maps property fields to step 2", () => {
    expect(resolveStepFromFieldPath("propertyInfo.postcode")).toBe(2);
  });

  it("falls back to step 3", () => {
    expect(resolveStepFromFieldPath("unknown.path")).toBe(3);
  });
});
