import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeExtractedText } from '../src-content/lib/text.mjs'

test('preserves paragraph breaks while collapsing inline whitespace', () => {
  const text = 'First   paragraph.\n\n\nSecond\t paragraph.\n  Third line.'

  assert.equal(
    normalizeExtractedText(text),
    'First paragraph.\n\nSecond paragraph.\nThird line.'
  )
})

test('trims surrounding whitespace without removing meaningful newlines', () => {
  const text = '\n\n  Alpha\n\nBeta  \n\n'

  assert.equal(normalizeExtractedText(text), 'Alpha\n\nBeta')
})
