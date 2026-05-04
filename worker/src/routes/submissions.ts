import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { contactSubmissions } from '../db/schema'
import type { Db } from '../db/client'

type Env = { db: Db }

export const submissionsRouter = new Hono<{ Variables: Env }>()

// GET /api/sites/:siteId/submissions
submissionsRouter.get('/', async (c) => {
  const db = c.get('db')
  const rows = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.siteId, c.req.param('siteId')))
    .orderBy(desc(contactSubmissions.createdAt))
  return c.json(rows)
})

// PATCH /api/sites/:siteId/submissions/:id/read — mark as read
submissionsRouter.patch('/:id/read', async (c) => {
  const db = c.get('db')
  const [updated] = await db
    .update(contactSubmissions)
    .set({ read: true })
    .where(eq(contactSubmissions.id, c.req.param('id')))
    .returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

// POST /api/contact — public endpoint called by client sites
export const contactRouter = new Hono<{ Variables: Env }>()

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
