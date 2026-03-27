import test from 'node:test'
import assert from 'node:assert/strict'

import { bundleWords, getSafeLocale, parseWordMetadata } from '../src-content/lib/tokenizer.mjs'

test('classifies grouped numbers as numeric and sentence-ending', () => {
  const meta = parseWordMetadata('1.000.000.', 'is')

  assert.equal(meta.isNumeric, true)
  assert.equal(meta.endsSentence, true)
  assert.equal(meta.hasOtherPunc, false)
})

test('keeps period between number and lowercase letters in one token', () => {
  const tokens = bundleWords('Þetta kostar 1.000isk í dag.', 'is', 4)

  assert.deepEqual(tokens, ['Þetta', 'kostar', '1.000isk', 'í', 'dag.'])
})

test('splits em dash boundaries when the joined token exceeds max length', () => {
  const tokens = bundleWords('alpha—beta—gamma', 'en', 7)

  assert.deepEqual(tokens, ['alpha—', 'beta—', 'gamma'])
})

test('keeps japanese punctuation attached for non-space-delimited languages', () => {
  const tokens = bundleWords('こんにちは世界。テスト', 'ja', 13)

  assert.equal(tokens.length > 0, true)
  assert.equal(tokens.some(token => token.endsWith('。')), true)
})

test('falls back to english locale for invalid language tags', () => {
  assert.equal(getSafeLocale('not_a_real_locale_tag!!'), 'en')
})

test('captures prefix punctuation length in word metadata', () => {
  const meta = parseWordMetadata('“hello”', 'en')

  assert.equal(meta.prefixLength, 1)
  assert.equal(meta.length, 5)
  assert.equal(meta.endsSentence, false)
})

test('skips leading whitespace in non-space-delimited tokenization', () => {
  const tokens = bundleWords('  こんにちは。 テスト', 'ja', 13)

  assert.deepEqual(tokens, ['こんにちは。', 'テスト'])
})
