import { describe, expect, it } from "vitest";
import { resolveStepFromFieldPath } from "../../features/quotation/components/organisms/quotation-steps/quotation-review-step.utils";

describe("resolveStepFromFieldPath (quotation)", () => {
  it("maps contact fields to step 0", () => {
    expect(resolveStepFromFieldPath("contact.email")).toBe(0);
    expect(resolveStepFromFieldPath("turnstileToken")).toBe(0);
  });

  it("maps project type fields to step 1", () => {
    expect(resolveStepFromFieldPath("projectType.projectType")).toBe(1);
  });

  it("maps scope fields to step 2", () => {
    expect(resolveStepFromFieldPath("scope.projectDescription")).toBe(2);
  });

  it("maps site fields to step 3", () => {
    expect(resolveStepFromFieldPath("site.postcode")).toBe(3);
  });

  it("maps budget fields to step 4", () => {
    expect(resolveStepFromFieldPath("budget.timeline")).toBe(4);
  });

  it("maps additional fields to step 5", () => {
    expect(resolveStepFromFieldPath("additional.termsAccepted")).toBe(5);
  });

  it("falls back to step 6", () => {
    expect(resolveStepFromFieldPath("unknown.path")).toBe(6);
  });
});
