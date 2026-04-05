# Turnstile Widget Lifecycle Design — Contact Form Step 1 → Step 5

**Status:** Reintegration Design Document  
**Effective:** April 5, 2026  
**Audience:** Security, Backend, Frontend Engineering

---

## 1. EXECUTIVE SUMMARY

This document specifies the complete Turnstile CAPTCHA widget lifecycle for the 5-step contact form:

- **Step 1 (Contact Info):** Widget renders; user completes challenge; token stored in ephemeral Zustand state
- **Steps 2–4:** Token remains in Zustand (never localStorage, never logged)
- **Step 5 (Review):** Token validation checked before submit; form rejected if expired or missing
- **Server-side:** Turnstile Siteverify API validates token; form processing blocked on failure

**Core Principle:** Token is **ephemeral**—it expires after 5–10 minutes, and the form enforces re-verification if user navigates away or session expires.

---

## 2. WIDGET LIFECYCLE

### 2.1 Step 1: Widget Initialization & Rendering

**Timeline:** User lands on contact form (Step 1)

**Trigger Conditions:**

- Contact info step is active (`currentStep === 1`)
- Site key is configured: `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` is present and non-empty
- If site key is missing: show fallback error message (widget cannot render)

**Zustand State Pre-render:**

```javascript
{
  turnstileToken: null,        // ← Token from last verification (or null if first time)
  turnstileError: null,        // ← No error yet
}
```

**Widget Render Logic:**

```tsx
const widgetRenderKey = useState(0);  // Key to force re-render on retry

return (
  isTurnstileConfigured ? (
    <Turnstile
      key={widgetRenderKey}      // ← Force re-render when retry clicked
      sitekey={turnstileSiteKey}  // ← From NEXT_PUBLIC_TURNSTILE_SITE_KEY
      onLoad={...}               // ← Fires when widget iframe loads
      onVerify={...}             // ← Fires when user completes challenge
      onExpire={...}             // ← Fires when token expires (5-10 mins)
      onError={...}              // ← Fires on load failure or network error
    />
  ) : (
    <FallbackErrorMessage />
  )
);
```

**Widget Renders:**

- Embedded Cloudflare iframe with "Verify you are human" challenge
- Supports auto-solve if user is trusted; otherwise shows interactive challenge
- Challenge timeout: ~4 minutes before iframe closes

---

### 2.2 onVerify Callback: User Completes Challenge

**Trigger:** User successfully completes the CAPTCHA challenge

**Callback Signature:**

```typescript
onVerify(token: string): void
```

**Flow:**

| Step | Action                                | Zustand Update           | User Sees                                         |
| ---- | ------------------------------------- | ------------------------ | ------------------------------------------------- |
| 1    | Widget receives token from Cloudflare | None yet                 | (Widget animates success)                         |
| 2    | `onVerify()` fires                    | `turnstileToken = token` | Temporary UI confirmation (e.g., green checkmark) |
| 3    | No further action                     | `turnstileError = null`  | Widget may animate fade-out or freeze             |
| 4    | User proceeds to Step 2               | No automatic advance     | "Continue" button becomes enabled                 |

**Implementation Pattern:**

```typescript
onVerify={(token: string) => {
  // 1. Store token in ephemeral Zustand state (NOT localStorage)
  setTurnstileToken(token);

  // 2. Clear any previous error
  setTurnstileError(null);

  // 3. Log for debugging only (dev environment)
  if (process.env.NODE_ENV !== "production") {
    console.debug("[turnstile] verification succeeded", { tokenLength: token.length });
  }

  // 4. Optional: Show visual feedback (e.g., green checkmark, subtle animation)
  // Do NOT automatically advance step—user must click "Continue"
}}
```

**Token Storage:**

- **Zustand state:** `turnstileToken` (ephemeral, excluded from localStorage via `partialize`)
- **NOT stored in:** localStorage, sessionStorage, cookies, or hidden form fields
- **Token Visibility:** Never exposed to user; never logged in production; never sent to client metrics

**Token Properties:**

- **Format:** Long opaque string (e.g., `0.XXXs1mMJNS3B_VV...`)
- **Lifetime:** 5–10 minutes (after which it auto-expires in Cloudflare backend)
- **Single-use:** Token valid only once per Siteverify call (server-side idempotency key prevents replay)

---

### 2.3 onExpire Callback: Token Expires (5–10 minutes)

**Trigger:** Cloudflare backend marks token as expired (token lifetime exceeded)

**Callback Signature:**

```typescript
onExpire(): void
```

**Flow:**

| Step | Action                                        | Zustand Update                               | User Sees                                          |
| ---- | --------------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| 1    | Token lifetime exceeded in Cloudflare backend | `turnstileToken = null`                      | Widget may animate fade-out or show "expired" icon |
| 2    | `onExpire()` fires (widget detects expiry)    | `turnstileError = "Verification expired..."` | Error message + Retry button                       |
| 3    | User cannot continue without clicking Retry   | Widget state reset                           | "Continue" button remains disabled                 |
| 4    | User clicks "Retry"                           | `widgetRenderKey++` force re-render          | New widget instance appears                        |
| 5    | User re-completes challenge                   | `turnstileToken = newToken`                  | New token stored; error cleared                    |

**Implementation Pattern:**

```typescript
onExpire={() => {
  // 1. Clear stale token
  setTurnstileToken(null);

  // 2. Set user-facing error message
  setTurnstileError("Verification expired. Please try again.");

  // 3. Log event
  if (process.env.NODE_ENV !== "production") {
    console.warn("[turnstile] token expired");
  }
}}
```

**User Experience:**

```
[Verification widget]  [Status: Expired]
────────────────────────────────────────
Verification expired. Please try again.
────────────────────────────────────────
                                [Retry]
```

**Retry Logic:**

- User clicks "Retry" button → `widgetRenderKey++` → React forces Turnstile re-mount
- New widget instance renders; old token is discarded
- User must re-complete challenge to generate fresh token

---

### 2.4 onError Callback: Widget Load or Challenge Failure

**Trigger:** Turnstile widget fails to load OR user fails challenge (clicks ✕) OR network timeout

**Callback Signature:**

```typescript
onError(errorCode?: string): void
```

**Error Codes** (from `react-turnstile` library):
| Code | Meaning | Recovery |
|------|---------|----------|
| (none / undefined) | Widget load failed | Manual retry |
| `"challenge-closed"` | User clicked ✕ on challenge | Manual retry |
| `"challenge-error"` | Cloudflare backend error | Manual retry (may transient) |
| `"challenge-expired"` | Token expired during challenge | Manual retry |
| `"network-error"` | Network timeout to Cloudflare | Check connectivity; retry |
| `"unknown"` | Catch-all | Manual retry |

**Flow:**

| Step | Action                                 | Zustand Update                 | User Sees                          |
| ---- | -------------------------------------- | ------------------------------ | ---------------------------------- |
| 1    | Widget fails to load / challenge fails | `turnstileToken = null`        | Widget disappears or shows error   |
| 2    | `onError(errorCode)` fires             | `turnstileError = userMessage` | Error message + Retry button       |
| 3    | User is blocked from continuing        | Button disabled                | "Continue" button remains disabled |
| 4    | User clicks Retry                      | `widgetRenderKey++`            | New widget instance                |
| 5    | (Repeat verification)                  | New token on success           | User can proceed if succeeds       |

**Implementation Pattern:**

```typescript
onError((errorCode?: string) => {
  // 1. Clear token (if any)
  setTurnstileToken(null);

  // 2. Map error code to user-facing message
  const userMessage = mapErrorCodeToMessage(errorCode);
  setTurnstileError(userMessage);

  // 3. Log error for diagnostics
  if (process.env.NODE_ENV !== "production") {
    console.warn("[turnstile] error", { errorCode, userMessage });
  }
});

function mapErrorCodeToMessage(code?: string): string {
  switch (code) {
    case "challenge-closed":
      return "Challenge cancelled. Please try again.";
    case "network-error":
      return "Network error. Check your connection and retry.";
    case "challenge-error":
      return "Challenge failed. Please retry.";
    case "challenge-expired":
      return "Challenge expired. Please try again.";
    default:
      return "Verification failed. Please retry.";
  }
}
```

**User Experience:**

```
[Widget error or closed]
────────────────────────────────────────
Verification failed. Please retry.
────────────────────────────────────────
                                [Retry]
```

---

### 2.5 Steps 2–4: Token Persistence in Zustand

**Timeline:** User navigates Steps 2, 3, 4 (Inquiry Type, Reference Linking, Message Details)

**Zustand State:**

```javascript
{
  turnstileToken: "0.XXXs1mMJNS3B_VV...",  // ← Unchanged from Step 1
  turnstileError: null,                   // ← Unchanged
}
```

**No Actions Taken:**

- Token remains in ephemeral Zustand state
- No validation, no server calls, no token refresh
- If user goes back to Step 1, token still available (but may be expired)
- If user navigates away and returns later, token is **LOST** (Zustand not persisted) and new Widget instance will require re-verification

**Edge Case: User Revisits Step 1:**

- If token expired: `onExpire()` fires; user sees "Verification expired" message and must retry
- If token valid: Widget remains in verified state (Turnstile detects valid token); user can proceed
- If user explicitly clicks "Retry": `widgetRenderKey++` forces reset; new verification required

---

### 2.6 Step 5: Token Validation Gate Before Submit

**Timeline:** User lands on Review step (Step 5)

**UI Trigger:** "Submit Inquiry" button renders

**Client-side Gate:**

```typescript
// In SubmitInquiryButton component

function SubmitInquiryButton() {
  const { turnstileToken } = useContactStore();
  const { pending } = useFormStatus();

  const isTokenValid = Boolean(turnstileToken?.trim());
  const isDisabled = pending || !isTokenValid;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      title={!isTokenValid ? "Verification incomplete. Please go back to Step 1." : undefined}
      className="min-w-40"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : !isTokenValid ? (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Complete Verification
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Submit Inquiry
        </>
      )}
    </Button>
  );
}
```

**User Experience:**

| Scenario                  | Button State    | Tooltip                                              | User Action                      |
| ------------------------- | --------------- | ---------------------------------------------------- | -------------------------------- |
| Token valid & fresh       | Enabled (blue)  | Submit                                               | Click "Submit Inquiry"           |
| Token expired             | Disabled (gray) | "Complete Verification. Please go back to Step 1."   | Click "Back" → Step 1 → Retry    |
| Token null/empty          | Disabled (gray) | "Verification incomplete. Please go back to Step 1." | Click "Back" → Step 1 → Complete |
| Form pending (submitting) | Disabled (gray) | —                                                    | Wait for response                |

---

## 3. FAILURE-MODE MATRIX

### 3.1 Scenario: Widget Fails to Load

| Component            | Behavior                                          | User Message                         | Outcome                     |
| -------------------- | ------------------------------------------------- | ------------------------------------ | --------------------------- |
| **Client (onError)** | `turnstileToken = null`; error set; widget hidden | "Verification failed. Please retry." | User cannot proceed         |
| **Server**           | (No call attempted)                               | —                                    | —                           |
| **Step 5 Guard**     | Submit button disabled                            | "Complete Verification"              | Blocked                     |
| **Recovery**         | User clicks "Retry"; widget re-renders            | —                                    | Widget may succeed on retry |

**Root Causes (Troubleshooting):**

- Network timeout to `cdn.turnstile.com`
- Invalid site key (domain mismatch or not allowlisted)
- Cloudflare service degradation
- Browser sandbox blocking iframe (rare)

**Retention Policy:** No data retained; widget can be retried unlimited times.

---

### 3.2 Scenario: User Fails CAPTCHA Challenge

| Component            | Behavior                                                            | User Message                      | Outcome                          |
| -------------------- | ------------------------------------------------------------------- | --------------------------------- | -------------------------------- |
| **Client (onError)** | `turnstileToken = null`; error set; widget remains visible          | "Challenge failed. Please retry." | User can attempt again           |
| **Server**           | (No call attempted)                                                 | —                                 | —                                |
| **Step 5 Guard**     | Submit button disabled                                              | "Complete Verification"           | Blocked until challenge succeeds |
| **Recovery**         | Cloudflare widget re-presents challenge (interactive or auto-solve) | —                                 | User retries                     |

**Retry Limits:** None (client-side). Cloudflare enforces rate limits on failed attempts from same IP (~5 failures → 15-min cooldown).

---

### 3.3 Scenario: Token Expires Between Step 1 and Step 5

| Component                              | Behavior                                                                             | User Message                                       | Outcome                                |
| -------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------- |
| **Client (onExpire during Steps 2–4)** | `turnstileToken = null`; error NOT shown (user hasn't revealed Step 5)               | (Silent in background)                             | User unaware on Steps 2–4              |
| **Client (Step 5 Guard)**              | Token null; submit button disabled                                                   | "Complete Verification. Please go back to Step 1." | User sees message on Step 5            |
| **Server (if somehow token sent)**     | Siteverify API returns `success: false` with `error-codes: ["timeout-or-duplicate"]` | Server maps to user-facing error                   | Form rejected                          |
| **User Recovery Path**                 | Click "Back" (Step 4 → 1) → Retry widget                                             | —                                                  | Generate fresh token; retry submission |

**Why This Is Safe:**

- Client-side guard prevents expired token from ever reaching server
- Server-side verification provides defense-in-depth
- User has explicit recovery path

---

### 3.4 Scenario: Server Siteverify API Fails (4xx/5xx)

| Component                         | Behavior                                                                    | User Message                                                                            | Outcome                            |
| --------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------- |
| **Server (verifyTurnstileToken)** | Network request fails or returns error HTTP status                          | Maps error code to `"Verification is currently unavailable. Please try again shortly."` | Form rejected                      |
| **Client**                        | Form submission fails; error message displayed                              | Same message                                                                            | User sees generic error            |
| **Retry Path**                    | User can immediately retry (no token refresh needed; fresh Siteverify call) | —                                                                                       | May succeed if Cloudflare recovers |
| **Audit Log**                     | Error logged with context (error code, IP, timestamp)                       | —                                                                                       | Ops/security review possible       |

**Server Error Mapping:**

```
"invalid-input-secret" → "Service unavailable"
"missing-input-secret" → "Service unavailable"
"invalid-input-response" → "Verification failed" (user malice)
"missing-input-response" → "Verification failed" (client error)
"invalid-widget-id" → "Service unavailable"
"invalid-remoteip" → (rare, skip check)
"timeout-or-duplicate" → "Expired; try again"
```

---

### 3.5 Scenario: Network Error During Siteverify (Timeout / Connection Refused)

| Component                | Behavior                                                    | User Message                                                | Outcome                                             |
| ------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| **Server (catch block)** | Fetch times out or network error; exception caught          | `"Verification service unavailable. Please retry shortly."` | Form rejected; idempotency key prevents retry storm |
| **Client**               | Form submission fails; error displayed                      | Same message                                                | User sees error                                     |
| **Retry Path**           | User must submit form again; fresh Siteverify API call made | —                                                           | May succeed if Cloudflare recovers                  |
| **Timeout Policy**       | Server enforces `8000ms` timeout on Siteverify fetch        | —                                                           | Prevents hanging submissions                        |

**Cloudflare Siteverify Endpoint:**

```
https://challenges.cloudflare.com/turnstile/v0/siteverify
```

---

### 3.6 Scenario: Hostname Mismatch on Siteverify Response

| Component                         | Behavior                                                                 | User Message                                            | Outcome                                       |
| --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------- |
| **Server (verifyTurnstileToken)** | Response includes `hostname: "other-domain.com"`; mismatch with expected | `"Verification failed. Please retry and submit again."` | Form rejected; token voided                   |
| **Reason**                        | Token generated for different domain (XSS / subdomain confusion)         | —                                                       | Security check prevents misuse                |
| **User Recovery**                 | Unclear to user (generic error); appears as random failure               | —                                                       | Retry may work if hostname resolves correctly |
| **Ops Concern**                   | May indicate DNS misconfiguration or cached wrong sitekey                | Log hostname mismatch for investigation                 | —                                             |

**Expected Hostname Resolution:**

```typescript
const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
// e.g., "localhost", "nexgen-electrical-innovations.co.uk", etc.

if (payload.hostname && payload.hostname !== expectedHostname) {
  return { success: false, error: "..." };
}
```

---

## 4. SITEVERIFY API REQUEST DETAILS

### 4.1 Endpoint

```
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
```

### 4.2 Request Headers

```http
Content-Type: application/x-www-form-urlencoded
```

(NOT `application/json`—Cloudflare requires URL-encoded form data)

### 4.3 Request Body (URL-encoded)

| Field             | Type       | Required   | Description                                                                     |
| ----------------- | ---------- | ---------- | ------------------------------------------------------------------------------- |
| `secret`          | string     | ✓          | Server-side secret key (`TURNSTILE_SECRET_KEY`). **Never** expose to client.    |
| `response`        | string     | ✓          | Client-side token from `onVerify()` callback.                                   |
| `idempotency_key` | UUID       | (optional) | Unique token for this verification attempt; prevents retry storms. Recommended. |
| `remoteip`        | IP address | (optional) | Client IP from request headers; helps Cloudflare correlate abuse patterns.      |

### 4.4 Example Request

```javascript
const verificationBody = new URLSearchParams({
  secret: env.TURNSTILE_SECRET_KEY, // "1x0000000000000000000000000000000AA"
  response: token, // "0.XXXs1mMJNS3B_VV_ZJyHqmRaZO..."
  idempotency_key: crypto.randomUUID(), // "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
});

if (clientId !== "unknown") {
  verificationBody.set("remoteip", clientId); // "203.0.113.42"
}

const response = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    body: verificationBody,
    signal: controller.signal, // AbortSignal with 8000ms timeout
  },
);
```

### 4.5 Response Body (JSON)

```json
{
  "success": true,
  "challenge_ts": "2024-04-05T15:30:45.123Z",
  "hostname": "nexgen-electrical-innovations.co.uk",
  "error-codes": [],
  "error_codes": [],
  "score": null,
  "score_reason": null,
  "metadata": {}
}
```

| Field          | Type           | Description                                                            |
| -------------- | -------------- | ---------------------------------------------------------------------- |
| `success`      | boolean        | `true` if token valid; `false` otherwise. **Always check this field.** |
| `challenge_ts` | ISO8601        | Timestamp when user completed challenge.                               |
| `hostname`     | string         | Domain where token was generated; must match expected hostname.        |
| `error-codes`  | string[]       | (If `success: false`) Array of error strings (see 3.4 above).          |
| `score`        | null \| number | Score-based challenge result; `null` for managed challenge.            |
| `score_reason` | null \| string | Reason for score; `null` for managed challenge.                        |
| `metadata`     | object         | Custom data (if enabled); usually empty.                               |

### 4.6 Response Example: Success

```json
{
  "success": true,
  "challenge_ts": "2024-04-05T15:30:45.123Z",
  "hostname": "nexgen-electrical-innovations.co.uk",
  "error-codes": []
}
```

### 4.7 Response Example: Failure (Expired Token)

```json
{
  "success": false,
  "challenge_ts": null,
  "hostname": null,
  "error-codes": ["timeout-or-duplicate"]
}
```

### 4.8 Response Example: Failure (Invalid Secret)

```json
{
  "success": false,
  "challenge_ts": null,
  "hostname": null,
  "error-codes": ["invalid-input-secret"]
}
```

---

## 5. IMPLEMENTATION CODE PATTERNS

### 5.1 onVerify Handler (Client-side)

**File:** [features/contact/components/organisms/contact-steps/contact-info-step.tsx](features/contact/components/organisms/contact-steps/contact-info-step.tsx#L90-L100)

```typescript
/**
 * Execute when user successfully completes Turnstile challenge.
 *
 * - Token is valid for 5–10 minutes
 * - Token is single-use on server (Siteverify call consumes it)
 * - No automatic step advance; user must click "Continue"
 */
onVerify={(token: string) => {
  // 1. Store token in ephemeral Zustand state
  setTurnstileToken(token);

  // 2. Clear any previous error state
  setTurnstileError(null);

  // 3. Debug logging (development only)
  if (process.env.NODE_ENV !== "production") {
    console.debug("[turnstile] verification succeeded", {
      tokenLength: token.length,
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Optional: Emit analytics event (if applicable)
  // analytics.trackEvent("turnstile_verified", { source: "contact_form" });
}}
```

---

### 5.2 onExpire Handler (Client-side)

**File:** [features/contact/components/organisms/contact-steps/contact-info-step.tsx](features/contact/components/organisms/contact-steps/contact-info-step.tsx#L101-L110)

```typescript
/**
 * Execute when Turnstile token expires (5–10 minutes after generation).
 *
 * - Token is no longer valid for server-side verification
 * - User must retry to generate a fresh token
 * - Expiry can occur while user is filling Steps 2–4
 */
onExpire={() => {
  // 1. Clear stale token
  setTurnstileToken(null);

  // 2. Set error message (shown when user reaches Step 5)
  setTurnstileError("Verification expired. Please try again.");

  // 3. Debug logging
  if (process.env.NODE_ENV !== "production") {
    console.warn("[turnstile] token expired", {
      timestamp: new Date().toISOString(),
    });
  }

  // Note: We do NOT force user back to Step 1.
  // Error will surface when user clicks "Submit" on Step 5.
}}
```

---

### 5.3 onError Handler (Client-side)

**File:** [features/contact/components/organisms/contact-steps/contact-info-step.tsx](features/contact/components/organisms/contact-steps/contact-info-step.tsx#L111-L130)

```typescript
/**
 * Execute when Turnstile widget fails to load, user closes challenge,
 * or network error occurs.
 *
 * - Map error code to user-facing message
 * - Never expose raw error code to user
 */
onError((errorCode?: string) => {
  // 1. Clear token (widget failed, so any previous token is invalid)
  setTurnstileToken(null);

  // 2. Map error code to user message
  const userMessage = mapTurnstileErrorCode(errorCode);
  setTurnstileError(userMessage);

  // 3. Debug logging
  if (process.env.NODE_ENV !== "production") {
    console.warn("[turnstile] widget error", {
      errorCode,
      userMessage,
      timestamp: new Date().toISOString(),
    });
  }
});

function mapTurnstileErrorCode(code?: string): string {
  switch (code) {
    case "challenge-closed":
      return "Challenge was cancelled. Please try again.";
    case "challenge-error":
      return "The challenge encountered an error. Please retry.";
    case "challenge-expired":
      return "The challenge expired. Please try again.";
    case "network-error":
      return "Network error. Please check your connection and retry.";
    default:
      return "Verification failed. Please retry.";
  }
}
```

---

### 5.4 Server-side Verification (Siteverify Call)

**File:** [features/contact/api/contact-request.ts](features/contact/api/contact-request.ts#L42-L85)

```typescript
/**
 * Verify Turnstile token with Cloudflare Siteverify API.
 *
 * - Called ONLY on Step 5 form submission
 * - Never call multiple times for same token (single-use after first Siteverify)
 * - Enforces 8-second timeout to prevent hanging submissions
 * - Returns user-facing error message instead of technical details
 */
async function verifyTurnstileToken(
  token: string,
  clientId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  // 1. Environment check
  if (!env.TURNSTILE_SECRET_KEY) {
    return {
      success: false,
      error: "Verification is unavailable. Please try again shortly.",
    };
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    // 2. Set up AbortController for timeout
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), TURNSTILE_VERIFY_TIMEOUT_MS);

    // 3. Build request body (URL-encoded, NOT JSON)
    const verificationBody = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      idempotency_key: crypto.randomUUID(),
    });

    // 4. Add client IP if available (helps Cloudflare patterns)
    if (clientId !== "unknown") {
      verificationBody.set("remoteip", clientId);
    }

    // 5. Call Cloudflare Siteverify API
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationBody,
        signal: controller.signal,
      },
    );

    // 6. Abort timeout (request completed)
    clearTimeout(timeout);

    // 7. Parse response
    const payload = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
      hostname?: string;
    };

    const errorCodes = payload["error-codes"] ?? [];

    // 8a. Check HTTP status
    if (!response.ok) {
      console.warn("[contact] Turnstile verification failed (HTTP)", {
        status: response.status,
        statusText: response.statusText,
      });
      return {
        success: false,
        error: mapTurnstileFailure(errorCodes),
      };
    }

    // 8b. Check `success` field
    if (!payload.success) {
      console.warn("[contact] Turnstile verification failed", {
        errorCodes,
      });
      return {
        success: false,
        error: mapTurnstileFailure(errorCodes),
      };
    }

    // 9. Hostname validation
    const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
    if (payload.hostname && payload.hostname !== expectedHostname) {
      console.warn("[contact] Turnstile hostname mismatch", {
        expectedHostname,
        receivedHostname: payload.hostname,
      });
      return {
        success: false,
        error: "Verification failed. Please retry and submit again.",
      };
    }

    // 10. Success
    return { success: true };
  } catch (error) {
    // 11. Catch network error, abort, parse error, etc.
    console.warn("[contact] Turnstile verification error", {
      message: error instanceof Error ? error.message : "unknown",
      errorType: error?.constructor?.name,
    });

    return {
      success: false,
      error: "Verification service unavailable. Please retry shortly.",
    };
  } finally {
    // 12. Ensure timeout is always cleared
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

/**
 * Map Cloudflare error codes to user-facing messages
 */
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

  if (
    errorCodes.includes("invalid-input-response") ||
    errorCodes.includes("missing-input-response")
  ) {
    return "Verification failed. Please retry and submit again.";
  }

  return "Verification failed. Please retry and submit again.";
}
```

---

### 5.5 Siteverify Call Integration in Form Submission

**File:** [features/contact/api/contact-request.ts](features/contact/api/contact-request.ts#L155-L200)

```typescript
/**
 * Form submission server action.
 *
 * Execution order:
 * 1. Security check (CSRF)
 * 2. Rate limiting (IP-based)
 * 3. Turnstile token Siteverify ← NEW
 * 4. Honeypot check
 * 5. Input sanitization
 * 6. Schema validation
 * 7. Email sending
 */
export async function submitContactRequest(
  data: CompleteContactFormInput,
): Promise<ContactSubmissionResult> {
  try {
    // ────────────────────────────────────────────────────────────
    // STEP 1: Security check (CSRF)
    // ────────────────────────────────────────────────────────────
    const security = await securityCheck({ validateOriginHeader: true });
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      };
    }

    // ────────────────────────────────────────────────────────────
    // STEP 2: Rate limiting (check before expensive verification)
    // ────────────────────────────────────────────────────────────
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = rateLimiters.contactForm.check(clientId);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      };
    }

    // ────────────────────────────────────────────────────────────
    // STEP 3: Turnstile token verification (NEW)
    // ────────────────────────────────────────────────────────────
    // Extract token from form data
    const turnstileToken = extractTurnstileToken(data);

    if (!turnstileToken) {
      return {
        success: false,
        error:
          "Verification incomplete. Please return to Step 1 and complete verification.",
      };
    }

    // Verify token with Cloudflare
    const turnstileResult = await verifyTurnstileToken(
      turnstileToken,
      clientId,
    );

    if (!turnstileResult.success) {
      return {
        success: false,
        error: turnstileResult.error,
      };
    }

    // ────────────────────────────────────────────────────────────
    // STEP 4: Honeypot check
    // ────────────────────────────────────────────────────────────
    if (data && typeof data === "object" && "website" in data) {
      const hp = (data as Record<string, unknown>).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        // Silently succeed (fake submission) to avoid bot detection
        return { success: true, referenceId: `CR-${Date.now()}-BLOCKED` };
      }
    }

    // ────────────────────────────────────────────────────────────
    // STEP 5: Input sanitization
    // ────────────────────────────────────────────────────────────
    const sanitizedData = sanitizeAllInputs(data);

    // ────────────────────────────────────────────────────────────
    // STEP 6: Schema validation
    // ────────────────────────────────────────────────────────────
    const validationResult = serverContactFormSchema.safeParse(sanitizedData);

    if (!validationResult.success) {
      const fieldErrors = buildFieldErrors(validationResult.error.issues);
      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    // ────────────────────────────────────────────────────────────
    // STEP 7: Generate reference ID & send emails
    // ────────────────────────────────────────────────────────────
    const referenceId = generateContactReferenceId();

    const emailResult = await sendContactEmails({
      ...validationResult.data,
      referenceId,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send confirmation emails",
      };
    }

    return {
      success: true,
      referenceId,
    };
  } catch (error) {
    console.error("[action] Contact submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Extract turnstile token from form data.
 * Token should be included in CompleteContactFormInput.
 */
function extractTurnstileToken(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const token = (data as Record<string, unknown>).turnstileToken;
  return typeof token === "string" ? token : null;
}

/**
 * Sanitize all string inputs
 */
function sanitizeAllInputs(data: CompleteContactFormInput) {
  return {
    contactInfo: {
      fullName: sanitizeInput.text(data.contactInfo.fullName),
      email: sanitizeInput.email(data.contactInfo.email),
      phone: sanitizeInput.phone(data.contactInfo.phone),
      company: data.contactInfo.company
        ? sanitizeInput.text(data.contactInfo.company)
        : undefined,
    },
    // ... rest of sanitization
  };
}
```

---

### 5.6 Step 5 Submit Button Token Guard (Client-side)

**File:** [features/contact/components/organisms/contact-steps/contact-review-step.tsx](features/contact/components/organisms/contact-steps/contact-review-step.tsx#L119-L145)

```typescript
/**
 * Submit button on Step 5 (Review).
 *
 * - Button disabled if `turnstileToken` is null or empty
 * - Button disabled if form submission is pending
 * - Tooltip explains why button is disabled
 */
function SubmitInquiryButton() {
  const { turnstileToken } = useContactStore();
  const { pending } = useFormStatus();

  // Check if token exists and is non-empty
  const isTokenValid = Boolean(turnstileToken?.trim());

  // Button is disabled if no token OR if form is submitting
  const isDisabled = pending || !isTokenValid;

  // Helper text
  const tooltipText = !isTokenValid
    ? "Verification incomplete. Please go back to Step 1 and complete the verification challenge."
    : undefined;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      title={tooltipText}
      className="min-w-40"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : !isTokenValid ? (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Complete Verification
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Submit Inquiry
        </>
      )}
    </Button>
  );
}

export function ContactReviewStep() {
  // ... rest of component
}
```

---

## 6. SECURITY CHECKLIST

### 6.1 Token Storage & Exposure

- ☑ **Token stored in ephemeral Zustand state ONLY** (NOT localStorage, sessionStorage, cookies, IndexedDB)
  - Verification: Zustand store uses `partialize` middleware to exclude `turnstileToken` from persistence
  - File: [features/contact/hooks/use-contact-store.ts](features/contact/hooks/use-contact-store.ts#L165-L174)

- ☑ **Token NEVER logged in production**
  - Debug logs guarded by `process.env.NODE_ENV !== "production"`
  - Verification: Search codebase for `console.log(token)` or `console.warn(token)`—results must be empty

- ☑ **Token NEVER exposed to user via UI**
  - Token is opaque internal state; no display in form, review, or confirmation screens
  - Verification: Search for `turnstileToken` in `.tsx` files outside of store/callbacks

- ☑ **Token NEVER sent to analytics/telemetry**
  - If event tracking implemented, token must be excluded
  - Verification: Check analytics event payloads; ensure no `{...token}` or `{...data}`

- ☑ **Token NEVER persisted to browser disk**
  - Zustand storage exclusion prevents re-hydration
  - Verification: Open DevTools → Application → Local Storage → Contact form storage; `turnstileToken` absent

---

### 6.2 Server-side Verification

- ☑ **Siteverify call happens BEFORE form processing**
  - Order: CSRF → Rate Limit → **Turnstile** → Honeypot → Sanitize → Validate → Send
  - Verification: Step 3 in [submitContactRequest](features/contact/api/contact-request.ts#L155-L200)

- ☑ **Server rejects form if token missing or verification fails**
  - Returns `{ success: false, error: "..." }` with user-facing message
  - Verification: No conditional branches that skip Turnstile

- ☑ **Siteverify response hostname validated**
  - Expected hostname: `new URL(env.NEXT_PUBLIC_SITE_URL).hostname`
  - Verification: Code line ~135 in contact-request.ts

- ☑ **Turnstile secret key NEVER exposed to client**
  - Secret key: `TURNSTILE_SECRET_KEY` (server-only env var, not `NEXT_PUBLIC_*`)
  - Verification: `env.ts` client section must NOT include `TURNSTILE_SECRET_KEY`
  - File: [app/env.ts](app/env.ts#L32)

- ☑ **Idempotency key included in Siteverify request**
  - Prevents retry storm if client retransmits same token
  - Verification: `idempotency_key: crypto.randomUUID()` in verifyTurnstileToken

---

### 6.3 Rate Limiting & DoS Prevention

- ☑ **Rate limiting applied BEFORE Turnstile verification**
  - Prevents abuse of Siteverify API (attacker could hammer with random tokens)
  - Current limit: **3 requests per 1 hour per IP**
  - Verification: Step 2 in submitContactRequest (before Step 3 Turnstile);see [rateLimiters.contactForm.check](features/contact/api/contact-request.ts#L160-L167)

- ☑ **Turnstile Siteverify has 8-second timeout**
  - Prevents hanging submissions if Cloudflare is slow
  - Verification: `TURNSTILE_VERIFY_TIMEOUT_MS = 8000` in contact-request.ts

- ☑ **No retry loop in Turnstile verification**
  - Single attempt per form submission; no exponential backoff
  - Verification: verifyTurnstileToken returns once; no while loop

---

### 6.4 Test Keys & Production Separation

- ☑ **Test keys configured for development ONLY**
  - Test site key: `1x00000000000000000000AA`
  - Test secret key: `1x0000000000000000000000000000000AA`
  - These keys bypass verification in dev/test environments
  - Reference: [migration-contact-hydrate.mjs](scripts/migration-contact-hydrate.mjs#L40)

- ☑ **Production keys fetched from secret management**
  - Production site key: From Cloudflare dashboard; stored in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - Production secret key: From Cloudflare dashboard; stored in Vercel/CI secret; never in repo
  - Verification: `.env.example` lists `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` (no value)

- ☑ **Site key domain allowlist checked**
  - Cloudflare dashboard settings limit widget to Nexgen Electrical domains only
  - Verification: Cloudflare panel → Turnstile → Target fields

---

### 6.5 Client-side Defense Depth

- ☑ **Submit button disabled if token missing (Step 5 guard)**
  - Prevents user from submitting without Turnstile verification
  - Verification: SubmitInquiryButton checks `isTokenValid = Boolean(turnstileToken?.trim())`

- ☑ **Token expiry detected via onExpire callback**
  - User informed on Step 5 if token expires
  - Verification: onExpire sets error message; Step 5 subscribe to store

- ☑ **Error messages do NOT expose technical details**
  - "Verification failed" (user-facing) vs. "invalid-input-response" (logged server-side)
  - Verification: mapTurnstileErrorCode and mapTurnstileFailure map codes to safe messages

---

### 6.6 Monitoring & Logging

- ☑ **All Turnstile errors logged server-side**
  - Console.warn calls for each failure scenario with context
  - Verification: Lines ~108–115, 135–142 in contact-request.ts

- ☑ **No token values logged**
  - Logs include `tokenLength`, `errorCode`, `status`, `hostname`—never full token
  - Verification: Grep for `\$\{token\}` or `token:` in console statements—results must be empty

- ☑ **Audit event created for form submission**
  - Reference ID generated and logged for email trail
  - Verification: `generateContactReferenceId()` and audit logs in email service

---

### 6.7 Environment Configuration

- ☑ **`.env.example` updated with Turnstile keys**
  - Developers know to add keys to `.env.local`
  - File: [.env.example](.env.example) (if exists)

- ☑ **`.env.local` NOT committed**
  - `.gitignore` includes `.env.local` and `.env.*.local`
  - Verification: Run `git check-ignore .env.local` → should return "is ignored"

- ☑ **Vercel secrets configured**
  - `TURNSTILE_SECRET_KEY` set in Vercel project settings
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set in Vercel project settings
  - Verification: Vercel dashboard → Settings → Environment variables

---

## 7. IMPLEMENTATION SEQUENCE

### Phase 1: Schema & Store Updates (No Breaking Changes Yet)

| Step | File                                                                        | Change                                                                                                                        | Why                                |
| ---- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1.1  | `features/contact/schemas/contact-schemas.ts`                               | Add `turnstileToken: z.string().min(1, "Verification required")` to `completeContactFormSchema` and `serverContactFormSchema` | Require token in form submission   |
| 1.2  | `features/contact/hooks/use-contact-store.ts`                               | Verify `turnstileToken` is in ephemeral state (check `partialize` middleware); ensure NOT persisted                           | Token must NOT survive page reload |
| 1.3  | `features/contact/schemas/contact-schemas.ts` (getCompleteFormData method)  | Return `turnstileToken: state.turnstileToken \|\| ""` in output object                                                        | Include token in form payload      |
| 1.4  | `features/contact/components/organisms/contact-steps/contact-info-step.tsx` | Verify `Turnstile` component renders with `onVerify`, `onExpire`, `onError` callbacks                                         | Widget must be integrated          |

**Test Point 1.4:** Manually verify:

- Step 1 loads; Turnstile widget appears
- User completes challenge; `onVerify` fires; token stored in Zustand
- No console errors; token not logged to console

---

### Phase 2: Siteverify Integration (Add Server Verification)

| Step | File                                      | Change                                                                                      | Why                                    |
| ---- | ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------- |
| 2.1  | `features/contact/api/contact-request.ts` | Call `verifyTurnstileToken(token, clientId)` AFTER rate limit check, BEFORE honeypot        | Server verifies token authenticity     |
| 2.2  | `features/contact/api/contact-request.ts` | If `verifyTurnstileToken` returns `success: false`, return `{ success: false, error: ... }` | Block form submission on token failure |
| 2.3  | `features/contact/api/contact-request.ts` | Implement `mapTurnstileFailure(errorCodes)` to map Cloudflare codes to user messages        | Error messages safe & clear            |

**Test Point 2.3:** Conditionally test (use test keys):

- Manually craft form submission with valid test token → Should succeed
- Manually craft form submission with empty token → Should fail with "Verification incomplete"
- Manually craft form submission with invalid token → Should fail with "Verification failed"

---

### Phase 3: Client-side Step 5 Guard (Add Submit Button Gate)

| Step | File                                                                                                | Change                                      | Why                                     |
| ---- | --------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| 3.1  | `features/contact/components/organisms/contact-steps/contact-review-step.tsx` (SubmitInquiryButton) | Extract `turnstileToken` from store         | Check token presence                    |
| 3.2  | `features/contact/components/organisms/contact-steps/contact-review-step.tsx` (SubmitInquiryButton) | Disable button if `!turnstileToken?.trim()` | Prevent submission without verification |
| 3.3  | `features/contact/components/organisms/contact-steps/contact-review-step.tsx` (SubmitInquiryButton) | Add tooltip explaining why disabled         | User understands how to proceed         |

**Test Point 3.3:** Manually test:

- Navigate to Step 5 without completing Step 1 verification → Button disabled; tooltip visible
- Complete Step 1 verification → Navigate to Step 5 → Button enabled
- Wait 10+ minutes (simulate token expiry) → Navigate to Step 5 → Button disabled again

---

### Phase 4: Environment Setup

| Step | File                        | Change                                                                                               | Why                           |
| ---- | --------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| 4.1  | `.env.local` (local dev)    | Add test keys (from migration script): `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`     | Widget renders in dev         |
| 4.2  | `.env.local` (local dev)    | Add test secret: `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA`                          | Server verifies tokens in dev |
| 4.3  | Vercel project (production) | Set secrets: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` (real keys from Cloudflare) | Production verification works |
| 4.4  | `.env.example`              | Document env vars (no real values)                                                                   | Developers know what to set   |

**Test Point 4.4:** Run locally with dev keys:

- `pnpm dev` → Contact form loads
- Step 1 widget appears
- Challenge completes; token stored
- Step 5 submit succeeds (assuming all other form fields valid)

---

### Phase 5: Testing & Validation

| Step | File                                        | Change                                                       | Why                         |
| ---- | ------------------------------------------- | ------------------------------------------------------------ | --------------------------- |
| 5.1  | `__tests__/contact/contact-schemas.test.ts` | Update/add test: "rejects form without turnstileToken"       | Enforce schema requirement  |
| 5.2  | `__tests__/contact/contact-schemas.test.ts` | Update/add test: "accepts form with valid turnstileToken"    | Verify schema accepts token |
| 5.3  | `e2e/contact.spec.ts` (or new)              | Add test: "Step 1 Turnstile widget → Step 5 submit succeeds" | End-to-end flow works       |
| 5.4  | `e2e/contact.spec.ts`                       | Add test: "Step 5 submit disabled if turnstileToken missing" | Guard works                 |

**Test Point 5.4:** Run tests:

```bash
pnpm test --run __tests__/contact/{schema,routing,request}.test.ts
pnpm test:e2e contact.spec.ts
```

---

### Phase 6: Code Review & Merge

- [ ] Security review: Check all 6.1–6.7 checklist items
- [ ] Credentials rotation: Ensure test keys used locally; production keys in Vercel
- [ ] Documentation: This file reviewed and linked from contact form comments
- [ ] Merge PR with Copilot review

---

## 8. DEPLOYMENT CHECKLIST

### Before Releasing to Production

- ☑ All tests passing (`pnpm test:run`, `pnpm test:e2e`)
- ☑ Build successful (`pnpm build`)
- ☑ No console errors in browser DevTools (test locally with prod-like build)
- ☑ Turnstile keys rotated (old keys revoked if changed)
- ☑ Cloudflare Turnstile dashboard domain allowlist includes production domain
- ☑ Rate limiting tested and working
- ☑ Send test contact form; verify email received
- ☑ Monitor error logs for first 24 hours post-deploy
- ☑ Audit logs show token verification events (if 6.7 monitoring implemented)

---

## 9. TROUBLESHOOTING GUIDE

### Widget Never Appears

**Symptoms:** White/blank space where widget should render

**Diagnosis:**

1. Is `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set in `.env.local`?
2. Is the site key syntactically valid? (Should be ~40 chars, e.g., `1x00000000000000000000AA`)
3. Check browser console for CORS or network errors

**Fix:**

```bash
# .env.local
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

---

### "Verification failed. Please retry." (Widget Loads but Challenge Fails)

**Symptoms:** User clicks widget, challenge appears, then fails immediately

**Diagnosis:**

1. Is your domain allowlisted in Cloudflare Turnstile settings?
2. Are you testing on localhost? (Test keys require `localhost`; prod keys require prod domain)
3. Is there a misconfiguration between test keys and prod keys?

**Fix:**

- For local dev: Use test keys in `.env.local`
- For production: Use prod keys in Vercel secrets
- Verify Cloudflare dashboard domain settings

---

### "Verification is currently unavailable. Please try again shortly." (Server Siteverify Fails)

**Symptoms:** User completes challenge on Step 1; token stored; Step 5 submit fails

**Diagnosis:**

1. Is `TURNSTILE_SECRET_KEY` set on server? (Hidden from client)
2. Is it correct? (Should match Cloudflare dashboard secret)
3. Is Cloudflare API reachable? (Network timeout?)

**Fix:**

```bash
# Vercel project → Settings → Environment Variables
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  # (test secret)
```

---

### Submit Button Stays Disabled Even After Step 1 Verification

**Symptoms:** User completes Turnstile challenge; button text changes; but button stays disabled on Step 5

**Diagnosis:**

1. Is Zustand state updating? (DevTools → Zustand > contactStore > turnstileToken)
2. Is token truthy and non-empty?
3. Is form in `pending` state? (Submitting already?)

**Fix:**

- Check browser DevTools → Zustand store; verify `turnstileToken` has value
- If token missing: Go back to Step 1; retry challenge

---

### "Verification expired. Please try again." on Step 5

**Symptoms:** User took >10 minutes between Step 1 and Step 5; token expired

**Diagnosis:** This is **expected behavior**. Token lifetime is 5–10 minutes.

**Fix:** User must go back to Step 1 and re-verify.

---

## 10. REFERENCES

### Cloudflare Turnstile Documentation

- [Turnstile Getting Started](https://developers.cloudflare.com/turnstile/get-started/)
- [Siteverify API](https://developers.cloudflare.com/turnstile/api/siteverify/)
- [Client-side JavaScript API](https://developers.cloudflare.com/turnstile/references/javascript-api/)
- [Managed Challenge vs. Non-Interactive](https://developers.cloudflare.com/turnstile/get-started/#managed-challenge)

### React Turnstile Library

- [react-turnstile on npm](https://www.npmjs.com/package/react-turnstile)
- [Callbacks: onLoad, onVerify, onExpire, onError](https://www.npmjs.com/package/react-turnstile#api)

### Project Files

- [Zustand Store](features/contact/hooks/use-contact-store.ts)
- [Contact Form Schemas](features/contact/schemas/contact-schemas.ts)
- [Contact Request Server Action](features/contact/api/contact-request.ts)
- [Contact Info Step Component](features/contact/components/organisms/contact-steps/contact-info-step.tsx)
- [Contact Review Step Component](features/contact/components/organisms/contact-steps/contact-review-step.tsx)
- [Environment Configuration](app/env.ts)

### Security & Compliance

- [OWASP: CSRF Protection](https://owasp.org/www-community/attacks/csrf)
- [OWASP: Automated Threats](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [Cloudflare: DDoS Mitigation](https://www.cloudflare.com/en-gb/ddos/)

---

**Document Version:** 1.0  
**Last Updated:** April 5, 2026  
**Next Review:** June 1, 2026 (post-production validation)
