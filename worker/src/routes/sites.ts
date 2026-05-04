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

// GET /api/sites/resolve?host=acmecabs.com — resolve hostname → siteId
// Used by /site at runtime so a single Pages deployment can serve every client.
// Resolution order:
//   1. Exact match on customDomain (e.g. acmecabs.com, www.acmecabs.com)
//   2. Subdomain prefix on *.pages.dev → match siteId or cfPagesProject
sitesRouter.get('/resolve', async (c) => {
  const db = c.get('db')
  const rawHost = c.req.query('host') || ''
  const host = rawHost.toLowerCase().split(':')[0]
  if (!host) return c.json({ error: 'host query param required' }, 400)

  // 1. Exact custom-domain match (try with and without leading "www.")
  const candidates = host.startsWith('www.') ? [host, host.slice(4)] : [host, `www.${host}`]
  for (const candidate of candidates) {
    const [hit] = await db.select().from(sites).where(eq(sites.customDomain, candidate))
    if (hit) return c.json({ siteId: hit.siteId, source: 'customDomain' })
  }

  // 2. *.pages.dev — first label is the project; match siteId or cfPagesProject
  if (host.endsWith('.pages.dev')) {
    const project = host.split('.')[0]
    const [bySiteId] = await db.select().from(sites).where(eq(sites.siteId, project))
    if (bySiteId) return c.json({ siteId: bySiteId.siteId, source: 'pagesSiteId' })
    const [byProject] = await db.select().from(sites).where(eq(sites.cfPagesProject, project))
    if (byProject) return c.json({ siteId: byProject.siteId, source: 'cfPagesProject' })
  }

  return c.json({ error: 'No site for host', host }, 404)
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
