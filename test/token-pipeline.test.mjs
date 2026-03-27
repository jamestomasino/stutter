import test from 'node:test'
import assert from 'node:assert/strict'

import { buildWordEntries } from '../src-content/lib/tokenPipeline.mjs'

function hyphenateWord(word) {
  switch (word) {
    case 'supercalifragilistic':
      return 'su|per|cal|ifrag|ilis|tic'
    case 'supercalifragilistic!':
      return 'su|per|cal|ifrag|ilis|tic!'
    case 'alpha':
      return 'al|pha'
    case 'beta':
      return 'be|ta'
    case 'gamma':
      return 'gam|ma'
    default:
      return word
  }
}

test('marks paragraph boundaries on the last token of each paragraph', () => {
  const entries = buildWordEntries('First paragraph.\n\nSecond paragraph.', 'en', 13, hyphenateWord)

  assert.deepEqual(
    entries.map(entry => entry.text),
    ['First', 'paragraph.', 'Second', 'paragraph.']
  )
  assert.deepEqual(
    entries.map(entry => entry.isParagraphEnd),
    [false, true, false, true]
  )
})

test('preserves numeric group separators during long-word splitting', () => {
  const entries = buildWordEntries('Upphaed 1.000isk 1.000.000', 'is', 4, hyphenateWord)

  assert.equal(entries.some(entry => entry.text === '1.000isk'), true)
  assert.equal(entries.some(entry => entry.text === '1.000.000'), true)
})

test('splits long words after tokenization and keeps sentence punctuation on the last segment', () => {
  const entries = buildWordEntries('supercalifragilistic!', 'en', 6, hyphenateWord)

  assert.equal(entries.length > 1, true)
  assert.equal(entries.at(-1).text.endsWith('!'), true)
  assert.deepEqual(
    entries.slice(0, -1).map(entry => entry.text.endsWith('-')),
    new Array(entries.length - 1).fill(true)
  )
})

test('uses unicode dash boundaries before fallback splitting', () => {
  const entries = buildWordEntries('alpha—beta—gamma', 'en', 7, hyphenateWord)

  assert.deepEqual(entries.map(entry => entry.text), ['alpha—', 'beta—', 'gamma'])
})

test('splits long hyphen-bounded segments and preserves boundary punctuation', () => {
  const entries = buildWordEntries('supercalifragilistic-beta', 'en', 6, hyphenateWord)
  const tokens = entries.map(entry => entry.text)

  assert.equal(tokens.at(-1), 'beta')
  assert.equal(tokens.length > 2, true)
  assert.deepEqual(tokens.slice(0, -1).map(token => token.endsWith('-')), new Array(tokens.length - 1).fill(true))
  assert.equal(entries.at(-1).isParagraphEnd, true)
})

test('does not split long tokens when maxWordLength is zero', () => {
  const entries = buildWordEntries('supercalifragilistic', 'en', 0, hyphenateWord)

  assert.deepEqual(entries.map(entry => entry.text), ['supercalifragilistic'])
})
