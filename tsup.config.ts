import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    splitting: true,
    clean: false,
    minify: false,
    dts: false,
    // esbuildPlugins: [
    //   // Adds .vue files support
    //   vuePlugin(),
    //   // Adds runtime props type generation from TS types
    //   autoPropsPlugin({
    //     include: ['**/*.ts'],
    //   }),
    // ],
  }
})
