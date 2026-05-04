const BASE = '/api'
// Deploy calls must hit the real deployed worker (needs real R2, not local miniflare).
// Set VITE_WORKER_URL to your deployed worker URL so this works in local dev.
// In production the same BASE is used for everything.
const WORKER_BASE = (import.meta.env.VITE_WORKER_URL as string)
  ? `${(import.meta.env.VITE_WORKER_URL as string).replace(/\/$/, '')}/api`
  : BASE

async function req<T>(method: string, path: string, body?: unknown, base = BASE): Promise<T> {
  const res = await fetch(`${base}${path}`, {
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
  deploySite: (siteId: string) =>
    req<{ ok: boolean; url: string; project: string; deploymentId?: string; site: Site }>(
      'POST',
      `/sites/${siteId}/deploy`,
      undefined,
      WORKER_BASE,
    ),

  // Runs deploy via the Vite dev server plugin (local dev only).
  // Resolves with the live URL on success, rejects on failure.
  deployLocal: async (siteId: string): Promise<string> => {
    const res = await fetch(`/deploy-local/${siteId}`, { method: 'POST' })
    if (!res.body) throw new Error('No response body')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let allOutput = ''
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      allOutput += chunk
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
    }
    if (buffer) allOutput += buffer
    if (allOutput.includes('__DEPLOY_FAIL__')) {
      const msg = allOutput.split('__DEPLOY_FAIL__:').pop()?.trim() || 'Deploy failed'
      throw new Error(msg)
    }
    const urlMatch = allOutput.match(/https:\/\/[^\s]+\.pages\.dev/)
    return urlMatch?.[0] ?? ''
  },

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
