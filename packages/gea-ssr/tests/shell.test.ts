import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseShell } from '../src/shell.ts'

describe('parseShell', () => {
  it('splits index.html at div#app', () => {
    const html = '<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>'
    const { before, after } = parseShell(html, 'app')
    assert.equal(before, '<!DOCTYPE html><html><head></head><body><div id="app">')
    assert.equal(after, '</div></body></html>')
  })

  it('handles custom app element id', () => {
    const html = '<html><body><div id="root"></div></body></html>'
    const { before, after } = parseShell(html, 'root')
    assert.equal(before, '<html><body><div id="root">')
    assert.equal(after, '</div></body></html>')
  })

  it('handles single quotes in id attribute', () => {
    const html = "<html><body><div id='app'></div></body></html>"
    const { before, after } = parseShell(html, 'app')
    assert.equal(before, "<html><body><div id='app'>")
    assert.equal(after, '</div></body></html>')
  })

  it('throws if app element not found', () => {
    const html = '<html><body><div id="other"></div></body></html>'
    assert.throws(() => parseShell(html, 'app'), /Could not find.*id="app"/)
  })

  it('handles whitespace and attributes on app div', () => {
    const html = '<html><body><div id="app" class="main" ></div></body></html>'
    const { before, after } = parseShell(html, 'app')
    assert.ok(before.endsWith('>'))
    assert.ok(after.startsWith('</div>'))
  })
})
