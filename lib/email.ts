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

    const result = await resend.emails.send({
      from: `${env.CONTACT_FROM_NAME} <${env.CONTACT_FROM_EMAIL}>`,
      to,
      subject: `Your Inquiry Received - Reference ${referenceCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="border-bottom: 2px solid #00f2ff; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="color: #00f2ff; margin: 0;">Nexgen Electrical</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Electrical Innovations</p>
            </div>

            <h2 style="color: #222; margin-top: 0;">Thank you for your inquiry</h2>
            
            <p>We've received your project inquiry and our engineering team is reviewing it now.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #00f2ff; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #666;">Reference Code</p>
              <p style="margin: 0; font-size: 18px; font-family: monospace; color: #00f2ff; font-weight: bold;">
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

    const result = await resend.emails.send({
      from: `${env.CONTACT_FROM_NAME} <${env.CONTACT_FROM_EMAIL}>`,
      to: env.CONTACT_ADMIN_EMAIL,
      subject: `New Contact Inquiry - ${data.projectType} - REF: ${data.referenceCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #00f2ff; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #222;">New Contact Inquiry</h2>
              <p style="margin: 0; font-size: 12px; color: #999;">Reference: <strong>${data.referenceCode}</strong></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; width: 30%; color: #666;">Name</td>
                <td style="padding: 10px 0;">${data.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Company</td>
                <td style="padding: 10px 0;">${data.company || "Not provided"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Project Type</td>
                <td style="padding: 10px 0;"><strong style="color: #00f2ff;">${data.projectType}</strong></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Submitted</td>
                <td style="padding: 10px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>

            <h3 style="color: #222; margin-top: 20px;">Project Details</h3>
            <div style="background-color: #fafafa; padding: 15px; border: 1px solid #eee; white-space: pre-wrap; word-break: break-word;">
${data.message}
            </div>

            ${
              data.ipAddress
                ? `<p style="margin-top: 20px; font-size: 12px; color: #999;">IP Address: ${data.ipAddress}</p>`
                : ""
            }

            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px;">
              <a href="mailto:${data.email}" style="display: inline-block; background-color: #00f2ff; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold;">
                Reply to ${data.name}
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
