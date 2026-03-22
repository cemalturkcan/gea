import { defineConfig } from 'vite'
import { resolve } from 'path'
import { geaPlugin } from '../packages/vite-plugin-gea/index.ts'

const geaRoot = resolve(__dirname, '..')

export default defineConfig({
  plugins: [geaPlugin()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.js',
      name: 'app',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    minify: 'esbuild',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      gea: resolve(geaRoot, 'packages/gea/src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
})
