import type { Context, MiddlewareHandler } from 'hono'
import { eq, and } from 'drizzle-orm'
import { userSites, type Role } from '../db/schema'
import { getSessionUser, type SessionUser } from './auth'
import type { Db } from '../db/client'

declare module 'hono' {
  interface ContextVariableMap {
    db: Db
    user: SessionUser
    sessionId: string
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const header = c.req.header('Authorization') ?? ''
  const sessionId = header.startsWith('Bearer ') ? header.slice(7).trim() : null
  if (!sessionId) return c.json({ error: 'Missing bearer token' }, 401)

  const db = c.get('db')
  const user = await getSessionUser(db, sessionId)
  if (!user) return c.json({ error: 'Invalid or expired session' }, 401)

  c.set('user', user)
  c.set('sessionId', sessionId)
  await next()
}

export function requireRole(...allowed: Role[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get('user')
    if (!user || !allowed.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  }
}

// Whether the current user can read/write data for the given siteId.
export async function userCanAccessSite(c: Context, siteId: string): Promise<boolean> {
  const user = c.get('user')
  if (!user) return false
  if (user.role === 'super_admin' || user.role === 'admin') return true
  const db = c.get('db')
  const [row] = await db
    .select()
    .from(userSites)
    .where(and(eq(userSites.userId, user.id), eq(userSites.siteId, siteId)))
  return !!row
}
