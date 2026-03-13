import { readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
  },
  plugins: [vue()],
  define: {
    _VERSION: JSON.stringify(pkg.version),
    _NAME: JSON.stringify(pkg.name),
  },
})
