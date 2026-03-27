#!/usr/bin/env node

const { execSync } = require('child_process')

function parseJsonOutput(raw) {
  const text = String(raw || '').trim()
  if (!text) return null
  return JSON.parse(text)
}

function isIgnorableError(error) {
  if (!error || error.code !== 'MANIFEST_FIELD_UNSUPPORTED') return false
  const message = `${error.message || ''} ${error.description || ''}`
  return /\/background\/service_worker/.test(message)
}

let result
try {
  const stdout = execSync('npx web-ext lint --output json', { stdio: ['ignore', 'pipe', 'pipe'] })
  result = parseJsonOutput(stdout)
} catch (error) {
  result = parseJsonOutput(error.stdout)
  if (!result) {
    process.stderr.write(error.stderr ? String(error.stderr) : String(error))
    process.exit(1)
  }
}

const errors = result.errors || []
const actionableErrors = errors.filter(error => !isIgnorableError(error))

if (actionableErrors.length > 0) {
  console.error('web-ext lint reported actionable errors:')
  actionableErrors.forEach(error => {
    console.error(`- [${error.code}] ${error.file || '<unknown file>'}: ${error.message}`)
  })
  process.exit(1)
}

const ignoredCount = errors.length - actionableErrors.length
if (ignoredCount > 0) {
  console.warn(`Ignored ${ignoredCount} known MV3 lint false positive(s) for background.service_worker.`)
}

const warnings = result.warnings || []
if (warnings.length > 0) {
  console.warn(`web-ext warnings: ${warnings.length}`)
  warnings.forEach(warning => {
    console.warn(`- [${warning.code}] ${warning.file || '<unknown file>'}:${warning.line || 0}`)
  })
}

console.log('web-ext lint passed (with known MV3 exception handling).')
