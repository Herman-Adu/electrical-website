/**
 * Quotation Business Notification Email Template
 * Pure HTML string generator - no React Email dependency
 */

import type { CompleteQuotationInput } from "../../schemas/quotation-schemas";
import { BRAND_COLORS, SLA } from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
} from "@/lib/email/config/email-config-builder";

interface QuotationBusinessEmailProps {
  requestId: string;
  submittedAt: string;
  formData: CompleteQuotationInput;
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
    unsure: "Not sure / Need guidance",
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

const formatProjectSize = (value: string) => {
  const labels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "very-large": "Very Large",
  };
  return labels[value] || value;
};

export function generateQuotationBusinessEmail(
  props: QuotationBusinessEmailProps,
): string {
  const { requestId, submittedAt, formData, config } = props;
  const { contact, projectType, scope, site, budget, additional } = formData;

  const isUrgent = budget.timeline === "urgent";
  const headerText = isUrgent
    ? "URGENT QUOTATION REQUEST"
    : "New Quotation Request";

  const formattedDate = new Date(submittedAt).toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quotation Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.bgBodyAlt};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_COLORS.bgBodyAlt}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Quotation Request",
            title: headerText,
            reference: requestId,
            referenceLabel: "Request ID",
            status: isUrgent ? "Urgent" : "New",
          })}

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <!-- Submitted Time -->
              <p style="margin: 0 0 24px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">
                Submitted: ${formattedDate}
              </p>

              <!-- Contact Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Contact Information</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 120px;">Name:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${contact.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Email:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${contact.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Phone:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${contact.phone}</td>
                      </tr>
                      ${
                        contact.company
                          ? `
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Company:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${contact.company}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Contact Pref:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; text-transform: capitalize;">${additional.preferredContactMethod}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Project Type -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Project Type</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 120px;">Category:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; text-transform: capitalize;">${projectType.projectCategory}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Type:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; text-transform: capitalize;">${projectType.projectType.replace(/-/g, " ")}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Property:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; text-transform: capitalize;">${projectType.propertyType.replace(/-/g, " ")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Project Scope -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Project Scope</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 120px;">Size:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${formatProjectSize(scope.estimatedSize)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; vertical-align: top;">Services:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; text-transform: capitalize;">${scope.services.map((s: string) => s.replace(/-/g, " ")).join(", ")}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Has Drawings:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${scope.hasDrawings ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Needs Design:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${scope.needsDesign ? "Yes" : "No"}</td>
                      </tr>
                    </table>
                    <div style="margin-top: 12px; padding: 12px; background-color: ${BRAND_COLORS.bgBodyAlt}; border-radius: 4px;">
                      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textLighter}; font-size: 12px; font-weight: 600;">Description:</p>
                      <p style="margin: 0; color: #27272a; font-size: 14px; line-height: 1.5;">${scope.projectDescription}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Site Address -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Site Address</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px; color: #27272a; font-size: 14px; line-height: 1.5;">
                      ${site.addressLine1}${site.addressLine2 ? `<br>${site.addressLine2}` : ""}<br>
                      ${site.city}${site.county ? `, ${site.county}` : ""}<br>
                      ${site.postcode}
                    </p>
                    ${
                      site.siteAccessNotes
                        ? `
                    <p style="margin: 12px 0 0; padding: 8px; background-color: #fef3c7; border-radius: 4px; color: #92400e; font-size: 12px;">
                      <strong>Access Notes:</strong> ${site.siteAccessNotes}
                    </p>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <!-- Budget & Timeline -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Budget & Timeline</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px; width: 120px;">Budget:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px; font-weight: 600;">${formatBudgetRange(budget.budgetRange)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Timeline:</td>
                        <td style="padding: 6px 0; color: ${isUrgent ? "#dc2626" : "#27272a"}; font-size: 14px; font-weight: ${isUrgent ? "700" : "600"};">${formatTimeline(budget.timeline)}</td>
                      </tr>
                      ${
                        budget.preferredStartDate
                          ? `
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Start Date:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${new Date(budget.preferredStartDate).toLocaleDateString("en-GB")}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Flexible Budget:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${budget.flexibleOnBudget ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLighter}; font-size: 14px;">Flexible Timeline:</td>
                        <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${budget.flexibleOnTimeline ? "Yes" : "No"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Additional Info -->
              ${
                additional.complianceRequirements.length > 0 ||
                additional.specialRequirements
                  ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: ${BRAND_COLORS.bgCardMutedAlt}; padding: 12px 16px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
                    <h2 style="margin: 0; color: #27272a; font-size: 14px; font-weight: 600;">Additional Information</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    ${
                      additional.complianceRequirements.length > 0
                        ? `
                    <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">Compliance Requirements:</p>
                    <p style="margin: 0 0 12px; color: #27272a; font-size: 14px; text-transform: uppercase;">${additional.complianceRequirements.join(", ")}</p>
                    `
                        : ""
                    }
                    ${
                      additional.specialRequirements
                        ? `
                    <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">Special Requirements:</p>
                    <p style="margin: 0; color: #27272a; font-size: 14px; line-height: 1.5;">${additional.specialRequirements}</p>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <!-- Marketing & Source -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 0; color: ${BRAND_COLORS.textLighter}; font-size: 12px; width: 140px;">Marketing Consent:</td>
                        <td style="padding: 4px 0; color: #27272a; font-size: 12px;">${additional.marketingConsent ? "Yes" : "No"}</td>
                      </tr>
                      ${
                        additional.howDidYouHear
                          ? `
                      <tr>
                        <td style="padding: 4px 0; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">Source:</td>
                        <td style="padding: 4px 0; color: #27272a; font-size: 12px; text-transform: capitalize;">${additional.howDidYouHear.replace(/-/g, " ")}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SLA Reminder -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 12px; text-align: center;">
                ${SLA.quotation.businessAction}
              </p>
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
