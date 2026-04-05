"use server";

import { Resend } from "resend";
import type { CompleteServiceRequestInput } from "../schemas/service-request-schemas";
import { generateServiceCustomerEmail } from "./templates/service-customer-html";
import { generateServiceBusinessEmail } from "./templates/service-business-html";
import { logDelivery } from "@/lib/email/services/delivery-log";
import { buildEmailConfig } from "@/lib/email/config/email-config-builder";

export type EmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

interface SendEmailsParams {
  formData: CompleteServiceRequestInput;
  requestId: string;
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendServiceRequestEmails({
  formData,
  requestId,
}: SendEmailsParams): Promise<{
  customerEmail: EmailResult;
  businessEmail: EmailResult;
}> {
  const submittedAt = new Date().toISOString();

  const customerEmail = await sendServiceCustomerEmail({
    to: formData.contact.email,
    customerName: formData.contact.fullName,
    requestId,
    serviceType: formData.serviceDetails.serviceType,
    urgency: formData.serviceDetails.urgency,
    preferredDate: formData.propertyInfo.preferredDate,
    preferredTimeSlot: formData.propertyInfo.preferredTimeSlot,
  });

  const businessEmail = await sendServiceBusinessEmail({
    requestId,
    submittedAt,
    formData,
  });

  return { customerEmail, businessEmail };
}

async function sendServiceCustomerEmail(props: {
  to: string;
  customerName: string;
  requestId: string;
  serviceType: string;
  urgency: "routine" | "urgent" | "emergency";
  preferredDate: string;
  preferredTimeSlot: string;
}): Promise<EmailResult> {
  const config = await buildEmailConfig();
  const urgency = props.urgency;
  const subject =
    urgency === "emergency"
      ? `EMERGENCY - Service Request Received (${props.requestId})`
      : `Service Request Confirmed - ${props.requestId}`;

  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: "Email service not configured. Please add RESEND_API_KEY.",
      };
    }

    const resend = getResendClient();
    const from = config.email.fromEmail;
    const html = generateServiceCustomerEmail({ ...props, config });

    const { data, error } = await resend.emails.send({
      from,
      to: props.to,
      subject,
      html,
    });

    if (error) {
      await logDelivery({
        category: "service",
        recipientType: "customer",
        templateName: "Service Customer Confirmation",
        from,
        to: props.to,
        subject,
        status: "failed",
        error: error.message || "Failed to send customer email",
        metadata: {
          requestId: props.requestId,
          urgency: props.urgency,
          customerName: props.customerName,
        },
      });

      return {
        success: false,
        error: error.message || "Failed to send customer email",
      };
    }

    await logDelivery({
      category: "service",
      recipientType: "customer",
      templateName: "Service Customer Confirmation",
      from,
      to: props.to,
      subject,
      status: "sent",
      resendId: data?.id,
      metadata: {
        requestId: props.requestId,
        urgency: props.urgency,
        customerName: props.customerName,
      },
    });

    return { success: true, messageId: data?.id || "unknown" };
  } catch (error) {
    await logDelivery({
      category: "service",
      recipientType: "customer",
      templateName: "Service Customer Confirmation",
      from: config.email.fromEmail,
      to: props.to,
      subject,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        requestId: props.requestId,
        urgency: props.urgency,
        customerName: props.customerName,
      },
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending customer email",
    };
  }
}

async function sendServiceBusinessEmail(props: {
  requestId: string;
  submittedAt: string;
  formData: CompleteServiceRequestInput;
}): Promise<EmailResult> {
  const config = await buildEmailConfig();
  const urgency = props.formData.serviceDetails.urgency;

  const subject =
    urgency === "emergency"
      ? `EMERGENCY SERVICE REQUEST - ${props.requestId} - IMMEDIATE ACTION REQUIRED`
      : urgency === "urgent"
        ? `URGENT: New Service Request - ${props.requestId}`
        : `New Service Request - ${props.requestId}`;

  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: "Email service not configured. Please add RESEND_API_KEY.",
      };
    }

    const resend = getResendClient();
    const from = config.email.fromEmail;
    const to = config.company.email.support;
    const html = generateServiceBusinessEmail({ ...props, config });

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      await logDelivery({
        category: "service",
        recipientType: "business",
        templateName: "Service Business Notification",
        from,
        to,
        subject,
        status: "failed",
        error: error.message || "Failed to send business email",
        metadata: {
          requestId: props.requestId,
          urgency,
          customerName: props.formData.contact.fullName,
        },
      });

      return {
        success: false,
        error: error.message || "Failed to send business email",
      };
    }

    await logDelivery({
      category: "service",
      recipientType: "business",
      templateName: "Service Business Notification",
      from,
      to,
      subject,
      status: "sent",
      resendId: data?.id,
      metadata: {
        requestId: props.requestId,
        urgency,
        customerName: props.formData.contact.fullName,
      },
    });

    return { success: true, messageId: data?.id || "unknown" };
  } catch (error) {
    await logDelivery({
      category: "service",
      recipientType: "business",
      templateName: "Service Business Notification",
      from: config.email.fromEmail,
      to: config.company.email.support,
      subject,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        requestId: props.requestId,
        urgency,
        customerName: props.formData.contact.fullName,
      },
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending business email",
    };
  }
}
