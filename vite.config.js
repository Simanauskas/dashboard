import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import logData from './log-data.plugin.js'

export default defineConfig({
  plugins: [react(), logData()],
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
    // Injected at build time from GitHub Actions secret — not in source
    __DISPATCH_TOKEN__: JSON.stringify(process.env.DISPATCH_TOKEN || ''),
  },
})
