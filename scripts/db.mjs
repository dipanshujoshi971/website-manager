import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env')

if (!existsSync(envPath)) {
  console.error('❌  .env not found')
  process.exit(1)
}

// Parse .env into an object
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
    })
    .filter(([k]) => k)
)

const cmd = process.argv[2] // 'generate' or 'migrate'
if (!cmd) { console.error('Usage: node scripts/db.mjs generate|migrate'); process.exit(1) }

// Use the locally installed drizzle-kit binary (hoisted to root node_modules)
const bin = join(root, 'node_modules', '.bin', 'drizzle-kit')
execSync(`"${bin}" ${cmd}`, {
  cwd: join(root, 'worker'),
  env: { ...process.env, ...env },
  stdio: 'inherit',
})
