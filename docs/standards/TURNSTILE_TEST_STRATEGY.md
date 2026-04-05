# Turnstile Widget Lifecycle — Test Strategy & Scenarios

**Test Type:** Functional, Security, Integration  
**Scope:** Contact form Steps 1–5 with Turnstile verification  
**Environment:** Local dev (test keys), Staging (test keys), Production (prod keys)

---

## QUICK START: 5-MINUTE SMOKE TEST

**Prerequisites:** `pnpm dev` running on `http://localhost:3000`

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run smoke test
pnpm test:smoke contact-turnstile.spec.ts

# OR manual test:
# 1. Open http://localhost:3000/contact
# 2. See "Your Contact Details" step with Turnstile widget
# 3. Click widget → Challenge auto-passes (test keys)
# 4. Fill form fields (Steps 2–4)
# 5. Step 5: "Submit Inquiry" button ENABLED (blue, clickable)
# 6. Click submit → See success message
# PASS: All completed without errors
```

---

## TEST COVERAGE MATRIX

| Test ID | Category     | Scenario                         | Steps                      | Expected Result                         | Priority |
| ------- | ------------ | -------------------------------- | -------------------------- | --------------------------------------- | -------- |
| **1.1** | Rendering    | Widget renders on Step 1         | 1                          | Turnstile iframe visible                | P0       |
| **1.2** | Rendering    | No widget if site key missing    | 1                          | Fallback error message                  | P0       |
| **2.1** | Verification | User completes challenge         | 1                          | Token stored; no error                  | P0       |
| **2.2** | Verification | User fails challenge (clicks ✕)  | 1                          | Error message; retry button             | P1       |
| **2.3** | Verification | User retries after failure       | 1                          | New token generated; error cleared      | P1       |
| **3.1** | State        | Token persists Steps 2–4         | 1→2→3→4                    | Token in Zustand (not localStorage)     | P1       |
| **3.2** | State        | Token lost on page reload        | 1 → reload                 | Token null; go back to Step 1           | P1       |
| **4.1** | Submit Gate  | Submit disabled without token    | 1(skip)→5                  | Button disabled; tooltip visible        | P0       |
| **4.2** | Submit Gate  | Submit enabled with token        | 1→5                        | Button enabled (blue)                   | P0       |
| **5.1** | Server       | Valid token accepted             | 1→5→submit                 | Form submitted; email sent              | P0       |
| **5.2** | Server       | Expired token rejected           | 1→5(wait 10m)→submit       | Server error: "Verification expired"    | P1       |
| **5.3** | Server       | Empty token rejected             | 1(skip)→5→submit           | Server error: "Verification incomplete" | P0       |
| **5.4** | Server       | Invalid token rejected           | 1(skip, craft fake)→submit | Server error: "Verification failed"     | P1       |
| **6.1** | Rate Limit   | Allow 1st request                | submit #1                  | Success                                 | P1       |
| **6.2** | Rate Limit   | Allow 2nd request                | submit #2                  | Success                                 | P1       |
| **6.3** | Rate Limit   | Allow 3rd request                | submit #3                  | Success                                 | P1       |
| **6.4** | Rate Limit   | Block 4th request                | submit #4                  | Error: "Too many requests"              | P1       |
| **7.1** | Security     | Token not in DevTools storage    | 1                          | DevTools → Local Storage → empty        | P0       |
| **7.2** | Security     | Token not logged in console      | 1                          | Browser console → no token visible      | P0       |
| **7.3** | Security     | Secret key not exposed to client | all                        | Network tab → no secret key in requests | P0       |

**Priority:**

- **P0 (Critical):** Blocks release; test before every deploy
- **P1 (High):** Important for security/UX; test weekly
- **P2 (Medium):** Nice to have; test monthly

---

## DETAILED TEST SCENARIOS

### Category A: Widget Rendering

#### Test 1.1: Widget Renders on Step 1

**Setup:**

- Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`
- Browser: Chrome/Firefox
- Page: `http://localhost:3000/contact`

**Steps:**

1. Load contact page
2. Land on Step 1 ("Your Contact Details")
3. Scroll to widget area

**Expected Result:**

- ✓ Turnstile iframe appears
- ✓ Widget contains Cloudflare logo
- ✓ "Verify you are human" button visible
- ✓ No console errors (check DevTools)

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Site key not set in `.env.local`
- [ ] React component not rendering `<Turnstile>`
- [ ] CORS error to `cdn.turnstile.com`
- [ ] Browser adblocker blocking Turnstile script

---

#### Test 1.2: Fallback Message If Site Key Missing

**Setup:**

- Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` (empty)
- Browser: Chrome
- Page: `http://localhost:3000/contact`

**Steps:**

1. Load contact page
2. Land on Step 1

**Expected Result:**

- ✓ No Turnstile iframe
- ✓ Fallback message visible: "Turnstile key missing. Verification cannot be completed."
- ✓ User cannot proceed (button disabled or warned)

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Fallback message not rendered
- [ ] Widget still tries to load (error occurs instead)
- [ ] User able to proceed without verification

---

### Category B: Verification Flow

#### Test 2.1: User Completes Challenge Successfully

**Setup:**

- Env: Test keys configured
- Browser: Chrome
- Page: Step 1, Turnstile widget visible

**Steps:**

1. Click Turnstile widget
2. Challenge appears (should auto-pass with test keys, or show interactive challenge)
3. Complete challenge (if interactive, solve puzzle or wait for auto-pass)
4. Challenge closes

**Expected Result:**

- ✓ Widget animates success (checkmark or fade)
- ✓ `onVerify()` callback fires
- ✓ Token stored in Zustand (verify via React DevTools)
- ✓ No error message displayed
- ✓ Browser console shows (if dev): `[turnstile] verify`

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Verification (Chrome DevTools):**

```javascript
// In browser console:
JSON.stringify(contactStore.getState()); // ← Should show { turnstileToken: "0.XXX...", turnstileError: null }
```

**Failure Analysis (if FAIL):**

- [ ] Challenge never completes (hangs or error)
- [ ] Token not stored (check Zustand state)
- [ ] onVerify callback not firing (check console)

---

#### Test 2.2: User Fails Challenge (Closes Widget)

**Setup:**

- Env: Test keys
- Browser: Chrome
- Page: Step 1, Turnstile widget visible

**Steps:**

1. Click Turnstile widget
2. Challenge appears
3. Click ✕ button to close challenge (or close iframe manually)

**Expected Result:**

- ✓ Widget disappears / error message appears
- ✓ `onError()` callback fires
- ✓ Error message visible: "Challenge failed. Please retry."
- ✓ Retry button appears
- ✓ Token NOT stored (or cleared)
- ✓ Browser console shows: `[turnstile] error`

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Widget remains visible (error not shown)
- [ ] Error message unclear or missing
- [ ] Old token still in state (should be cleared)

---

#### Test 2.3: User Retries After Failure

**Setup:**

- Previous test (2.2) completed in same session
- Error message + Retry button visible

**Steps:**

1. Click "Retry" button
2. Widget re-renders (widgetRenderKey increments)
3. New challenge appears
4. Complete challenge
5. Challenge closes

**Expected Result:**

- ✓ Widget re-renders (fresh instance)
- ✓ New challenge presented
- ✓ User can complete challenge
- ✓ New token stored
- ✓ Error message cleared
- ✓ No stale token in state

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Retry button doesn't trigger re-render
- [ ] Old widget still visible (refresh issue)
- [ ] Token remains empty after retry

---

### Category C: State Management

#### Test 3.1: Token Persists in Zustand Across Steps

**Setup:**

- Complete Step 1 verification (token stored)
- Browser DevTools open (React DevTools + Zustand)

**Steps:**

1. Step 1: Verify token stored
2. Click "Continue" → Step 2
3. Check Zustand state (token still present)
4. Click "Continue" → Step 3
5. Check Zustand state (token still present)
6. Click "Continue" → Step 4
7. Check Zustand state (token still present)

**Expected Result:**

- ✓ Token remains in Zustand across all steps
- ✓ Token value unchanged (same token from Step 1)
- ✓ No new verification requests triggered
- ✓ Browser console shows no token refresh calls

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Verification (Chrome Console):**

```javascript
// At each step:
const token = contactStore.getState().turnstileToken;
console.log("Step X token:", token); // ← Same token throughout
```

**Failure Analysis (if FAIL):**

- [ ] Token cleared unexpectedly
- [ ] New token generated on step change (bad UX)
- [ ] Token differs between steps

---

#### Test 3.2: Token Lost on Page Reload

**Setup:**

- Complete Step 1 verification
- Token stored in Zustand
- Browser console open

**Steps:**

1. Verify token in Zustand: `contactStore.getState().turnstileToken` → `"0.XXX..."`
2. Reload page (Cmd+R or F5)
3. Navigate back to Step 1
4. Check token state
5. Open DevTools → Application → Local Storage → contact-form-storage

**Expected Result:**

- ✓ Token is null/empty after reload
- ✓ Local Storage entry does NOT contain `turnstileToken` (verify in contact-form-storage JSON)
- ✓ User sees Step 1 (currentStep may be remembered, but token lost)
- ✓ Submit button on Step 5 would be disabled (if user navigates there)

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Verification (Chrome DevTools):**

1. After reload, open DevTools → Application → Local Storage
2. Find entry: contact-form-storage
3. Look for `turnstileToken` in JSON → Should NOT be present
4. Step and form data should be preserved (other fields)

**Failure Analysis (if FAIL):**

- [ ] `turnstileToken` appears in local storage (persistence error)
- [ ] Token still in-memory after reload (shouldn't be possible)
- [ ] Zustand `partialize` not excluding token

---

### Category D: Submit Button Gate

#### Test 4.1: Submit Button Disabled Without Token

**Setup:**

- Skip Step 1 (don't verify); navigate directly to Step 5
  - Use DevTools to set `currentStep = 5` in Zustand, or
  - Edit URL to `?step=5` (if step selection implemented)

**Steps:**

1. Navigate to Step 5 without completing Step 1
2. Observe submit button
3. Hover over button to see tooltip

**Expected Result:**

- ✓ "Submit Inquiry" button is DISABLED (grayed out, not clickable)
- ✓ Button text changed to "Complete Verification" (if state-based rendering)
- ✓ Tooltip visible: "Verification incomplete. Please go back to Step 1..."
- ✓ Clicking button does nothing (no form submission)

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Button is enabled (should be disabled)
- [ ] No tooltip
- [ ] Button click submits form (gate not enforced)

---

#### Test 4.2: Submit Button Enabled With Valid Token

**Setup:**

- Complete Step 1 verification → Token stored
- Navigate through Steps 2–4
- Land on Step 5

**Steps:**

1. Verify token in Zustand: `contactStore.getState().turnstileToken` → `"0.XXX..."`
2. Observe submit button
3. Hover over button

**Expected Result:**

- ✓ "Submit Inquiry" button is ENABLED (blue, clickable)
- ✓ Button text shows "Submit Inquiry"
- ✓ No error tooltip
- ✓ Button click triggers form submission

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Button remains disabled (token check not working)
- [ ] Button state doesn't update after navigation

---

### Category E: Server-side Verification

#### Test 5.1: Valid Token Accepted; Form Submitted

**Setup:**

- Complete Steps 1–4 with valid data
- Step 5 submit button enabled
- Backend `/api/submitContactForm` ready

**Steps:**

1. Fill all required fields across Steps 1–4:
   - Name: "John Smith"
   - Email: "john@example.com"
   - Phone: "+44 123 456 7890"
   - Inquiry Type: "General Inquiry"
   - Sector: "Residential"
   - Priority: "Normal"
   - Reference: None
   - Subject: "Test inquiry"
   - Message: "This is a test message for the contact form."
   - Preferred Contact: "Either"
   - Best Time: "Anytime"
2. Step 5: Review all information
3. Click "Submit Inquiry"
4. Observe response

**Expected Result:**

- ✓ Form submission in progress (button shows "Submitting...")
- ✓ Server processes request (network tab shows POST to `/api/submitContactForm`)
- ✓ Response: `{ success: true, referenceId: "CR-..." }`
- ✓ Success page displayed (ContactSuccessMessage)
- ✓ Reference ID shown to user (e.g., "CR-ABC123-XYZ")
- ✓ Confirmation email received (check inbox)

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Server Logs (check Next.js dev server output):**

- Should show: `[contact] Turnstile verification succeeded`
- Should show: `[contact] Email sent to admin @ <admin-email>`
- Should NOT show: `Turnstile verification failed`

**Failure Analysis (if FAIL):**

- [ ] Form submission fails (POST returns error)
- [ ] Server error: "Verification failed"
- [ ] No email received (email service issue)
- [ ] Success message not shown

---

#### Test 5.2: Expired Token Rejected by Server

**Setup:**

- Complete Step 1 verification
- Wait 10+ minutes (or manually set client clock forward)
- Navigate to Step 5
- Attempt submission

**Steps:**

1. Complete Step 1 → Token stored with timestamp
2. Wait 10+ minutes OR set system clock forward 10 minutes
3. Navigate to Step 5
4. (Optional: Token may already be marked expired by `onExpire()` callback)
5. Click "Submit Inquiry"

**Expected Result:**

- ✓ Client-side: Button disabled (token expired, onExpire fired silently)
  - OR if submit attempted: server rejects
- ✓ Server response: `{ success: false, error: "Verification expired. Please complete verification again." }`
- ✓ Server logs: `Turnstile verification failed { errorCodes: ["timeout-or-duplicate"] }`
- ✓ Form NOT submitted; no email sent

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Expired token accepted by server (should reject)
- [ ] Form submitted despite expiry (security issue)
- [ ] Button not disabled (though server would reject, UX poor)

---

#### Test 5.3: Empty Token Rejected by Server

**Setup:**

- Craft request with empty `turnstileToken`
- Bypass client-side gate (use curl or Postman)

**Steps:**

1. Prepare form data with all fields filled EXCEPT `turnstileToken: ""`
2. Submit via curl:
   ```bash
   curl -X POST http://localhost:3000/api/submitContactForm \
     -H "Content-Type: application/json" \
     -d '{
       "turnstileToken": "",
       "contactInfo": { "fullName": "John", "email": "john@example.com", "phone": "+441234567890" },
       "inquiryType": { "inquiryType": "general-inquiry", "sector": "residential", "priority": "normal" },
       "referenceLinking": { "hasExistingReference": false, "referenceType": "none" },
       "messageDetails": { "subject": "Test", "message": "Test message for contact form", "preferredContactMethod": "either", "bestTimeToContact": "anytime", "newsletterOptIn": false }
     }'
   ```

**Expected Result:**

- ✓ Server response: `{ success: false, error: "Verification incomplete. Please return to Step 1 and complete verification." }`
- ✓ Form rejected before Siteverify call attempt
- ✓ Server logs: No Turnstile verification attempt
- ✓ No email sent

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Form accepted despite empty token
- [ ] Server processes request (should fail fast)

---

#### Test 5.4: Invalid Token Rejected by Server

**Setup:**

- Craft request with fake token
- Bypass client-side gate

**Steps:**

1. Prepare form data with `turnstileToken: "fakefakefake"`
2. Submit via curl (same as test 5.3, but with invalid token)

**Expected Result:**

- ✓ Server calls Siteverify API
- ✓ Cloudflare returns: `{ success: false, error-codes: ["invalid-input-response"] }`
- ✓ Server response: `{ success: false, error: "Verification failed. Please retry and submit again." }`
- ✓ Server logs: `Turnstile verification failed { errorCodes: ["invalid-input-response"] }`
- ✓ No email sent

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Invalid token accepted (security issue)
- [ ] Server doesn't call Siteverify
- [ ] Form submitted despite invalid token

---

### Category F: Rate Limiting

#### Test 6.1–6.4: Rate Limit Enforcement (1st–4th Requests)

**Setup:**

- Env: `CONTACT_RATE_LIMIT=3` (allow 3 per hour)
- Clear any previous rate limit state
- Same client IP for all 4 requests

**Steps:**

1. Request #1: Submit form with valid token
2. Check response: `{ success: true }`
3. Request #2: Submit form with valid token (wait 1–2 seconds)
4. Check response: `{ success: true }`
5. Request #3: Submit form with valid token (wait 1–2 seconds)
6. Check response: `{ success: true }`
7. Request #4: Submit form with valid token (wait 1–2 seconds)
8. Check response: Should be RATE LIMITED

**Expected Result (Requests 1–3):**

- ✓ Each request succeeds: `{ success: true, referenceId: "CR-..." }`
- ✓ Email sent for each

**Expected Result (Request 4):**

- ✓ Response: `{ success: false, error: "Too many requests. Please wait a moment before trying again." }`
- ✓ Server logs: Rate limit exceeded
- ✓ No email sent for request #4

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Test Execution (Bash):**

```bash
# Submit 4 requests rapidly
for i in {1..4}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/submitContactForm \
    -H "Content-Type: application/json" \
    -d '{...valid form data...}' | jq '.success'
  sleep 1
done

# Expected output:
# Request 1: true
# Request 2: true
# Request 3: true
# Request 4: false (rate limited)
```

**Failure Analysis (if FAIL):**

- [ ] All 4 requests succeed (rate limit not enforced)
- [ ] Request #3 blocked (limit too aggressive)
- [ ] Request #4 succeeds (limit not working)

---

### Category G: Security Checks

#### Test 7.1: Token Not in DevTools Local Storage

**Setup:**

- Complete Step 1 verification
- Browser DevTools open

**Steps:**

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Find entry: `contact-form-storage` (or similar)
5. Click entry to view JSON
6. Search for `turnstileToken`

**Expected Result:**

- ✓ Local Storage entry exists (contains currentStep, contactInfo, etc.)
- ✓ `turnstileToken` KEY is NOT present in the JSON
- ✓ Only fields in `partialize` list are saved:
  ```json
  {
    "currentStep": 1,
    "contactInfo": { ... },
    "inquiryType": { ... },
    "referenceLinking": { ... },
    "messageDetails": { ... }
    // NOTE: turnstileToken is NOT here
  }
  ```

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] `turnstileToken` appears in Local Storage (persistence issue)
- [ ] Storage entry shows full token value (security issue)

---

#### Test 7.2: Token Not Logged to Browser Console

**Setup:**

- Complete Step 1 verification
- Browser console open (F12 → Console tab)

**Steps:**

1. Open browser console (F12)
2. Search console output for token value (Ctrl+F in console)
3. Expected searches:
   - `"0.XXX"` (token prefix)
   - `"token"`
   - Full token value (if known)

**Expected Result:**

- ✓ Console shows: `[turnstile] verify` (dev environment)
- ✓ NO token value printed
- ✓ No `console.log(token)` output
- ✓ Zustand state update visible (in React DevTools), but value not exposed in console

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Failure Analysis (if FAIL):**

- [ ] Token value logged to console (security issue)
- [ ] Raw token printed somewhere

---

#### Test 7.3: Secret Key Not Exposed to Client

**Setup:**

- Browser Network tab open
- Form submission in progress

**Steps:**

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Submit form (Step 5 → Submit Inquiry)
4. Find request to `/api/submitContactForm`
5. Check request body and response
6. Search for `TURNSTILE_SECRET_KEY` or secret key values

**Expected Result:**

- ✓ Request body contains `turnstileToken` (client token, safe to expose)
- ✓ Request body does NOT contain `TURNSTILE_SECRET_KEY` (server-side only)
- ✓ Response does NOT contain secret key
- ✓ No `Authorization: Bearer <secret>` headers

**Actual Result:** ******\_\_\_******

**Status:** ☐ PASS ☐ FAIL ☐ SKIP

**Verification (Network Tab):**

1. Click `/api/submitContactForm` POST request
2. View Request body → Should show client token only
3. View Response → Should show `{ success: true, referenceId: "..." }`
4. Check Headers → No authorization headers with secrets

**Failure Analysis (if FAIL):**

- [ ] Secret key visible in request/response (major security issue)
- [ ] Env var leaked to client bundle

---

## TEST EXECUTION SCHEDULE

### Pre-Merge Testing (Before PR approval)

- **Unit Tests:** Test 1.1, 1.2, 2.1, 4.1, 4.2 (automated)
- **Manual Tests:** Test 2.1, 2.2, 2.3, 3.1, 5.1, 7.1, 7.2
- **Security Tests:** Test 5.3, 5.4, 7.3
- **Time:** ~1 hour

### Post-Merge Testing (Before deployment)

- **Full Test Suite:** All tests 1.1–7.3
- **E2E Tests:** `pnpm test:e2e contact.spec.ts`
- **Regression:** Check other form steps unaffected
- **Time:** ~2 hours

### Post-Deployment Monitoring (First 24 hours)

- **Manual Spot Check:** Test 5.1 (form submission works)
- **Error Logs:** Check for "Verification failed" spikes
- **Email Delivery:** Verify emails received
- **Rate Limiting:** Verify no false positives (users can submit)
- **Time:** Continuous monitoring

---

## KNOWN ISSUES & WORKAROUNDS

| Issue                             | Symptom                                   | Root Cause                                           | Workaround                                           |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Widget fails to load on localhost | "Challenge error" on page load            | Domain not allowlisted in Cloudflare                 | Use test keys; ensure localhost is allowlisted       |
| Token expires silently            | Button disabled on Step 5 without warning | Token 5–10 min lifetime; user took long on Steps 2–4 | Show timer or periodic token refresh reminder        |
| Rate limit too aggressive         | User blocked after 2 legit submissions    | Rate limit set to 2 instead of 3                     | Adjust `CONTACT_RATE_LIMIT` env var                  |
| Email not received                | Form succeeds; no confirmation email      | Resend API disabled                                  | Check `RESEND_API_KEY` env var; verify email service |

---

## APPENDIX: Test Data

### Valid Form Data (Use for all tests)

```json
{
  "contactInfo": {
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+441234567890",
    "company": "Acme Corp"
  },
  "inquiryType": {
    "inquiryType": "general-inquiry",
    "sector": "residential",
    "priority": "normal"
  },
  "referenceLinking": {
    "hasExistingReference": false,
    "referenceType": "none"
  },
  "messageDetails": {
    "subject": "Test Contact Form Inquiry",
    "message": "This is a test message to verify the contact form is working correctly with Turnstile verification.",
    "preferredContactMethod": "either",
    "bestTimeToContact": "anytime",
    "newsletterOptIn": false
  }
}
```

### Test Keys (Development)

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

### Browser Equivalents for curl Testing

```bash
# Example: Submit form via curl (for server-side tests)
SITE_KEY="1x00000000000000000000AA"
SECRET_KEY="1x0000000000000000000000000000000AA"

# First, verify the token locally (simulates server verification)
# Note: curl cannot directly test Turnstile widget, but can test server API

curl -X POST http://localhost:3000/api/submitContactForm \
  -H "Content-Type: application/json" \
  -d '{
    "turnstileToken": "0.test-token-fake",
    "contactInfo": {"fullName": "John", "email": "john@example.com", "phone": "+441234567890"},
    "inquiryType": {"inquiryType": "general-inquiry", "sector": "residential", "priority": "normal"},
    "referenceLinking": {"hasExistingReference": false},
    "messageDetails": {"subject": "Test", "message": "Test message body", "preferredContactMethod": "either", "bestTimeToContact": "anytime"}
  }' | jq '.'
```

---

**Version:** 1.0  
**Last Updated:** April 5, 2026  
**Maintained By:** QA & Security Team
