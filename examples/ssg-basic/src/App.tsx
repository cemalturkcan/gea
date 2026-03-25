import { Component } from '@geajs/core'
import { Link, RouterView } from '@geajs/core'
import Home from './views/Home'
import About from './views/About'
import Contact from './views/Contact'
import Blog from './views/Blog'
import BlogPost from './views/BlogPost'

export const routes = {
  '/': Home,
  '/about': About,
  '/contact': Contact,
  '/blog': Blog,
  '/blog/:slug': { component: BlogPost, content: 'blog' },
}

export default class App extends Component {
  template() {
    return (
      <div class="app">
        <nav class="nav">
          <Link to="/" label="Home" exact class="nav-link" />
          <Link to="/about" label="About" class="nav-link" />
          <Link to="/blog" label="Blog" class="nav-link" />
          <Link to="/contact" label="Contact" class="nav-link" />
        </nav>
        <main class="content">
          <RouterView routes={routes} />
        </main>
      </div>
    )
  }
}
