import type { CompleteServiceRequestInput } from "../../schemas/service-request-schemas";
import {
  BRAND_COLORS,
  type UrgencyLevel,
} from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedFooterHtml,
  getSharedHeaderHtml,
} from "@/lib/email/config/email-config-builder";

interface ServiceBusinessEmailProps {
  requestId: string;
  submittedAt: string;
  formData: CompleteServiceRequestInput;
  config: ResolvedEmailConfig;
}

const urgencyLabel: Record<UrgencyLevel, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
};

function formatServiceType(value: string): string {
  return value.replace(/-/g, " ");
}

function formatTimeSlot(value: string): string {
  const labels: Record<string, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    anytime: "Any time",
  };
  return labels[value] ?? value;
}

export function generateServiceBusinessEmail({
  requestId,
  submittedAt,
  formData,
  config,
}: ServiceBusinessEmailProps): string {
  const { contact, serviceDetails, propertyInfo } = formData;
  const urgency = serviceDetails.urgency;

  const headerTitle =
    urgency === "emergency"
      ? "EMERGENCY SERVICE REQUEST"
      : urgency === "urgent"
        ? "URGENT SERVICE REQUEST"
        : "New Service Request";

  const submittedAtLabel = new Date(submittedAt).toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Notification</title>
</head>
<body style="margin:0;padding:0;background:${BRAND_COLORS.bgBodyAlt};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND_COLORS.bgBodyAlt};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          ${getSharedHeaderHtml(config)}
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <h2 style="margin:0;color:#1a1a1a;font-size:22px;font-weight:700;">${headerTitle}</h2>
              <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Request ID: ${requestId}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 36px;">
              <p style="margin:0 0 16px;color:#71717a;font-size:12px;">Submitted: ${submittedAtLabel}</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#f8fafc;padding:10px 14px;font-size:13px;font-weight:600;color:#111827;">Contact</td></tr>
                <tr><td style="padding:12px 14px;font-size:13px;color:#374151;line-height:1.7;">
                  <strong>Name:</strong> ${contact.fullName}<br>
                  <strong>Email:</strong> ${contact.email}<br>
                  <strong>Phone:</strong> ${contact.phone}${contact.company ? `<br><strong>Company:</strong> ${contact.company}` : ""}
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#f8fafc;padding:10px 14px;font-size:13px;font-weight:600;color:#111827;">Service</td></tr>
                <tr><td style="padding:12px 14px;font-size:13px;color:#374151;line-height:1.7;">
                  <strong>Urgency:</strong> ${urgencyLabel[urgency]}<br>
                  <strong>Type:</strong> ${formatServiceType(serviceDetails.serviceType)}<br>
                  <strong>Description:</strong><br>
                  ${serviceDetails.description}
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#f8fafc;padding:10px 14px;font-size:13px;font-weight:600;color:#111827;">Property & Schedule</td></tr>
                <tr><td style="padding:12px 14px;font-size:13px;color:#374151;line-height:1.7;">
                  <strong>Property Type:</strong> ${propertyInfo.propertyType}<br>
                  <strong>Address:</strong> ${propertyInfo.addressLine1}${propertyInfo.addressLine2 ? `, ${propertyInfo.addressLine2}` : ""}, ${propertyInfo.city}${propertyInfo.county ? `, ${propertyInfo.county}` : ""}, ${propertyInfo.postcode}<br>
                  <strong>Preferred Date:</strong> ${propertyInfo.preferredDate}<br>
                  <strong>Preferred Time:</strong> ${formatTimeSlot(propertyInfo.preferredTimeSlot)}<br>
                  ${propertyInfo.flexibleScheduling ? `<strong>Flexible Scheduling:</strong> Yes<br>` : ""}
                  ${propertyInfo.alternativeDate ? `<strong>Alternative Date:</strong> ${propertyInfo.alternativeDate}<br>` : ""}
                  ${propertyInfo.accessInstructions ? `<strong>Access Instructions:</strong> ${propertyInfo.accessInstructions}` : ""}
                </td></tr>
              </table>
            </td>
          </tr>

          ${getSharedFooterHtml(config, "business")}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
