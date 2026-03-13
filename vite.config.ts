import { readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  plugins: [vue()],
  fmt: {
    singleQuote: true,
    semi: false,
  },
  define: {
    _VERSION: JSON.stringify(pkg.version),
    _NAME: JSON.stringify(pkg.name),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
  },
  pack: {
    entry: ['./src/index.ts', './src/checkout/index.ts'],
    platform: 'browser',
    define: {
      _VERSION: JSON.stringify(pkg.version),
      _NAME: JSON.stringify(pkg.name),
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    env: {
      builtin: true,
      es2026: true,
      browser: true,
      node: true,
    },
    ignorePatterns: [
      '**/.agents/',
      '**/.changeset',
      '**/.nuxt',
      '**/.output',
      '**/.tmp',
      '**/coverage',
      '**/dist',
      '**/node_modules',
      'docs/app.config.ts',
      'docs/nuxt.config.ts',
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ['**/*.test.ts'],
        rules: {
          '@typescript-eslint/unbound-method': 'off',
        },
      },
      {
        files: ['src/**/*.ts'],
        rules: {
          '@typescript-eslint/no-floating-promises': 'off',
        },
      },
    ],
  },
})
