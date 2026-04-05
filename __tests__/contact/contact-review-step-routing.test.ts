import { describe, expect, it } from "vitest";
import { resolveStepFromFieldPath } from "../../features/contact/components/organisms/contact-steps/contact-review-step.utils";

describe("resolveStepFromFieldPath", () => {
  it("maps contact fields to step 1", () => {
    expect(resolveStepFromFieldPath("contactInfo.email")).toBe(1);
    expect(resolveStepFromFieldPath("turnstileToken")).toBe(1);
  });

  it("maps inquiry fields to step 2", () => {
    expect(resolveStepFromFieldPath("inquiryType.priority")).toBe(2);
  });

  it("maps reference fields to step 3", () => {
    expect(resolveStepFromFieldPath("referenceLinking.referenceId")).toBe(3);
  });

  it("maps message fields to step 4", () => {
    expect(resolveStepFromFieldPath("messageDetails.message")).toBe(4);
  });

  it("falls back to step 5", () => {
    expect(resolveStepFromFieldPath("unknown.path")).toBe(5);
  });
});
