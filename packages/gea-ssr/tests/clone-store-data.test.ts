import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { cloneStoreData } from '../src/ssr-context.ts'

/**
 * Tests that cloneStoreData fails fast on unsupported types
 * instead of silently dropping them.
 */

describe('cloneStoreData – fail fast on unsupported types', () => {
  it('clones primitive values correctly', () => {
    const store = { count: 42, name: 'test', active: true, empty: null }
    Object.defineProperty(store, 'count', { value: 42, writable: true, enumerable: true, configurable: true })
    Object.defineProperty(store, 'name', { value: 'test', writable: true, enumerable: true, configurable: true })
    Object.defineProperty(store, 'active', { value: true, writable: true, enumerable: true, configurable: true })
    Object.defineProperty(store, 'empty', { value: null, writable: true, enumerable: true, configurable: true })

    const cloned = cloneStoreData(store)
    assert.equal(cloned.count, 42)
    assert.equal(cloned.name, 'test')
    assert.equal(cloned.active, true)
    assert.equal(cloned.empty, null)
  })

  it('deep-clones nested objects (not shared references)', () => {
    const nested = { x: 1 }
    const store = Object.create(null)
    Object.defineProperty(store, 'data', { value: nested, writable: true, enumerable: true, configurable: true })

    const cloned = cloneStoreData(store)
    assert.deepEqual(cloned.data, { x: 1 })
    // Must be a deep copy, not same reference
    assert.notEqual(cloned.data, nested)
  })

  it('throws on Map values instead of silently dropping', () => {
    const store = Object.create(null)
    Object.defineProperty(store, 'data', {
      value: new Map([['a', 1]]),
      writable: true,
      enumerable: true,
      configurable: true,
    })

    assert.throws(
      () => cloneStoreData(store),
      (err: Error) => err.message.includes('data'),
      'Must throw with property name in error message',
    )
  })

  it('throws on Set values instead of silently dropping', () => {
    const store = Object.create(null)
    Object.defineProperty(store, 'data', {
      value: new Set([1, 2, 3]),
      writable: true,
      enumerable: true,
      configurable: true,
    })

    assert.throws(
      () => cloneStoreData(store),
      (err: Error) => err.message.includes('data'),
      'Must throw with property name in error message',
    )
  })

  it('throws on symbol values instead of silently dropping', () => {
    const store = Object.create(null)
    Object.defineProperty(store, 'tag', {
      value: Symbol('test'),
      writable: true,
      enumerable: true,
      configurable: true,
    })

    assert.throws(
      () => cloneStoreData(store),
      (err: Error) => err.message.includes('tag'),
      'Must throw with property name in error message',
    )
  })

  it('skips functions without error (existing behavior)', () => {
    const store = Object.create(null)
    Object.defineProperty(store, 'count', { value: 5, writable: true, enumerable: true, configurable: true })
    Object.defineProperty(store, 'increment', { value: () => {}, writable: true, enumerable: true, configurable: true })

    const cloned = cloneStoreData(store)
    assert.equal(cloned.count, 5)
    assert.equal(cloned.increment, undefined)
  })

  it('skips internal props (existing behavior)', () => {
    const store = Object.create(null)
    Object.defineProperty(store, '_private', { value: 'secret', writable: true, enumerable: true, configurable: true })
    Object.defineProperty(store, 'visible', { value: 'yes', writable: true, enumerable: true, configurable: true })

    const cloned = cloneStoreData(store)
    assert.equal(cloned._private, undefined)
    assert.equal(cloned.visible, 'yes')
  })
})
