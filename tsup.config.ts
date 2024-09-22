import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    splitting: true,
    clean: false,
    minify: true,
    dts: false,
  }
})
