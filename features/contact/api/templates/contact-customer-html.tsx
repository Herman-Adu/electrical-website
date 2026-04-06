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
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 700px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Contact Request",
            title: "Message Received",
            reference: referenceId,
            referenceLabel: "Reference",
            status: "Received",
          })}

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
                Dear ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for contacting ${config.company.name}. We have received your inquiry and our team will review it promptly.
              </p>

              <!-- Compact Meta Row -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0 16px; background-color: ${BRAND_COLORS.bgCardMutedAlt}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.borderLight};">
                <tr>
                  <td style="padding: 14px 16px; width: 55%; vertical-align: top;">
                    <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.45px;">Inquiry Type</p>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600;">${inquiryLabel}</p>
                  </td>
                  <td style="padding: 14px 16px; width: 45%; text-align: right; vertical-align: top;">
                    <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.45px;">Response Window</p>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600;">${SLA.contact.response}</p>
                  </td>
                </tr>
              </table>

              <!-- Summary/Detail Grid (2-column max) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding: 0 8px 0 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBodyAlt}; border-radius: 8px; border: 1px solid ${BRAND_COLORS.borderLight};">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px;">Inquiry Summary</p>
                          <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">Subject</p>
                          <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500; line-height: 1.6;">${subject}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding: 0 0 0 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border-radius: 8px; border: 1px solid #fcd34d;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 12px; color: #92400e; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px;">Next Steps</p>
                          <ul style="margin: 0; padding: 0 0 0 18px; color: #78350f; font-size: 13px; line-height: 1.7;">
                            <li>${SLA.contact.description}</li>
                            <li>We'll respond via your preferred contact method</li>
                            <li>Keep your reference number handy for follow-ups</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Standalone CTA Row -->
              <style>
                @media only screen and (max-width:600px) {
                  .contact-customer-cta-cell { text-align: center !important; }
                  .contact-customer-cta-table { margin: 0 auto !important; }
                }
              </style>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 8px;">
                <tr>
                  <td class="contact-customer-cta-cell" style="text-align: right;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="contact-customer-cta-table" style="margin: 0 0 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: ${config.brand.primary}; text-align: center;">
                          <a href="tel:${config.company.phone}" style="display: inline-block; padding: 10px 18px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; line-height: 1;">Call ${config.company.phone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

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
