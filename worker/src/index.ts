import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createDb } from './db/client'
import { sitesRouter } from './routes/sites'
import { contentRouter } from './routes/content'
import { submissionsRouter, contactRouter } from './routes/submissions'
import { uploadRouter, filesRouter } from './routes/upload'
import { deployRouter } from './routes/deploy'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'

type Bindings = {
  DATABASE_URL: string
  R2_BUCKET?: R2Bucket
  R2_PUBLIC_URL?: string
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_API_TOKEN?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS — allow builder app + all client sites in production
app.use('*', cors({
  origin: (origin) => origin ?? '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Inject db into context for all /api routes
app.use('/api/*', async (c, next) => {
  const db = createDb(c.env.DATABASE_URL)
  c.set('db' as any, db)
  await next()
})

// Routes
app.route('/api/auth', authRouter)
app.route('/api/users', usersRouter)
app.route('/api/sites', sitesRouter)
app.route('/api/sites/:siteId/content', contentRouter)
app.route('/api/sites/:siteId/submissions', submissionsRouter)
app.route('/api/contact', contactRouter)
app.route('/api/upload', uploadRouter)
app.route('/api/files', filesRouter)
app.route('/api/sites/:siteId/deploy', deployRouter)

app.get('/', (c) => c.json({ ok: true, service: 'gonex-builder-api' }))

export default app
