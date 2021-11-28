#### 介绍

```Nest-Admin``` 后端使用了 ```nestjs``` 、```typeorm```、 ```mysql2```、 ```nest-redis```、 ```log4js``` 开发实现的 RBAC 权限管理系统。

> [!WARNING]
> 本项目中使用了 ```nest-redis```，本项目开发期间它的 npm 包最新版本不兼容 nest 8.x ，因此使用了 ```npm i <git url>``` 安装, 如果使用 ```npm i``` 命令安装不成功的话，请删除 node_modules 文件夹，然后使用 ```pnpm``` 命令下载依赖。

#### 项目结构
```javascript
├── src                             //
│   ├── common                      // 公共文件
│   │   │── decorators              // 装饰器
│   │   │── enums                   // 枚举
│   │   │── guards                  // 全局守卫
│   │   │── interfaces              // 接口
│   │   │── libs                    // 封装 nest-redis log4js
│   │   │── utils                   // 一些工具函数的封装，包含全局接口返回 result
│   ├── config                      // 项目配置文件， 使用 yml 文件进行配置，区分环境
│   ├── system                      // 系统模块， 核心代码
│   │   │── auth                    // token 验证
│   │   │── menu                    // 菜单模块
│   │   │── oss                     // 文件上传 模块
│   │   │── perm                    // 权限模块
│   │   │── role                    // 角色模块
│   │   │── user                    // 用户模块
│   ├── app.module.ts               // 模块集合
│   ├── main.ts                     // 项目初始化
├── .eslintignore
├── .eslint.js
├── .gitigore
├── .prettierrc
├── nest-cli.json
├── tsconfig.build.json
├── tsconfig.json
└── tslint.json
```
