import { Hono } from 'hono'
import { eq, inArray } from 'drizzle-orm'
import { sites, siteContent, userSites, TEMPLATE_TYPES } from '../db/schema'
import { launchpadDefaultContent } from '../lib/launchpad-default-content'
import { requireAuth, requireRole, userCanAccessSite } from '../lib/authz'
import type { Db } from '../db/client'
import type { SessionUser } from '../lib/auth'

type Vars = { db: Db; user: SessionUser }

export const sitesRouter = new Hono<{ Variables: Vars }>()

// PUBLIC: hostname → siteId (used by the customer site at runtime).
sitesRouter.get('/resolve', async (c) => {
  const db = c.get('db')
  const rawHost = c.req.query('host') || ''
  const host = rawHost.toLowerCase().split(':')[0]
  if (!host) return c.json({ error: 'host query param required' }, 400)

  const candidates = host.startsWith('www.') ? [host, host.slice(4)] : [host, `www.${host}`]
  for (const candidate of candidates) {
    const [hit] = await db.select().from(sites).where(eq(sites.customDomain, candidate))
    if (hit) return c.json({ siteId: hit.siteId, source: 'customDomain' })
  }

  if (host.endsWith('.pages.dev')) {
    const project = host.split('.')[0]
    const [bySiteId] = await db.select().from(sites).where(eq(sites.siteId, project))
    if (bySiteId) return c.json({ siteId: bySiteId.siteId, source: 'pagesSiteId' })
    const [byProject] = await db.select().from(sites).where(eq(sites.cfPagesProject, project))
    if (byProject) return c.json({ siteId: byProject.siteId, source: 'cfPagesProject' })
  }

  return c.json({ error: 'No site for host', host }, 404)
})

// All other site routes require auth.
sitesRouter.use('*', requireAuth)

// GET /api/sites — list sites visible to the current user
sitesRouter.get('/', async (c) => {
  const db = c.get('db')
  const user = c.get('user')

  if (user.role === 'super_admin' || user.role === 'admin') {
    const all = await db.select().from(sites).orderBy(sites.createdAt)
    return c.json(all)
  }

  // site_owner: only sites mapped to them
  const mappings = await db
    .select({ siteId: userSites.siteId })
    .from(userSites)
    .where(eq(userSites.userId, user.id))
  if (!mappings.length) return c.json([])
  const all = await db
    .select()
    .from(sites)
    .where(inArray(sites.siteId, mappings.map((m) => m.siteId)))
    .orderBy(sites.createdAt)
  return c.json(all)
})

// POST /api/sites — super_admin or admin only
sitesRouter.post('/', requireRole('super_admin', 'admin'), async (c) => {
  const db = c.get('db')
  const body = await c.req.json<{ name: string; siteId: string; templateType: string }>()

  if (!body.name || !body.siteId || !body.templateType) {
    return c.json({ error: 'name, siteId, and templateType are required' }, 400)
  }
  if (!TEMPLATE_TYPES.includes(body.templateType as any)) {
    return c.json({ error: 'Invalid templateType' }, 400)
  }
  if (!/^[a-z0-9-]+$/.test(body.siteId)) {
    return c.json({ error: 'siteId must be lowercase letters, numbers, and hyphens only' }, 400)
  }

  const [site] = await db.insert(sites).values({
    name: body.name,
    siteId: body.siteId,
    templateType: body.templateType as any,
  }).returning()

  const initialContent = body.templateType === 'gonex-launchpad' ? launchpadDefaultContent : {}
  await db.insert(siteContent).values({ siteId: site.siteId, content: initialContent })

  return c.json(site, 201)
})

// GET /api/sites/:siteId
sitesRouter.get('/:siteId', async (c) => {
  const siteId = c.req.param('siteId')
  if (!(await userCanAccessSite(c, siteId))) return c.json({ error: 'Forbidden' }, 403)
  const db = c.get('db')
  const [site] = await db.select().from(sites).where(eq(sites.siteId, siteId))
  if (!site) return c.json({ error: 'Not found' }, 404)
  return c.json(site)
})

// PUT /api/sites/:siteId — admins only (site_owner cannot edit metadata)
sitesRouter.put('/:siteId', requireRole('super_admin', 'admin'), async (c) => {
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

// DELETE /api/sites/:siteId — super_admin only
sitesRouter.delete('/:siteId', requireRole('super_admin'), async (c) => {
  const db = c.get('db')
  const [deleted] = await db
    .delete(sites)
    .where(eq(sites.siteId, c.req.param('siteId')))
    .returning()
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ ok: true })
})
