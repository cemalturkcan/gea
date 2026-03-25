import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { join, dirname, resolve, relative } from 'node:path'

import { RouterView, Link } from '@geajs/core'
import { renderToString } from './render'
import { crawlRoutes } from './crawl'
import { parseShell, injectIntoShell, stripScripts } from './shell'
import { preloadContent, clearContentCache, serializeContentCache } from './content'
import type { SSGOptions, GenerateResult, GeneratedPage, StaticRoute } from './types'

export async function generate(options: SSGOptions): Promise<GenerateResult> {
  const {
    routes,
    shell: shellPath,
    outDir = 'dist',
    appElementId = 'app',
    onBeforeRender,
    onAfterRender,
    onRenderError,
    concurrency = 4,
    sitemap,
  } = options

  const startTime = performance.now()
  const pages: GeneratedPage[] = []
  const errors: Array<{ path: string; error: Error }> = []

  try {
    if (options.contentDir) {
      await preloadContent(options.contentDir)
      ;(globalThis as any).__SSG_CONTENT__ = JSON.parse(serializeContentCache())
    }

    const shellHtml = await readFile(shellPath, 'utf-8')
    const shellParts = parseShell(shellHtml, appElementId)

    const staticRoutes = await crawlRoutes(routes)

    if (!staticRoutes.length) {
      console.warn('[gea-ssg] No static routes found.')
      return { pages, duration: performance.now() - startTime, errors }
    }

    const absOut = resolve(outDir)
    const seenPaths = new Set<string>()
    for (const route of staticRoutes) {
      const target = resolve(join(outDir, route.path, 'index.html'))
      const rel = relative(absOut, target)
      if (rel.startsWith('..') || resolve(rel) === rel) {
        throw new Error(`[gea-ssg] Path traversal detected: "${route.path}" escapes outDir.`)
      }
      if (seenPaths.has(route.path)) {
        console.warn(`[gea-ssg] Duplicate path "${route.path}" — later render will overwrite.`)
      }
      seenPaths.add(route.path)
    }

    console.log(`[gea-ssg] Found ${staticRoutes.length} routes, rendering...`)

    const renderRoute = async (route: StaticRoute, index: number): Promise<void> => {
      try {
        if (onBeforeRender) {
          await onBeforeRender({
            path: route.path,
            params: route.params,
            component: route.component,
            layouts: route.layouts,
          })
        }

        let html: string
        try {
          RouterView._ssgRoute = {
            component: route.component,
            layouts: route.layouts,
            params: route.params,
          }
          Link._ssgCurrentPath = route.path
          html = renderToString(options.app, undefined, { seed: index })
        } finally {
          RouterView._ssgRoute = null
          Link._ssgCurrentPath = null
        }

        let fullHtml = stripScripts(injectIntoShell(shellParts, html))

        if (onAfterRender) {
          const transformed = await onAfterRender(
            {
              path: route.path,
              params: route.params,
              component: route.component,
              layouts: route.layouts,
            },
            fullHtml,
          )
          if (transformed) fullHtml = transformed
        }

        const outputPath = getOutputPath(route.path, outDir)
        await mkdir(dirname(outputPath), { recursive: true })
        await writeFile(outputPath, fullHtml, 'utf-8')

        pages.push({
          path: route.path,
          outputPath,
          size: Buffer.byteLength(fullHtml, 'utf-8'),
        })
      } catch (error) {
        const err = error as Error
        errors.push({ path: route.path, error: err })
        if (onRenderError) {
          onRenderError(route.path, err)
        } else {
          console.error(`[gea-ssg] Render error: ${route.path}`, err.message)
        }
      }
    }

    await runWithConcurrency(staticRoutes, renderRoute, concurrency)

    if (sitemap) {
      const sitemapOpts = typeof sitemap === 'boolean' ? { hostname: 'https://example.com' } : sitemap
      await generateSitemap(pages, sitemapOpts, outDir)
    }

    const duration = performance.now() - startTime
    console.log(`[gea-ssg] ✓ ${pages.length} pages generated (${errors.length} errors), ${Math.round(duration)}ms`)

    return { pages, duration, errors }
  } finally {
    clearContentCache()
    delete (globalThis as any).__SSG_CONTENT__
  }
}

function getOutputPath(routePath: string, outDir: string): string {
  if (routePath === '/' || routePath === '') {
    return join(outDir, 'index.html')
  }
  return join(outDir, routePath, 'index.html')
}

async function runWithConcurrency<T>(
  items: T[],
  fn: (item: T, index: number) => Promise<void>,
  limit: number,
): Promise<void> {
  const executing = new Set<Promise<void>>()

  for (let i = 0; i < items.length; i++) {
    const p = fn(items[i], i).then(() => {
      executing.delete(p)
    })
    executing.add(p)

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
}

async function generateSitemap(
  pages: GeneratedPage[],
  options: { hostname: string; changefreq?: string; priority?: number; exclude?: string[] },
  outDir: string,
): Promise<void> {
  const { hostname, changefreq = 'weekly', priority = 0.8, exclude = [] } = options

  const urls = pages
    .filter((p) => !exclude.includes(p.path))
    .map(
      (p) => `  <url>
    <loc>${hostname}${p.path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'sitemap.xml'), xml, 'utf-8')
}
