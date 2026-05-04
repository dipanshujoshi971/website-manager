import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import { spawn } from 'child_process'
import type { Plugin } from 'vite'

// Local deploy plugin — intercepts POST /deploy-local/:siteId and runs
// `node scripts/deploy-site.mjs --site-id <siteId>` as a child process.
// Only active in dev; the browser Deploy button calls this endpoint.
function localDeployPlugin(): Plugin {
  return {
    name: 'local-deploy',
    configureServer(server) {
      server.middlewares.use('/deploy-local', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405).end()
          return
        }
        const siteId = req.url?.replace(/^\//, '').split('?')[0]
        if (!siteId) {
          res.writeHead(400).end(JSON.stringify({ error: 'siteId required' }))
          return
        }

        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.write(`Deploying "${siteId}" to Cloudflare Pages...\n`)

        const root = path.resolve(__dirname, '..')
        const proc = spawn(
          process.execPath,
          ['scripts/deploy-site.mjs', '--site-id', siteId],
          { cwd: root, env: process.env, shell: false }
        )

        proc.stdout.on('data', (d) => res.write(d))
        proc.stderr.on('data', (d) => res.write(d))
        proc.on('close', (code) => {
          if (code === 0) {
            res.end('\n__DEPLOY_OK__')
          } else {
            res.end(`\n__DEPLOY_FAIL__:exit code ${code}`)
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), localDeployPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
