import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Deployed under a project GitHub Pages path; override with VITE_BASE for other hosts.
const base = process.env.VITE_BASE ?? '/axe-hud/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    // Import the library straight from source so the demo always reflects the latest code.
    alias: [
      {
        find: 'axe-hud/react',
        replacement: resolve(import.meta.dirname, '../../src/react/index.ts'),
      },
      { find: 'axe-hud', replacement: resolve(import.meta.dirname, '../../src/index.ts') },
    ],
  },
})
