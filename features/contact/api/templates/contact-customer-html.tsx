/**
 * Contact Customer Confirmation Email Template
 *
 * HTML email template for contact form confirmations
 */

import { BRAND_COLORS, SLA } from "@/lib/email/services/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
} from "@/lib/email/config/email-config-builder";

interface ContactCustomerEmailProps {
  customerName: string;
  referenceId: string;
  subject: string;
  inquiryType: string;
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

export function generateContactCustomerEmail({
  customerName,
  referenceId,
  subject,
  inquiryType,
  config,
}: ContactCustomerEmailProps): string {
  const firstName = customerName.split(" ")[0];
  const inquiryLabel = inquiryTypeLabels[inquiryType] || inquiryType;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Inquiry Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bgBodyAlt}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBodyAlt};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          ${getSharedHeaderHtml(config)}

          <!-- Title row after header -->
          <tr>
            <td style="padding: 32px 40px 0; text-align: center;">
              <h2 style="margin: 0; color: #1a1a1a; font-size: 22px; font-weight: 700;">Message Received</h2>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Reference: ${referenceId}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
                Dear ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for contacting ${config.company.name}. We have received your inquiry and our team will review it promptly.
              </p>

              <!-- Inquiry Summary -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0; background-color: ${BRAND_COLORS.bgCardMutedAlt}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.borderLight};">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Your Inquiry
                    </h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 120px;">Type:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${inquiryLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Subject:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">${subject}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <div style="margin: 24px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid ${config.brand.primary};">
                <h3 style="margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600;">
                  What happens next?
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li>${SLA.contact.description}</li>
                  <li>We'll respond via your preferred contact method</li>
                  <li>Keep your reference number handy for follow-ups</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0; color: #52525b; font-size: 14px; line-height: 1.6;">
                If you have any urgent questions, please don't hesitate to call us at <strong>${config.company.phone}</strong>.
              </p>

              <p style="margin: 24px 0 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: ${BRAND_COLORS.textDark};">The ${config.company.name} Team</strong>
              </p>
            </td>
          </tr>

          ${getSharedFooterHtml(config, "customer")}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
