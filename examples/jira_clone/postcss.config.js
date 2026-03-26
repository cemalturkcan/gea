import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Pass config explicitly: default resolution uses process.cwd(), which is the monorepo root for `npm run example:jira-clone`. */
export default {
  plugins: [tailwindcss({ config: join(__dirname, 'tailwind.config.js') }), autoprefixer()],
}
