import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { handleRequest } from '../src/handle-request.ts'
import type { GeaComponentInstance, GeaStore } from '../src/types.ts'
import { Store } from '../../gea/src/lib/store.ts'

const mockIndexHtml = '<!DOCTYPE html><html><body><div id="app"></div></body></html>'

// A real Store instance — SSR overlay only works on Store Proxy instances
class TestStore extends Store {
  user = 'default'
  count = 0
}
const sharedStore: GeaStore = new TestStore()

class StoreReadingApp implements GeaComponentInstance {
  props: Record<string, unknown>
  constructor(props?: Record<string, unknown>) { this.props = props || {} }
  template() {
    return `<div data-user="${sharedStore.user}" data-count="${sharedStore.count}"></div>`
  }
}

async function readResponse(response: Response): Promise<string> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let result = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value)
  }
  return result
}

describe('SSR context isolation', () => {
  it('concurrent requests get isolated store state', async () => {
    // Reset store to known state
    sharedStore.user = 'default'
    sharedStore.count = 0

    const handler = handleRequest(StoreReadingApp, {
      indexHtml: mockIndexHtml,
      storeRegistry: { TestStore: sharedStore },
      async onBeforeRender(ctx) {
        // Each request mutates the store differently based on route
        const route = ctx.route
        if (route === '/alice') {
          sharedStore.user = 'Alice'
          sharedStore.count = 1
          // Simulate async work to increase overlap window
          await new Promise(r => setTimeout(r, 20))
        } else if (route === '/bob') {
          sharedStore.user = 'Bob'
          sharedStore.count = 2
          await new Promise(r => setTimeout(r, 20))
        }
      },
    })

    // Fire both requests concurrently
    const [aliceResponse, bobResponse] = await Promise.all([
      handler(new Request('http://localhost/alice')),
      handler(new Request('http://localhost/bob')),
    ])

    const aliceHtml = await readResponse(aliceResponse)
    const bobHtml = await readResponse(bobResponse)

    // Each response must contain its own store state, not the other's
    assert.ok(aliceHtml.includes('data-user="Alice"'), 'Alice response must show Alice')
    assert.ok(aliceHtml.includes('data-count="1"'), 'Alice response must show count=1')
    assert.ok(bobHtml.includes('data-user="Bob"'), 'Bob response must show Bob')
    assert.ok(bobHtml.includes('data-count="2"'), 'Bob response must show count=2')

    // Original singleton must be untouched
    assert.equal(sharedStore.user, 'default', 'Original store must not be mutated')
    assert.equal(sharedStore.count, 0, 'Original store count must not be mutated')
  })

  it('store mutations in onBeforeRender do not leak to other requests', async () => {
    // Reset outside SSR context — writes go to the raw Store
    sharedStore.user = 'initial'
    sharedStore.count = 0

    const handler = handleRequest(StoreReadingApp, {
      indexHtml: mockIndexHtml,
      storeRegistry: { TestStore: sharedStore },
      async onBeforeRender(ctx) {
        if (ctx.route === '/mutator') {
          sharedStore.user = 'mutated'
          sharedStore.count = 999
        }
        // /reader does not mutate — should see original state
      },
    })

    // Fire mutator first, reader second — but both concurrent
    const [mutatorResponse, readerResponse] = await Promise.all([
      handler(new Request('http://localhost/mutator')),
      handler(new Request('http://localhost/reader')),
    ])

    const mutatorHtml = await readResponse(mutatorResponse)
    const readerHtml = await readResponse(readerResponse)

    assert.ok(mutatorHtml.includes('data-user="mutated"'), 'Mutator sees its own mutation')
    assert.ok(readerHtml.includes('data-user="initial"'), 'Reader must not see mutator state')

    // Singleton untouched
    assert.equal(sharedStore.user, 'initial')
  })
})
