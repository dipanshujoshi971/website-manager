import { Hono } from 'hono'
import { requireAuth } from '../lib/authz'

type Bindings = {
  DATABASE_URL: string
  R2_BUCKET?: R2Bucket
  R2_PUBLIC_URL?: string
  WORKER_URL?: string
}

export const uploadRouter = new Hono<{ Bindings: Bindings }>()

uploadRouter.use('*', requireAuth)

// POST /api/upload — store the file in R2, return its public URL.
uploadRouter.post('/', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) return c.json({ error: 'No file provided' }, 400)

  if (c.env.R2_BUCKET) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const key = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    await c.env.R2_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    })
    // Prefer a configured public bucket URL; otherwise serve through this worker.
    // Match the URL origin to where the file actually lives: when the request is
    // coming from a localhost dev worker, the bytes are in local miniflare R2 — using
    // a production WORKER_URL there would 404 from any deployed site. So fall back to
    // the request origin when running locally and only use WORKER_URL in production.
    const reqOrigin = new URL(c.req.url).origin
    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(reqOrigin)
    const origin = isLocal ? reqOrigin : (c.env.WORKER_URL?.replace(/\/$/, '') ?? reqOrigin)
    const url = c.env.R2_PUBLIC_URL
      ? `${c.env.R2_PUBLIC_URL}/${key}`
      : `${origin}/api/files/${key}`
    return c.json({ url, key })
  }

  // No R2 binding (shouldn't happen with wrangler.toml configured) — base64 fallback
  // so the editor still works for someone running an older worker build.
  const buffer = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  return c.json({ url: `data:${file.type};base64,${base64}` })
})

// GET /api/files/:key+ — stream a stored object back from R2.
// `key+` captures slashes so /api/files/images/abc.png works.
export const filesRouter = new Hono<{ Bindings: Bindings }>()

filesRouter.get('/:key{.+}', async (c) => {
  if (!c.env.R2_BUCKET) return c.json({ error: 'R2 not configured' }, 500)
  const key = c.req.param('key')
  const obj = await c.env.R2_BUCKET.get(key)
  if (!obj) return c.json({ error: 'Not found' }, 404)
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  // Long cache — keys are content-addressed via timestamp+random, so they never change.
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(obj.body, { headers })
})
