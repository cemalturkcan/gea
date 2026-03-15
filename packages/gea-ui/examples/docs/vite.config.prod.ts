import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { geaPlugin } from '../../../../packages/vite-plugin-gea/index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  base: '/docs/gea-ui-showcase/',
  plugins: [geaPlugin()],
  resolve: {
    alias: {
      '@geajs/core': resolve(__dirname, '../../../../packages/gea/src'),
      '@geajs/ui': resolve(__dirname, '../../src'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../../../../docs/public/gea-ui-showcase'),
    emptyOutDir: true,
    minify: false,
  },
})
