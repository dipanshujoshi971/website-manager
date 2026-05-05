/**
 * deploy-site.mjs
 *
 * Builds the site template and deploys it to Cloudflare Pages for a specific site.
 * Uses `wrangler pages deploy` which is the official, reliable deployment method.
 *
 * Usage:
 *   npm run deploy:site -- --site-id gonex-delhi
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const siteIdArg = args[args.indexOf('--site-id') + 1]
if (!siteIdArg) {
  console.error('❌  Usage: npm run deploy:site -- --site-id <your-site-id>')
  process.exit(1)
}

// ── load .env ─────────────────────────────────────────────────────────────────
const envPath = join(root, '.env')
if (!existsSync(envPath)) {
  console.error('❌  .env not found. Copy .env.example and fill in values.')
  process.exit(1)
}
const env = parseEnv(readFileSync(envPath, 'utf8'))
Object.assign(process.env, env)

if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
  console.error('❌  CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set in .env')
  process.exit(1)
}

if (!env.WORKER_URL) {
  console.warn('⚠️   WORKER_URL not set in .env — site will use relative /api paths (only works if API is on same domain)')
}

// ── 1. build site ─────────────────────────────────────────────────────────────
console.log('\n📦  Building site template...')
try {
  execSync('npm run build:site', {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, VITE_API_URL: env.WORKER_URL || '' },
  })
} catch (e) {
  console.error('❌  Build failed:', e.message)
  process.exit(1)
}

// ── 2. ensure CF Pages project exists ────────────────────────────────────────
console.log(`\n🔧  Ensuring Cloudflare Pages project "${siteIdArg}" exists...`)
try {
  execSync(
    `npx wrangler pages project create "${siteIdArg}" --production-branch=main`,
    { cwd: root, stdio: 'pipe', env: process.env }
  )
  console.log(`   ✓ Project created.`)
} catch {
  // Already exists — that's fine, continue
  console.log(`   ✓ Project already exists.`)
}

// ── 3. deploy to CF Pages ─────────────────────────────────────────────────────
console.log(`\n🚀  Deploying to Cloudflare Pages project "${siteIdArg}"...`)
try {
  execSync(
    `npx wrangler pages deploy site/dist --project-name="${siteIdArg}" --branch=main --commit-dirty=true`,
    { cwd: root, stdio: 'inherit', env: process.env }
  )
} catch (e) {
  console.error('❌  Wrangler deploy failed:', e.message)
  process.exit(1)
}

// ── 4. update DB via worker API ───────────────────────────────────────────────
if (env.WORKER_URL) {
  console.log('\n💾  Updating site record in database...')
  try {
    // Get the actual subdomain CF assigned (may differ if name was taken)
    const projectRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${siteIdArg}`,
      { headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` } }
    )
    const projectData = await projectRes.json()
    const subdomain = projectData.result?.subdomain ?? `${siteIdArg}.pages.dev`
    const liveUrl = subdomain.includes('.') ? `https://${subdomain}` : `https://${subdomain}.pages.dev`

    await fetch(`${env.WORKER_URL}/api/sites/${siteIdArg}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cfPagesProject: subdomain.split('.')[0], previewUrl: liveUrl }),
    })

    console.log(`\n✅  Done! Your site is live at:\n\n    ${liveUrl}\n`)
  } catch (e) {
    console.warn('⚠️   Could not update DB automatically:', e.message)
    console.log(`\n✅  Deployed! Visit https://api.cloudflare.com → Pages → ${siteIdArg} to find your URL.`)
  }
} else {
  console.log(`\n✅  Deployed to CF Pages project "${siteIdArg}"`)
}
