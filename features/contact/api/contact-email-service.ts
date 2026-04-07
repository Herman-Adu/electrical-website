/**
 * Contact Email Service
 *
 * Handles sending contact form confirmation and notification emails
 */

"use server";

import { Resend } from "resend";
import { generateContactCustomerEmail } from "./templates/contact-customer-html";
import { generateContactBusinessEmail } from "./templates/contact-business-html";
import type { ServerContactFormInput } from "../schemas/contact-schemas";
import { logDelivery } from "@/lib/email/services/delivery-log";
import { buildEmailConfig } from "@/lib/email/config/email-config-builder";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface ContactEmailData extends ServerContactFormInput {
  referenceId: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmails(
  data: ContactEmailData,
): Promise<EmailResult> {
  const config = await buildEmailConfig();
  try {
    const resend = getResendClient();
    const customerEmail = data.contactInfo.email;
    const customerName = data.contactInfo.fullName;
    const contactFrom = config.email.contactFromEmail;
    const businessTo = config.company.email.support;

    // Send customer confirmation email
    const customerResult = await resend.emails.send({
      from: contactFrom,
      to: customerEmail,
      subject: `Contact Inquiry Received - ${data.referenceId}`,
      html: generateContactCustomerEmail({
        customerName,
        referenceId: data.referenceId,
        subject: data.messageDetails.subject,
        inquiryType: data.inquiryType.inquiryType,
        priority: data.inquiryType.priority,
        config,
      }),
    });

    const contactSubject = `Contact Inquiry Received - ${data.referenceId}`;

    if (customerResult.error) {
      console.error(
        "[email] Customer contact email error:",
        customerResult.error,
      );
      await logDelivery({
        category: "contact",
        recipientType: "customer",
        templateName: "Contact Customer Confirmation",
        from: contactFrom,
        to: customerEmail,
        subject: contactSubject,
        status: "failed",
        error: customerResult.error.message || "Failed to send",
        metadata: { requestId: data.referenceId, customerName },
      });
      return {
        success: false,
        error: "Failed to send confirmation email",
      };
    }

    await logDelivery({
      category: "contact",
      recipientType: "customer",
      templateName: "Contact Customer Confirmation",
      from: contactFrom,
      to: customerEmail,
      subject: contactSubject,
      status: "sent",
      resendId: customerResult.data?.id,
      metadata: { requestId: data.referenceId, customerName },
    });

    // Send business notification email
    const businessResult = await resend.emails.send({
      from: contactFrom,
      to: businessTo,
      subject: `New Contact Inquiry: ${data.messageDetails.subject} [${data.inquiryType.priority.toUpperCase()}]`,
      html: generateContactBusinessEmail({
        referenceId: data.referenceId,
        customerName,
        customerEmail,
        customerPhone: data.contactInfo.phone,
        company: data.contactInfo.company,
        inquiryType: data.inquiryType.inquiryType,
        sector: data.inquiryType.sector,
        priority: data.inquiryType.priority,
        hasExistingReference: data.referenceLinking.hasExistingReference,
        existingReferenceId: data.referenceLinking.referenceId,
        existingReferenceDescription:
          data.referenceLinking.referenceDescription,
        subject: data.messageDetails.subject,
        message: data.messageDetails.message,
        preferredContactMethod: data.messageDetails.preferredContactMethod,
        bestTimeToContact: data.messageDetails.bestTimeToContact,
        newsletterOptIn: data.messageDetails.newsletterOptIn,
        config,
      }),
    });
    const businessSubject = `New Contact Inquiry: ${data.messageDetails.subject} [${data.inquiryType.priority.toUpperCase()}]`;

    if (businessResult.error) {
      console.error(
        "[email] Business contact email error:",
        businessResult.error,
      );
      await logDelivery({
        category: "contact",
        recipientType: "business",
        templateName: "Contact Business Notification",
        from: contactFrom,
        to: businessTo,
        subject: businessSubject,
        status: "failed",
        error: businessResult.error.message || "Failed to send",
        metadata: { requestId: data.referenceId, customerName },
      });
      // Don't fail the whole submission if business email fails
    } else {
      await logDelivery({
        category: "contact",
        recipientType: "business",
        templateName: "Contact Business Notification",
        from: contactFrom,
        to: businessTo,
        subject: businessSubject,
        status: "sent",
        resendId: businessResult.data?.id,
        metadata: { requestId: data.referenceId, customerName },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[email] Contact email service error:", error);
    await logDelivery({
      category: "contact",
      recipientType: "customer",
      templateName: "Contact Emails",
      from: config.email.contactFromEmail,
      to: data.contactInfo.email,
      subject: `Contact Inquiry - ${data.referenceId}`,
      status: "failed",
      error:
        error instanceof Error ? error.message : "Email service unavailable",
      metadata: {
        requestId: data.referenceId,
        customerName: data.contactInfo.fullName,
      },
    });
    return {
      success: false,
      error: "Email service unavailable",
    };
  }
}
