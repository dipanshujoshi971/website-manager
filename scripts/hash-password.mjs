#!/usr/bin/env node
// Generates a password hash compatible with worker/src/lib/auth.ts (PBKDF2-SHA256).
// Usage:  node scripts/hash-password.mjs '<password>'
// Output: pbkdf2$100000$<saltB64>$<hashB64>   — paste this into the users.password_hash column.
import { webcrypto as crypto } from 'node:crypto'

const ITERATIONS = 100_000
const SALT_BYTES = 16
const KEY_BYTES = 32

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>')
  process.exit(1)
}

function bufToB64(buf) {
  return Buffer.from(buf).toString('base64')
}

const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
const baseKey = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  { name: 'PBKDF2' },
  false,
  ['deriveBits'],
)
const bits = await crypto.subtle.deriveBits(
  { name: 'PBKDF2', salt, hash: 'SHA-256', iterations: ITERATIONS },
  baseKey,
  KEY_BYTES * 8,
)

console.log(`pbkdf2$${ITERATIONS}$${bufToB64(salt)}$${bufToB64(new Uint8Array(bits))}`)
