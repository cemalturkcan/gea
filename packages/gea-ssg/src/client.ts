/**
 * Lightweight browser-only module.
 * vite-plugin aliases `@geajs/ssg` to this file for client builds.
 * Reads content from `window.__SSG_CONTENT__` injected by the SSG build.
 */
import type { ContentFile } from './types'
export type { ContentFile } from './types'

function getData(): Record<string, ContentFile[]> {
  const g = globalThis as any
  if (g.__SSG_CONTENT__) {
    return g.__SSG_CONTENT__
  }
  return {}
}

export const ssg = {
  content<T = Record<string, any>>(
    subdir: string,
    options?: { sort?: (a: ContentFile<T>, b: ContentFile<T>) => number },
  ): ContentFile<T>[] {
    const items = [...(getData()[subdir] || [])] as ContentFile<T>[]
    if (options?.sort) items.sort(options.sort)
    return items
  },

  file<T = Record<string, any>>(subdir: string, slug: string): ContentFile<T> | null {
    const items = (getData()[subdir] || []) as ContentFile<T>[]
    return items.find((f) => f.slug === slug) || null
  },
}
