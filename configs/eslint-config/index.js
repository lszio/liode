module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'header', 'import', "deprecation"],
  extends: [
    "turbo",
    "prettier",
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  env: {
    browser: true,
    es6: true
  },
  ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js'],

  rules: {
    // ERROR
    'deprecation/deprecation': 'error',

    // WARNING
    "no-multiple-empty-lines": ["warn", { max: 1 }],
    // "arrow-parens": ["warn", "as-needed"],
    // "comma-dangle": ["warn", "never"],
    "quotes": ["warn", "double"],
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "semi": ["warn", "always"],
  }
};
