import {
  BRAND_COLORS,
  getUrgencyCardStyle,
  type UrgencyLevel,
} from "@/lib/email/config/email-config";
import {
  type ResolvedEmailConfig,
  getSharedHeaderHtml,
  getSharedFooterHtml,
  getUrgencyBadgeStyleFromConfig,
} from "@/lib/email/config/email-config-builder";

interface BusinessNotificationEmailProps {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  urgency: UrgencyLevel;
  description: string;
  preferredDate: string;
  preferredTimeSlot: string;
  alternativeDate?: string;
  address: string;
  city: string;
  county?: string;
  postcode: string;
  propertyType: string;
  accessInstructions?: string;
  flexibleScheduling: boolean;
  submittedAt: string;
  config: ResolvedEmailConfig;
}

export function generateBusinessNotificationEmail(
  props: BusinessNotificationEmailProps,
): string {
  const {
    requestId,
    customerName,
    customerEmail,
    customerPhone,
    serviceType,
    urgency,
    description,
    preferredDate,
    preferredTimeSlot,
    alternativeDate,
    address,
    city,
    county,
    postcode,
    propertyType,
    accessInstructions,
    flexibleScheduling,
    submittedAt,
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
  const formattedSubmitted = new Date(submittedAt).toLocaleString("en-GB");
  const sla = config.sla.service[urgency];
  const cardStyle = getUrgencyCardStyle(urgency);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Service Request - ${requestId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.bgBody};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 700px; border-collapse: collapse; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          ${getSharedHeaderHtml(config, undefined, undefined, {
            brandTitle: "Service Request",
            title: isEmergency
              ? "Emergency Service Request"
              : isUrgent
                ? "Urgent Service Request"
                : "New Service Request",
            reference: requestId,
            referenceLabel: "Request ID",
            status: "Action Required",
          })}

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              ${
                isEmergency
                  ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                  <td style="background-color: #fee2e2; border: 3px solid #dc2626; padding: 24px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0 0 12px; color: #dc2626; font-size: 24px; font-weight: 700;">IMMEDIATE ATTENTION REQUIRED</h2>
                    <p style="margin: 0 0 8px; color: #991b1b; font-size: 16px; font-weight: 600;">
                      This is an emergency service request. Customer expects contact within ${config.sla.service.emergency.time}.
                    </p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 14px;">Submitted: ${formattedSubmitted}</p>
                  </td>
                </tr>
              </table>
              `
                  : isUrgent
                    ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                <tr>
                  <td style="background-color: #fffbeb; border: 3px solid #d97706; padding: 24px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0 0 12px; color: #b45309; font-size: 24px; font-weight: 700;">PRIORITY ATTENTION REQUIRED</h2>
                    <p style="margin: 0 0 8px; color: #92400e; font-size: 16px; font-weight: 600;">
                      This is an urgent service request. Customer expects contact within ${config.sla.service.urgent.time}.
                    </p>
                    <p style="margin: 0; color: #78350f; font-size: 14px;">Submitted: ${formattedSubmitted}</p>
                  </td>
                </tr>
              </table>
              `
                    : ""
              }

              <!-- Customer Information -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; ${cardStyle}; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">Customer Information</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; width: 35%;">Name:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${customerEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Phone:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${customerPhone}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Service Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; ${cardStyle}; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">Service Details</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; width: 35%;">Service Type:</td>
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
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; vertical-align: top;">Description:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${description}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Property Information -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; ${cardStyle}; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">Property Information</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; width: 35%;">Address:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${address}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">City:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${city}</td>
                      </tr>
                      ${
                        county
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">County:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${county}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Postcode:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${postcode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Property Type:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${propertyType}</td>
                      </tr>
                      ${
                        accessInstructions
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; vertical-align: top;">Access:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${accessInstructions}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Schedule Preferences -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; ${cardStyle}; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 700;">Schedule Preferences</h3>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600; width: 35%;">Preferred Date:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Preferred Time:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${preferredTimeSlot}</td>
                      </tr>
                      ${
                        alternativeDate
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Alternative Date:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${new Date(alternativeDate).toLocaleDateString("en-GB")}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 600;">Flexible Scheduling:</td>
                        <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${flexibleScheduling ? "Yes" : "No"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid ${BRAND_COLORS.borderDefault}; margin: 32px 0;">

              <!-- Action Items -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${BRAND_COLORS.infoBlueBg}; border: 2px solid ${BRAND_COLORS.infoBlue}; border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.infoBlueText}; font-size: 18px; font-weight: 700;">Next Steps</h3>
                    <ol style="margin: 0; padding-left: 24px;">
                      <li style="margin: 8px 0; color: ${BRAND_COLORS.infoBlueDark}; font-size: 15px; line-height: 1.6; font-weight: 500;">
                        ${sla.businessAction}
                      </li>
                      <li style="margin: 8px 0; color: ${BRAND_COLORS.infoBlueDark}; font-size: 15px; line-height: 1.6; font-weight: 500;">
                        Confirm appointment date and time
                      </li>
                      <li style="margin: 8px 0; color: ${BRAND_COLORS.infoBlueDark}; font-size: 15px; line-height: 1.6; font-weight: 500;">
                        Assign electrician to the job
                      </li>
                      <li style="margin: 8px 0; color: ${BRAND_COLORS.infoBlueDark}; font-size: 15px; line-height: 1.6; font-weight: 500;">
                        Send appointment confirmation to customer
                      </li>
                      <li style="margin: 8px 0; color: ${BRAND_COLORS.infoBlueDark}; font-size: 15px; line-height: 1.6; font-weight: 500;">
                        Update CRM system with request details
                      </li>
                    </ol>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${getSharedFooterHtml(config, "business")}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
