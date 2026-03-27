#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const bump = (process.argv[2] || 'patch').toLowerCase()
const validBumps = new Set(['patch', 'minor', 'major'])

const run = cmd => execSync(cmd, { cwd: rootDir, stdio: 'pipe' }).toString().trim()

if (!validBumps.has(bump)) {
  console.error(`Invalid bump "${bump}". Use one of: patch, minor, major`)
  process.exit(1)
}

const branch = run('git rev-parse --abbrev-ref HEAD')
if (branch === 'master') {
  console.error('Refusing to prepare release on master. Create or switch to a release branch first.')
  process.exit(1)
}

const hasUncommitted = (() => {
  try {
    execSync('git diff --quiet && git diff --cached --quiet', { cwd: rootDir, stdio: 'ignore' })
    return false
  } catch {
    return true
  }
})()

if (hasUncommitted) {
  console.error('Working tree is not clean. Commit or stash changes before preparing a release.')
  process.exit(1)
}

execSync(`npm version ${bump} --no-git-tag-version`, { cwd: rootDir, stdio: 'inherit' })
execSync('npm run manifest:firefox', { cwd: rootDir, stdio: 'inherit' })

const version = run("node -p \"require('./package.json').version\"")
execSync('git add package.json package-lock.json manifest.json', { cwd: rootDir, stdio: 'inherit' })
execSync(`git commit -m "chore(release): v${version}"`, { cwd: rootDir, stdio: 'inherit' })

console.log('\nRelease prep complete.')
console.log(`Version: v${version}`)
console.log('\nNext steps:')
console.log(`1. git push -u origin ${branch}`)
console.log(`2. gh pr create --base master --head ${branch} --title "chore(release): v${version}" --body "Prepare release v${version}"`)
console.log('3. Merge the PR after required checks pass.')
console.log('4. On local master: git pull && npm run release:tag:push')
