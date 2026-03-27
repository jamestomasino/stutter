import { normalizeExtractedText } from './text.mjs'

function getNodeText(node) {
  if (!node) return ''

  if (typeof node.innerText === 'string' && node.innerText.trim()) {
    return node.innerText
  }

  if (typeof node.textContent === 'string' && node.textContent.trim()) {
    return node.textContent
  }

  return ''
}

export function collectOpenShadowRootText(root) {
  const segments = []
  const visited = new Set()

  function visit(node) {
    if (!node || typeof node !== 'object' || visited.has(node)) {
      return
    }

    visited.add(node)

    if (node.shadowRoot) {
      const shadowText = getNodeText(node.shadowRoot)
      if (shadowText.trim()) {
        segments.push(shadowText)
      }
      visit(node.shadowRoot)
    }

    const children = Array.isArray(node.childNodes) ? node.childNodes : Array.from(node.childNodes || [])
    children.forEach(child => visit(child))
  }

  visit(root)

  return segments
}

export function extractFallbackPageText(doc) {
  if (!doc || !doc.body) return ''

  const segments = []
  const bodyText = getNodeText(doc.body)
  if (bodyText.trim()) {
    segments.push(bodyText)
  }

  collectOpenShadowRootText(doc.body).forEach(text => {
    if (text.trim()) {
      segments.push(text)
    }
  })

  if (!segments.length) return ''

  return normalizeExtractedText(segments.join('\n\n'))
}
