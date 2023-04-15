/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'plugin:prettier/recommended',
    'prettier',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "max-len": ["error", { "code": 80 }]
  },
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
        // Add a pattern to allow the @rushstack/eslint-patch package in devDependencies
        '**/@rushstack/eslint-patch/**',
      ],
    },
  ],
}
