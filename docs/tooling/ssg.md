# Static Site Generation

`@geajs/ssg` pre-renders your Gea application to static HTML at build time. Every route becomes an `index.html` file with zero client JavaScript — instant loads, full SEO, and no runtime overhead.

## Installation

```bash
npm install -D @geajs/ssg
```

Requires `@geajs/core` ^1.0.0 and `vite` ^8.0.0 as peer dependencies.

## Setup

Add `geaSSG()` to your Vite config after `geaPlugin()`:

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

Your `src/App.tsx` must export a `routes` object and `App` (or a default export):

```tsx
import { Component, RouterView, Link } from '@geajs/core'

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
        <nav>
          <Link to="/" label="Home" exact />
          <Link to="/about" label="About" />
          <Link to="/blog" label="Blog" />
        </nav>
        <RouterView routes={routes} />
      </div>
    )
  }
}
```

Running `vite build` renders every route to `dist/`:

```
dist/
├── index.html          (/)
├── about/index.html    (/about)
├── blog/
│   ├── index.html      (/blog)
│   ├── hello/index.html
│   └── world/index.html
└── sitemap.xml
```

## Markdown Content

The `ssg` accessor reads markdown files with YAML frontmatter from a content directory:

```tsx
import { ssg } from '@geajs/ssg'

class Blog extends Component {
  posts = ssg.content<{ title: string; date: string }>('blog', {
    sort: (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  })

  template() {
    return (
      <ul>
        {this.posts.map(p => `<li>${p.frontmatter.title}</li>`).join('')}
      </ul>
    )
  }
}
```

Each returned file has:

- `slug` — filename without extension
- `frontmatter` — parsed YAML metadata
- `content` — raw markdown
- `html` — rendered HTML

A typical markdown file:

```markdown
---
title: Hello World
date: 2026-01-15
excerpt: Getting started with Gea SSG.
---

# Hello World

This is the body content. It supports **bold**, `code`, and [links](https://example.com).
```

### Single File Lookup

Use `ssg.file()` to look up a single content file by slug:

```tsx
class BlogPost extends Component {
  template(props) {
    const post = ssg.file('blog', props?.slug)
    if (!post) return '<div>Not found</div>'
    return (
      <article>
        <h1>{post.frontmatter.title}</h1>
        <div>{post.html}</div>
      </article>
    )
  }
}
```

## Dynamic Routes

### Content-Based Routes

Parameterized routes can auto-generate pages from content files. Each `.md` file's slug becomes a route parameter:

```tsx
export const routes = {
  '/blog/:slug': { component: BlogPost, content: 'blog' },
}
```

With three files in `src/content/blog/` (`hello.md`, `world.md`, `intro.md`), this generates three pages: `/blog/hello`, `/blog/world`, `/blog/intro`.

### Explicit Paths

For non-content parameterized routes, provide explicit paths:

```tsx
export const routes = {
  '/user/:id': {
    component: UserPage,
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  },
}
```

## Layouts

Route groups with `layout` components work automatically. The SSG renders layouts wrapping page content through `Outlet`, just like client-side rendering:

```tsx
export const routes = {
  '/': Home,
  '/docs': {
    layout: DocsLayout,
    children: {
      '/getting-started': GettingStarted,
      '/api': ApiReference,
    },
  },
}
```

## Active Links

`Link` components get `data-active` attributes in static output matching the current route. Style them with CSS:

```css
[data-active] {
  font-weight: bold;
  color: var(--accent);
}
```

## Dev Mode

In development (`vite dev`), content is preloaded and injected into the page so `ssg.content()` and `ssg.file()` work without a build step. Content file changes trigger automatic page reload.

## Sitemap

Pass a `sitemap` option to generate `sitemap.xml`:

```ts
geaSSG({
  sitemap: {
    hostname: 'https://example.com',
    changefreq: 'weekly',
    priority: 0.8,
    exclude: ['/404'],
  },
})
```

## Plugin Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `contentDir` | `string` | — | Markdown content directory (relative to project root) |
| `sitemap` | `boolean \| SitemapOptions` | — | Generate sitemap.xml |
| `appElementId` | `string` | `'app'` | Mount element id in index.html |
| `routes` | `RouteMap` | — | Override routes (default: loaded from `src/App.tsx`) |
| `app` | `Component` | — | Override app component (default: loaded from `src/App.tsx`) |
| `concurrency` | `number` | `4` | Max concurrent page renders |
| `onBeforeRender` | `function` | — | Hook before each page render |
| `onAfterRender` | `function` | — | Hook after render, can transform HTML |
| `onRenderError` | `function` | — | Custom error handler per route |

## Programmatic API

All functions are available from the main entry point for custom build pipelines:

```ts
import { ssg, generate, renderToString, crawlRoutes, parseShell, preloadContent } from '@geajs/ssg'
```
