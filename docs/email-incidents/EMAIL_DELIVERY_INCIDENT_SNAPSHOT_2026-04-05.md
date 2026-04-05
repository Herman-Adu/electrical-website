# Email Delivery Incident Snapshot (2026-04-05)

## Incident context

- Symptom reported: live app (Vercel) no longer sends email for forms.
- Dev environment behavior: forms sending successfully.
- User requested full memory rehydration package + orchestrator continuation prompt.

## Commit-window analysis (most recent)

Recent commits on main:

1. `2d2d298` (merge PR #44) ← hotfix wrapper commit
2. `4910cd8` fix(contact): prevent premature message-step validation errors
3. `a32b871` (merge PR #43) ← quotation migration wrapper commit
4. `5401a8f` feat(quotation): complete lift-and-shift migration
5. `e969c16` / `39b20b6` docs hydration updates
6. `ca8a4f1` contact migration baseline

### Material findings

- `4910cd8` touched only:
  - `features/contact/components/organisms/contact-steps/message-details-step.tsx`
- This commit cannot affect email transport logic.

- `5401a8f` introduced quotation email pipeline files:
  - `features/quotation/api/quotation-email-service.ts`
  - `features/quotation/api/quotation-request.ts`
  - templates under `features/quotation/api/templates/`

- Email sender config resolution currently comes from:
  - `lib/email/config/email-config-builder.ts`

- Critical behavior in current code:
  - `quotationFromEmail` resolves as:
    - `emailSettings?.quotationFromEmail`
    - else `emailSettings?.fromEmail`
    - else `COMPANY.email.noreply`

- Strapi settings loaders currently return `null` (no runtime override source):
  - `lib/strapi/global/email-settings/email-settings.ts`
  - `lib/strapi/global/company-settings/company-settings.ts`

- Hard fallback constants include static sender domain in:
  - `lib/email/services/email-config.tsx`

## Likely production failure mode

Given current resolution chain, if Vercel runtime has no active Strapi-config override and no code-level env override for quotation sender, the fallback `from` value can be used.

If that fallback domain is not verified in the Resend account tied to production `RESEND_API_KEY`, Resend can reject sends in production while other environments with different credentials/domain setup appear to work.

## Confidence and gaps

- High confidence on config resolution path and commit impact boundaries.
- Medium confidence on exact rejection code because runtime error payload from live logs was not captured in this session.

## Immediate investigation commands (safe, no secret output)

```bash
# 1) confirm latest deployed commit on Vercel matches main
# 2) inspect Vercel function logs for /contact and /quotation submissions
# 3) capture masked error class/message only (no secrets)
```

## Recommended hotfix direction

1. Add explicit env fallback support in config builder for sender addresses (e.g. quotation/contact/from/reply-to).
2. Keep fallback chain deterministic: env -> settings -> static constants.
3. Add a startup warning log when fallback static sender is used in production.
4. Add focused tests for sender-resolution precedence.

## Related files (primary)

- `features/quotation/api/quotation-email-service.ts`
- `features/quotation/api/quotation-request.ts`
- `features/contact/api/contact-email-service.ts`
- `lib/email/config/email-config-builder.ts`
- `lib/strapi/global/email-settings/email-settings.ts`
- `lib/strapi/global/company-settings/company-settings.ts`
- `lib/email/services/email-config.tsx`
