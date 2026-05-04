import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { sites, siteContent, TEMPLATE_TYPES } from '../db/schema'
import { launchpadDefaultContent } from '../lib/launchpad-default-content'
import type { Db } from '../db/client'

type Env = { db: Db }

export const sitesRouter = new Hono<{ Variables: Env }>()

// GET /api/sites — list all
sitesRouter.get('/', async (c) => {
  const db = c.get('db')
  const all = await db.select().from(sites).orderBy(sites.createdAt)
  return c.json(all)
})

// POST /api/sites — create
sitesRouter.post('/', async (c) => {
  const db = c.get('db')
  const body = await c.req.json<{ name: string; siteId: string; templateType: string }>()

  if (!body.name || !body.siteId || !body.templateType) {
    return c.json({ error: 'name, siteId, and templateType are required' }, 400)
  }
  if (!TEMPLATE_TYPES.includes(body.templateType as any)) {
    return c.json({ error: 'Invalid templateType' }, 400)
  }
  // siteId must be URL-safe
  if (!/^[a-z0-9-]+$/.test(body.siteId)) {
    return c.json({ error: 'siteId must be lowercase letters, numbers, and hyphens only' }, 400)
  }

  const [site] = await db.insert(sites).values({
    name: body.name,
    siteId: body.siteId,
    templateType: body.templateType as any,
  }).returning()

  // Seed content — launchpad gets full default content, others start empty
  const initialContent = body.templateType === 'gonex-launchpad' ? launchpadDefaultContent : {}
  await db.insert(siteContent).values({ siteId: site.siteId, content: initialContent })

  return c.json(site, 201)
})

// GET /api/sites/:siteId
sitesRouter.get('/:siteId', async (c) => {
  const db = c.get('db')
  const [site] = await db.select().from(sites).where(eq(sites.siteId, c.req.param('siteId')))
  if (!site) return c.json({ error: 'Not found' }, 404)
  return c.json(site)
})

// PUT /api/sites/:siteId — update metadata (name, domain, cfPagesProject)
sitesRouter.put('/:siteId', async (c) => {
  const db = c.get('db')
  const body = await c.req.json<{ name?: string; customDomain?: string; cfPagesProject?: string }>()
  const [updated] = await db
    .update(sites)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(sites.siteId, c.req.param('siteId')))
    .returning()
  if (!updated) return c.json({ error: 'Not found' }, 404)
  return c.json(updated)
})

// DELETE /api/sites/:siteId
sitesRouter.delete('/:siteId', async (c) => {
  const db = c.get('db')
  const [deleted] = await db
    .delete(sites)
    .where(eq(sites.siteId, c.req.param('siteId')))
    .returning()
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ ok: true })
})
