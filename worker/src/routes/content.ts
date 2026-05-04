import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { siteContent } from '../db/schema'
import type { Db } from '../db/client'

type Env = { db: Db }

export const contentRouter = new Hono<{ Variables: Env }>()

// GET /api/sites/:siteId/content
contentRouter.get('/', async (c) => {
  const db = c.get('db')
  const siteId = c.req.param('siteId')
  const [row] = await db.select().from(siteContent).where(eq(siteContent.siteId, siteId))
  if (!row) return c.json({ error: 'Not found' }, 404)
  return c.json(row)
})

// PUT /api/sites/:siteId/content
contentRouter.put('/', async (c) => {
  const db = c.get('db')
  const siteId = c.req.param('siteId')
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
