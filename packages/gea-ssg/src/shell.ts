export interface ShellParts {
  before: string
  after: string
}

export function parseShell(html: string, appElementId: string = 'app'): ShellParts {
  const openTagRegex = new RegExp(`(<\\s*div[^>]*\\bid\\s*=\\s*["']${appElementId}["'][^>]*>)`, 'i')
  const match = html.match(openTagRegex)

  if (!match || match.index === undefined) {
    throw new Error(`[gea-ssg] <div id="${appElementId}"> not found in shell HTML.`)
  }

  const openTagEnd = match.index + match[0].length
  const closeIndex = html.indexOf('</div>', openTagEnd)

  if (closeIndex === -1) {
    throw new Error(`[gea-ssg] Closing </div> not found for <div id="${appElementId}">.`)
  }

  const before = html.slice(0, openTagEnd)
  const after = html.slice(closeIndex)

  return { before, after }
}

export function injectIntoShell(shell: ShellParts, renderedHtml: string, headTags?: string): string {
  let result = shell.before + renderedHtml + shell.after

  if (headTags) {
    const headInsertPos = result.toLowerCase().indexOf('</head>')
    if (headInsertPos !== -1) {
      result = result.slice(0, headInsertPos) + headTags + result.slice(headInsertPos)
    }
  }

  return result
}
