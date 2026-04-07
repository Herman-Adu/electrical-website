import {
  BRAND_COLORS,
  type UrgencyLevel,
} from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
  getUrgencyBadgeStyleFromConfig,
} from "@/lib/email/config/email-config-builder";

interface CustomerConfirmationEmailProps {
  customerName: string;
  requestId: string;
  serviceType: string;
  urgency: UrgencyLevel;
  preferredDate: string;
  preferredTimeSlot: string;
  address: string;
  city: string;
  postcode: string;
  config: ResolvedEmailConfig;
}

export function generateCustomerConfirmationEmail(
  props: CustomerConfirmationEmailProps,
): string {
  const {
    customerName,
    requestId,
    serviceType,
    urgency,
    preferredDate,
    preferredTimeSlot,
    address,
    city,
    postcode,
    config,
  } = props;

  const isEmergency = urgency === "emergency";
  const isUrgent = urgency === "urgent";
  const formattedDate = new Date(preferredDate).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sla = config.sla.service[urgency];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Confirmation - ${requestId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.bgBody};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 700px; border-collapse: collapse; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Service Request",
            title: "Request Confirmed",
            reference: requestId,
            referenceLabel: "Request ID",
            status: "Received",
            statusTone: isEmergency
              ? "emergency"
              : isUrgent
                ? "urgent"
                : "normal",
          })}

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">Dear ${customerName},</p>

              <p style="margin: 0 0 24px; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                Thank you for choosing our electrical services. We have received your service request and our team will contact you shortly to confirm the appointment details.
              </p>

              ${
                isEmergency
                  ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0 0 8px; color: #dc2626; font-size: 18px; font-weight: 700;">EMERGENCY SERVICE REQUEST</p>
                    <p style="margin: 0; color: #991b1b; font-size: 14px;">
                      Our emergency response team has been notified and will contact you within ${config.sla.service.emergency.time}.
                    </p>
                  </td>
                </tr>
              </table>
              `
                  : isUrgent
                    ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0 0 8px; color: #b45309; font-size: 18px; font-weight: 700;">URGENT SERVICE REQUEST</p>
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      Your request has been marked as urgent. Our team will prioritise this and contact you within ${config.sla.service.urgent.time}.
                    </p>
                  </td>
                </tr>
              </table>
              `
                    : ""
              }

              <!-- Request Details Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${BRAND_COLORS.bgCardMuted}; border: 1px solid ${BRAND_COLORS.borderDefault}; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">Request Details</h3>

                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Request ID:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${requestId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Service Type:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${serviceType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Priority:</td>
                        <td style="padding: 8px 0;">
                          <span style="${getUrgencyBadgeStyleFromConfig(urgency, config)}">
                            ${urgency.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Preferred Date:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Preferred Time:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${preferredTimeSlot}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Location:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${address}, ${city} ${postcode}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">What Happens Next?</h3>
              <ol style="margin: 0 0 24px; padding-left: 24px;">
                <li style="margin: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                  ${sla.description}
                </li>
                <li style="margin: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                  A qualified electrician will contact you to confirm the appointment
                </li>
                <li style="margin: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                  We'll arrive at your scheduled time and complete the work professionally
                </li>
                <li style="margin: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                  You'll receive a detailed invoice and warranty information
                </li>
              </ol>

              <hr style="border: none; border-top: 1px solid ${BRAND_COLORS.borderDefault}; margin: 32px 0;">

              <p style="margin: 0 0 16px; color: ${BRAND_COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
                If you have any questions or need to modify your request, please contact us at <strong>${config.company.email.support}</strong> or call <strong>${config.company.phone}</strong>.
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
  `.trim();
}
