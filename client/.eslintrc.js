// https://eslint.org/docs/user-guide/configuring

/**
 * 
 * "off"或者0    //关闭规则关闭
 *  "warn"或者1    //在打开的规则作为警告（不影响退出代码）
 * "error"或者2    //把规则作为一个错误（退出代码触发时为1
 */

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'vue/require-component-is': 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    // allow async-await
    'generator-star-spacing': 'off',
    'no-mixed-operators':'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 允许 短路求值， if else
    'no-unused-expressions': [2, { 'allowShortCircuit': true, 'allowTernary': true }],
    // 驼峰命名法
    'camelcase': [1, { 'properties': 'always' }],
    // 允许 a['v'] 表示键 方括号
    'dot-notation': [0, { 'allowKeywords': false }], 
    // 允许在条件语句中使用复制语句
    'no-cond-assign': 0,
    // 禁用 var 声明变量，使用 let const 代替， 某些外部引入请在文件头申明可使用
    'no-var': 2,
    'no-useless-escape': 0 // 正则中需要转义等特殊字符
  }
}
