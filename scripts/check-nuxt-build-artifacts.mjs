// tsdown 0.15.12 resolves its `entry` array through glob matching and
// silently drops patterns that match nothing. It only errors when the
// combined match set across all entries is empty. That means a misnamed or
// missing runtime source file can produce a green `pnpm build` while quietly
// shipping a Nuxt module with no runtime, since `package.json` publishes the
// whole `dist` directory regardless of what actually landed inside it.
//
// This script asserts the Nuxt-facing build artifacts exist after every
// build, and names exactly what is missing when they do not.

import { existsSync } from 'node:fs'

const required = [
  'dist/nuxt/module.js',
  'dist/nuxt/runtime/server/utils/useServerStripe.js',
]

const missing = required.filter(path => !existsSync(path))

if (missing.length) {
  console.error(`MISSING BUILD ARTIFACTS: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('all nuxt build artifacts present')
