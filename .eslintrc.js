module.exports = {
  root: true,
  extends: ['@react-native'],
  plugins: ['react', 'react-native'],
  rules: {
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
    'require-await': 'error',
    'no-constant-condition': ['error', {checkLoops: false}],
    'require-atomic-updates': 'error',
  },
  ignorePatterns: ['e2e/*'],
  parserOptions: {
    project: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'react-native/react-native': true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
