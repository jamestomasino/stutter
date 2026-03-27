import test from 'node:test'
import assert from 'node:assert/strict'

import { collectOpenShadowRootText, extractFallbackPageText } from '../src-content/lib/extraction.mjs'

function makeNode({ innerText = '', textContent = '', childNodes = [], shadowRoot = null } = {}) {
  return {
    innerText,
    textContent,
    childNodes,
    shadowRoot
  }
}

test('collects text from open shadow roots, including nested hosts', () => {
  const nestedHost = makeNode({
    shadowRoot: makeNode({ textContent: 'Nested shadow text' })
  })
  const host = makeNode({
    childNodes: [nestedHost],
    shadowRoot: makeNode({
      textContent: 'Outer shadow text',
      childNodes: [nestedHost]
    })
  })
  const root = makeNode({ childNodes: [host] })

  assert.deepEqual(collectOpenShadowRootText(root), ['Outer shadow text', 'Nested shadow text'])
})

test('falls back to combining body text and open shadow root text', () => {
  const host = makeNode({
    shadowRoot: makeNode({ textContent: 'Shadow article copy.' })
  })
  const doc = {
    body: makeNode({
      innerText: 'Visible body copy.',
      childNodes: [host]
    })
  }

  assert.equal(
    extractFallbackPageText(doc),
    'Visible body copy.\n\nShadow article copy.'
  )
})

test('returns empty string when no fallback text exists', () => {
  const doc = {
    body: makeNode({ childNodes: [] })
  }

  assert.equal(extractFallbackPageText(doc), '')
})
