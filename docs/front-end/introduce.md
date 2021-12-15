#### 介绍

```Nest-Admin``` 前端使用了 ```vue3```、```element-plus```、```ts``` 开发，包括 utils 、 k-ui （封装的一些常用组件）、动态菜单、权限校验、按钮级别权限控制等功能。

#### 项目结构

```javascript
├── public                     // 静态资源
│   │── favicon.ico            // favicon图标
│   └── index.html             // html模板
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   │   │── Breadcrumb
│   │   │── Charts             // echarts 简单封装
│   │   │── Hamburger
│   │   │── SvgIcon            // icons 文件中的 svg 渲染组件
│   ├── conmon                 // 基础接口 type 和 常量定义
│   ├── config                 // 全局配置文件
│   ├── icons                  // 项目所有 svg icons
│   ├── layout                 // 全局 layout
│   ├── plugins                // 插件包，目前有 k-ui 主要是一些自用的封装，简化开发
│   ├── router                 // 路由
│   ├── store                  // 全局 store 管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── views                  // views 所有页面
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口文件 加载组件 初始化等
│   └── perm.js                // 权限管理
├── .env.xxx                   // 环境变量配置
├── .eslintrc.js               // eslint 配置项
├── vue.config.js              // vue-cli 配置
└── package.json               // package.json
```


