import {
  BRAND_COLORS,
  type UrgencyLevel,
} from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedFooterHtml,
  getSharedHeaderHtml,
} from "@/lib/email/config/email-config-builder";

interface ServiceCustomerEmailProps {
  customerName: string;
  requestId: string;
  serviceType: string;
  urgency: UrgencyLevel;
  preferredDate: string;
  preferredTimeSlot: string;
  config: ResolvedEmailConfig;
}

const urgencyLabel: Record<UrgencyLevel, string> = {
  routine: "Routine",
  urgent: "Urgent",
  emergency: "Emergency",
};

const urgencyBanner: Record<UrgencyLevel, string> = {
  routine: "",
  urgent:
    '<div style="margin:0 0 20px;padding:12px 16px;border-radius:8px;background:#fffbeb;border-left:4px solid #d97706;color:#92400e;font-size:14px;">Urgent request received. Our team will prioritise this case.</div>',
  emergency:
    '<div style="margin:0 0 20px;padding:12px 16px;border-radius:8px;background:#fef2f2;border-left:4px solid #dc2626;color:#991b1b;font-size:14px;font-weight:600;">Emergency request received. Our emergency team is being notified now.</div>',
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

export function generateServiceCustomerEmail({
  customerName,
  requestId,
  serviceType,
  urgency,
  preferredDate,
  preferredTimeSlot,
  config,
}: ServiceCustomerEmailProps): string {
  const firstName = customerName.split(" ")[0] ?? customerName;
  const responseSla = config.sla.service[urgency];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Confirmation</title>
</head>
<body style="margin:0;padding:0;background:${BRAND_COLORS.bgBodyAlt};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND_COLORS.bgBodyAlt};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          ${getSharedHeaderHtml(config)}
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <h2 style="margin:0;color:#1a1a1a;font-size:22px;font-weight:700;">Service Request Received</h2>
              <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Reference: ${requestId}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 36px;">
              <p style="margin:0 0 16px;color:#27272a;font-size:16px;line-height:1.6;">Dear ${firstName},</p>
              <p style="margin:0 0 20px;color:#52525b;font-size:14px;line-height:1.7;">Thanks for submitting your service request. We have logged your details and our team will follow up soon.</p>
              ${urgencyBanner[urgency]}

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px;color:#27272a;font-size:15px;font-weight:600;">Request summary</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="padding:6px 0;color:#71717a;font-size:13px;width:140px;">Urgency:</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${urgencyLabel[urgency]}</td></tr>
                      <tr><td style="padding:6px 0;color:#71717a;font-size:13px;">Service Type:</td><td style="padding:6px 0;color:#111827;font-size:13px;text-transform:capitalize;">${formatServiceType(serviceType)}</td></tr>
                      <tr><td style="padding:6px 0;color:#71717a;font-size:13px;">Preferred Date:</td><td style="padding:6px 0;color:#111827;font-size:13px;">${preferredDate}</td></tr>
                      <tr><td style="padding:6px 0;color:#71717a;font-size:13px;">Preferred Time:</td><td style="padding:6px 0;color:#111827;font-size:13px;">${formatTimeSlot(preferredTimeSlot)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="padding:16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;">
                <p style="margin:0;color:#0c4a6e;font-size:13px;line-height:1.7;">${responseSla.description}</p>
              </div>
            </td>
          </tr>
          ${getSharedFooterHtml(config, "customer")}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
