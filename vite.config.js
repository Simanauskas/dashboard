import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    // Injected at build time from GitHub Actions secret — not in source
    __DISPATCH_TOKEN__: JSON.stringify(process.env.DISPATCH_TOKEN || ''),
  },
})
