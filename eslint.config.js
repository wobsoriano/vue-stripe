import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  gitignore: true,
  rules: {
    'ts/consistent-type-definitions': 'off',
  },
})
