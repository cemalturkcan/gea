# @geajs/ssg

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dashersw/gea/blob/master/LICENSE)

Static site generation plugin for [Gea](https://www.npmjs.com/package/@geajs/core). Pre-renders your routes to static HTML at build time — zero client JavaScript, instant page loads, SEO-friendly output.

## Installation

```bash
npm install -D @geajs/ssg
```

Requires `@geajs/core` ^1.0.0 and `vite` ^8.0.0 as peer dependencies.

## Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { geaPlugin } from '@geajs/vite-plugin'
import { geaSSG } from '@geajs/ssg/vite'

export default defineConfig({
  plugins: [
    geaPlugin(),
    geaSSG({
      contentDir: 'src/content',
      sitemap: { hostname: 'https://example.com' },
    }),
  ],
})
```

Your `src/App.tsx` must export `routes` (a `RouteMap`) and `App` (or a default export):

```tsx
export const routes = {
  '/': Home,
  '/about': About,
  '/blog': Blog,
  '/blog/:slug': { component: BlogPost, content: 'blog' },
}

export default class App extends Component {
  template() {
    return (
      <div>
        <nav>...</nav>
        <RouterView routes={routes} />
      </div>
    )
  }
}
```

Run `vite build` and every route is pre-rendered to `dist/`.

## Features

### Static Routes

Every path in your `RouteMap` is rendered to an `index.html` file:

```
/           → dist/index.html
/about      → dist/about/index.html
/contact    → dist/contact/index.html
```

### Markdown Content

Load markdown files with YAML frontmatter using the `ssg` accessor:

```tsx
import { ssg } from '@geajs/ssg'

class Blog extends Component {
  posts = ssg.content('blog', {
    sort: (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  })

  template() {
    return <ul>{this.posts.map(p => `<li>${p.frontmatter.title}</li>`).join('')}</ul>
  }
}
```

Each file has: `slug`, `frontmatter`, `content` (raw md), `html` (rendered).

### Dynamic Routes with Content

Parameterized routes can auto-generate pages from content files. Each `.md` file's slug becomes a route parameter:

```tsx
// Route config — one page per markdown file in content/blog/
export const routes = {
  '/blog/:slug': { component: BlogPost, content: 'blog' },
}

// Component reads content by slug
class BlogPost extends Component {
  template(props) {
    const post = ssg.file('blog', props?.slug)
    return post ? <article><h1>{post.frontmatter.title}</h1><div>{post.html}</div></article> : ''
  }
}
```

### Dynamic Routes with Explicit Paths

For non-content parameterized routes, provide explicit paths:

```tsx
export const routes = {
  '/user/:id': {
    component: UserPage,
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  },
}
```

### Client-Only Content

Wrap parts of a template with the `<Client>` tag to exclude them from static output. The wrapped content only renders in the browser:

```tsx
import { Component, Client } from '@geajs/core'

class Dashboard extends Component {
  template() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Client>
          <LiveChart />
          <UserActivity />
        </Client>
      </div>
    )
  }
}
```

During SSG the `<Client>` section becomes an empty placeholder. At runtime the child components mount normally.

### Layouts and Outlets

Route groups with `layout` components are rendered with proper nesting — the layout wraps the page content through `Outlet`.

### Sitemap

Pass `sitemap: { hostname: 'https://example.com' }` to generate a `sitemap.xml` with all rendered pages.

### Active Link State

`Link` components automatically get `data-active` attributes in static output, matching the current route — no client JavaScript needed.

### Dev Mode

In dev mode (`vite dev`), content is preloaded and injected into the page so `ssg.content()` and `ssg.file()` work without a build step. Content file changes trigger automatic page reload.

## Plugin Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `contentDir` | `string` | — | Content directory for markdown files (relative to project root) |
| `sitemap` | `boolean \| SitemapOptions` | — | Generate sitemap.xml |
| `appElementId` | `string` | `'app'` | Mount element id in index.html |
| `routes` | `RouteMap` | — | Override routes (default: from `src/App.tsx`) |
| `app` | `Component` | — | Override app component (default: from `src/App.tsx`) |
| `concurrency` | `number` | `4` | Max concurrent page renders |
| `onBeforeRender` | `function` | — | Hook called before each page render |
| `onAfterRender` | `function` | — | Hook called after render, can transform HTML |
| `onRenderError` | `function` | — | Custom error handler per route |

## Programmatic API

```ts
import { ssg, generate, renderToString, crawlRoutes, parseShell, preloadContent } from '@geajs/ssg'
```

All exports are available from the main entry point for custom build pipelines.

## Related Packages

- **[@geajs/core](https://www.npmjs.com/package/@geajs/core)** — Core framework
- **[@geajs/vite-plugin](https://www.npmjs.com/package/@geajs/vite-plugin)** — Vite plugin for compile-time JSX
- **[create-gea](https://www.npmjs.com/package/create-gea)** — Project scaffolder

## License

[MIT](LICENSE) — Copyright (c) 2017-present Armagan Amcalar
