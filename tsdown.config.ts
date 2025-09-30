import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/checkout/index.ts'],
  platform: 'neutral',
})
