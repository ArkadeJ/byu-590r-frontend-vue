/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'eslint:recommended',
    "plugin:vue/vue3-recommended",
    "prettier",
    '@vue/typescript/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
