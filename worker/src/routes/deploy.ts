import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { sites } from '../db/schema'
import { requireAuth, requireRole } from '../lib/authz'
import type { Db } from '../db/client'
import type { SessionUser } from '../lib/auth'

type Bindings = {
  R2_BUCKET?: R2Bucket
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_API_TOKEN?: string
}
type Env = { db: Db; user: SessionUser }

export const deployRouter = new Hono<{ Bindings: Bindings; Variables: Env }>()

deployRouter.use('*', requireAuth, requireRole('super_admin', 'admin'))

const EXT_MIME: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  css: 'text/css',
  js: 'application/javascript',
  mjs: 'application/javascript',
  json: 'application/json',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  ico: 'image/x-icon',
  woff: 'font/woff',
  woff2: 'font/woff2',
  txt: 'text/plain',
  xml: 'application/xml',
  map: 'application/json',
}

function getMime(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  return EXT_MIME[ext] ?? 'application/octet-stream'
}

async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// POST /api/sites/:siteId/deploy
deployRouter.post('/', async (c) => {
  const siteId = c.req.param('siteId')
  const accountId = c.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = c.env.CLOUDFLARE_API_TOKEN
  const r2 = c.env.R2_BUCKET

  if (!accountId || !apiToken) {
    return c.json({
      error: 'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set as Worker secrets.',
    }, 500)
  }
  if (!r2) return c.json({ error: 'R2_BUCKET binding not available.' }, 500)

  const db = c.get('db')
  const [site] = await db.select().from(sites).where(eq(sites.siteId, siteId))
  if (!site) return c.json({ error: 'Site not found' }, 404)

  const projectName = siteId
  const cfBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}`
  const auth = { Authorization: `Bearer ${apiToken}` }

  // 1. Create CF Pages project if it doesn't exist; capture the actual assigned subdomain
  let projectSubdomain: string = projectName
  const checkRes = await fetch(`${cfBase}/pages/projects/${projectName}`, { headers: auth })
  if (checkRes.status === 404) {
    const createRes = await fetch(`${cfBase}/pages/projects`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName, production_branch: 'main' }),
    })
    if (!createRes.ok) {
      const data = await createRes.json() as any
      return c.json({ error: 'Could not create Pages project', details: data.errors }, 500)
    }
    const createData = await createRes.json() as any
    projectSubdomain = createData.result?.subdomain ?? projectName
  } else if (checkRes.ok) {
    const checkData = await checkRes.json() as any
    projectSubdomain = checkData.result?.subdomain ?? projectName
  } else {
    return c.json({ error: 'Failed to verify Pages project existence.' }, 500)
  }

  // 2. List all template files from R2 (paginated)
  const objects: R2Object[] = []
  let cursor: string | undefined
  do {
    const listed = await r2.list({ prefix: 'template/', cursor, limit: 1000 })
    objects.push(...listed.objects)
    cursor = listed.truncated ? (listed as any).cursor : undefined
  } while (cursor)

  if (!objects.length) {
    return c.json({
      error: 'No template files found in R2.',
      hint: 'Run `npm run upload-template` first to build and upload the site template.',
    }, 400)
  }

  // 3. Read each file, compute SHA-256, build manifest
  const manifest: Record<string, string> = {}
  const files: { hash: string; buf: ArrayBuffer; type: string; name: string }[] = []

  for (const obj of objects) {
    const r2obj = await r2.get(obj.key)
    if (!r2obj) continue
    const buf = await r2obj.arrayBuffer()
    const hash = await sha256Hex(buf)
    const filePath = '/' + obj.key.replace('template/', '')
    manifest[filePath] = hash
    files.push({ hash, buf, type: getMime(obj.key), name: filePath.slice(1) || 'file' })
  }

  // 4. Submit to CF Pages Direct Upload API
  const form = new FormData()
  form.append('manifest', JSON.stringify(manifest))
  form.append('branch', 'main')   // marks this as a production deployment → activates {project}.pages.dev
  for (const { hash, buf, type, name } of files) {
    form.append(hash, new Blob([buf], { type }), name)
  }

  const deployRes = await fetch(`${cfBase}/pages/projects/${projectName}/deployments`, {
    method: 'POST',
    headers: auth,
    body: form,
  })

  if (!deployRes.ok) {
    const data = await deployRes.json() as any
    return c.json({ error: 'Deployment upload failed', details: data.errors ?? data }, 500)
  }

  const deployData = await deployRes.json() as any

  // CF may assign a different subdomain than projectName if the name was already taken
  // globally (e.g. "testing" → "testing-bz8"). Extract just the prefix for storage so
  // the /resolve endpoint can match "{prefix}.pages.dev" back to this site.
  const subdomainPrefix = projectSubdomain.includes('.')
    ? projectSubdomain.split('.')[0]
    : projectSubdomain
  const liveUrl = `https://${subdomainPrefix}.pages.dev`

  // 5. Persist actual subdomain prefix + live URL to DB
  const [updated] = await db
    .update(sites)
    .set({ cfPagesProject: subdomainPrefix, previewUrl: liveUrl, updatedAt: new Date() })
    .where(eq(sites.siteId, siteId))
    .returning()

  return c.json({
    ok: true,
    url: liveUrl,
    project: subdomainPrefix,
    deploymentId: deployData.result?.id,
    site: updated,
  })
})
