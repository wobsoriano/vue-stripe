import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/checkout/index.ts',
    './src/nuxt/module.ts',
    './src/nuxt/runtime/server/utils/useServerStripe.ts',
  ],
  platform: 'neutral',
  external: ['#imports'],
  define: {
    _VERSION: JSON.stringify(pkg.version),
    _NAME: JSON.stringify(pkg.name),
  },
})
