import { eq, gt, and } from 'drizzle-orm'
import { sessions, users, type Role, type UserPermissions } from '../db/schema'
import type { Db } from '../db/client'

const PBKDF2_ITERATIONS = 100_000
const SALT_BYTES = 16
const KEY_BYTES = 32
const SESSION_TTL_DAYS = 7

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function b64ToBuf(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, hash: 'SHA-256', iterations },
    baseKey,
    KEY_BYTES * 8,
  )
}

// Format: pbkdf2$<iterations>$<saltB64>$<hashB64>
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await deriveKey(password, salt, PBKDF2_ITERATIONS)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bufToB64(salt.buffer)}$${bufToB64(hash)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const iterations = Number(parts[1])
  const salt = b64ToBuf(parts[2])
  const expected = b64ToBuf(parts[3])
  const actual = new Uint8Array(await deriveKey(password, salt, iterations))
  if (actual.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i]
  return diff === 0
}

export type SessionUser = {
  id: string
  username: string
  role: Role
  permissions: UserPermissions
}

export async function createSession(db: Db, userId: string): Promise<{ id: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  const [row] = await db.insert(sessions).values({ userId, expiresAt }).returning()
  return { id: row.id, expiresAt: row.expiresAt }
}

export async function getSessionUser(db: Db, sessionId: string): Promise<SessionUser | null> {
  // UUID-ish guard so a malformed bearer doesn't blow up the SQL parser.
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return null
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      permissions: users.permissions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
  return rows[0] ?? null
}

export async function deleteSession(db: Db, sessionId: string): Promise<void> {
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}
