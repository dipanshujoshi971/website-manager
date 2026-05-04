const BASE = '/api'

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as any).error ?? res.statusText)
  }
  return res.json()
}

export const api = {
  // Sites
  listSites: () => req<Site[]>('GET', '/sites'),
  createSite: (data: CreateSiteInput) => req<Site>('POST', '/sites', data),
  getSite: (siteId: string) => req<Site>('GET', `/sites/${siteId}`),
  updateSite: (siteId: string, data: Partial<Site>) => req<Site>('PUT', `/sites/${siteId}`, data),
  deleteSite: (siteId: string) => req<Site>('DELETE', `/sites/${siteId}`),

  // Content
  getContent: (siteId: string) => req<SiteContent>('GET', `/sites/${siteId}/content`),
  updateContent: (siteId: string, content: Record<string, unknown>) =>
    req<SiteContent>('PUT', `/sites/${siteId}/content`, { content }),

  // Submissions
  getSubmissions: (siteId: string) =>
    req<ContactSubmission[]>('GET', `/sites/${siteId}/submissions`),
  markRead: (siteId: string, id: string) =>
    req<ContactSubmission>('PATCH', `/sites/${siteId}/submissions/${id}/read`, {}),
}

// --- Types (mirrored from worker schema) ---

export const TEMPLATE_TYPES = [
  'gonex-launchpad',
  'ride-hailing',
  'logistics',
  'food-delivery',
  'grocery-delivery',
  'handyman',
  'super-app',
  'carpooling',
  'bus-booking',
  'pharmacy-delivery',
] as const

export type TemplateType = (typeof TEMPLATE_TYPES)[number]

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  'gonex-launchpad': 'GoNex Launchpad (Ride-Hailing)',
  'ride-hailing': 'Ride-Hailing / Taxi App',
  'logistics': 'Logistics & Parcel Delivery',
  'food-delivery': 'Food Delivery App',
  'grocery-delivery': 'Grocery Delivery App',
  'handyman': 'Handyman Services App',
  'super-app': 'All-in-One / Super App',
  'carpooling': 'Car Pooling App',
  'bus-booking': 'Bus Booking App',
  'pharmacy-delivery': 'Pharmacy / Medicine Delivery',
}

export const TEMPLATE_ICONS: Record<TemplateType, string> = {
  'gonex-launchpad': '🚀',
  'ride-hailing': '🚕',
  'logistics': '📦',
  'food-delivery': '🍔',
  'grocery-delivery': '🛒',
  'handyman': '🔧',
  'super-app': '⚡',
  'carpooling': '🚗',
  'bus-booking': '🚌',
  'pharmacy-delivery': '💊',
}

export interface Site {
  id: string
  name: string
  siteId: string
  templateType: TemplateType
  customDomain: string | null
  previewUrl: string | null
  cfPagesProject: string | null
  createdAt: string
  updatedAt: string
}

export interface SiteContent {
  id: string
  siteId: string
  content: Record<string, unknown>
  updatedAt: string
}

export interface ContactSubmission {
  id: string
  siteId: string
  fullName: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface CreateSiteInput {
  name: string
  siteId: string
  templateType: TemplateType
}
