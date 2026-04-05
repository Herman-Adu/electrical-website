"use server"

import { Resend } from "resend"
import { generateCustomerConfirmationEmail } from "./templates/customer-confirmation-html"
import { generateBusinessNotificationEmail } from "./templates/business-notification-html"
import type { CompleteFormInput } from "../schemas/schemas"
import { logDelivery } from "@/lib/email/services/delivery-log"
import { buildEmailConfig } from "@/lib/email/config/email-config-builder"

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export type EmailResult = { success: true; messageId: string } | { success: false; error: string }

interface SendEmailsParams {
  formData: CompleteFormInput
  requestId: string
}

export async function sendServiceRequestEmails({ formData, requestId }: SendEmailsParams): Promise<{
  customerEmail: EmailResult
  businessEmail: EmailResult
}> {
  const submittedAt = new Date().toISOString()

  // Send customer confirmation email
  const customerEmailResult = await sendCustomerConfirmationEmail({
    to: formData.personalInfo.email,
    customerName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
    requestId,
    serviceType: formData.serviceDetails.serviceType,
    urgency: formData.serviceDetails.urgency,
    preferredDate: formData.schedulePreferences.preferredDate,
    preferredTimeSlot: formData.schedulePreferences.preferredTimeSlot,
    address: formData.propertyInfo.address,
    city: formData.propertyInfo.city,
    postcode: formData.propertyInfo.postcode,
  })

  // Send business notification email
  const businessEmailResult = await sendBusinessNotificationEmail({
    requestId,
    customerName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
    customerEmail: formData.personalInfo.email,
    customerPhone: formData.personalInfo.phone,
    serviceType: formData.serviceDetails.serviceType,
    urgency: formData.serviceDetails.urgency,
    description: formData.serviceDetails.description,
    preferredDate: formData.schedulePreferences.preferredDate,
    preferredTimeSlot: formData.schedulePreferences.preferredTimeSlot,
    alternativeDate: formData.schedulePreferences.alternativeDate,
    address: formData.propertyInfo.address,
    city: formData.propertyInfo.city,
    county: formData.propertyInfo.county,
    postcode: formData.propertyInfo.postcode,
    propertyType: formData.propertyInfo.propertyType,
    accessInstructions: formData.propertyInfo.accessInstructions,
    flexibleScheduling: formData.schedulePreferences.flexibleScheduling,
    submittedAt,
  })

  return {
    customerEmail: customerEmailResult,
    businessEmail: businessEmailResult,
  }
}

async function sendCustomerConfirmationEmail(props: {
  to: string
  customerName: string
  requestId: string
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  preferredDate: string
  preferredTimeSlot: string
  address: string
  city: string
  postcode: string
}): Promise<EmailResult> {
  const config = await buildEmailConfig()
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service not configured. Please add RESEND_API_KEY environment variable.",
      }
    }

    const resend = getResendClient()

    // Generate HTML email content
    const htmlContent = generateCustomerConfirmationEmail({
      customerName: props.customerName,
      requestId: props.requestId,
      serviceType: props.serviceType,
      urgency: props.urgency,
      preferredDate: props.preferredDate,
      preferredTimeSlot: props.preferredTimeSlot,
      address: props.address,
      city: props.city,
      postcode: props.postcode,
      config,
    })

    const { data, error } = await resend.emails.send({
      from: config.email.fromEmail,
      to: props.to,
      subject:
        props.urgency === "emergency"
          ? `EMERGENCY - Service Request Received (${props.requestId})`
          : `Service Request Confirmed - ${props.requestId}`,
      html: htmlContent,
    })

    if (error) {
      console.error("[email] Customer email error:", error)
      await logDelivery({
        category: "service",
        recipientType: "customer",
        templateName: "Service Customer Confirmation",
        from: config.email.fromEmail,
        to: props.to,
        subject: props.urgency === "emergency" ? `EMERGENCY - Service Request Received (${props.requestId})` : `Service Request Confirmed - ${props.requestId}`,
        status: "failed",
        error: error.message || "Failed to send customer email",
        metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
      })
      return {
        success: false,
        error: error.message || "Failed to send customer email",
      }
    }

    await logDelivery({
      category: "service",
      recipientType: "customer",
      templateName: "Service Customer Confirmation",
      from: config.email.fromEmail,
      to: props.to,
      subject: props.urgency === "emergency" ? `EMERGENCY - Service Request Received (${props.requestId})` : `Service Request Confirmed - ${props.requestId}`,
      status: "sent",
      resendId: data?.id,
      metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
    })

    return {
      success: true,
      messageId: data?.id || "unknown",
    }
  } catch (error) {
    console.error("[email] Customer email exception:", error)
    await logDelivery({
      category: "service",
      recipientType: "customer",
      templateName: "Service Customer Confirmation",
      from: config.email.fromEmail,
      to: props.to,
      subject: "Service Request Confirmed",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending customer email",
    }
  }
}

async function sendBusinessNotificationEmail(props: {
  requestId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  description: string
  preferredDate: string
  preferredTimeSlot: string
  alternativeDate?: string
  address: string
  city: string
  county?: string
  postcode: string
  propertyType: string
  accessInstructions?: string
  flexibleScheduling: boolean
  submittedAt: string
}): Promise<EmailResult> {
  const config = await buildEmailConfig()
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service not configured",
      }
    }

    const resend = getResendClient()
    const businessFrom = config.email.fromEmail
    const businessTo = config.company.email.support

    // Generate HTML email content
    const htmlContent = generateBusinessNotificationEmail({ ...props, config })

    const { data, error } = await resend.emails.send({
      from: businessFrom,
      to: businessTo,
      subject:
        props.urgency === "emergency"
          ? `EMERGENCY SERVICE REQUEST - ${props.requestId} - IMMEDIATE ACTION REQUIRED`
          : `New Service Request - ${props.requestId}`,
      html: htmlContent,
    })

    const businessSubject = props.urgency === "emergency" ? `EMERGENCY SERVICE REQUEST - ${props.requestId}` : `New Service Request - ${props.requestId}`

    if (error) {
      console.error("[email] Business email error:", error)
      await logDelivery({
        category: "service",
        recipientType: "business",
        templateName: "Service Business Notification",
        from: businessFrom,
        to: businessTo,
        subject: businessSubject,
        status: "failed",
        error: error.message || "Failed to send business email",
        metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
      })
      return {
        success: false,
        error: error.message || "Failed to send business email",
      }
    }

    await logDelivery({
      category: "service",
      recipientType: "business",
      templateName: "Service Business Notification",
      from: businessFrom,
      to: businessTo,
      subject: businessSubject,
      status: "sent",
      resendId: data?.id,
      metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
    })

    return {
      success: true,
      messageId: data?.id || "unknown",
    }
  } catch (error) {
    console.error("[email] Business email exception:", error)
    await logDelivery({
      category: "service",
      recipientType: "business",
      templateName: "Service Business Notification",
      from: config.email.fromEmail,
      to: config.company.email.support,
      subject: `Service Request - ${props.requestId}`,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: { requestId: props.requestId, urgency: props.urgency, customerName: props.customerName },
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending business email",
    }
  }
}
