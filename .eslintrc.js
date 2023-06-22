/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: '@ferld',
  ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js'],

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};
