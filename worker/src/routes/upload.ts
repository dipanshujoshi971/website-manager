import { Hono } from 'hono'

type Bindings = {
  DATABASE_URL: string
  R2_BUCKET?: R2Bucket           // bind in wrangler.toml when ready
  R2_PUBLIC_URL?: string         // public base URL of the R2 bucket
}

export const uploadRouter = new Hono<{ Bindings: Bindings }>()

uploadRouter.post('/', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null

  if (!file) return c.json({ error: 'No file provided' }, 400)

  // ── R2 path (when bucket is bound) ──────────────────────────────────────
  if (c.env.R2_BUCKET && c.env.R2_PUBLIC_URL) {
    const ext = file.name.split('.').pop() ?? 'bin'
    const key = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    await c.env.R2_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    })
    return c.json({ url: `${c.env.R2_PUBLIC_URL}/${key}` })
  }

  // ── Fallback: base64 data URL (dev / no R2 configured) ──────────────────
  const buffer = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  const dataUrl = `data:${file.type};base64,${base64}`
  return c.json({ url: dataUrl })
})
