module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    },
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': [2, 'never'],
    '@typescript-eslint/no-unused-vars': 0,
    'symbol-description': 0,
    semi: 0,
    'array-bracket-spacing': [2, 'never'],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    // 'comma-dangle': [2, 'never'],
    // 文件末尾强制换行
    'eol-last': 2,
    // vue 组件名 包含多个单词
    'vue/multi-word-component-names': 0,
    quotes: [1, 'single'],
    eqeqeq: [2, 'allow-null'],
    indent: [2, 2, {
      SwitchCase: 1
    }]
  }
}
