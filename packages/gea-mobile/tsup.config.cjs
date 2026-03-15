const { defineConfig } = require('tsup')

module.exports = defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  target: 'es2022',
  platform: 'browser',
  external: ['@geajs/core'],
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs', dts: '.d.mts' } : {}
  },
})
