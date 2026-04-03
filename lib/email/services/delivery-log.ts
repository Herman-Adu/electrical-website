"use server"

// ---------------------------------------------------------------------------
// Email Delivery Log
// ---------------------------------------------------------------------------
// In-memory store for email delivery events. When Strapi is connected, this
// will be replaced with a Strapi collection (email-delivery-logs) using the
// same interface. The in-memory store survives hot reloads via globalThis.
// ---------------------------------------------------------------------------

export type DeliveryStatus = "sent" | "delivered" | "bounced" | "failed" | "queued"
export type EmailCategory = "service" | "contact" | "quotation"
export type EmailRecipientType = "customer" | "business"

export interface DeliveryLogEntry {
  id: string
  timestamp: string
  category: EmailCategory
  recipientType: EmailRecipientType
  templateName: string
  from: string
  to: string
  subject: string
  status: DeliveryStatus
  messageId?: string
  error?: string
  resendId?: string
  metadata?: {
    requestId?: string
    urgency?: string
    customerName?: string
  }
}

export interface DeliveryStats {
  total: number
  sent: number
  delivered: number
  failed: number
  bounced: number
  successRate: number
  byCategory: Record<EmailCategory, number>
  byRecipientType: Record<EmailRecipientType, number>
  last24h: number
  last7d: number
}

// ---------------------------------------------------------------------------
// In-memory store (globalThis to survive HMR)
// ---------------------------------------------------------------------------

const STORE_KEY = "__email_delivery_log__"
const MAX_ENTRIES = 200

function getStore(): DeliveryLogEntry[] {
  const g = globalThis as Record<string, unknown>
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = [] as DeliveryLogEntry[]
  }
  return g[STORE_KEY] as DeliveryLogEntry[]
}

// ---------------------------------------------------------------------------
// Write: log a delivery event
// ---------------------------------------------------------------------------

let counter = 0

export async function logDelivery(
  entry: Omit<DeliveryLogEntry, "id" | "timestamp">,
): Promise<DeliveryLogEntry> {
  const store = getStore()
  counter++

  const logEntry: DeliveryLogEntry = {
    ...entry,
    id: `dl_${Date.now()}_${counter}`,
    timestamp: new Date().toISOString(),
  }

  // Prepend (newest first) and cap at MAX_ENTRIES
  store.unshift(logEntry)
  if (store.length > MAX_ENTRIES) {
    store.length = MAX_ENTRIES
  }

  return logEntry
}

// ---------------------------------------------------------------------------
// Read: query delivery logs
// ---------------------------------------------------------------------------

export interface DeliveryLogQuery {
  category?: EmailCategory
  recipientType?: EmailRecipientType
  status?: DeliveryStatus
  search?: string
  limit?: number
  offset?: number
}

export async function getDeliveryLogs(
  query: DeliveryLogQuery = {},
): Promise<{ entries: DeliveryLogEntry[]; total: number }> {
  const store = getStore()
  let filtered = [...store]

  if (query.category) {
    filtered = filtered.filter((e) => e.category === query.category)
  }
  if (query.recipientType) {
    filtered = filtered.filter((e) => e.recipientType === query.recipientType)
  }
  if (query.status) {
    filtered = filtered.filter((e) => e.status === query.status)
  }
  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.to.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.templateName.toLowerCase().includes(q) ||
        (e.metadata?.requestId?.toLowerCase().includes(q) ?? false) ||
        (e.metadata?.customerName?.toLowerCase().includes(q) ?? false),
    )
  }

  const total = filtered.length
  const offset = query.offset ?? 0
  const limit = query.limit ?? 50
  const entries = filtered.slice(offset, offset + limit)

  return { entries, total }
}

// ---------------------------------------------------------------------------
// Stats: aggregate delivery statistics
// ---------------------------------------------------------------------------

export async function getDeliveryStats(): Promise<DeliveryStats> {
  const store = getStore()
  const now = Date.now()
  const h24 = 24 * 60 * 60 * 1000
  const d7 = 7 * 24 * 60 * 60 * 1000

  const stats: DeliveryStats = {
    total: store.length,
    sent: 0,
    delivered: 0,
    failed: 0,
    bounced: 0,
    successRate: 0,
    byCategory: { service: 0, contact: 0, quotation: 0 },
    byRecipientType: { customer: 0, business: 0 },
    last24h: 0,
    last7d: 0,
  }

  for (const entry of store) {
    // Status counts
    if (entry.status === "sent" || entry.status === "delivered") stats.sent++
    if (entry.status === "delivered") stats.delivered++
    if (entry.status === "failed") stats.failed++
    if (entry.status === "bounced") stats.bounced++

    // Category
    stats.byCategory[entry.category]++

    // Recipient type
    stats.byRecipientType[entry.recipientType]++

    // Time windows
    const age = now - new Date(entry.timestamp).getTime()
    if (age <= h24) stats.last24h++
    if (age <= d7) stats.last7d++
  }

  stats.successRate = stats.total > 0 ? Math.round(((stats.sent) / stats.total) * 100) : 0

  return stats
}

// ---------------------------------------------------------------------------
// Utility: clear logs (admin action)
// ---------------------------------------------------------------------------

export async function clearDeliveryLogs(): Promise<{ cleared: number }> {
  const store = getStore()
  const count = store.length
  store.length = 0
  return { cleared: count }
}
