import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import App from './app'
import '../../src/styles/theme.css'
import './styles.css'

function syncDarkMode(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

const mq = window.matchMedia('(prefers-color-scheme: dark)')
syncDarkMode(mq.matches)
mq.addEventListener('change', (e) => syncDarkMode(e.matches))

window.addEventListener('message', (e) => {
  if (e.data && typeof e.data.dark === 'boolean') {
    syncDarkMode(e.data.dark)
  }
})

const root = document.getElementById('app')
if (!root) throw new Error('App root element not found')

const app = new App()
app.render(root)

requestAnimationFrame(() => {
  document.querySelectorAll('.demo-code').forEach((el) => {
    const text = el.textContent ?? ''
    el.innerHTML = Prism.highlight(text, Prism.languages.tsx, 'tsx')
  })
})
