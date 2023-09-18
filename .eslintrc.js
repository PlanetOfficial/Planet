module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended'],
  plugins: ['simple-import-sort', 'react', 'react-native', '@typescript-eslint'],
  rules: {
    "require-await": 1,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-raw-text": 2,
    "react-native/no-single-element-style-arrays": 2,
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
    tsconfigRootDir: __dirname,
    "ecmaFeatures": {
      "jsx": true
    },
  },
  env: {
    "react-native/react-native": true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
};
