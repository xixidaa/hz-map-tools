/*
 * @Author: WangNing
 * @Date: 2023-01-03 19:44:45
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-12 21:07:26
 * @FilePath: /hz-map-tools/.eslintrc.cjs
 */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  // parserOptions: {
  //   ecmaVersion: 'latest',
  // },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off'
  }
}
