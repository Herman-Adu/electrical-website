import { describe, expect, it } from "vitest";
import {
  SensitiveContentError,
  SensitiveContentGate,
} from "../../agent/gates/sensitive-content-gate";
import { inspectForSensitiveContent } from "../../agent/security/sensitive-content";

describe("sensitive content policy", () => {
  it("blocks restricted secret-bearing file paths in path fields", () => {
    const issues = inspectForSensitiveContent({
      filePath: "C:/repo/.env.local",
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe("restricted_path");
  });

  it("blocks environment-file style content", () => {
    const gate = new SensitiveContentGate();

    expect(() =>
      gate.validate(
        {
          payload:
            "RESEND_API_KEY=placeholder-value\nCONTACT_FROM_EMAIL=user@example.com",
        },
        "assistant_output",
      ),
    ).toThrow(SensitiveContentError);
  });

  it("allows variable-name-only discussion", () => {
    const gate = new SensitiveContentGate();

    expect(() =>
      gate.validate(
        {
          keys: ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CSRF_SECRET"],
        },
        "intent_input",
      ),
    ).not.toThrow();
  });

  it("blocks secret-like token values in sensitive fields", () => {
    const gate = new SensitiveContentGate();

    expect(() =>
      gate.validate(
        {
          secret: "ghp_abcdefghijklmnopqrstuvwxyz123456",
        },
        "intent_input",
      ),
    ).toThrow(SensitiveContentError);
  });
});
