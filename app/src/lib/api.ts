// In dev, Vite proxies /api -> local worker (see vite.config.ts).
// In prod (Azure SWA), set VITE_WORKER_URL to your deployed worker so requests
// hit it directly — Azure SWA's external rewrite doesn't forward POST/PUT/DELETE.
const WORKER_URL = (import.meta.env.VITE_WORKER_URL as string | undefined)?.replace(/\/$/, '')
const BASE = WORKER_URL ? `${WORKER_URL}/api` : '/api'
const WORKER_BASE = BASE

const TOKEN_KEY = 'gonex_auth_token'

export const auth = {
  getToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  setToken(token: string) {
    try { localStorage.setItem(TOKEN_KEY, token) } catch {}
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY) } catch {}
  },
}

// Hook so the AuthProvider can react to 401s globally.
let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

async function req<T>(method: string, path: string, body?: unknown, base = BASE): Promise<T> {
  const token = auth.getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    auth.clear()
    onUnauthorized?.()
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as any).error ?? res.statusText)
  }
  return res.json()
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    req<{ token: string; user: AuthUser }>('POST', '/auth/login', { username, password }),
  logout: () => req<{ ok: boolean }>('POST', '/auth/logout', {}),
  me: () => req<{ user: AuthUser; sites: string[] }>('GET', '/auth/me'),

  // Users (super_admin only)
  listUsers: () => req<ManagedUser[]>('GET', '/users'),
  createUser: (data: CreateUserInput) => req<ManagedUser>('POST', '/users', data),
  updateUser: (id: string, data: UpdateUserInput) => req<ManagedUser>('PATCH', `/users/${id}`, data),
  deleteUser: (id: string) => req<{ ok: boolean }>('DELETE', `/users/${id}`),
  setUserSites: (id: string, sites: string[]) =>
    req<{ ok: boolean; sites: string[] }>('PUT', `/users/${id}/sites`, { sites }),

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

export const ROLES = ['super_admin', 'admin', 'site_owner'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  site_owner: 'Site Owner',
}

export interface UserPermissions {
  canDeploy?: boolean
  canManageUsers?: boolean
  canCreateSites?: boolean
  canDeleteSites?: boolean
}

export interface AuthUser {
  id: string
  username: string
  role: Role
  permissions: UserPermissions
}

export interface ManagedUser extends AuthUser {
  createdAt: string
  updatedAt: string
  sites: string[]
}

export interface CreateUserInput {
  username: string
  password: string
  role: Role
  permissions?: UserPermissions
  sites?: string[]
}

export interface UpdateUserInput {
  password?: string
  role?: Role
  permissions?: UserPermissions
}
