/**
 * Contact Business Notification Email Template
 *
 * HTML email template for internal contact notifications
 */

import { BRAND_COLORS, SLA } from "@/lib/email/services/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
} from "@/lib/email/config/email-config-builder";

interface ContactBusinessEmailProps {
  referenceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  inquiryType: string;
  sector: string;
  priority: string;
  hasExistingReference: boolean;
  existingReferenceId?: string;
  existingReferenceDescription?: string;
  subject: string;
  message: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  newsletterOptIn?: boolean;
  config: ResolvedEmailConfig;
}

const inquiryTypeLabels: Record<string, string> = {
  "general-inquiry": "General Inquiry",
  "service-follow-up": "Service Follow-up",
  "quote-follow-up": "Quote Follow-up",
  complaint: "Complaint",
  feedback: "Feedback",
  partnership: "Partnership",
  "media-press": "Media & Press",
  careers: "Careers",
};

const sectorLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  "not-applicable": "Not Applicable",
};

const priorityColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  low: { bg: "#dcfce7", text: "#166534", border: "#22c55e" },
  normal: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" },
  high: { bg: "#fed7aa", text: "#c2410c", border: "#f97316" },
  urgent: { bg: "#fecaca", text: "#dc2626", border: "#ef4444" },
};

const contactMethodLabels: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  either: "Either (No Preference)",
};

const timeLabels: Record<string, string> = {
  morning: "Morning (9am - 12pm)",
  afternoon: "Afternoon (12pm - 5pm)",
  evening: "Evening (5pm - 8pm)",
  anytime: "Anytime",
};

export function generateContactBusinessEmail({
  referenceId,
  customerName,
  customerEmail,
  customerPhone,
  company,
  inquiryType,
  sector,
  priority,
  hasExistingReference,
  existingReferenceId,
  existingReferenceDescription,
  subject,
  message,
  preferredContactMethod,
  bestTimeToContact,
  newsletterOptIn,
  config,
}: ContactBusinessEmailProps): string {
  const priorityStyle = priorityColors[priority] || priorityColors.normal;
  const submittedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bgBodyAlt}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBodyAlt};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 700px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          ${getSharedHeaderHtml(config)}

          <!-- Reference Banner -->
          <tr>
            <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 16px 40px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="color: ${BRAND_COLORS.textLighter}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Reference</span><br>
                    <span style="color: ${config.brand.primary}; font-size: 16px; font-weight: 700; font-family: monospace;">${referenceId}</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="color: ${BRAND_COLORS.textLighter}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Type</span><br>
                    <span style="color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${inquiryTypeLabels[inquiryType] || inquiryType}</span>
                  </td>
                  <td style="text-align: center;">
                    <span style="color: ${BRAND_COLORS.textLighter}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted</span><br>
                    <span style="color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${submittedAt}</span>
                  </td>
                  <td style="text-align: right;">
                    <span style="color: ${BRAND_COLORS.textLighter}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Sector</span><br>
                    <span style="color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${sectorLabels[sector] || sector}</span>
                  </td>
                  <td style="text-align: right;">
                    <span style="display: inline-block; padding: 6px 16px; background-color: ${priorityStyle.bg}; color: ${priorityStyle.text}; border: 1px solid ${priorityStyle.border}; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                      ${priority} Priority
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">

              <!-- Contact Information -->
              <h2 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${config.brand.primary}; padding-bottom: 8px; display: inline-block;">
                Contact Information
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 140px; vertical-align: top;">Name:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; vertical-align: top;">Email:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; vertical-align: top;">Phone:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${customerPhone}</td>
                </tr>
                ${
                  company
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; vertical-align: top;">Company:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${company}</td>
                </tr>
                `
                    : ""
                }
              </table>

              ${
                hasExistingReference && existingReferenceId
                  ? `
              <!-- Linked Reference -->
              <h2 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${config.brand.primary}; padding-bottom: 8px; display: inline-block;">
                Linked Reference
              </h2>
              <div style="margin-bottom: 28px; padding: 16px; background-color: #fffbeb; border-radius: 8px; border: 1px solid #fcd34d;">
                <p style="margin: 0 0 8px; color: #92400e; font-size: 14px;">
                  <strong>Reference ID:</strong> <span style="font-family: monospace; color: #78350f;">${existingReferenceId}</span>
                </p>
                ${
                  existingReferenceDescription
                    ? `
                <p style="margin: 0; color: #78350f; font-size: 14px;">
                  <strong>Description:</strong> ${existingReferenceDescription}
                </p>
                `
                    : ""
                }
              </div>
              `
                  : ""
              }

              <!-- Message Details -->
              <h2 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${config.brand.primary}; padding-bottom: 8px; display: inline-block;">
                Message Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 140px; vertical-align: top;">Subject:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${subject}</td>
                </tr>
              </table>
              <div style="margin-bottom: 28px; padding: 16px; background-color: ${BRAND_COLORS.bgBodyAlt}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.borderLight};">
                <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Contact Preferences -->
              <h2 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${config.brand.primary}; padding-bottom: 8px; display: inline-block;">
                Contact Preferences
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 140px;">Preferred Method:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${contactMethodLabels[preferredContactMethod] || preferredContactMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Best Time:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${timeLabels[bestTimeToContact] || bestTimeToContact}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Newsletter:</td>
                  <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${newsletterOptIn ? "Subscribed" : "Not subscribed"}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Response Reminder -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="text-align: center; padding: 16px; background-color: ${BRAND_COLORS.bgCardMutedAlt}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.borderLight};">
                <p style="margin: 0; color: #52525b; font-size: 14px;">
                  ${SLA.contact.businessAction} using the contact details above.
                </p>
              </div>
            </td>
          </tr>

          ${getSharedFooterHtml(config, "business")}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
