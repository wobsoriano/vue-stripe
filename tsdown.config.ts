import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  entry: ['./src/index.ts', './src/checkout/index.ts'],
  platform: 'neutral',
  define: {
    _VERSION: JSON.stringify(pkg.version),
    _NAME: JSON.stringify(pkg.name),
  },
})
