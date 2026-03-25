export interface ShellParts {
  before: string
  after: string
  headEnd: number
}

export function parseShell(indexHtml: string, appElementId: string): ShellParts {
  const pattern = new RegExp(
    `(<div[^>]*\\bid=["']${escapeRegex(appElementId)}["'][^>]*>)([\\s\\S]*?)(</div>)`,
  )

  const match = indexHtml.match(pattern)
  if (!match) {
    throw new Error(
      `Could not find element with id="${appElementId}" in index.html. ` +
      `Make sure your index.html contains <div id="${appElementId}"></div>`,
    )
  }

  const splitIndex = match.index! + match[1].length
  const before = indexHtml.slice(0, splitIndex)
  const after = indexHtml.slice(splitIndex + match[2].length)

  const headEnd = before.toLowerCase().lastIndexOf('</head>')
  return { before, after, headEnd }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
