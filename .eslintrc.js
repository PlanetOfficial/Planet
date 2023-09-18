module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended'],
  plugins: ['react', 'react-native', '@typescript-eslint'],
  rules: {
    'require-await': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',
    'react-native/no-single-element-style-arrays': 'error',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-const-assign': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
    'require-atomic-updates': 'error',
  },
  ignorePatterns: ['e2e/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    'ecmaFeatures': {
      'jsx': true
    },
  },
  env: {
    'react-native/react-native': true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
};
