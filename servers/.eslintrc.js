module.exports = {
  parser:  '@typescript-eslint/parser', //定义ESLint的解析器
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],//定义文件继承的子规范
  plugins: ['@typescript-eslint'],//定义了该eslint文件所依赖的插件
  env:{                          //指定代码的运行环境
      browser: true,
      node: true,
      es6: true,
  },
  rules: {
    // '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }], 
    '@typescript-eslint/explicit-function-return-type': [
      // 'warn',
      'off', 
      {
        allowExpressions: true, 
        allowTypedFunctionExpressions: true,
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    "@typescript-eslint/no-angle-bracket-type-assertion": 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    /**
     * 变量名必须是 camelcase 风格的
     * @reason 很多 api 或文件名都不是 camelcase 风格的
     */
    '@typescript-eslint/camelcase': ['off', {properties: 'always'}],
    /**
     * 限制数组类型必须使用 Array<T> 或 T[]
     * @reason 允许灵活运用两者
     */
    '@typescript-eslint/array-type': 'off',
    /**
     * 类型断言必须使用 as Type，禁止使用 <Type>，禁止对对象字面量进行类型断言（断言成 any 是允许的）
     * @reason <Type> 容易被理解为 jsx
     */
    // '@typescript-eslint/consistent-type-assertions': [
    //   'error',
    //   {
    //       assertionStyle: 'as',
    //       objectLiteralTypeAssertions: 'never'
    //   }
    // ],
    /**
     * 优先使用 interface 而不是 type
     * @reason interface 可以 implement, extend 和 merge
     */
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    /**
     * 函数返回值必须与声明的类型一致
     * @reason 编译阶段检查就足够了
     */
    '@typescript-eslint/explicit-function-return-type': 'off',
     /**
     * 约束泛型的命名规则
     */
    '@typescript-eslint/generic-type-naming': 'off',
    /**
     * 私有成员必须以 _ 开头
     * @reason 已有 private 修饰符了，没必要限制变量名
     */
    '@typescript-eslint/member-naming': 'off',
    /**
     * 禁止 delete 时传入的 key 是动态的
     */
    '@typescript-eslint/no-dynamic-delete': 'error',
    /**
     * 禁止对 array 使用 for in 循环
     * @reason 统一关闭 requires type information 的规则
     */
    '@typescript-eslint/no-for-in-array': 'off',
    /**
     * 禁止使用 any
     */
    '@typescript-eslint/no-explicit-any': 'off',
    /**
     * 禁止多余的 non-null 断言
     */
    '@typescript-eslint/no-extra-non-null-assertion': 'off',
    /**
     * 禁止定义没必要的类，比如只有静态方法的类
     */
    '@typescript-eslint/no-extraneous-class': 'off',
    /**
     * 禁止调用 Promise 时没有处理异常情况
     */
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'none',
      'ignoreRestSiblings': true,
    }],
    'eqeqeq': [2, 'allow-null'],
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
  }                               
}