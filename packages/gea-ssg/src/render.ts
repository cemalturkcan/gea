import { resetUidCounter, Component } from '@geajs/core'

export interface RenderOptions {
  seed?: number
  onRenderError?: (error: Error) => void
}

export function renderToString(
  ComponentClass: new (props?: any) => any,
  props?: Record<string, any>,
  options: RenderOptions = {},
): string {
  const { seed = 0, onRenderError } = options

  resetUidCounter(seed)
  Component._ssgMode = true

  let instance: any = null

  try {
    instance = new ComponentClass(props)
    return String(instance.template(instance.props)).trim()
  } catch (error) {
    if (onRenderError) {
      onRenderError(error as Error)
      return ''
    }
    throw error
  } finally {
    Component._ssgMode = false
    if (instance && typeof instance.dispose === 'function') {
      try {
        instance.dispose()
      } catch {}
    }
  }
}
