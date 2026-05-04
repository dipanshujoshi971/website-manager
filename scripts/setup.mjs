import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const src = join(root, '.env')

if (!existsSync(src)) {
  console.error('❌  .env not found — copy .env.example to .env and fill in your values')
  process.exit(1)
}

const rootEnv = readFileSync(src, 'utf8')

// Worker needs DATABASE_URL etc — full root .env mirrored to .dev.vars
writeFileSync(join(root, 'worker/.dev.vars'), rootEnv)

// Builder needs both root vars AND its own VITE_* — preserve app-specific keys.
// Strategy: start from the root .env, then append any keys present in app/.env.example
// that aren't already set, using the example's value as the dev default.
function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i)
    if (m) out[m[1]] = m[2]
  }
  return out
}

const appExamplePath = join(root, 'app/.env.example')
const merged = { ...parseEnv(rootEnv) }
if (existsSync(appExamplePath)) {
  const example = parseEnv(readFileSync(appExamplePath, 'utf8'))
  for (const [k, v] of Object.entries(example)) {
    if (merged[k] === undefined) merged[k] = v
  }
}

const appEnv = Object.entries(merged).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'
writeFileSync(join(root, 'app/.env'), appEnv)

console.log('✓  .env → worker/.dev.vars + app/.env (merged with app/.env.example)')
