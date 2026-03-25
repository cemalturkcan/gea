import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createServerRouter } from '../src/server-router.ts'

describe('createServerRouter', () => {
  it('resolves a simple route', () => {
    const routes = { '/': 'Home', '/about': 'About' }
    const router = createServerRouter('http://localhost/about', routes)
    assert.equal(router.path, '/about')
    assert.equal(router.route, '/about')
  })

  it('extracts route params', () => {
    const routes = { '/users/:id': 'UserProfile' }
    const router = createServerRouter('http://localhost/users/42', routes)
    assert.equal(router.params.id, '42')
    assert.equal(router.route, '/users/:id')
  })

  it('parses query string', () => {
    const routes = { '/search': 'Search' }
    const router = createServerRouter('http://localhost/search?q=hello&page=2', routes)
    assert.equal(router.query.q, 'hello')
    assert.equal(router.query.page, '2')
  })

  it('parses hash', () => {
    const routes = { '/docs': 'Docs' }
    const router = createServerRouter('http://localhost/docs#section', routes)
    assert.equal(router.hash, '#section')
  })

  it('returns redirect string from guard', () => {
    class Dashboard {}
    const routes = {
      '/dashboard': {
        guard: () => '/login',
        children: { '/': Dashboard },
      },
    }
    const result = createServerRouter('http://localhost/dashboard', routes)
    assert.equal(result.guardRedirect, '/login')
  })

  it('passes guard that returns true', () => {
    class Dashboard {}
    const routes = {
      '/dashboard': {
        guard: () => true,
        children: { '/': Dashboard },
      },
    }
    const result = createServerRouter('http://localhost/dashboard', routes)
    assert.equal(result.guardRedirect, null)
    assert.equal(result.path, '/dashboard')
  })

  it('handles wildcard 404 route', () => {
    const routes = { '/': 'Home', '*': 'NotFound' }
    const router = createServerRouter('http://localhost/nonexistent', routes)
    assert.equal(router.route, '*')
  })

  it('handles string redirect routes', () => {
    const routes = { '/old': '/new', '/new': 'NewPage' }
    const router = createServerRouter('http://localhost/old', routes)
    assert.equal(router.guardRedirect, '/new')
  })
})
