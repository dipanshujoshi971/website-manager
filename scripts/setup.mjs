import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const src = join(root, '.env')

if (!existsSync(src)) {
  console.error('❌  .env not found — copy .env.example to .env and fill in your values')
  process.exit(1)
}

copyFileSync(src, join(root, 'worker/.dev.vars'))
copyFileSync(src, join(root, 'app/.env'))
console.log('✓  .env → worker/.dev.vars + app/.env')
