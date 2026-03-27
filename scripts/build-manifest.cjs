#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)

const mergeDeep = (base, override) => {
  const out = { ...base }
  Object.entries(override).forEach(([key, value]) => {
    if (isObject(value) && isObject(base[key])) {
      out[key] = mergeDeep(base[key], value)
      return
    }
    out[key] = value
  })
  return out
}

const normalizeVersion = version => String(version || '').trim().replace(/^v/, '')

const getExactTagVersion = rootDir => {
  try {
    const tag = execSync('git describe --tags --exact-match --match "v*"', {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim()
    return normalizeVersion(tag)
  } catch {
    return null
  }
}

const toManifestVersion = version => {
  const core = version.split('-')[0].split('+')[0]
  if (!/^\d+(\.\d+){0,3}$/.test(core)) {
    throw new Error(`Invalid manifest version "${version}". Expected 1-4 numeric segments.`)
  }
  return core
}

function buildManifest(targetArg = 'chrome', options = {}) {
  const target = String(targetArg || 'chrome').toLowerCase()
  const rootDir = options.rootDir || path.resolve(__dirname, '..')
  const writeOutput = options.writeOutput !== false

  const basePath = path.join(rootDir, 'manifest.base.json')
  const packagePath = path.join(rootDir, 'package.json')
  const overridePath = path.join(rootDir, 'manifest.overrides', `${target}.json`)
  const outputPath = path.join(rootDir, 'manifest.json')

  const baseManifest = readJson(basePath)
  const packageJson = readJson(packagePath)
  const overrideManifest = fs.existsSync(overridePath) ? readJson(overridePath) : {}
  const manifest = mergeDeep(baseManifest, overrideManifest)
  const packageVersion = normalizeVersion(packageJson.version)
  const tagVersion = getExactTagVersion(rootDir)
  const sourceVersion = tagVersion && tagVersion === packageVersion ? tagVersion : packageVersion || tagVersion

  if (!sourceVersion) {
    throw new Error('Unable to resolve extension version from package.json or git tag')
  }

  if (tagVersion && tagVersion !== packageVersion) {
    console.warn(`Tag version (${tagVersion}) differs from package.json version (${packageVersion}). Using package.json version.`)
  }

  if (
    target === 'firefox' &&
    manifest.background &&
    typeof manifest.background === 'object' &&
    typeof manifest.background.service_worker === 'string' &&
    (!Array.isArray(manifest.background.scripts) || manifest.background.scripts.length === 0)
  ) {
    manifest.background.scripts = [manifest.background.service_worker]
  }

  manifest.version = toManifestVersion(sourceVersion)
  if (sourceVersion !== manifest.version) {
    manifest.version_name = sourceVersion
  }

  if (writeOutput) {
    fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
    console.log(`Generated manifest.json for target: ${target} (version ${manifest.version}${manifest.version_name ? `; version_name ${manifest.version_name}` : ''})`)
  }

  return manifest
}

if (require.main === module) {
  buildManifest(process.argv[2] || 'chrome')
}

module.exports = {
  buildManifest
}
