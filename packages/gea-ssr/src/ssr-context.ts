import { AsyncLocalStorage } from 'node:async_hooks'
import { isInternalProp } from './types'

// Maps raw store target → cloned data overlay for the current request
const ssrContext = new AsyncLocalStorage<WeakMap<object, Record<string, unknown>>>()

/**
 * Called by Store Proxy get/set/delete handlers.
 * Returns the per-request data overlay for a store, or undefined if not in SSR context.
 */
export function resolveOverlay(target: object): Record<string, unknown> | undefined {
  return ssrContext.getStore()?.get(target)
}

function isClonable(value: unknown): boolean {
  if (value === null || value === undefined) return true
  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'boolean') return true
  if (t === 'symbol' || t === 'bigint') return false
  if (t !== 'object') return false
  if (Array.isArray(value)) return true
  if (value instanceof Date) return true
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function assertClonable(key: string, value: unknown): void {
  if (!isClonable(value)) {
    const typeName = value === null ? 'null'
      : typeof value === 'object' ? Object.getPrototypeOf(value)?.constructor?.name ?? typeof value
      : typeof value
    throw new Error(
      `[GEA SSR] Store property "${key}" contains an unsupported type (${typeName}). ` +
      'Only primitives, plain objects, arrays, and Dates are supported in SSR store data.',
    )
  }
}

export function deepClone(key: string, value: unknown): unknown {
  if (value === null || value === undefined) return value
  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'boolean') return value
  assertClonable(key, value)
  if (value instanceof Date) return new Date(value.getTime())
  if (Array.isArray(value)) return value.map((item, i) => deepClone(`${key}[${i}]`, item))
  // Plain object
  const result: Record<string, unknown> = {}
  for (const k of Object.keys(value as Record<string, unknown>)) {
    result[k] = deepClone(`${key}.${k}`, (value as Record<string, unknown>)[k])
  }
  return result
}

/**
 * Deep-clone a store's serializable data properties into a plain object.
 * Throws on unsupported types instead of silently dropping them.
 */
export function cloneStoreData(store: object): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const key of Object.getOwnPropertyNames(store)) {
    if (isInternalProp(key)) continue
    if (key === 'constructor') continue
    const descriptor = Object.getOwnPropertyDescriptor(store, key)
    if (!descriptor || typeof descriptor.value === 'function') continue
    if (typeof descriptor.get === 'function') continue
    assertClonable(key, descriptor.value)
    data[key] = deepClone(key, descriptor.value)
  }
  return data
}

/**
 * Run a function inside an SSR context with per-request store data overlays.
 * All store reads/writes within fn (and its async continuations) are isolated.
 */
/**
 * Get the raw target from a Store Proxy, or return the object as-is.
 */
function unwrapProxy(store: object): object {
  const raw = (store as Record<string, unknown>).__getRawTarget
  return (typeof raw === 'object' && raw !== null) ? raw as object : store
}

/**
 * Run a function inside an SSR context with per-request store data overlays.
 * All store reads/writes within fn (and its async continuations) are isolated.
 */
export function runInSSRContext<T>(
  stores: object[],
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const overlays = new WeakMap<object, Record<string, unknown>>()
  for (const store of stores) {
    // Unwrap the Proxy to get the raw target — the Proxy handler passes
    // the raw target to resolveOverlay, so the WeakMap key must match.
    const raw = unwrapProxy(store)
    overlays.set(raw, cloneStoreData(raw))
  }
  return ssrContext.run(overlays, fn)
}
