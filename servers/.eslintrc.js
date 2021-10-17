module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': [ 2, 'never' ],
    '@typescript-eslint/no-unused-vars': 0,
    'semi': 0,
    'array-bracket-spacing': [2, 'never'],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    // 'comma-dangle': [2, 'never'],
    // 文件末尾强制换行
    'eol-last': 2,
    'quotes': [1, 'single'],
    'eqeqeq': [2, 'allow-null'],
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
  },
};
