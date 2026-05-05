import { pgTable, text, uuid, jsonb, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core'

export const ROLES = ['super_admin', 'admin', 'site_owner'] as const
export type Role = (typeof ROLES)[number]

export type UserPermissions = {
  canDeploy?: boolean
  canManageUsers?: boolean
  canCreateSites?: boolean
  canDeleteSites?: boolean
}

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

// One row per client site
export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  siteId: text('site_id').notNull().unique(),         // used as VITE_SITE_ID in launchpad
  templateType: text('template_type').notNull().$type<TemplateType>(),
  customDomain: text('custom_domain'),
  previewUrl: text('preview_url'),                    // any URL — http://localhost:5173 in dev, live domain in prod
  cfPagesProject: text('cf_pages_project'),           // Cloudflare Pages project name
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Content JSON for each site — one row per site
export const siteContent = pgTable('site_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteId: text('site_id').notNull().references(() => sites.siteId, { onDelete: 'cascade' }),
  content: jsonb('content').notNull().default({}),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Contact form submissions from public client sites
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteId: text('site_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Auth: one row per user. No signup — all rows created by super_admin (or seeded by SQL).
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().$type<Role>(),
  permissions: jsonb('permissions').notNull().default({}).$type<UserPermissions>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Many-to-many: which sites a site_owner (or admin) can access. super_admin needs no rows here.
export const userSites = pgTable('user_sites', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  siteId: text('site_id').notNull().references(() => sites.siteId, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.siteId] }),
}))

// Login sessions — one row per active token. Bearer string clients send is sessions.id.
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

export type Site = typeof sites.$inferSelect
export type NewSite = typeof sites.$inferInsert
export type SiteContent = typeof siteContent.$inferSelect
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserSite = typeof userSites.$inferSelect
