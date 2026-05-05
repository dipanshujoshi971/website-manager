import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { users, userSites } from '../db/schema'
import { verifyPassword, createSession, deleteSession } from '../lib/auth'
import { requireAuth } from '../lib/authz'
import type { Db } from '../db/client'

type Vars = { db: Db }

export const authRouter = new Hono<{ Variables: Vars }>()

// POST /api/auth/login
authRouter.post('/login', async (c) => {
  const body = await c.req.json<{ username?: string; password?: string }>().catch(() => ({}))
  const username = body.username?.trim()
  const password = body.password
  if (!username || !password) return c.json({ error: 'username and password required' }, 400)

  const db = c.get('db')
  const [user] = await db.select().from(users).where(eq(users.username, username))
  if (!user) return c.json({ error: 'Invalid credentials' }, 401)

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return c.json({ error: 'Invalid credentials' }, 401)

  const session = await createSession(db, user.id)

  return c.json({
    token: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    },
  })
})

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (c) => {
  const u = c.get('user')
  const db = c.get('db')
  const mapped = await db
    .select({ siteId: userSites.siteId })
    .from(userSites)
    .where(eq(userSites.userId, u.id))
  return c.json({
    user: u,
    sites: mapped.map((m) => m.siteId),
  })
})

// POST /api/auth/logout — revokes the current session
authRouter.post('/logout', requireAuth, async (c) => {
  const db = c.get('db')
  const sessionId = c.get('sessionId')
  await deleteSession(db, sessionId)
  return c.json({ ok: true })
})
