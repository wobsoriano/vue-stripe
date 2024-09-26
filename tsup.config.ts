import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    splitting: true,
    clean: true,
    minify: true,
    dts: true,
  }
})
