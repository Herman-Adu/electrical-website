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
  const headerText =
    priority === "urgent" ? "URGENT CONTACT REQUEST" : "New Contact Request";
  const replySubject = encodeURIComponent(`Re: ${subject} (${referenceId})`);
  const replyHref = `mailto:${customerEmail}?subject=${replySubject}`;

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

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Contact Request",
            title: headerText,
            reference: referenceId,
            referenceLabel: "Reference",
            status: `${priority} Priority`,
          })}

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">

              <!-- Compact Meta Row -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px; background-color: ${BRAND_COLORS.bgCardMutedAlt}; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px;">
                <tr>
                  <td style="padding: 14px 16px; width: 34%; vertical-align: top;">
                    <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.45px;">Type</p>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600;">${inquiryTypeLabels[inquiryType] || inquiryType}</p>
                  </td>
                  <td style="padding: 14px 16px; width: 33%; vertical-align: top;">
                    <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.45px;">Submitted</p>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${submittedAt}</p>
                  </td>
                  <td style="padding: 14px 16px; width: 33%; text-align: right; vertical-align: top;">
                    <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.45px;">Sector</p>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600;">${sectorLabels[sector] || sector}</p>
                  </td>
                </tr>
              </table>

              <!-- Summary/Detail Grid (2-column max) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding: 0 8px 0 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBodyAlt}; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px;">Customer Summary</p>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; width: 92px; vertical-align: top;">Name:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${customerName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Email:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${customerEmail}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Phone:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${customerPhone}</td>
                            </tr>
                            ${
                              company
                                ? `
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Company:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${company}</td>
                            </tr>`
                                : ""
                            }
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding: 0 0 0 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBodyAlt}; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px;">Inquiry Details</p>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; width: 110px; vertical-align: top;">Subject:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${subject}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Method:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${contactMethodLabels[preferredContactMethod] || preferredContactMethod}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Best Time:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${timeLabels[bestTimeToContact] || bestTimeToContact}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 13px; vertical-align: top;">Newsletter:</td>
                              <td style="padding: 6px 0; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 500;">${newsletterOptIn ? "Subscribed" : "Not subscribed"}</td>
                            </tr>
                          </table>
                          ${
                            hasExistingReference && existingReferenceId
                              ? `
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 12px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px;">
                            <tr>
                              <td style="padding: 10px 12px;">
                                <p style="margin: 0; color: #92400e; font-size: 12px;"><strong>Linked Reference:</strong> <span style="font-family: monospace; color: #78350f;">${existingReferenceId}</span></p>
                                ${
                                  existingReferenceDescription
                                    ? `<p style="margin: 6px 0 0; color: #78350f; font-size: 12px;"><strong>Description:</strong> ${existingReferenceDescription}</p>`
                                    : ""
                                }
                              </td>
                            </tr>
                          </table>`
                              : ""
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px; background-color: ${BRAND_COLORS.bgBodyAlt}; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 10px; color: ${BRAND_COLORS.textDark}; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px;">Message</p>
                    <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- Standalone CTA Row -->
              <style>
                @media only screen and (max-width:600px) {
                  .contact-business-cta-cell { text-align: center !important; }
                  .contact-business-cta-table { margin: 0 auto !important; }
                }
              </style>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0;">
                <tr>
                  <td class="contact-business-cta-cell" style="text-align: right;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="contact-business-cta-table" style="margin: 0 0 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: ${config.brand.primary}; text-align: center;">
                          <a href="${replyHref}" style="display: inline-block; padding: 10px 18px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; line-height: 1;">Reply to Customer</a>
                        </td>
                      </tr>
                    </table>
                  </td>
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
