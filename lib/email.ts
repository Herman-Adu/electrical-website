import { Resend } from "resend";
import { env } from "@/app/env";

/**
 * Email service for contact form notifications
 * Uses Resend for reliable email delivery
 */

/**
 * Initialize Resend client with API key validation
 */
function getResendClient() {
  return new Resend(env.RESEND_API_KEY);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\u0000-\u001F\u007F]+/g, " ").trim();
}

const BRAND_COLOR_HEX = "#00f3bd";

export interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  referenceCode: string;
  ipAddress?: string;
}

/**
 * Send confirmation email to user
 */
export async function sendUserConfirmation(
  to: string,
  referenceCode: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();

    const safeReferenceCode = sanitizeHeaderValue(referenceCode);

    const result = await resend.emails.send({
      from: `${env.CONTACT_FROM_NAME} <${env.CONTACT_FROM_EMAIL}>`,
      to,
      subject: sanitizeHeaderValue(
        `Your Inquiry Received - Reference ${safeReferenceCode}`,
      ),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="border-bottom: 2px solid ${BRAND_COLOR_HEX}; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="color: ${BRAND_COLOR_HEX}; margin: 0;">Nexgen Electrical</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Electrical Innovations</p>
            </div>

            <h2 style="color: #222; margin-top: 0;">Thank you for your inquiry</h2>
            
            <p>We've received your project inquiry and our engineering team is reviewing it now.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid ${BRAND_COLOR_HEX}; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #666;">Reference Code</p>
              <p style="margin: 0; font-size: 18px; font-family: monospace; color: ${BRAND_COLOR_HEX}; font-weight: bold;">
                ${referenceCode}
              </p>
            </div>

            <h3 style="color: #222; margin-top: 30px;">Next steps</h3>
            <ol style="color: #666;">
              <li>Our team will review your project details</li>
              <li>You'll receive a detailed response within ${env.CONTACT_RESPONSE_TIME_HOURS} hours</li>
              <li>Keep your reference code handy for future correspondence</li>
            </ol>

            <h3 style="color: #222;">Need immediate assistance?</h3>
            <p style="color: #666;">
              For electrical emergencies, call our 24/7 emergency line:<br>
              <strong>1800 NEX GEN (1800 639 436)</strong>
            </p>

            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; font-size: 12px; color: #999;">
              <p style="margin: 0;">This is an automated confirmation. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 Nexgen Electrical. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[EMAIL_ERROR]", message);
    return { success: false, error: message };
  }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotification(
  data: ContactEmailData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const safeReferenceCode = escapeHtml(data.referenceCode);
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeCompany = escapeHtml(data.company || "Not provided");
    const safeProjectType = escapeHtml(data.projectType);
    const safeMessage = escapeHtml(data.message);
    const safeIpAddress = data.ipAddress ? escapeHtml(data.ipAddress) : "";
    const replyToHref = `mailto:${encodeURIComponent(data.email)}`;

    const result = await resend.emails.send({
      from: `${env.CONTACT_FROM_NAME} <${env.CONTACT_FROM_EMAIL}>`,
      to: env.CONTACT_FROM_EMAIL,
      subject: sanitizeHeaderValue(
        `New Contact Inquiry - ${safeProjectType} - REF: ${safeReferenceCode}`,
      ),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid ${BRAND_COLOR_HEX}; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #222;">New Contact Inquiry</h2>
              <p style="margin: 0; font-size: 12px; color: #999;">Reference: <strong>${safeReferenceCode}</strong></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; width: 30%; color: #666;">Name</td>
                <td style="padding: 10px 0;">${safeName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Email</td>
                <td style="padding: 10px 0;"><a href="${replyToHref}">${safeEmail}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Company</td>
                <td style="padding: 10px 0;">${safeCompany}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Project Type</td>
                <td style="padding: 10px 0;"><strong style="color: ${BRAND_COLOR_HEX};">${safeProjectType}</strong></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Submitted</td>
                <td style="padding: 10px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>

            <h3 style="color: #222; margin-top: 20px;">Project Details</h3>
            <div style="background-color: #fafafa; padding: 15px; border: 1px solid #eee; white-space: pre-wrap; word-break: break-word;">
${safeMessage}
            </div>

            ${
              data.ipAddress
                ? `<p style="margin-top: 20px; font-size: 12px; color: #999;">IP Address: ${safeIpAddress}</p>`
                : ""
            }

            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px;">
              <a href="${replyToHref}" style="display: inline-block; background-color: ${BRAND_COLOR_HEX}; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold;">
                Reply to ${safeName}
              </a>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ADMIN_EMAIL_ERROR]", message);
    return { success: false, error: message };
  }
}
