import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { blake3 } from '@noble/hashes/blake3.js'
import { bytesToHex } from '@noble/hashes/utils.js'
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

deployRouter.use('*', requireAuth, requireRole('super_admin', 'admin', 'site_owner'))

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

const SPECIAL_FILES = new Set(['_redirects', '_headers', '_routes.json', '_worker.js'])
const MAX_BUCKET_SIZE = 40 * 1024 * 1024
const MAX_BUCKET_FILE_COUNT = 2000
const MAX_ASSET_SIZE = 25 * 1024 * 1024

function getMime(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  return EXT_MIME[ext] ?? 'application/octet-stream'
}

function getExt(filePath: string): string {
  const idx = filePath.lastIndexOf('.')
  return idx === -1 ? '' : filePath.slice(idx + 1).toLowerCase()
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  const CHUNK = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK) as unknown as number[])
  }
  return btoa(binary)
}

function hashAsset(base64: string, ext: string): string {
  const input = new TextEncoder().encode(base64 + ext)
  return bytesToHex(blake3(input)).slice(0, 32)
}

type AssetEntry = {
  hash: string
  base64: string
  contentType: string
  path: string
  size: number
}

// POST /api/sites/:siteId/deploy
deployRouter.post('/', async (c) => {
  try {
    return await handleDeploy(c)
  } catch (e: any) {
    return c.json({ error: 'Deploy crashed', message: e?.message ?? String(e), stack: e?.stack }, 500)
  }
})

async function handleDeploy(c: any) {
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
  const cfApiBase = 'https://api.cloudflare.com/client/v4'
  const cfBase = `${cfApiBase}/accounts/${accountId}`
  const apiAuth = { Authorization: `Bearer ${apiToken}` }

  // 1. Ensure CF Pages project exists; capture the actual assigned subdomain
  let projectSubdomain: string = projectName
  const checkRes = await fetch(`${cfBase}/pages/projects/${projectName}`, { headers: apiAuth })
  if (checkRes.status === 404) {
    const createRes = await fetch(`${cfBase}/pages/projects`, {
      method: 'POST',
      headers: { ...apiAuth, 'Content-Type': 'application/json' },
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

  // 2. List all template files from R2
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
      hint: 'Run `npm run upload-template` first.',
    }, 400)
  }

  // 3. Read files, separate regular assets from CF Pages special files
  const assets: AssetEntry[] = []
  const specialFiles: Record<string, ArrayBuffer> = {}

  for (const obj of objects) {
    const r2obj = await r2.get(obj.key)
    if (!r2obj) continue
    const buf = await r2obj.arrayBuffer()
    const relPath = obj.key.replace(/^template\//, '')

    if (SPECIAL_FILES.has(relPath)) {
      specialFiles[relPath] = buf
      continue
    }

    if (buf.byteLength > MAX_ASSET_SIZE) {
      return c.json({ error: `Asset ${relPath} exceeds 25MB limit` }, 400)
    }

    const base64 = arrayBufferToBase64(buf)
    const ext = getExt(relPath)
    const hash = hashAsset(base64, ext)
    assets.push({
      hash,
      base64,
      contentType: getMime(relPath),
      path: '/' + relPath,
      size: base64.length,
    })
  }

  // Build manifest: { "/path": "hash" }
  const manifest: Record<string, string> = {}
  for (const a of assets) manifest[a.path] = a.hash

  // 4. Get upload JWT
  const tokenRes = await fetch(`${cfBase}/pages/projects/${projectName}/upload-token`, {
    headers: apiAuth,
  })
  if (!tokenRes.ok) {
    return c.json({ error: 'Failed to fetch upload token', status: tokenRes.status }, 500)
  }
  const tokenData = await tokenRes.json() as any
  const jwt = tokenData.result?.jwt
  if (!jwt) return c.json({ error: 'Upload token response missing jwt' }, 500)
  const jwtAuth = { Authorization: `Bearer ${jwt}` }

  // 5. Check which hashes are already uploaded
  const allHashes = Array.from(new Set(assets.map((a) => a.hash)))
  const checkMissingRes = await fetch(`${cfApiBase}/pages/assets/check-missing`, {
    method: 'POST',
    headers: { ...jwtAuth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashes: allHashes }),
  })
  if (!checkMissingRes.ok) {
    const data = await checkMissingRes.text()
    return c.json({ error: 'check-missing failed', details: data }, 500)
  }
  const checkData = await checkMissingRes.json() as any
  const missing: string[] = checkData.result ?? []

  // 6. Upload missing assets in batches (≤ 40MB or ≤ 2000 files)
  const missingSet = new Set(missing)
  const toUpload = assets.filter((a) => missingSet.has(a.hash))

  // Dedupe by hash (multiple paths may share content)
  const seen = new Set<string>()
  const uniqueToUpload = toUpload.filter((a) => {
    if (seen.has(a.hash)) return false
    seen.add(a.hash)
    return true
  })

  let bucket: AssetEntry[] = []
  let bucketSize = 0

  async function flushBucket() {
    if (!bucket.length) return
    const payload = bucket.map((a) => ({
      key: a.hash,
      value: a.base64,
      metadata: { contentType: a.contentType },
      base64: true,
    }))
    const uploadRes = await fetch(`${cfApiBase}/pages/assets/upload`, {
      method: 'POST',
      headers: { ...jwtAuth, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!uploadRes.ok) {
      const text = await uploadRes.text()
      throw new Error(`asset upload failed (${uploadRes.status}): ${text}`)
    }
    bucket = []
    bucketSize = 0
  }

  try {
    for (const a of uniqueToUpload) {
      if (bucket.length >= MAX_BUCKET_FILE_COUNT || bucketSize + a.size > MAX_BUCKET_SIZE) {
        await flushBucket()
      }
      bucket.push(a)
      bucketSize += a.size
    }
    await flushBucket()
  } catch (e: any) {
    return c.json({ error: e.message ?? 'Upload failed' }, 500)
  }

  // 7. Confirm all hashes (commits the uploads)
  const upsertRes = await fetch(`${cfApiBase}/pages/assets/upsert-hashes`, {
    method: 'POST',
    headers: { ...jwtAuth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashes: allHashes }),
  })
  if (!upsertRes.ok) {
    const text = await upsertRes.text()
    return c.json({ error: 'upsert-hashes failed', details: text }, 500)
  }

  // 8. Create the deployment with manifest + special files
  const form = new FormData()
  form.append('manifest', JSON.stringify(manifest))
  form.append('branch', 'main')
  if (specialFiles['_redirects']) {
    form.append('_redirects', new File([specialFiles['_redirects']], '_redirects'))
  }
  if (specialFiles['_headers']) {
    form.append('_headers', new File([specialFiles['_headers']], '_headers'))
  }
  if (specialFiles['_routes.json']) {
    form.append('_routes.json', new File([specialFiles['_routes.json']], '_routes.json'))
  }
  if (specialFiles['_worker.js']) {
    form.append('_worker.js', new File([specialFiles['_worker.js']], '_worker.js'))
  }

  const deployRes = await fetch(`${cfBase}/pages/projects/${projectName}/deployments`, {
    method: 'POST',
    headers: apiAuth,
    body: form,
  })

  if (!deployRes.ok) {
    const data = await deployRes.json() as any
    return c.json({ error: 'Deployment creation failed', details: data.errors ?? data }, 500)
  }

  const deployData = await deployRes.json() as any

  const subdomainPrefix = projectSubdomain.includes('.')
    ? projectSubdomain.split('.')[0]
    : projectSubdomain
  const liveUrl = `https://${subdomainPrefix}.pages.dev`

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
}
