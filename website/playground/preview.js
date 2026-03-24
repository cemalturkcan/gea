// website/playground/preview.js

const GEA_CORE_VERSION = '1.0.3'
const GEA_CORE_CDN_URL = `https://esm.sh/@geajs/core@${GEA_CORE_VERSION}`

function rewriteImports(code, blobUrlMap) {
  return code
    .replace(
      /from\s+['"]@geajs\/core['"]/g,
      `from '${GEA_CORE_CDN_URL}'`
    )
    .replace(
      /from\s+['"](\.[^'"]+)['"]/g,
      (match, importPath) => {
        const normalized = importPath.replace(/^\.\//, '')
        const candidates = [normalized, `${normalized}.ts`, `${normalized}.tsx`, `${normalized}.js`, `${normalized}.jsx`]
        for (const c of candidates) {
          if (blobUrlMap[c]) {
            return `from '${blobUrlMap[c]}'`
          }
        }
        return match
      }
    )
}

function createBlobModules(compiledModules, fileOrder) {
  const blobUrls = {}

  for (const filename of fileOrder) {
    const code = compiledModules[filename]
    if (!code) continue
    const rewritten = rewriteImports(code, blobUrls)
    const blob = new Blob([rewritten], { type: 'application/javascript' })
    blobUrls[filename] = URL.createObjectURL(blob)
  }

  return blobUrls
}

function generateSrcdoc(entryBlobUrl) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: system-ui, sans-serif; color: #e0dff5; margin: 16px; }
  .counter { display: flex; align-items: center; gap: 12px; }
  .counter span { font-size: 2rem; min-width: 3ch; text-align: center; }
  .counter button {
    font-size: 1.5rem; padding: 8px 16px; cursor: pointer;
    background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3);
    color: #00e5ff; border-radius: 6px;
  }
  .counter button:hover { background: rgba(0, 229, 255, 0.2); }
</style>
</head>
<body>
<div id="app"></div>
<script type="module">
  import('${entryBlobUrl}')
</script>
</body>
</html>`
}

function generateErrorSrcdoc(errors) {
  const errorHtml = errors.map(e =>
    `<div style="margin-bottom:12px"><strong>${e.file}</strong><pre style="color:#ff6b6b;white-space:pre-wrap;margin:4px 0">${escapeHtml(e.message)}</pre></div>`
  ).join('')
  return `<!DOCTYPE html>
<html>
<head><style>body{font-family:'IBM Plex Mono',monospace;background:#0a0a1a;color:#e0dff5;padding:16px;}pre{font-size:13px;}</style></head>
<body>
<h3 style="color:#ff2d95;margin-top:0">Compilation Error</h3>
${errorHtml}
</body>
</html>`
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function renderPreview(iframe, compiledModules, fileOrder, errors) {
  if (iframe._blobUrls) {
    Object.values(iframe._blobUrls).forEach(url => URL.revokeObjectURL(url))
  }

  if (errors && errors.length > 0) {
    iframe.srcdoc = generateErrorSrcdoc(errors)
    return
  }

  const blobUrls = createBlobModules(compiledModules, fileOrder)
  iframe._blobUrls = blobUrls

  const entryFile = fileOrder[fileOrder.length - 1]
  const entryUrl = blobUrls[entryFile]

  iframe.srcdoc = generateSrcdoc(entryUrl)
}
