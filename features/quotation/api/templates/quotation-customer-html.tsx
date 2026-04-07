/**
 * Quotation Customer Confirmation Email Template
 * Pure HTML string generator - no React Email dependency
 */

import { BRAND_COLORS, SLA } from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
} from "@/lib/email/config/email-config-builder";

interface QuotationCustomerEmailProps {
  customerName: string;
  company?: string;
  requestId: string;
  projectCategory: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  config: ResolvedEmailConfig;
}

const formatBudgetRange = (value: string) => {
  const labels: Record<string, string> = {
    "under-5k": "Under \u00A35,000",
    "5k-15k": "\u00A35,000 - \u00A315,000",
    "15k-50k": "\u00A315,000 - \u00A350,000",
    "50k-100k": "\u00A350,000 - \u00A3100,000",
    "100k-250k": "\u00A3100,000 - \u00A3250,000",
    "over-250k": "Over \u00A3250,000",
    unsure: "To be discussed",
  };
  return labels[value] || value;
};

const formatTimeline = (value: string) => {
  const labels: Record<string, string> = {
    urgent: "Urgent",
    "1-month": "Within 1 Month",
    "1-3-months": "1-3 Months",
    "3-6-months": "3-6 Months",
    "6-12-months": "6-12 Months",
    flexible: "Flexible",
  };
  return labels[value] || value;
};

export function generateQuotationCustomerEmail(
  props: QuotationCustomerEmailProps,
): string {
  const {
    customerName,
    company,
    requestId,
    projectCategory,
    projectType,
    budgetRange,
    timeline,
    config,
  } = props;
  const statusTone =
    timeline === "emergency"
      ? "emergency"
      : timeline === "urgent"
        ? "urgent"
        : "normal";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation Request Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.bgBodyAlt};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_COLORS.bgBodyAlt}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Quotation Request",
            title: "Quotation Request Received",
            reference: requestId,
            referenceLabel: "Reference",
            status: "Received",
            statusTone,
          })}

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; color: #27272a; font-size: 16px; line-height: 1.6;">
                Dear ${customerName}${company ? ` (${company})` : ""},
              </p>

              <p style="margin: 0 0 24px; color: #52525b; font-size: 14px; line-height: 1.6;">
                Thank you for submitting your quotation request. We have received your enquiry and our team will review your requirements shortly.
              </p>

              <!-- Request Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px; color: #27272a; font-size: 16px; font-weight: 600;">Request Summary</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 140px;">Project Category:</td>
                        <td style="padding: 8px 0; color: #27272a; font-size: 14px; font-weight: 500; text-transform: capitalize;">${projectCategory}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Project Type:</td>
                        <td style="padding: 8px 0; color: #27272a; font-size: 14px; font-weight: 500; text-transform: capitalize;">${projectType.replace(/-/g, " ")}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Budget Range:</td>
                        <td style="padding: 8px 0; color: #27272a; font-size: 14px; font-weight: 500;">${formatBudgetRange(budgetRange)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Timeline:</td>
                        <td style="padding: 8px 0; color: #27272a; font-size: 14px; font-weight: 500;">${formatTimeline(timeline)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next -->
              <h2 style="margin: 0 0 16px; color: #27272a; font-size: 16px; font-weight: 600;">What Happens Next?</h2>
              <ol style="margin: 0 0 24px; padding-left: 20px; color: #52525b; font-size: 14px; line-height: 1.8;">
                <li>Our team will review your project requirements</li>
                <li>We may contact you if we need any additional information</li>
                <li>${SLA.quotation.description}</li>
                <li>We'll be happy to discuss any questions you may have</li>
              </ol>

              <p style="margin: 0; color: #52525b; font-size: 14px; line-height: 1.6;">
                If you have any questions in the meantime, please don't hesitate to contact us.
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
