import { resetUidCounter, Component, ComponentManager } from '@geajs/core'

export interface RenderOptions {
  seed?: number
  /** Component class names to track and mark with data-gea attributes */
  hydrate?: string[]
  onRenderError?: (error: Error) => void
}

export function renderToString(
  ComponentClass: new (props?: any) => any,
  props?: Record<string, any>,
  options: RenderOptions = {},
): string {
  const { seed = 0, hydrate = [], onRenderError } = options

  resetUidCounter(seed)
  Component._ssgMode = true

  const cm = ComponentManager.getInstance()
  const tracked: Array<{ id: string; className: string }> = []

  if (hydrate.length) {
    const original = cm.setComponent.bind(cm)
    ;(cm as any).setComponent = function (comp: any) {
      original(comp)
      if (hydrate.includes(comp.constructor.name)) {
        tracked.push({ id: comp.id, className: comp.constructor.name })
      }
    }
  }

  let instance: any = null

  try {
    instance = new ComponentClass(props)
    let html = String(instance.template(instance.props)).trim()

    for (const { id, className } of tracked) {
      html = html.replace(` id="${id}"`, ` data-gea="${className}" id="${id}"`)
    }

    return html
  } catch (error) {
    if (onRenderError) {
      onRenderError(error as Error)
      return ''
    }
    throw error
  } finally {
    Component._ssgMode = false
    if (hydrate.length) {
      delete (cm as any).setComponent
    }
    if (instance && typeof instance.dispose === 'function') {
      try {
        instance.dispose()
      } catch {}
    }
  }
}
