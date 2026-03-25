# ADR-002: Production-Grade Contact Form Handling

**Date:** 2026-03-24  
**Status:** Accepted (awaiting implementation in P4-B2)  
**Context:** Phase 4 - Forms, Validation, and Security Hardening

## Problem Statement

The current contact form (`components/sections/contact.tsx`) is fully client-side with no actual submission mechanism:

- Form captures user input but never persists or sends it
- Shows a simulated success state for 3 seconds
- No email notification to administrators
- No database record created
- No validation beyond HTML5 browser constraints
- No rate limiting or security controls

This is inadequate for a production electrical services business that needs to respond to customer inquiries.

## Requirements

1. **Capture and persist contact inquiries** — store in database or accessible log
2. **Notification** — send email to admin with inquiry details
3. **Security** — validate server-side, implement rate limiting, CSRF protection
4. **User experience** — maintain current animation polish while adding real functionality
5. **Clear expectations** — tell user their inquiry was actually received and will be reviewed
6. **Accessibility** — maintain keyboard navigation and semantic HTML

## Approach Considered

### Option 1: Third-Party Service (Formspree, Basin, Emailjs)

- **Pros:** Zero backend maintenance, pre-built email/submission handling
- **Cons:** External dependency, limited customization, data leaves our control, potential privacy/GDPR concerns
- **Status:** Rejected — too much external dependency for a critical business process

### Option 2: Dedicated API Route

- **Pros:** Full control, clear separation of concerns
- **Cons:** More boilerplate, requires manual validation, error handling, and email integration
- **Status:** Considered but superseded by Server Actions

### Option 3: Next.js Server Action (Chosen)

- **Pros:**
  - Integrates seamlessly with Next.js 16
  - No separate API route needed
  - Type-safe form submissions (zero-runtime serialization)
  - Can be progressively enhanced (form submits even without JS with basic handling)
  - Keeps component code co-located with action
  - Built-in CSRF protection
- **Cons:** Requires moving submission logic out of component
- **Status:** **Recommended and accepted**

## Decision

We will implement contact form handling using **Next.js Server Actions** with the following architecture:

### Server-Side

1. **Server Action** (`lib/actions/contact.ts` or similar)
   - Validates form data (name, email, company, project type, message)
   - Enforces rate limiting per IP address (basic: max 3 submissions per hour)
   - Creates database record (if storage available, otherwise log)
   - Sends confirmation email to user
   - Sends notification email to admin
   - Returns success with reference code (database ID or hash)
   - Returns errors for validation failures or rate limit hits

2. **Database/Persistence**
   - Store inquiries in a simple table: `contact_inquiries (id, name, email, company, projectType, message, submittedAt, ipAddress)`
   - If no traditional database available, use file-based storage or external service

3. **Email Service**
   - Admin notification with full inquiry details
   - User confirmation with reference code and expected response time
   - Use Resend, SendGrid, or similar (or email via SMTP)

### Client-Side

1. **Form Component** (`components/sections/contact.tsx`)
   - Remains `use client` (Framer Motion animations required)
   - Add `const handleSubmit = async (e: FormEvent) => { await submitContactInquiry(formData); }`
   - Show loading state during submission
   - Show confirmation with real reference code (not timestamp-based)
   - Show error state if submission fails
   - Display expected response time

2. **Form Validation**
   - Keep HTML5 `required` for immediate feedback
   - Add client-side format validation (email format, min/max lengths)
   - Clear error messages for validation failures

### Security & Reliability

- **Rate Limiting:** 3 submissions per IP per hour (prevents spam/bots)
- **CSRF Protection:** Built-in via Next.js server actions
- **Validation:** Zod schema for input validation (shared client + server)
- **Error Handling:** Clear user feedback, no sensitive data in error messages
- **Monitoring:** Log all submissions, monitor for suspicious patterns

## Implementation Phases

- **P4-B1** (current): Architecture decision and ADR documentation ✓
- **P4-B2:** Implement server action, email service, database persistence
- **P4-B3:** Add rate limiting, security headers, CSRF tokens

## Notes

- The current animated contact section is effective and should be preserved
- Animation triggers on scroll (`useInView`) must remain client-side
- Form layout and styling do not need to change
- Success state will be updated with real reference code instead of timestamp
- Expected response time messaging ("Response within 2hrs") can be shown after successful submission

## Related Decisions

- [ADR-001: Build Safety](./001-build-safety.md) — foundational build integrity
- Phase 3 boundary decisions — confirmed all client boundaries, contact form rightfully remains `use client` for animations
