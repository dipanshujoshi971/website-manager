import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { users, userSites, ROLES, type Role, type UserPermissions } from '../db/schema'
import { hashPassword } from '../lib/auth'
import { requireAuth, requireRole } from '../lib/authz'
import type { Db } from '../db/client'

type Vars = { db: Db }

export const usersRouter = new Hono<{ Variables: Vars }>()

// All user-management routes are super_admin only.
usersRouter.use('*', requireAuth, requireRole('super_admin'))

function publicUser(u: typeof users.$inferSelect) {
  return {
    id: u.id,
    username: u.username,
    role: u.role,
    permissions: u.permissions,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }
}

// GET /api/users — list all users with their assigned sites
usersRouter.get('/', async (c) => {
  const db = c.get('db')
  const all = await db.select().from(users).orderBy(users.createdAt)
  const mappings = await db.select().from(userSites)
  const bySite: Record<string, string[]> = {}
  for (const m of mappings) {
    (bySite[m.userId] ??= []).push(m.siteId)
  }
  return c.json(all.map((u) => ({ ...publicUser(u), sites: bySite[u.id] ?? [] })))
})

// POST /api/users — create user
usersRouter.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json<{
    username: string
    password: string
    role: Role
    permissions?: UserPermissions
    sites?: string[]
  }>()
  if (!body.username || !body.password) return c.json({ error: 'username and password required' }, 400)
  if (!ROLES.includes(body.role)) return c.json({ error: 'Invalid role' }, 400)
  if (body.password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400)

  const passwordHash = await hashPassword(body.password)
  const [created] = await db
    .insert(users)
    .values({
      username: body.username.trim(),
      passwordHash,
      role: body.role,
      permissions: body.permissions ?? {},
    })
    .returning()
    .catch((e) => { throw new Error(e?.message ?? 'Failed to create user') })

  if (body.sites?.length) {
    await db.insert(userSites).values(body.sites.map((siteId) => ({ userId: created.id, siteId })))
  }
  return c.json({ ...publicUser(created), sites: body.sites ?? [] }, 201)
})

// PATCH /api/users/:id — update role / permissions / password
usersRouter.patch('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const body = await c.req.json<{
    password?: string
    role?: Role
    permissions?: UserPermissions
  }>()

  const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() }
  if (body.password !== undefined) {
    if (body.password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400)
    patch.passwordHash = await hashPassword(body.password)
  }
  if (body.role !== undefined) {
    if (!ROLES.includes(body.role)) return c.json({ error: 'Invalid role' }, 400)
    patch.role = body.role
  }
  if (body.permissions !== undefined) patch.permissions = body.permissions

  const [updated] = await db.update(users).set(patch).where(eq(users.id, id)).returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(publicUser(updated))
})

// DELETE /api/users/:id
usersRouter.delete('/:id', async (c) => {
  const db = c.get('db')
  const me = c.get('user')
  const id = c.req.param('id')
  if (id === me.id) return c.json({ error: 'Cannot delete yourself' }, 400)
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning()
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ ok: true })
})

// PUT /api/users/:id/sites — replace site assignments for a user
usersRouter.put('/:id/sites', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const body = await c.req.json<{ sites: string[] }>()
  const sites = Array.isArray(body.sites) ? body.sites : []

  const [user] = await db.select().from(users).where(eq(users.id, id))
  if (!user) return c.json({ error: 'Not found' }, 404)

  await db.delete(userSites).where(eq(userSites.userId, id))
  if (sites.length) {
    await db.insert(userSites).values(sites.map((siteId) => ({ userId: id, siteId })))
  }
  return c.json({ ok: true, sites })
})

// POST /api/users/:id/sites/:siteId — grant access
usersRouter.post('/:id/sites/:siteId', async (c) => {
  const db = c.get('db')
  const userId = c.req.param('id')
  const siteId = c.req.param('siteId')
  await db.insert(userSites).values({ userId, siteId }).onConflictDoNothing()
  return c.json({ ok: true })
})

// DELETE /api/users/:id/sites/:siteId — revoke access
usersRouter.delete('/:id/sites/:siteId', async (c) => {
  const db = c.get('db')
  const userId = c.req.param('id')
  const siteId = c.req.param('siteId')
  await db.delete(userSites).where(and(eq(userSites.userId, userId), eq(userSites.siteId, siteId)))
  return c.json({ ok: true })
})
