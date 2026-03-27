import test from 'node:test'
import assert from 'node:assert/strict'

import {
  clampIndex,
  indexToProgress,
  normalizeProgress,
  progressToIndex
} from '../src-content/lib/playbackProgress.mjs'

test('clampIndex keeps index within bounds', () => {
  assert.equal(clampIndex(-3, 10), 0)
  assert.equal(clampIndex(4, 10), 4)
  assert.equal(clampIndex(999, 10), 9)
})

test('normalizeProgress clamps invalid or out-of-range values', () => {
  assert.equal(normalizeProgress(-0.5), 0)
  assert.equal(normalizeProgress(0.5), 0.5)
  assert.equal(normalizeProgress(2), 1)
  assert.equal(normalizeProgress('oops'), 0)
})

test('progressToIndex maps 0..1 to valid token index range', () => {
  assert.equal(progressToIndex(0, 5), 0)
  assert.equal(progressToIndex(0.49, 5), 2)
  assert.equal(progressToIndex(1, 5), 4)
  assert.equal(progressToIndex(10, 5), 4)
  assert.equal(progressToIndex(-10, 5), 0)
})

test('indexToProgress maps index back to normalized progress', () => {
  assert.equal(indexToProgress(0, 5), 0)
  assert.equal(indexToProgress(2, 5), 0.5)
  assert.equal(indexToProgress(4, 5), 1)
  assert.equal(indexToProgress(999, 5), 1)
})

test('progress helpers are stable for empty/degenerate totals', () => {
  assert.equal(clampIndex(3, 0), 0)
  assert.equal(progressToIndex(0.5, 0), 0)
  assert.equal(indexToProgress(3, 0), 0)
  assert.equal(indexToProgress(0, 1), 0)
})
