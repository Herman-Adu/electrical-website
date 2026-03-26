---
name: send-notification
description: "Send an email notification via Resend. Supports plain text and HTML email bodies, optional scheduling, and dry-run mode. Use this when asked to send an email, notify a recipient, deliver an alert, or schedule a message. Always confirm recipients and content before sending when not in dry-run mode."
---

# Send Notification Skill

Uses the **resend** MCP server. This is a **destructive skill** — it sends real emails. Always use `dryRun: true` for previews.

## When to use

- "Send a notification to herman@adudev.co.uk that the deployment succeeded"
- "Email the client about the project update"
- "Schedule a reminder email for tomorrow at 10am"
- "Preview what the notification email would look like"

## Steps

1. Identify `to` (recipient email), `subject`, and body text.
2. If HTML formatting is needed, prepare `bodyHtml` alongside `bodyText`.
3. For scheduled sends, determine the ISO 8601 `scheduledAt` datetime.
4. **Always preview with `dryRun: true` first** and confirm with the user before sending.
5. After sending, report the `messageId` for tracking.

## Guidelines

- **Never send emails without explicit user confirmation** unless the intent clearly states automated notification.
- Sender is always `contact@adudev.co.uk` (CONTACT_FROM_EMAIL env var) — do not attempt to change it.
- Subject lines should be clear and actionable — maximum 60 characters.
- HTML bodies must be valid — avoid inline `<script>` tags.
- `scheduledAt` uses natural language via Resend (e.g. "tomorrow at 10am").

## Secret Safety (Non-Negotiable)

- Never print, echo, summarize, or quote secret values from `.env*`, terminal output, logs, screenshots, or tool results.
- Always mask sensitive tokens in all outputs (for example: `re_***`, `gQAA***`).
- Use secret variable names only (for example: `RESEND_API_KEY`) when discussing configuration.
- If credentials are exposed during a session, recommend immediate credential rotation before continuing.
