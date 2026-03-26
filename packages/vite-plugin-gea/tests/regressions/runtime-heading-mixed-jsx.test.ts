import assert from 'node:assert/strict'
import test from 'node:test'
import { installDom, flushMicrotasks } from '../../../../tests/helpers/jsdom-setup'
import { compileJsxComponent, loadRuntimeModules } from '../helpers/compile'

/**
 * Regression (email-client list title): multiple `{...}` siblings under `<h2>` where one is
 * plain text and the next is `cond && (<>…<span>…</>)` must not merge into a single
 * textContent update (which showed literal `<span…>` in the UI).
 */
test('heading with text expression and conditional JSX sibling renders and updates DOM', async () => {
  const restoreDom = installDom()

  try {
    const seed = `runtime-${Date.now()}-heading-mixed-jsx`
    const [{ default: Component }] = await loadRuntimeModules(seed)

    const ListTitle = await compileJsxComponent(
      `
        import { Component } from '@geajs/core'

        export default class ListTitle extends Component {
          folder = 'inbox'
          activeFilter: string | null = 'work'
          labels = [{ id: 'work', label: 'Work' }]

          template() {
            return (
              <div class="panel">
                <h2 class="list-title">
                  {this.folder.charAt(0).toUpperCase() + this.folder.slice(1)}
                  {this.activeFilter && (
                    <>
                      {' · '}
                      <span class="email-list-label-filter">
                        {this.labels.find((x) => x.id === this.activeFilter)?.label}
                      </span>
                    </>
                  )}
                </h2>
              </div>
            )
          }
        }
      `,
      '/virtual/ListTitle.jsx',
      'ListTitle',
      { Component },
    )

    const root = document.createElement('div')
    document.body.appendChild(root)

    const view = new ListTitle()
    view.render(root)
    await flushMicrotasks()

    const h2 = root.querySelector('h2.list-title')
    const badge = root.querySelector('.email-list-label-filter')
    assert.ok(h2, 'h2 exists')
    assert.ok(badge, 'label span must be real DOM, not escaped text in textContent')
    assert.equal(badge?.textContent?.trim(), 'Work')
    assert.equal(
      h2?.textContent?.includes('<span'),
      false,
      'heading must not contain literal angle-bracket markup as text',
    )

    view.activeFilter = null
    await flushMicrotasks()
    assert.equal(root.querySelector('.email-list-label-filter'), null)

    view.folder = 'sent'
    view.activeFilter = 'work'
    await flushMicrotasks()
    assert.equal(root.querySelector('h2.list-title')?.textContent?.includes('Sent'), true)
    assert.equal(root.querySelector('.email-list-label-filter')?.textContent?.trim(), 'Work')
  } finally {
    restoreDom()
  }
})
