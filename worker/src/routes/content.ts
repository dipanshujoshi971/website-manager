import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { siteContent } from '../db/schema'
import { requireAuth, userCanAccessSite } from '../lib/authz'
import type { Db } from '../db/client'
import type { SessionUser } from '../lib/auth'

type Vars = { db: Db; user: SessionUser }

export const contentRouter = new Hono<{ Variables: Vars }>()

// GET /api/sites/:siteId/content — PUBLIC, served to customer-facing sites at runtime
contentRouter.get('/', async (c) => {
  const db = c.get('db')
  const siteId = c.req.param('siteId')
  const [row] = await db.select().from(siteContent).where(eq(siteContent.siteId, siteId))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

// PUT /api/sites/:siteId/content — auth required + must have access to this site
contentRouter.put('/', requireAuth, async (c) => {
  const siteId = c.req.param('siteId')
  if (!(await userCanAccessSite(c, siteId))) return c.json({ error: 'Forbidden' }, 403)

  const db = c.get('db')
  const body = await c.req.json<{ content: Record<string, unknown> }>()

  const [existing] = await db.select().from(siteContent).where(eq(siteContent.siteId, siteId))

  if (existing) {
    const [updated] = await db
      .update(siteContent)
      .set({ content: body.content, updatedAt: new Date() })
      .where(eq(siteContent.siteId, siteId))
      .returning()
    return c.json(updated)
  }

  const [created] = await db
    .insert(siteContent)
    .values({ siteId, content: body.content })
    .returning()
  return c.json(created, 201)
})
