# Turnstile Widget Lifecycle — Quick Reference Card

**Use this during implementation & debugging**

---

## EXECUTION ORDER (Exact Sequence)

```
┌────────────────────────────────────────────────────────────────┐
│ STEP 1: CONTACT INFORMATION                                    │
├────────────────────────────────────────────────────────────────┤
│ 1. Turnstile widget renders (if NEXT_PUBLIC_TURNSTILE_SITE_KEY) │
│ 2. User completes challenge                                    │
│ 3. onVerify() → setTurnstileToken(token)                      │
│ 4. Store: { turnstileToken: "0.XXX...", turnstileError: null } │
│ 5. User clicks "Continue" → Advance to Step 2                 │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ STEPS 2, 3, 4: INQUIRY DETAILS                                 │
├────────────────────────────────────────────────────────────────┤
│ • Token remains in Zustand (ephemeral, NOT persisted)          │
│ • No server verification attempted                             │
│ • No token expiry check (silent)                               │
│ • User can navigate back/forth between steps                   │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ STEP 5: REVIEW & SUBMIT                                        │
├────────────────────────────────────────────────────────────────┤
│ On Page Load:                                                   │
│  • SubmitInquiryButton checks: isTokenValid = !!token?.trim()  │
│  • If true  → Button enabled (blue)                            │
│  • If false → Button disabled (gray) + tooltip                │
│                                                                │
│ On Submit (if button enabled):                                │
│  • Client sends form + token to server                         │
│  • Server Step 3: verifyTurnstileToken(token, clientId)       │
│  • Cloudflare API: POST /siteverify                            │
│  • Response: { success: true/false, ... }                     │
│  • If success=false → Reject form                             │
│  • If success=true → Process form → Send emails               │
└────────────────────────────────────────────────────────────────┘
```

---

## STATE TRANSITIONS (Zustand Store)

```javascript
// Initial state
{
  turnstileToken: null,
  turnstileError: null,
}

// After user completes challenge (onVerify)
→ {
  turnstileToken: "0.XXXs1mMJNS3B_VV...",  // ← NEW TOKEN
  turnstileError: null,                    // ← CLEARED
}

// If user fails challenge (onError)
→ {
  turnstileToken: null,                    // ← CLEARED
  turnstileError: "Challenge failed...",   // ← ERROR SET
}

// If user clicks Retry button
→ widgetRenderKey++                        // ← FORCE RE-RENDER
→ Widget re-mounts (new instance)
→ User re-completes challenge
→ onVerify fires again
→ turnstileToken updated with NEW token

// If token expires (onExpire) while on Steps 2–4
→ {
  turnstileToken: null,                    // ← CLEARED
  turnstileError: "Verification expired...", // ← ERROR SET
}
→ User doesn't see error until Step 5
→ Submit button disabled (Step 5 guard)

// After successful form submission
→ {
  isSubmitted: true,
  contactReferenceId: "CR-XX-XX",
}
→ ContactSuccessMessage renders
```

---

## CODE LOCATIONS & EDITS

### File 1: `features/contact/schemas/contact-schemas.ts`

**Current State:** turnstileToken field MISSING

**Required Edit:**

```typescript
// Add to completeContactFormSchema
export const completeContactFormSchema = z.object({
  contactInfo: contactInfoSchema,
  inquiryType: inquiryTypeSchema,
  referenceLinking: referenceLinkingSchema,
  messageDetails: messageDetailsSchema,
  turnstileToken: z.string().min(1, "Verification required"), // ← ADD THIS
});

// Add to serverContactFormSchema (same)
export const serverContactFormSchema = z.object({
  // ... existing fields
  turnstileToken: z.string().min(1), // ← ADD THIS
});
```

**Verification:** `pnpm test __tests__/contact/contact-schemas.test.ts`

---

### File 2: `features/contact/hooks/use-contact-store.ts`

**Current State:** Zustand store has ephemeral turnstileToken (already correct)

**Verify:** `partialize` middleware excludes turnstileToken from localStorage:

```typescript
{
  name: "contact-form-storage",
  partialize: (state) => ({
    currentStep: state.currentStep,
    contactInfo: state.contactInfo,
    inquiryType: state.inquiryType,
    referenceLinking: state.referenceLinking,
    messageDetails: state.messageDetails,
    // NOTE: turnstileToken is EXCLUDED (not in this object)
  }),
}
```

✅ **No changes needed**—already correct.

---

### File 3: `features/contact/components/organisms/contact-steps/contact-info-step.tsx`

**Current State:** Turnstile widget already integrated (mostly correct)

**Verify Structure:**

```tsx
// ✓ Zustand import & destructure
const { turnstileToken, setTurnstileToken, setTurnstileError } = useContactStore();

// ✓ Site key from env
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const isTurnstileConfigured = Boolean(turnstileSiteKey);

// ✓ Widget render condition
{isTurnstileConfigured ? (
  <Turnstile
    key={widgetRenderKey}
    sitekey={turnstileSiteKey || ""}
    onVerify={(token) => { setTurnstileToken(token); ... }}
    onExpire={() => { setTurnstileToken(null); ... }}
    onError={(errorCode) => { setTurnstileToken(null); ... }}
  />
) : (
  <FallbackErrorMessage />
)}

// ✓ Error message display
{turnstileError && (
  <div>
    <p>{turnstileError}</p>
    <Button onClick={retryVerification}>Retry</Button>
  </div>
)}
```

✅ **No changes needed**—already implemented.

---

### File 4: `features/contact/api/contact-request.ts`

**Current State:** Standalone verifyTurnstileToken exists; NOT called in submitContactRequest

**Required Edits:**

#### Edit 4a: Ensure verifyTurnstileToken exists

```typescript
async function verifyTurnstileToken(
  token: string,
  clientId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  // ... implementation (already in file or needs to be added)
}
```

#### Edit 4b: Call verifyTurnstileToken in submitContactRequest AFTER rate limit

```typescript
export async function submitContactRequest(
  data: CompleteContactFormInput,
): Promise<ContactSubmissionResult> {
  try {
    // STEP 1: Security check (CSRF)
    const security = await securityCheck({ validateOriginHeader: true });
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      };
    }

    // STEP 2: Rate limiting
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = rateLimiters.contactForm.check(clientId);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a moment before trying again.",
      };
    }

    // ┌─────────────────────────────────────────────────────────┐
    // │ STEP 3: TURNSTILE VERIFICATION (NEW)                    │
    // └─────────────────────────────────────────────────────────┘
    const turnstileToken = (data as any)?.turnstileToken; // Extract from payload
    if (!turnstileToken) {
      return {
        success: false,
        error:
          "Verification incomplete. Please return to Step 1 and complete verification.",
      };
    }

    const turnstileResult = await verifyTurnstileToken(
      turnstileToken,
      clientId,
    );
    if (!turnstileResult.success) {
      return { success: false, error: turnstileResult.error };
    }

    // STEP 4: Honeypot check
    if (data && typeof data === "object" && "website" in data) {
      const hp = (data as any).website;
      if (hp && typeof hp === "string" && hp.length > 0) {
        return { success: true, referenceId: `CR-${Date.now()}-BLOCKED` };
      }
    }

    // STEP 5+: Sanitize, validate, send emails (existing code)
    // ...
  } catch (error) {
    console.error("[action] Contact submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
```

✅ **Changes needed**—ensure verifyTurnstileToken is called.

---

### File 5: `features/contact/components/organisms/contact-steps/contact-review-step.tsx`

**Current State:** SubmitInquiryButton does NOT check turnstileToken

**Required Edit:**

```tsx
function SubmitInquiryButton() {
  const { turnstileToken } = useContactStore(); // ← ADD THIS
  const { pending } = useFormStatus();

  // ┌─────────────────────────────────────────────────────────┐
  // │ ADD THIS LOGIC                                          │
  // └─────────────────────────────────────────────────────────┘
  const isTokenValid = Boolean(turnstileToken?.trim());
  const isDisabled = pending || !isTokenValid; // ← UPDATE THIS
  const tooltipText = !isTokenValid
    ? "Verification incomplete. Please go back to Step 1 and complete verification."
    : undefined;

  return (
    <Button
      type="submit"
      disabled={isDisabled} // ← UPDATE THIS
      title={tooltipText} // ← ADD THIS
      className="min-w-40"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : !isTokenValid ? ( // ← ADD THIS CONDITION
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

✅ **Changes needed**—add token guard logic.

---

### File 6: `app/env.ts`

**Current State:** Both Turnstile keys defined

**Verify:**

```typescript
export const env = createEnv({
  server: {
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(), // ← ✓ Present
    // ...
  },
  client: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(), // ← ✓ Present
    // ...
  },
});
```

✅ **No changes needed**—already defined.

---

## ENVIRONMENT CONFIGURATION

### `.env.local` (Local Development)

```bash
# Turnstile CAPTCHA (Test Keys)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

### Vercel Secrets (Production)

```bash
# Settings → Environment Variables

NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # (real prod key from Cloudflare)
TURNSTILE_SECRET_KEY=            # (real prod secret from Cloudflare)
```

### Cloudflare Turnstile Dashboard Setup

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile
2. Create site: `Nexgen Electrical (Production)`
3. Domain: `nexgen-electrical-innovations.co.uk`
4. Mode: Managed (automatic / interactive challenge)
5. Copy **Site Key** → Store as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Vercel
6. Copy **Secret Key** → Store as `TURNSTILE_SECRET_KEY` in Vercel

---

## TEST EXECUTION CHECKLIST

### Unit Tests

```bash
# Test schemas accept/reject turnstileToken
pnpm test __tests__/contact/contact-schemas.test.ts

# Should include:
# ✓ "requires turnstile token in complete schema"
# ✓ "accepts complete schema when turnstile token exists"
# ✓ "rejects form without turnstile token"
```

### Manual Testing (Local Dev with Test Keys)

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Open browser
open http://localhost:3000/contact

# Flow:
# 1. Step 1: Verify Turnstile widget renders
# 2. Step 1: Complete challenge (should auto-pass with test keys)
# 3. Step 1: Click "Continue" → Advance to Step 2
# 4. Steps 2–4: Fill form data (required fields only)
# 5. Step 5: Verify "Submit Inquiry" button is ENABLED (green)
# 6. Step 5: Click "Submit Inquiry"
# 7. Verify form submission succeeds (success page or email received)

# Edge Case: Test expiry
# 1. Step 1: Verify widget
# 2. Leave browser idle for 10+ minutes
# 3. Step 5: Verify "Submit Inquiry" button is DISABLED (gray)
# 4. Tooltip says: "Complete Verification..."
# 5. Click "Back" → Step 1 → Re-verify → Try again
```

### E2E Test (Playwright)

```bash
# If e2e/contact.spec.ts exists, run:
pnpm test:e2e contact.spec.ts

# Should include:
# ✓ "Turnstile widget renders on Step 1"
# ✓ "User can complete verification"
# ✓ "Submit button disabled without verification"
# ✓ "Form submission succeeds with valid token"
```

---

## FAILURE DIAGNOSIS

| Symptom                      | Root Cause                               | Fix                                                    |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| Widget doesn't render        | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` missing | Add test key to `.env.local`                           |
| "Challenge failed" on Step 1 | Domain not allowlisted in Cloudflare     | Add `localhost` (dev) or prod domain to Cloudflare     |
| Button disabled on Step 5    | `turnstileToken` is null/empty           | Go back to Step 1; re-verify                           |
| "Service unavailable" error  | `TURNSTILE_SECRET_KEY` missing on server | Add to `.env.local` and Vercel secrets                 |
| Console error: `CORS`        | Turnstile CDN blocked                    | Check browser network tab; verify no adblocker         |
| Submit fails with tech error | verifyTurnstileToken not called          | Ensure submitContactRequest calls verifyTurnstileToken |

---

## SECURITY CHECKLIST (Before Merge)

- [ ] Token NEVER stored in localStorage
- [ ] Token NEVER logged in production
- [ ] Token NOT exposed in DevTools Application tab
- [ ] Token guard active on Step 5 (button disabled if no token)
- [ ] Siteverify call happens BEFORE form processing
- [ ] Secret key NOT in client code (only `TURNSTILE_SECRET_KEY` in server env)
- [ ] Test keys used locally; production keys for prod
- [ ] All 5+ error paths return user-facing messages (no raw error codes)
- [ ] Rate limit applied before Turnstile verification
- [ ] Hostname validation in Siteverify response

---

## GIT WORKFLOW

```bash
# 1. Create feature branch
git checkout -b feat/turnstile-reintegration

# 2. Make edits (Files 1–6 above)
# 3. Test locally

# 4. Lint & type-check
pnpm lint
pnpm typecheck

# 5. Run tests
pnpm test:run
pnpm test:e2e

# 6. Commit
git add .
git commit -m "feat(contact): integrate Turnstile CAPTCHA

- Add turnstileToken to contact form schemas
- Integrate Turnstile widget on Step 1
- Add Siteverify verification in submitContactRequest
- Gate Step 5 submit button with token validation
- Configure test keys for local dev

Closes #XX"

# 7. Push & create PR
git push origin feat/turnstile-reintegration

# 8. Request Copilot review (via GitHub)
```

---

## DEPLOYMENT STEPS

```bash
# 1. Verify tests pass on main
pnpm test:run
pnpm test:e2e

# 2. Verify production build works
pnpm build

# 3. Set Vercel secrets
# Go to: Vercel → Project → Settings → Environment Variables
# Add:
#   NEXT_PUBLIC_TURNSTILE_SITE_KEY = (from Cloudflare)
#   TURNSTILE_SECRET_KEY = (from Cloudflare)

# 4. Merge PR to main
# (Automatic deploy to production)

# 5. Post-deploy verification (in prod)
# - Visit /contact
# - Verify widget renders
# - Complete 1 form submission
# - Verify email received

# 6. Monitor logs for 24 hours
# Watch for: Turnstile verification failures, rate limit hits, Siteverify timeouts
```

---

**Version:** 1.0  
**Updated:** April 5, 2026  
**Last Reviewed:** By Security & Frontend
