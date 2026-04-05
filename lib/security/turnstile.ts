interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
}

export type TurnstileVerificationResult =
  | { success: true }
  | { success: false; error: string };

export interface VerifyTurnstileTokenParams {
  token: string;
  clientId: string;
  headersList: Headers;
  secretKey?: string;
  siteUrl: string;
  logContext: "contact" | "quotation";
  timeoutMs?: number;
}

const DEFAULT_TURNSTILE_VERIFY_TIMEOUT_MS = 8000;

function normalizeHostname(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const firstValue = value
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  if (!firstValue) {
    return null;
  }

  return firstValue.split(":")[0]?.toLowerCase() ?? null;
}

function resolveExpectedTurnstileHostnames(
  headersList: Headers,
  siteUrl: string,
): string[] {
  const expectedHostnames = new Set<string>();
  const forwardedHost = normalizeHostname(headersList.get("x-forwarded-host"));
  const host = normalizeHostname(headersList.get("host"));

  if (forwardedHost) {
    expectedHostnames.add(forwardedHost);
  }

  if (host) {
    expectedHostnames.add(host);
  }

  expectedHostnames.add(new URL(siteUrl).hostname.toLowerCase());

  return Array.from(expectedHostnames);
}

function mapTurnstileFailure(errorCodes: string[]): string {
  if (errorCodes.includes("timeout-or-duplicate")) {
    return "Verification expired. Please complete verification again.";
  }

  if (
    errorCodes.includes("invalid-input-secret") ||
    errorCodes.includes("missing-input-secret")
  ) {
    return "Verification is currently unavailable. Please try again shortly.";
  }

  return "Verification failed. Please retry and submit again.";
}

export async function verifyTurnstileToken({
  token,
  clientId,
  headersList,
  secretKey,
  siteUrl,
  logContext,
  timeoutMs = DEFAULT_TURNSTILE_VERIFY_TIMEOUT_MS,
}: VerifyTurnstileTokenParams): Promise<TurnstileVerificationResult> {
  if (!secretKey) {
    return {
      success: false,
      error: "Verification is unavailable. Please try again shortly.",
    };
  }

  const expectedHostnames = resolveExpectedTurnstileHostnames(
    headersList,
    siteUrl,
  );

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), timeoutMs);

    const verificationBody = new URLSearchParams({
      secret: secretKey,
      response: token,
      idempotency_key: crypto.randomUUID(),
    });

    if (clientId !== "unknown") {
      verificationBody.set("remoteip", clientId);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationBody,
        signal: controller.signal,
      },
    );

    const payload = (await response.json()) as TurnstileVerifyResponse;
    const errorCodes = payload["error-codes"] ?? [];

    if (!response.ok || !payload.success) {
      console.warn(`[${logContext}] Turnstile verification failed`, {
        errorCodes,
      });

      return {
        success: false,
        error: mapTurnstileFailure(errorCodes),
      };
    }

    const receivedHostname = payload.hostname?.toLowerCase();

    if (receivedHostname && !expectedHostnames.includes(receivedHostname)) {
      console.warn(`[${logContext}] Turnstile hostname mismatch`, {
        expectedHostnames,
        receivedHostname,
      });

      return {
        success: false,
        error: "Verification failed. Please retry and submit again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.warn(`[${logContext}] Turnstile verification error`, {
      message: error instanceof Error ? error.message : "unknown",
    });

    return {
      success: false,
      error: "Verification service unavailable. Please retry shortly.",
    };
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
