import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { buildManifest } = require('../scripts/build-manifest.cjs')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

test('adds Firefox background scripts fallback when service worker is present', () => {
  const manifest = buildManifest('firefox', { rootDir, writeOutput: false })

  assert.equal(manifest.background.service_worker, 'dist-bg/index.js')
  assert.deepEqual(manifest.background.scripts, ['dist-bg/index.js'])
})

test('does not add background scripts fallback for non-Firefox manifests', () => {
  const manifest = buildManifest('chrome', { rootDir, writeOutput: false })

  assert.equal(manifest.background.service_worker, 'dist-bg/index.js')
  assert.equal('scripts' in manifest.background, false)
})
