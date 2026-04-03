/**
 * Centralised Email Configuration
 *
 * Single source of truth for all email template values.
 * All templates import from here instead of hardcoding.
 *
 * Future: This config will be fetched from Strapi single-type "email-configuration"
 * via API call, replacing these static defaults.
 */

// ---------------------------------------------------------------------------
// Company Details
// ---------------------------------------------------------------------------
export const COMPANY = {
  name: "Electrical Services",
  tagline: "Professional & Reliable",
  legalName: "Electrical Services Ltd",
  address: {
    line1: "123 Electrical House",
    city: "London",
    postcode: "EC1A 1BB",
    full: "123 Electrical House, London EC1A 1BB",
  },
  phone: {
    primary: "0800 123 4567",
    local: "020 7123 4567",
  },
  email: {
    support: "support@electricalservices.com",
    info: "info@electricalservices.com",
    noreply: "noreply@electricalservices.com",
  },
  website: "www.electricalservices.com",
  copyrightYear: new Date().getFullYear().toString(),
} as const

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------
export const BRAND_COLORS = {
  // Core brand
  primary: "#f59e0b",
  primaryLight: "#fbbf24",
  primaryDark: "#d97706",

  // Header gradients
  headerGradient: {
    start: "#1a1a1a",
    end: "#2d2d2d",
  },

  // Text
  textDark: "#1a1a1a",
  textMuted: "#4b5563",
  textLight: "#6b7280",
  textLighter: "#71717a",
  textWhite: "#ffffff",

  // Backgrounds
  bgBody: "#f6f9fc",
  bgBodyAlt: "#f4f4f5",
  bgCard: "#ffffff",
  bgCardMuted: "#f9fafb",
  bgCardMutedAlt: "#fafafa",

  // Borders
  borderDefault: "#e5e7eb",
  borderLight: "#e4e4e7",

  // Action / Info
  infoBlue: "#3b82f6",
  infoBlueBg: "#eff6ff",
  infoBlueText: "#1e40af",
  infoBlueDark: "#1e3a8a",
} as const

// ---------------------------------------------------------------------------
// Urgency Color Schemes
// ---------------------------------------------------------------------------
export const URGENCY_COLORS = {
  routine: {
    headerGradient: { start: "#1a1a1a", end: "#2d2d2d" },
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
    cardBg: "#f9fafb",
    cardBorder: "#e5e7eb",
    bannerBg: "",
    bannerBorder: "",
    bannerTitle: "",
    bannerText: "",
  },
  urgent: {
    headerGradient: { start: "#78350f", end: "#92400e" },
    badgeBg: "#fef3c7",
    badgeText: "#b45309",
    cardBg: "#fffbeb",
    cardBorder: "#fde68a",
    bannerBg: "#fffbeb",
    bannerBorder: "#d97706",
    bannerTitle: "#b45309",
    bannerText: "#92400e",
  },
  emergency: {
    headerGradient: { start: "#7f1d1d", end: "#991b1b" },
    badgeBg: "#fee2e2",
    badgeText: "#dc2626",
    cardBg: "#fef2f2",
    cardBorder: "#fecaca",
    bannerBg: "#fee2e2",
    bannerBorder: "#dc2626",
    bannerTitle: "#dc2626",
    bannerText: "#991b1b",
  },
} as const

export type UrgencyLevel = keyof typeof URGENCY_COLORS

// ---------------------------------------------------------------------------
// SLA Response Times
// ---------------------------------------------------------------------------
export const SLA = {
  service: {
    routine: {
      time: "2-4 hours",
      description: "We'll review your request within 2-4 hours",
      businessAction: "Contact customer within 2-4 hours",
    },
    urgent: {
      time: "2 hours",
      description: "Our team will prioritise your request and call within 2 hours",
      businessAction: "Contact customer within 2 hours (URGENT)",
    },
    emergency: {
      time: "30 minutes",
      description: "Our emergency team will call you within 30 minutes",
      businessAction: "Call customer immediately (within 30 minutes)",
    },
  },
  contact: {
    response: "24-48 hours",
    description: "Our team will review your inquiry within 24-48 hours",
    businessAction: "Please respond to this inquiry within 24-48 hours",
  },
  quotation: {
    response: "2-5 business days",
    description: "You will receive a detailed quotation within 2-5 business days",
    businessAction: "This quotation request requires follow-up within 2 business days",
  },
} as const

// ---------------------------------------------------------------------------
// Template-specific Configuration
// ---------------------------------------------------------------------------
export const TEMPLATE_CONFIG = {
  serviceCustomer: {
    subject: (requestId: string) => `Service Request Confirmation - ${requestId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
    signOff: `The ${COMPANY.name} Team`,
  },
  serviceBusiness: {
    subject: (requestId: string, urgency: string) =>
      urgency === "emergency"
        ? `EMERGENCY: New Service Request - ${requestId}`
        : urgency === "urgent"
          ? `URGENT: New Service Request - ${requestId}`
          : `New Service Request - ${requestId}`,
    fromName: `${COMPANY.name} System`,
    replyTo: COMPANY.email.noreply,
  },
  contactCustomer: {
    subject: (referenceId: string) => `Contact Inquiry Received - ${referenceId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
    signOff: `The ${COMPANY.name} Team`,
  },
  contactBusiness: {
    subject: (referenceId: string, priority: string) =>
      priority === "urgent"
        ? `URGENT: New Contact Inquiry - ${referenceId}`
        : `New Contact Inquiry - ${referenceId}`,
    fromName: `${COMPANY.name} System`,
    replyTo: COMPANY.email.noreply,
  },
  quotationCustomer: {
    subject: (requestId: string) => `Quotation Request Received - ${requestId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
    signOff: `The ${COMPANY.name} Team`,
  },
  quotationBusiness: {
    subject: (requestId: string, isUrgent: boolean) =>
      isUrgent
        ? `URGENT: New Quotation Request - ${requestId}`
        : `New Quotation Request - ${requestId}`,
    fromName: `${COMPANY.name} System`,
    replyTo: COMPANY.email.noreply,
  },
} as const

// ---------------------------------------------------------------------------
// Shared HTML Helpers
// ---------------------------------------------------------------------------

/** Returns the header gradient CSS based on urgency */
export function getHeaderGradient(urgency: UrgencyLevel): string {
  const colors = URGENCY_COLORS[urgency].headerGradient
  return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`
}

/** Returns the standard header gradient for non-urgency templates */
export function getDefaultHeaderGradient(): string {
  return `linear-gradient(135deg, ${BRAND_COLORS.headerGradient.start} 0%, ${BRAND_COLORS.headerGradient.end} 100%)`
}

/** Returns urgency badge inline styles */
export function getUrgencyBadgeStyle(urgency: UrgencyLevel): string {
  const c = URGENCY_COLORS[urgency]
  return `display: inline-block; background-color: ${c.badgeBg}; color: ${c.badgeText}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;`
}

/** Returns card background and border for urgency-aware sections */
export function getUrgencyCardStyle(urgency: UrgencyLevel): string {
  const c = URGENCY_COLORS[urgency]
  return `background-color: ${c.cardBg}; border: ${urgency === "routine" ? "1px" : "2px"} solid ${c.cardBorder}`
}

/** Standard footer HTML */
export function getFooterHtml(variant: "customer" | "business" = "customer"): string {
  if (variant === "business") {
    return `
      <td style="padding: 32px 40px; background-color: ${BRAND_COLORS.bgCardMuted}; border-radius: 0 0 12px 12px; border-top: 1px solid ${BRAND_COLORS.borderDefault}; text-align: center;">
        <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textLight}; font-size: 12px;">${COMPANY.name} Business System</p>
      </td>`
  }
  return `
      <td style="padding: 32px 40px; background-color: ${BRAND_COLORS.bgCardMuted}; border-radius: 0 0 12px 12px; border-top: 1px solid ${BRAND_COLORS.borderDefault}; text-align: center;">
        <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textLight}; font-size: 12px;">&copy; ${COMPANY.copyrightYear} ${COMPANY.legalName}. All rights reserved.</p>
        <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 12px;">${COMPANY.tagline} Electrical Solutions</p>
      </td>`
}

/** Standard contact info block */
export function getContactInfoHtml(): string {
  return `
        <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.8;">
          Phone: ${COMPANY.phone.primary}<br>
          Email: ${COMPANY.email.support}<br>
          Website: ${COMPANY.website}
        </p>`
}
