import { defineConfig } from 'tsdown'
import { geaPlugin } from '../vite-plugin-gea/src/index'
import { copyFileSync } from 'node:fs'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind-preset': 'src/tailwind-preset.ts',
  },
  plugins: [geaPlugin() as any],
  format: 'esm',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: { build: true },
  target: 'es2022',
  platform: 'browser',
  external: ['@geajs/core', /^@zag-js\//],
  define: {
    'import.meta.hot': 'undefined',
    'import.meta.url': '""',
  },
  hash: false,
  fixedExtension: true,
  onSuccess() {
    copyFileSync('src/styles/theme.css', 'dist/theme.css')
    console.log('Copied theme.css to dist/')
  },
})
