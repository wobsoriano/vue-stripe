import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  gitignore: true,
  ignores: [
    '.superpowers/**',
    'docs/superpowers/**',
  ],
  rules: {
    'ts/consistent-type-definitions': 'off',
    'node/prefer-global/process': 'warn',
  },
})
