import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import logData from './log-data.plugin.js'
import runsData from './runs-data.plugin.js'

// Which build is live. The installed app compares this with /version.json (see
// src/refresh.js) to know when newer data has been deployed. Unique per build.
const BUILD_ID = `${(process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || 'dev').slice(0, 8)}-${Date.now().toString(36)}`
const versionFile = () => ({
  name: 'version-file',
  generateBundle() { this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) }) },
})

export default defineConfig({
  plugins: [react(), logData(), runsData(), versionFile()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Two pages: the dashboard (/) and the phone logger (/log/).
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        log: resolve(__dirname, 'log/index.html'),
      },
    },
  },
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
    // Injected at build time from GitHub Actions secret — not in source
    __DISPATCH_TOKEN__: JSON.stringify(process.env.DISPATCH_TOKEN || ''),
  },
})
