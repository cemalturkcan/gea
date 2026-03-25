import App from './App'
import './styles.css'

const root = document.getElementById('app')
if (!root) throw new Error('App root element not found')

root.innerHTML = ''

const app = new App()
app.render(root)
