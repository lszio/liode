module.exports = {
  rules: {
    "no-multiple-empty-lines": ["warn", { max: 1 }],
    "arrow-parens": ["warn", "as-needed"],
    "comma-dangle": ["warn", "never"],

    /// eslint-plugin-deprecation plugin
    'deprecation/deprecation': 'warn'
  }
}
