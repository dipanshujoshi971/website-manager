import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createDb } from './db/client'
import { sitesRouter } from './routes/sites'
import { contentRouter } from './routes/content'
import { submissionsRouter, contactRouter } from './routes/submissions'
import { uploadRouter } from './routes/upload'

type Bindings = { DATABASE_URL: string }

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
app.route('/api/sites', sitesRouter)
app.route('/api/sites/:siteId/content', contentRouter)
app.route('/api/sites/:siteId/submissions', submissionsRouter)
app.route('/api/contact', contactRouter)
app.route('/api/upload', uploadRouter)

app.get('/', (c) => c.json({ ok: true, service: 'gonex-builder-api' }))

export default app
