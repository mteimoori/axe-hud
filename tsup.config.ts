import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react/index': 'src/react/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  // react/react-dom stay external (optional peers); preact is bundled, and
  // axe-core is emitted as a lazy chunk so it only loads when the HUD is enabled.
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.jsxImportSource = 'preact'
  },
})
