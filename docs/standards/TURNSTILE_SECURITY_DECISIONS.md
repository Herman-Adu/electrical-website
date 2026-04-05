# Turnstile Widget Lifecycle — Security Decision Rationale

**Audience:** Security Team, Architecture Review, Threat Modeling  
**Purpose:** Explain WHY each design decision was made (not just WHAT it is)  
**Status:** Design Rationale Document

---

## EXECUTIVE SUMMARY

This document records **security decisions** for Turnstile CAPTCHA reintegration in the contact form, with threat model justification for each design choice.

**Key Decisions:**

1. **Token stored in ephemeral state (NOT localStorage)** — Prevents token theft via XSS
2. **Siteverify verification BEFORE form processing** — Prevents token reuse & forgery
3. **Server validates token hostname** — Prevents subdomain confusion attacks
4. **Rate limiting BEFORE Turnstile** — Prevents API abuse
5. **Submit button gated by client-side token check** — Reduces junk submissions
6. **8-second timeout on Siteverify** — Prevents hanging requests & DoS

---

## DECISION 1: Ephemeral Token Storage (Zustand, NOT localStorage)

### Decision

> Token stored in **Zustand ephemeral state** (excluded from `persist` middleware); token is lost on page reload.

### Threat Model

**Threat A: Token Theft via Cross-Site Scripting (XSS)**

- **Attack Vector:** Malicious script injected into page (via comment injection, npm supply chain, etc.) exfiltrates token
- **Severity:** HIGH—attacker can forge form submissions from any user's session
- **Mitigation:** Token never accessible from malicious JS if not persisted to browser storage
  - XSS script CAN read Zustand in-memory state if it runs before unload
  - But XSS script CANNOT read token if page is reloaded (token lost)
  - XSS script cannot read token from localStorage (it doesn't exist there)

**Threat B: Token Compromise via Browser History/DevTools**

- **Attack Vector:** User leaves computer unattended; attacker opens DevTools → Application tab → localStorage
- **Severity:** MEDIUM—attacker sees token; can submit form once
- **Mitigation:** Token not in localStorage; attacker cannot find it
  - Even ephemeral Zustand in-memory token is hidden from DevTools Application tab (not persisted)
  - Zustand only shows persisted values in Storage

**Threat C: Token Harvesting via Malware**

- **Attack Vector:** Browser keylogger/password stealer malware reads browser memory or local storage
- **Severity:** HIGH—token exfiltrated
- **Mitigation:** Token lifetime is 5–10 minutes
  - Even if malware steals token, token valid for limited time
  - Server-side Siteverify includes strong validation (hostname, idempotency)
  - Rate limiting prevents attacker from doing unlimited resubmissions

### Why NOT Persist Token?

**Option A: Store in localStorage** ❌

```javascript
localStorage.setItem("turnstile_token", token);
```

- **Pros:** Survives page reload; user doesn't need to re-verify across tab switches
- **Cons:**
  - Accessible to SAME-ORIGIN XSS scripts (can read `localStorage.getItem("turnstile_token")`)
  - Visible in DevTools → Application tab → Local Storage
  - Persists even after user intends to log out (sessions can be hijacked)
  - OWASP recommends against storing security tokens in localStorage

**Option B: Store in sessionStorage** ⚠️

```javascript
sessionStorage.setItem("turnstile_token", token);
```

- **Pros:** Cleared on tab close (better than localStorage)
- **Cons:**
  - Still accessible to same-origin XSS (can read `sessionStorage.getItem()`)
  - Still visible in DevTools
  - Per-tab, so won't work if user switches between tabs/windows
  - Not meaningfully more secure than localStorage for this use case

**Option C: Store in Zustand ephemeral state** ✅ **CHOSEN**

```typescript
{
  turnstileToken: "0.XXX...",  // ← In-memory; NOT persisted
}
```

- **Pros:**
  - Lost on page reload (no persistence attack surface)
  - Cannot be accessed from DevTools Application tab
  - Ephemeral nature forces re-verification if user navigates away & back
  - Zustand exclusion list (`partialize`) prevents accidental persistence
  - Aligns with security best practice for CSRF tokens (short-lived, in-memory)

**Option D: Store in HTTP-only cookie** (Not applicable)

- **Pros:** Cannot be read by JavaScript (XSS-safe)
- **Cons:**
  - Turnstile token is NOT a session token; it's a challenge proof
  - Using cookie adds CSRF risk (would need SameSite=Strict)
  - Only works if form submitted via POST (our form uses hidden `<input>` in `<form>`)
  - Adds complexity; Turnstile library doesn't handle cookie storage

### Implementation Verification

```typescript
// ✓ Correct: Token in Zustand, excluded from persistence
export const useContactStore = create<ContactFormState>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: "contact-form-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        contactInfo: state.contactInfo,
        // NOTE: turnstileToken is NOT in this partialize list
        // So it will NOT be saved to localStorage
      }),
    },
  ),
);

// Verification: After form completion, reload page
// → turnstileToken should be null (lost)
// → Step 5 submit button should be disabled
// → User forced to go back to Step 1 to re-verify
```

---

## DECISION 2: Siteverify Verification BEFORE Form Processing

### Decision

> Server calls `verifyTurnstileToken()` **immediately after rate limit check**, before ANY form field processing or email sending.

### Execution Order

```
1. CSRF check ✓
2. Rate limit check ✓
3. ┌─→ Turnstile Siteverify ← EARLY, defensive
4. ├─→ Honeypot check
5. ├─→ Input sanitization
6. ├─→ Schema validation
7. └─→ Email sending
```

### Threat Model

**Threat A: Token Reuse / Replay Attack**

- **Attack Vector:** Attacker intercepts client token; resubmits same token multiple times
  ```bash
  curl -X POST .../api/submitContactForm -d "turnstileToken=0.XXX..."
  curl -X POST .../api/submitContactForm -d "turnstileToken=0.XXX..."  # Replay
  ```
- **Severity:** HIGH—attacker can spam multiple form submissions from single token
- **Mitigation:** Siteverify API is single-use per token
  - First call: `{ success: true }`
  - Second call with same token: `{ success: false, error-codes: ["timeout-or-duplicate"] }`
  - `idempotency_key` in request prevents retry storms from same client

**Threat B: Forged Token**

- **Attack Vector:** Attacker crafts fake token string; submits form without Cloudflare verification
  ```bash
  curl -X POST .../api/submitContactForm -d "turnstileToken=fakefakefake"
  ```
- **Severity:** CRITICAL—allows unlimited spam/mail bomb without CAPTCHA
- **Mitigation:** Server Siteverify validates token cryptography (only valid tokens pass)
  - Invalid token → `{ success: false }`
  - Cloudflare backend checks HMAC signature
  - Attacker cannot forge valid token without secret key

**Threat C: Expired Token**

- **Attack Vector:** User completes Step 1 on Monday; submits form on Tuesday (token expired)
- **Severity:** LOW—legitimate issue, not attack, but form should fail safely
- **Mitigation:** Siteverify checks token lifetime (5–10 minute expiry)
  - Expired token → `{ success: false, error-codes: ["timeout-or-duplicate"] }`
  - User re-verifies; new fresh token generated

### Why BEFORE Other Processing?

**Option A: Verify AFTER validation** ❌

```typescript
// WRONG: Validates form first, THEN checks token
const validationResult = serverContactFormSchema.safeParse(data); // ← Heavy
if (!validationResult.success) {
  return error;
}

const turnstileResult = await verifyTurnstileToken(token, clientId); // ← Late
if (!turnstileResult.success) {
  return error;
}
```

- **Cons:**
  - Wastes compute on form validation even if token is invalid
  - If attacker sends 1000 requests with invalid tokens, server spends resources on 1000 validation passes
  - Delays error response to attacker (no fast-path rejection)

**Option B: Verify AFTER sanitization** ⚠️

```typescript
// Mediocre: Sanitizes first, THEN verifies
const sanitizedData = sanitizeAllInputs(data); // ← I/O
const turnstileResult = await verifyTurnstileToken(token, clientId); // ← Late
```

- **Cons:**
  - Still wastes I/O on sanitization before checking token
  - Better than Option A, but not ideal

**Option C: Verify AFTER rate limit, BEFORE other processing** ✅ **CHOSEN**

```typescript
// CORRECT: Rate limit → Turnstile → Everything else
const rateLimitResult = rateLimiters.contactForm.check(clientId); // ← Fast, memory
if (!rateLimitResult.allowed) {
  return error;
}

const turnstileResult = await verifyTurnstileToken(token, clientId); // ← Early, API
if (!turnstileResult.success) {
  return error;
}

const sanitizedData = sanitizeAllInputs(data); // ← Only if verified
const validationResult = serverContactFormSchema.safeParse(sanitizedData); // ← Only if verified
```

- **Pros:**
  - Rate limit blocks repeat offenders first (no API cost)
  - Turnstile blocks forged tokens early (fail fast)
  - Only expensive operations (sanitization, validation, email) run on valid tokens
  - Defense-in-depth: multiple barriers before email is sent

### Implementation Verification

```typescript
// ✓ Correct order
export async function submitContactRequest(data) {
  // Step 1: CSRF check
  const security = await securityCheck(...);
  if (!security.valid) return error;

  // Step 2: Rate limit (light)
  const rateLimitResult = rateLimiters.contactForm.check(clientId);
  if (!rateLimitResult.allowed) return error;

  // ┌─────────────────────────────────────╗
  // │ Step 3: TURNSTILE (early)           ║
  // └─────────────────────────────────────┘
  const token = extractTurnstileToken(data);
  if (!token) return error;  // ← Before any other processing

  const turnstileResult = await verifyTurnstileToken(token, clientId);
  if (!turnstileResult.success) return error;  // ← FAIL FAST

  // Only after verified: sanitize, validate, send
  const sanitizedData = sanitizeAllInputs(data);  // ← Expensive I/O
  const validationResult = serverContactFormSchema.safeParse(sanitizedData);  // ← Expensive compute
  // ... send emails, etc.
}
```

---

## DECISION 3: Server Validates Turnstile Response Hostname

### Decision

> Server extracts `hostname` from Siteverify response; compares against expected hostname.

```typescript
const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
// e.g., "nexgen-electrical-innovations.co.uk" or "localhost"

if (payload.hostname && payload.hostname !== expectedHostname) {
  return {
    success: false,
    error: "Verification failed. Please retry and submit again.",
  };
}
```

### Threat Model

**Threat A: Subdomain Confusion / Domain Spoofing**

- **Attack Vector:** Attacker controls `evil.nexgen-electrical-innovations.co.uk` or similar
  1. Attacker sets up fake contact form on evil subdomain
  2. Attacker registers Turnstile widget for `evil.nexgen-electrical-innovations.co.uk`
  3. User completes CAPTCHA on evil site
  4. Attacker intercepts token; replays it on legitimate `contact.nexgen-electrical-innovations.co.uk`
  5. Server accepts token (hostname = `evil...` ≠ expected `contact...`)
- **Severity:** MEDIUM—requires attacker to control subdomain AND intercept token
- **Mitigation:** Server checks hostname in Siteverify response matches expected domain
  - Token generated for `evil...` will have `hostname: "evil..."`
  - Server expects `hostname: "nexgen..."` (from NEXT_PUBLIC_SITE_URL)
  - Mismatch → Token rejected

**Threat B: Token Generated on Wrong Domain (Configuration Error)**

- **Attack Vector:** Misconfiguration leads to Turnstile widget rendering on wrong domain
  - Dev site: `localhost:3000` (uses test keys for `localhost`)
  - Prod site: `nexgen-electrical-innovations.co.uk` (uses prod keys)
  - Attacker swaps keys; dev keys used on prod → tokens have `hostname: "localhost"`
- **Severity:** LOW (misconfiguration, not active attack)
- **Mitigation:** Hostname check catches misconfiguration early
  - Dev tokens rejected on prod (hostname mismatch)
  - Alerts ops to configuration issue

**Threat C: MITM / Token Interception**

- **Attack Vector:** Attacker on network intercepts HTTPS handshake; forces downgrade
- **Severity:** CRITICAL (requires network-level attack)
- **Mitigation:** Hostname check Does NOT prevent MITM
  - But Turnstile response is signed by Cloudflare; MITM cannot forge response
  - Hostname check is **defense-in-depth**, not primary MITM defense

### Why Validate Hostname?

**Option A: Skip hostname validation** ❌

```typescript
// WRONG: Accept any hostname in response
const payload = await response.json();
if (payload.success) {
  // Don't check `payload.hostname`
  return { success: true };
}
```

- **Cons:**
  - Allows subdomain confusion attack
  - Cannot detect configuration errors
  - Reduces OWASP defense-in-depth score

**Option B: Validate hostname** ✅ **CHOSEN**

```typescript
// CORRECT: Check hostname match
const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
if (payload.hostname && payload.hostname !== expectedHostname) {
  return { success: false, error: "Verification failed..." };
}
```

- **Pros:**
  - Prevents subdomain confusion
  - Catches configuration errors early
  - No performance cost (single string comparison)
  - Aligns with OWASP (defense-in-depth)

### Implementation Verification

```bash
# Verify expected hostname is deterministic
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_SITE_URL=https://nexgen-electrical-innovations.co.uk

# Code logic
const expectedHostname = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
// → "localhost" or "nexgen-electrical-innovations.co.uk"
```

---

## DECISION 4: Rate Limiting BEFORE Turnstile Verification

### Decision

> Rate limiters checked immediately after CSRF; blocks repeat offenders before calling Turnstile API.

```
Current limit: 3 requests per 1 hour per IP (configurable)
```

### Threat Model

**Threat A: API Abuse / Brute-Force Spam**

- **Attack Vector:** Attacker sends 1000 requests to `/api/submitContactForm` with random tokens
  ```bash
  for i in {1..1000}; do
    curl -X POST /api/submitContactForm -d "turnstileToken=random$i"
  done
  ```
- **Severity:** MEDIUM—DOS on Turnstile API; expensive for server
- **Mitigation:** Rate limiter blocks attacker after 3 attempts per hour
  - Request 1–3: Allowed (charged to rate limit budget)
  - Request 4+: Blocked (returns 429 Too Many Requests)

**Threat B: Cloudflare Siteverify API Abuse**

- **Attack Vector:** Attacker forces server to hammer Cloudflare API
- **Severity:** LOW—Cloudflare has own rate limits, but adds latency
- **Mitigation:** Rate limiter has been reached before Turnstile API call
  - Limits propagate to Siteverify calls
  - Protects Cloudflare from abuse

**Threat C: Email Spam (Mail Bomb)**

- **Attack Vector:** Attacker send 1000 contact forms; each triggers email to admin
- **Severity:** HIGH—inbox flooded; possible DoS of email system
- **Mitigation:** Rate limiter prevents email loop
  - Only 3 emails per hour per IP
  - Admin inbox protected

### Why Rate Limit BEFORE Turnstile, Not After?

**Option A: Rate limit only after Siteverify success** ❌

```typescript
// WRONG: Rate limit applied post-verification
const turnstileResult = await verifyTurnstileToken(token, clientId);
if (!turnstileResult.success) { ... }

const rateLimitResult = rateLimiters.contactForm.check(clientId);  // ← Late
if (!rateLimitResult.allowed) return error;
```

- **Cons:**
  - Calls Siteverify even for repeat offenders
  - Wastes Cloudflare API quota on junk requests
  - Slower response to attacker (no fast-path rejection)

**Option B: Rate limit VERY EARLY (before CSRF check)** ❌

```typescript
// WRONG: Rate limit before CSRF validation
const rateLimitResult = rateLimiters.contactForm.check(clientId);  // ← Early
if (!rateLimitResult.allowed) return error;

const security = await securityCheck(...);  // ← Late
if (!security.valid) return error;
```

- **Cons:**
  - Could be exploited to bypass CSRF check (attacker crafts 3 requests that pass rate limit but fail CSRF)
  - Security check should be first

**Option C: Rate limit AFTER CSRF, BEFORE Turnstile** ✅ **CHOSEN**

```typescript
// CORRECT: CSRF → Rate Limit → Turnstile → other processing
const security = await securityCheck(...);  // ← Earliest, data-less
if (!security.valid) return error;

const rateLimitResult = rateLimiters.contactForm.check(clientId);  // ← Early, light
if (!rateLimitResult.allowed) return error;

const turnstileResult = await verifyTurnstileToken(token, clientId);  // ← Medium, API call
if (!turnstileResult.success) return error;

const sanitizedData = sanitizeAllInputs(data);  // ← Late, I/O
```

- **Pros:**
  - Validates request origin (CSRF) first
  - Blocks repeat offenders fast (no API cost)
  - Calls Turnstile only for new/allowed IPs
  - Calls sanitization/validation only for verified tokens

### Implementation Verification

```typescript
// ✓ Rate limit check
const headersList = await headers();
const clientId = getClientIdentifier(headersList); // ← Extract IP
const rateLimitResult = rateLimiters.contactForm.check(clientId);

if (!rateLimitResult.allowed) {
  return {
    success: false,
    error: "Too many requests. Please wait a moment before trying again.",
  };
}

// Verify rate limiter configured
// lib/security/rate-limiter.ts should define:
export const rateLimiters = {
  contactForm: new RateLimiter({
    maxRequests: 3, // ← 3 requests
    windowMs: 3600 * 1000, // ← per 1 hour
  }),
};
```

---

## DECISION 5: Client-side Submit Button Gate (Token Check)

### Decision

> Step 5 submit button is disabled if `turnstileToken` is null/empty; shows user-facing tooltip.

```tsx
const isTokenValid = Boolean(turnstileToken?.trim());
disabled={pending || !isTokenValid}
```

### Threat Model

**Threat A: Bypassing Turnstile via Developer Tools**

- **Attack Vector:** User disables JavaScript; skips Turnstile widget; directly crafts POST request
  ```bash
  curl -X POST /api/submitContactForm \
    -d "turnstileToken=" \
    -d "fullName=John" \
    -d "email=john@example.com" \
    ...
  ```
- **Severity:** LOW—server-side gate catches this (see Decision 2)
- **Mitigation:** Client-side gate catches obvious cases early
  - Button disabled (feedback to user to complete Step 1)
  - Reduces junk submissions reaching server
  - Better UX (clear error message)

**Threat B: Accidental Submission Without Verification**

- **Attack Vector:** User accidentally clicks Submit on Step 5 without completing Step 1
  - (Not an attack, but a UX issue)
- **Severity:** LOW—user error
- **Mitigation:** Disabled button prevents accidental submission
  - User sees tooltip: "Complete Verification"
  - Forces user back to Step 1

**Threat C: Token Expiry Between Step 1 and Step 5**

- **Attack Vector:** User takes >10 minutes between steps; token expires
- **Severity:** LOW—legitimate issue, caught early
- **Mitigation:** Button disabled on Step 5 if token expires
  - User sees disabled button + tooltip
  - User knows to re-verify

### Why "Defense-in-Depth" (Client + Server)?

**Option A: Only client-side gate** ❌

```typescript
// WRONG: Only disable button; no server check
if (!turnstileToken) {
  disabledButton... return;
}
```

- **Cons:**
  - User can disable JavaScript in browser; bypass button gate
  - User can craft POST request via curl with empty token
  - Email still sent (server has no guard)

**Option B: Only server-side gate** ⚠️

```typescript
// Mediocre: Server checks, but no client-side feedback
// submitContactRequest() does: if (!token) return error;
```

- **Cons:**
  - User submits form with no visible feedback (confusing)
  - Server wasted resources processing request
  - User sees error after submission (slower feedback loop)

**Option C: Both client and server gates** ✅ **CHOSEN**

```typescript
// CORRECT: Client-side feedback + server-side enforcement

// CLIENT:
const isTokenValid = Boolean(turnstileToken?.trim());
<Button disabled={!isTokenValid}>Submit</Button>

// SERVER:
if (!token) return { success: false, error: "Verification incomplete..." };
const turnstileResult = await verifyTurnstileToken(token, clientId);
if (!turnstileResult.success) return { success: false, error: turnstileResult.error };
```

- **Pros:**
  - Client-side feedback (fast, clear UX)
  - Server-side enforcement (true security barrier)
  - Prevents accidental submissions
  - Protects against JS-disabled attacks

### Implementation Verification

```tsx
// ✓ Submit button gate
function SubmitInquiryButton() {
  const { turnstileToken } = useContactStore();
  const { pending } = useFormStatus();

  const isTokenValid = Boolean(turnstileToken?.trim());
  const isDisabled = pending || !isTokenValid;
  const tooltipText = !isTokenValid
    ? "Verification incomplete. Please go back to Step 1 and complete verification."
    : undefined;

  return (
    <Button
      type="submit"
      disabled={isDisabled} // ← Gate applied
      title={tooltipText} // ← User guidance
    >
      {isDisabled ? "Complete Verification" : "Submit Inquiry"}
    </Button>
  );
}
```

---

## DECISION 6: 8-Second Timeout on Siteverify Request

### Decision

> Server enforces `TURNSTILE_VERIFY_TIMEOUT_MS = 8000` on fetch to Cloudflare Siteverify API.

```typescript
const controller = new AbortController();
timeout = setTimeout(() => controller.abort(), 8000); // ← 8 seconds

const response = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  { signal: controller.signal },
);
```

### Threat Model

**Threat A: Slowloris / TCP Hanging Attack**

- **Attack Vector:** Attacker opens connection to Siteverify API; never responds
  - Server waits indefinitely for Cloudflare response
  - Request ties up database connection pool
  - After 100+ hanging requests, server out of connections
- **Severity:** MEDIUM—temporary DoS on contact form
- **Mitigation:** 8-second timeout aborts hanging requests
  - Returns error after 8s; frees connection
  - Prevents connection pool exhaustion

**Threat B: Cloudflare Service Degradation**

- **Attack Vector:** Cloudflare experiencing outage; all Siteverify calls slow
  - Requests hang for 30+ seconds
  - Server resource exhaustion
- **Severity:** MEDIUM—contact form unavailable during outage
- **Mitigation:** 8-second timeout ensures fast failure
  - If Cloudflare slow, request fails after 8s
  - Server returns user error: "Service unavailable; try again"
  - Better UX than hanging forever

**Threat C: Attacker Exploits Slow Siteverify Responses**

- **Attack Vector:** Attacker finds way to slow Siteverify API (e.g., via Cloudflare rate limiting on attacker's IP)
  - Server times out every request
  - Contact form unavailable
- **Severity:** LOW—requires Cloudflare API control or network-level attack
- **Mitigation:** 8-second timeout fail-fast
  - Prevents cascading retries
  - User sees clear error (not hanging form)

### Why 8 Seconds Specifically?

**Option A: No timeout** ❌

```typescript
// WRONG: Wait forever for Cloudflare response
const response = await fetch("/siteverify"); // Could hang 30+ minutes
```

- **Cons:**
  - Hanging request ties up connection
  - Form submission never completes (server-side timeout ≠ client knows)
  - Connection pool exhaustion after many requests

**Option B: Very short timeout (1 second)** ❌

```typescript
// WRONG: Too aggressive; false failures on slow networks
timeout = setTimeout(() => controller.abort(), 1000); // ← 1 second
```

- **Cons:**
  - Cloudflare legitimate latency ~500ms–2s
  - Timeout fires on slow networks (too many false failures)
  - User sees "Service unavailable" when actually slow network

**Option C: 8-second timeout** ✅ **CHOSEN**

```typescript
// CORRECT: Balance between DoS protection and reasonable Cloudflare latency
timeout = setTimeout(() => controller.abort(), 8000); // ← 8 seconds
```

- **Pros:**
  - Allows Cloudflare normal latency (typically <500ms; max ~5s for slow networks)
  - Prevents hanging indefinitely
  - Protects connection pool
  - Aligns with research on acceptable web timeouts (< 10s)
  - Leaves headroom for Next.js edge function timeout (~30s)

**Benchmark:** Typical Siteverify latencies (from Cloudflare & community reports):

- **Median:** 100–200ms
- **P95:** 500–800ms
- **P99:** 2–3 seconds
- **Outlier (rare):** 5–7 seconds

8-second timeout ensures we don't reject valid requests due to network jitter.

### Implementation Verification

```typescript
// ✓ Timeout implementation
const TURNSTILE_VERIFY_TIMEOUT_MS = 8000; // ← 8 seconds

async function verifyTurnstileToken(token: string, clientId: string) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), TURNSTILE_VERIFY_TIMEOUT_MS);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationBody,
        signal: controller.signal, // ← AbortSignal connected
      },
    );

    clearTimeout(timeout); // ← Clear if success
    // ... process response
  } catch (error) {
    // Handles AbortError (timeout) and other network errors
    return { success: false, error: "Verification service unavailable..." };
  } finally {
    if (timeout) clearTimeout(timeout); // ← Ensure cleanup
  }
}
```

---

## DECISION 7: Idempotency Key in Siteverify Request

### Decision

> Each Siteverify request includes unique `idempotency_key` to prevent retry storms.

```typescript
const verificationBody = new URLSearchParams({
  secret: env.TURNSTILE_SECRET_KEY,
  response: token,
  idempotency_key: crypto.randomUUID(), // ← New UUID per request
});
```

### Threat Model

**Threat A: Retry Storm / Retry Amplification**

- **Attack Vector:** Client network timeout; user clicks "Submit" 3 times rapidly
  ```bash
  curl -X POST /api/submitContactForm -d "..."  # Request 1
  # Network timeout after 2 seconds; user retries
  curl -X POST /api/submitContactForm -d "..."  # Request 2 (same token & idempotency_key)
  curl -X POST /api/submitContactForm -d "..."  # Request 3 (same token & idempotency_key)
  ```
- **Severity:** MEDIUM—multiplies load on Cloudflare API
- **Mitigation:** Idempotency key prevents Cloudflare from counting duplicate requests
  - Request 1: Siteverify with `idempotency_key: ABC123` → Allowed
  - Request 2: Siteverify with `idempotency_key: DEF456` → New request (Cloudflare counts this)
  - Request 3: Siteverify with `idempotency_key: GHI789` → New request (Cloudflare counts this)
  - Each gets unique UUID; Cloudflare doesn't discard as duplicate

**Threat B: Attacker Exploits Duplicate Detection**

- **Attack Vector:** Attacker intentionally sends same idempotency_key twice
  - First request: Siteverify → Success
  - Second request: Siteverify with SAME idempotency_key → Cloudflare deduplicates; returns cached response
  - Attacker reuses token without consuming it
- **Severity:** LOW—requires attacker to control idempotency_key, which is server-side
- **Mitigation:** Server generates new UUID per request; attacker cannot predict it
  - Token consumed after first Siteverify (backend state)
  - Second request with same token gets `timeout-or-duplicate` error

### Why UUID Per Request?

**Option A: No idempotency key** ❌

```typescript
// WRONG: No idempotency_key field
const verificationBody = new URLSearchParams({
  secret: env.TURNSTILE_SECRET_KEY,
  response: token,
  // idempotency_key not sent
});
```

- **Cons:**
  - Retry storm not deduplicated
  - Multiple Siteverify calls count as separate requests
  - Higher load on Cloudflare

**Option B: Static idempotency key** ❌

```typescript
// WRONG: Same key for all requests
const verificationBody = new URLSearchParams({
  secret: env.TURNSTILE_SECRET_KEY,
  response: token,
  idempotency_key: "static-key", // ← Same for every call
});
```

- **Cons:**
  - Attacker reuses key; Cloudflare deduplicates
  - Token consumed on first call, but second call (same key) returns cached success
  - Allows token reuse

**Option C: New UUID per request** ✅ **CHOSEN**

```typescript
// CORRECT: Unique UUID per request
const verificationBody = new URLSearchParams({
  secret: env.TURNSTILE_SECRET_KEY,
  response: token,
  idempotency_key: crypto.randomUUID(), // ← New each time
});
```

- **Pros:**
  - Cloudflare counts each Siteverify request uniquely
  - Retry storms visible (not conflated)
  - Token consumed after first successful Siteverify
  - Second request with same token fails (even with different UUID)
  - UUID generated server-side (attacker cannot predict)

### Implementation Verification

```typescript
// ✓ Idempotency key implementation
async function verifyTurnstileToken(token: string, clientId: string) {
  const verificationBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
    idempotency_key: crypto.randomUUID(), // ← New UUID
  });

  if (clientId !== "unknown") {
    verificationBody.set("remoteip", clientId);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: verificationBody, signal: controller.signal },
  );

  // Each request gets unique idempotency_key
  // Cloudflare tracks per-key; prevents retry deduplication
}
```

---

## THREAT MATRIX SUMMARY

| Threat                       | Severity | Mitigation Layer                           | Decision # |
| ---------------------------- | -------- | ------------------------------------------ | ---------- |
| Token theft via XSS          | HIGH     | Ephemeral state (not localStorage)         | 1          |
| Token reuse / replay         | HIGH     | Siteverify single-use + idempotency key    | 2, 7       |
| Token forgery                | CRITICAL | Siteverify cryptographic validation        | 2          |
| Subdomain confusion          | MEDIUM   | Hostname validation in Siteverify response | 3          |
| API abuse (brute-force)      | MEDIUM   | Rate limiting before Turnstile             | 4          |
| Email spam / mail bomb       | HIGH     | Rate limiting (blocks repeat submissions)  | 4          |
| JS bypass (no token)         | LOW      | Server-side gate + client-side gate        | 5          |
| TCP hanging / slowloris      | MEDIUM   | 8-second timeout on Siteverify fetch       | 6          |
| Retry storm                  | MEDIUM   | Idempotency key deduplication              | 7          |
| Token compromise via malware | HIGH     | 5–10 minute expiry + server validation     | (implicit) |
| Cloudflare outage            | MEDIUM   | Fail-fast on timeout; inform user          | 6          |

---

## SECURITY REVIEW CHECKLIST

Before deployment, security review should verify:

- [ ] **Decision 1 (Ephemeral State):** Zustand `partialize` excludes `turnstileToken`; DevTools localStorage shows no token
- [ ] **Decision 2 (Early Siteverify):** Siteverify called AFTER rate limit, BEFORE sanitization/validation/email
- [ ] **Decision 3 (Hostname Check):** Server validates `payload.hostname === expectedHostname`
- [ ] **Decision 4 (Rate Limiting):** Rate limiter configured; limit enforced before Turnstile call
- [ ] **Decision 5 (Button Gate):** Step 5 submit button disabled if `!turnstileToken?.trim()`
- [ ] **Decision 6 (Timeout):** 8-second timeout on Siteverify fetch (not infinite, not <1s)
- [ ] **Decision 7 (Idempotency):** New UUID generated per Siteverify request

---

## COMPLIANCE & STANDARDS ALIGNMENT

### OWASP Top 10 (2021)

| Control                               | Decision                            | Alignment                                       |
| ------------------------------------- | ----------------------------------- | ----------------------------------------------- |
| A01: Broken Access Control            | Gate token validation               | ✓ Step 5 guard prevents unauthorized submission |
| A02: Cryptographic Failures           | Token never in localStorage         | ✓ Ephemeral state reduces exposure              |
| A03: Injection                        | Input sanitization after Siteverify | ✓ Decision 2 (early check)                      |
| A05: Broken Access Control            | Rate limiting                       | ✓ Decision 4 reduces abuse                      |
| A06: Vulnerable & Outdated Components | react-turnstile kept updated        | ✓ Modern library, Cloudflare managed            |

### CWE (Common Weakness Enumeration)

| CWE                                                | Threat                   | Mitigation                     |
| -------------------------------------------------- | ------------------------ | ------------------------------ |
| CWE-352: Cross-Site Request Forgery                | CSRF token validation    | ✓ CSRF check in Step 1         |
| CWE-430: Insufficient Logging/Monitoring           | Log all Turnstile errors | ✓ Console.warn in catch blocks |
| CWE-770: Allocation of Resources Without Limits    | Rate limiting            | ✓ Decision 4                   |
| CWE-799: Improper Control of Interaction Frequency | Rate limiting + timeout  | ✓ Decisions 4, 6               |

---

## FUTURE IMPROVEMENTS (Out of Scope)

These decisions are intentionally **not** in Scope v1, but noted for future consideration:

1. **Enhanced Logging:** Structured logging to centralized observability system
   - Current: `console.warn()` (development visible)
   - Future: Send to DataDog/Sentry with PII-scrubbed context

2. **Turnstile Score-based Challenge:** Use Turnstile's ML score instead of binary verify/block
   - Current: Managed challenge (binary pass/fail)
   - Future: Risk scoring; soft blocking on low scores

3. **Geolocation-based Rate Limiting:** Different limits per region
   - Current: Global 3/hour
   - Future: Stricter on regions with known abuse patterns

4. **Honeypot Field Refinement:** Add time-based honeypot (measure fill speed)
   - Current: Simple checkbox honeypot
   - Future: Bots fill suspiciously fast; flag and rate-limit

5. **Turnstile Widget Events Telemetry:** Track widget render time, user completion time
   - Current: Silent operation
   - Future: Metrics dashboard (average challenge time, failure rates, etc.)

---

**Version:** 1.0  
**Effective Date:** April 5, 2026  
**Next Review:** July 1, 2026 (post-production monitoring)  
**Author:** Security & Architecture Team
