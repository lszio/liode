/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: '@ferld',
  ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js', "**/*.config.js"],

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};
