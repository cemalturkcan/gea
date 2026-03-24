import assert from 'node:assert/strict'
import { describe, it, beforeEach, afterEach } from 'node:test'
import { JSDOM } from 'jsdom'

function installDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  const raf = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0) as unknown as number
  const caf = (id: number) => clearTimeout(id)
  dom.window.requestAnimationFrame = raf
  dom.window.cancelAnimationFrame = caf

  const prev = {
    window: globalThis.window,
    document: globalThis.document,
    HTMLElement: globalThis.HTMLElement,
    Node: globalThis.Node,
    NodeFilter: globalThis.NodeFilter,
    MutationObserver: globalThis.MutationObserver,
    Event: globalThis.Event,
    CustomEvent: globalThis.CustomEvent,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  }

  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    NodeFilter: dom.window.NodeFilter,
    MutationObserver: dom.window.MutationObserver,
    Event: dom.window.Event,
    CustomEvent: dom.window.CustomEvent,
    requestAnimationFrame: raf,
    cancelAnimationFrame: caf,
  })

  return () => {
    Object.assign(globalThis, prev)
    dom.window.close()
  }
}

async function loadModules() {
  const seed = `comp-helpers-${Date.now()}-${Math.random()}`
  const mgr = await import(`../src/lib/base/component-manager?${seed}`)
  mgr.default.instance = undefined
  const compMod = await import(`../src/lib/base/component.tsx?${seed}`)
  return {
    Component: compMod.default as typeof import('../src/lib/base/component').default,
  }
}

describe('Component.__child', () => {
  let restoreDom: () => void
  let Component: Awaited<ReturnType<typeof loadModules>>['Component']

  beforeEach(async () => {
    restoreDom = installDom()
    const mods = await loadModules()
    Component = mods.Component
  })

  afterEach(() => {
    restoreDom()
  })

  it('sets parentComponent to the parent', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const child = parent.__child(Child, {})
    assert.equal(child.parentComponent, parent)
  })

  it('sets __geaCompiledChild to true on the child', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const child = parent.__child(Child, {})
    assert.equal(child.__geaCompiledChild, true)
  })

  it('passes props correctly to the child', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const child = parent.__child(Child, { color: 'blue', count: 42 })
    assert.equal(child.props.color, 'blue')
    assert.equal(child.props.count, 42)
  })

  it('registers the child in parent.__childComponents', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const child = parent.__child(Child, {})
    assert.ok(parent.__childComponents.includes(child))
  })

  it('sets __geaItemKey (stringified) when key argument is provided', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const childNumKey = parent.__child(Child, {}, 7)
    assert.equal(childNumKey.__geaItemKey, '7')

    const childStrKey = parent.__child(Child, {}, 'abc')
    assert.equal(childStrKey.__geaItemKey, 'abc')
  })

  it('does not set __geaItemKey when no key argument is provided', () => {
    class Parent extends Component {
      template() {
        return '<div></div>'
      }
    }
    class Child extends Component {
      template() {
        return '<span></span>'
      }
    }
    const parent = new Parent()
    const child = parent.__child(Child, {})
    assert.equal(child.__geaItemKey, undefined)
  })
})

describe('Component.__el', () => {
  let restoreDom: () => void
  let Component: Awaited<ReturnType<typeof loadModules>>['Component']

  beforeEach(async () => {
    restoreDom = installDom()
    const mods = await loadModules()
    Component = mods.Component
  })

  afterEach(() => {
    restoreDom()
  })

  it('returns element by id suffix with caching', async () => {
    class MyComp extends Component {
      template() { return `<div id="${this.id}"><p id="${this.id}-info">hi</p></div>` }
    }
    const comp = new MyComp()
    document.body.innerHTML = ''
    comp.render(document.body)
    const el = comp.__el('info')
    assert.ok(el)
    assert.equal(el.textContent, 'hi')
    // Second call returns cached
    assert.equal(comp.__el('info'), el)
  })
})

describe('Component.__updateText', () => {
  let restoreDom: () => void
  let Component: Awaited<ReturnType<typeof loadModules>>['Component']

  beforeEach(async () => {
    restoreDom = installDom()
    const mods = await loadModules()
    Component = mods.Component
  })

  afterEach(() => {
    restoreDom()
  })

  it('updates textContent of element by suffix', async () => {
    class MyComp extends Component {
      template() { return `<div id="${this.id}"><span id="${this.id}-msg">old</span></div>` }
    }
    const comp = new MyComp()
    document.body.innerHTML = ''
    comp.render(document.body)
    comp.__updateText('msg', 'new')
    assert.equal(document.getElementById(comp.id + '-msg')?.textContent, 'new')
  })

  it('does nothing if element not found', () => {
    class MyComp extends Component {
      template() { return `<div id="${this.id}"></div>` }
    }
    const comp = new MyComp()
    // Should not throw
    comp.__updateText('nonexistent', 'text')
  })
})
