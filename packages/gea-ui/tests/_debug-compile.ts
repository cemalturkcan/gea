import { readFileSync } from 'fs'
import { geaPlugin } from '../../vite-plugin-gea/index'

const src = readFileSync('packages/gea-ui/src/components/radio-group.tsx', 'utf-8')
const plugin = geaPlugin()
const transform = typeof plugin.transform === 'function' ? plugin.transform : (plugin.transform as any)?.handler
const result = await transform?.call({} as never, src, '/virtual/radio-group.tsx')
const code = typeof result === 'string' ? result : result.code
console.log(code)
