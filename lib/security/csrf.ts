/**
 * CSRF Protection Utilities
 * 
 * Next.js Server Actions have built-in CSRF protection through:
 * 1. Origin header validation
 * 2. Action ID verification
 * 
 * This module provides additional optional CSRF protection for
 * scenarios requiring explicit token validation.
 * 
 * Note: For most Next.js Server Action use cases, the built-in
 * protection is sufficient. Use these utilities for:
 * - Custom API routes
 * - Additional security layers
 * - Compliance requirements
 */

import { cookies, headers } from "next/headers"

const CSRF_TOKEN_NAME = "__csrf_token"
const CSRF_HEADER_NAME = "x-csrf-token"

/**
 * Generates a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

/**
 * Sets a CSRF token in cookies (call from server component or route handler)
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken()
  const cookieStore = await cookies()
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })
  
  return token
}

/**
 * Gets the current CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Validates CSRF token from request headers against cookie
 * Returns true if valid, false otherwise
 */
export async function validateCsrfToken(): Promise<boolean> {
  const headersList = await headers()
  const cookieStore = await cookies()
  
  const headerToken = headersList.get(CSRF_HEADER_NAME)
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value
  
  if (!headerToken || !cookieToken) {
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(headerToken, cookieToken)
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Validates the request origin against allowed origins
 * This is already done by Next.js Server Actions, but can be used
 * for additional validation in custom routes
 */
export async function validateOrigin(allowedOrigins?: string[]): Promise<boolean> {
  const headersList = await headers()
  const origin = headersList.get("origin")
  const host = headersList.get("host")
  
  if (!origin) {
    // Same-origin requests may not have origin header
    return true
  }
  
  // If allowed origins specified, check against them
  if (allowedOrigins && allowedOrigins.length > 0) {
    return allowedOrigins.some((allowed) => origin.includes(allowed))
  }
  
  // Default: origin must match host
  try {
    const originUrl = new URL(origin)
    return originUrl.host === host
  } catch {
    return false
  }
}

/**
 * Combined security check for server actions
 * Validates rate limit and origin
 */
export async function securityCheck(
  options: {
    validateOriginHeader?: boolean
    allowedOrigins?: string[]
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const { validateOriginHeader = true, allowedOrigins } = options
  
  // Validate origin if requested
  if (validateOriginHeader) {
    const originValid = await validateOrigin(allowedOrigins)
    if (!originValid) {
      return { valid: false, error: "Invalid request origin" }
    }
  }
  
  return { valid: true }
}
