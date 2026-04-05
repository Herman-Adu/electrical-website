import { describe, expect, it } from "vitest";
import { resolveStepFromFieldPath } from "../../features/service-request/components/organisms/service-request-steps/service-review-step.utils";

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
