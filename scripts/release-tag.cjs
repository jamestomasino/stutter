#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const shouldPush = process.argv.includes('--push')

const run = cmd => execSync(cmd, { cwd: rootDir, stdio: 'pipe' }).toString().trim()

const hasUncommitted = (() => {
  try {
    execSync('git diff --quiet && git diff --cached --quiet', { cwd: rootDir, stdio: 'ignore' })
    return false
  } catch {
    return true
  }
})()

if (hasUncommitted) {
  console.error('Working tree is not clean. Commit or stash changes before tagging a release.')
  process.exit(1)
}

const branch = run('git rev-parse --abbrev-ref HEAD')
if (branch !== 'master') {
  console.error(`Expected to tag from master, found "${branch}".`)
  process.exit(1)
}

execSync('git fetch origin master --tags', { cwd: rootDir, stdio: 'inherit' })

const localHead = run('git rev-parse HEAD')
const remoteHead = run('git rev-parse origin/master')
if (localHead !== remoteHead) {
  console.error('Local master is not at origin/master. Run `git pull --ff-only` before tagging.')
  process.exit(1)
}

const version = run("node -p \"require('./package.json').version\"")
const tag = `v${version}`

try {
  run(`git rev-parse -q --verify refs/tags/${tag}`)
  console.error(`Tag ${tag} already exists.`)
  process.exit(1)
} catch {
  // Tag does not exist; continue.
}

execSync(`git tag -a ${tag} -m "${tag}"`, { cwd: rootDir, stdio: 'inherit' })
console.log(`Created tag ${tag}`)

if (shouldPush) {
  execSync(`git push origin ${tag}`, { cwd: rootDir, stdio: 'inherit' })
  console.log(`Pushed tag ${tag}`)
}
