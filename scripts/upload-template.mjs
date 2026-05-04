/**
 * upload-template.mjs
 *
 * Builds the site template and uploads every file in site/dist/ to R2
 * under the `template/` prefix. Run this once (and again after any template
 * code changes) before using the "Deploy" button in the builder UI.
 *
 * Usage:
 *   npm run upload-template
 *
 * Requires in .env:
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, WORKER_URL (prod worker URL)
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { readdir } from 'fs/promises'
import { join, relative, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── helpers ───────────────────────────────────────────────────────────────────

function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

async function* walkDir(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkDir(fullPath)
    else yield fullPath
  }
}

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.map': 'application/json',
}

// ── load .env ─────────────────────────────────────────────────────────────────

const envPath = join(root, '.env')
if (!existsSync(envPath)) {
  console.error('❌  .env not found. Copy .env.example and fill in values.')
  process.exit(1)
}

const env = parseEnv(readFileSync(envPath, 'utf8'))
// Make available to child processes (wrangler picks up these vars automatically)
Object.assign(process.env, env)

if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
  console.error('❌  CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set in .env')
  process.exit(1)
}

if (!env.WORKER_URL) {
  console.warn('⚠️   WORKER_URL is not set in .env.')
  console.warn('    The template will be built without a production API URL.')
  console.warn('    Set WORKER_URL=https://your-worker.workers.dev in .env for production builds.')
}

// ── 1. build site template ────────────────────────────────────────────────────

console.log('\n📦  Building site template...')
execSync('npm run build:site', {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_URL: env.WORKER_URL || '',
  },
})

const distDir = join(root, 'site', 'dist')
if (!existsSync(distDir)) {
  console.error('❌  site/dist not found after build.')
  process.exit(1)
}

// ── 2. upload each file to R2 via wrangler ────────────────────────────────────

const BUCKET = 'gonex-builder-uploads'
console.log(`\n☁️   Uploading files to R2 bucket "${BUCKET}" (template/ prefix)...\n`)

let uploaded = 0
let failed = 0

for await (const filePath of walkDir(distDir)) {
  const rel = relative(distDir, filePath).replace(/\\/g, '/')
  const r2Key = `${BUCKET}/template/${rel}`
  const ext = extname(filePath).toLowerCase()
  const contentType = MIME_MAP[ext] || 'application/octet-stream'

  // Escape file path for shell (handles spaces in Windows paths)
  const escapedFile = filePath.replace(/\\/g, '/').replace(/ /g, '\\ ')

  try {
    execSync(
      `npx wrangler r2 object put "${r2Key}" --file="${filePath}" --content-type="${contentType}"`,
      { cwd: root, stdio: 'pipe', env: process.env }
    )
    console.log(`  ✓  template/${rel}`)
    uploaded++
  } catch (err) {
    console.error(`  ✗  template/${rel} — ${err.message}`)
    failed++
  }
}

// ── 3. done ───────────────────────────────────────────────────────────────────

console.log(`\n${failed === 0 ? '✅' : '⚠️ '} Upload complete — ${uploaded} files uploaded${failed ? `, ${failed} failed` : ''}.`)
if (failed === 0) {
  console.log('\n🚀  You can now click "Deploy to Cloudflare Pages" in the builder')
  console.log('    for any site to get a live URL.')
} else {
  console.log('\n   Some files failed. Check your CLOUDFLARE_API_TOKEN permissions.')
  process.exit(1)
}
