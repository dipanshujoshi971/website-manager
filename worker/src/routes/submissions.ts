import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { contactSubmissions } from '../db/schema'
import { requireAuth, userCanAccessSite } from '../lib/authz'
import type { Db } from '../db/client'
import type { SessionUser } from '../lib/auth'

type Vars = { db: Db; user: SessionUser }

export const submissionsRouter = new Hono<{ Variables: Vars }>()

submissionsRouter.use('*', requireAuth)

// GET /api/sites/:siteId/submissions
submissionsRouter.get('/', async (c) => {
  const siteId = c.req.param('siteId')
  if (!(await userCanAccessSite(c, siteId))) return c.json({ error: 'Forbidden' }, 403)

  const db = c.get('db')
  const rows = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.siteId, siteId))
    .orderBy(desc(contactSubmissions.createdAt))
  return c.json(rows)
})

// PATCH /api/sites/:siteId/submissions/:id/read
submissionsRouter.patch('/:id/read', async (c) => {
  const siteId = c.req.param('siteId')
  if (!(await userCanAccessSite(c, siteId))) return c.json({ error: 'Forbidden' }, 403)

  const db = c.get('db')
  const [updated] = await db
    .update(contactSubmissions)
    .set({ read: true })
    .where(eq(contactSubmissions.id, c.req.param('id')))
    .returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

// POST /api/contact — PUBLIC endpoint called by customer sites
export const contactRouter = new Hono<{ Variables: { db: Db } }>()

contactRouter.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json<{
    siteId: string
    fullName: string
    email: string
    phone?: string
    subject: string
    message: string
  }>()

  if (!body.siteId || !body.fullName || !body.email || !body.subject || !body.message) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [row] = await db.insert(contactSubmissions).values(body).returning()
  return c.json(row, 201)
})
