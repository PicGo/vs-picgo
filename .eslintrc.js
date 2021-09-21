module.exports = {
  root: true,
  extends: [
    'standard-with-typescript',
    'prettier-standard',
    'plugin:react/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true
        }
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    'no-console': 'warn',
    // https://stackoverflow.com/a/64024916/8242705
    'no-use-before-define': 'off',
    'react/jsx-sort-props': 'error',
    'react/jsx-boolean-value': 'error'
  },
  overrides: [
    {
      files: ['./*.js', './*.ts'],
      rules: {
        'import/no-anonymous-default-export': 0,
        'filenames/match-exported': 0
      }
    }
  ]
}
