#### 项目说明
前端使用 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 模板， 后端使用 nestjs typeorm 等开发

#### 项目特点
1. nest-admin权限管理系统，是基于nodejs打造出的一站式RBAC管理平台
2. 使用技术 [nestjs](https://nestjs.com/)、[typeorm](https://typeorm.io/)、[vue](https://cn.vuejs.org/index.html)、[ElementUI](https://element.eleme.cn) 开发
3. 优秀的菜单功能权限，前端可灵活控制页面及按钮展示，后端可对未授权的请求进行拦截
4. 当前已有功能：用户管理，角色管理，部门管理，菜单管理，文件管理

#### 下一步计划
1. 更好的系统日志
2. 新增角色时，角色权限只能是创建者权限的子集，有效防止权限越权
4. 部门可选绑定角色


#### 项目结构
> servers 后端项目结构
```
──  src                     // 构建相关
├── commin                  // 公共代码，工具类等
│   ├── decorators          // 自定义装饰器，包含 @Permssion 权限装饰器
│   ├── interfaces          // 自定义接口
│   ├── guards              // 自定义守卫 guards
│   ├── utils               // 工具类
├── config                  // 配置相关, mysql, jwt,upload 等
├── system                  // 核心代码
│   ├── auth                // jwt 相关
│   ├── dept                // 部门模块
│   ├── menu                // 菜单模块
│   ├── perm                // 权限相关模块
│   ├── relatinalEntites    // user 与 role, role 与 menu中间表 user_role, role_menu 实体模块
│   ├── roles               // 角色模块
│   ├── user                // 用户模块，登录注册等
│   ├── app.module.ts       // app.modules
│   ├── main.ts             // main.ts
├── .env                    // 环境配置， 数据库等配置
├── .eslintignore           
├── .eslint.js
├── .gitigore
├── .prettierrc
├── nest-cli.json
├── tsconfig.build.json
├── tsconfig.json
└── tslint.json

```
> client 前端项目结构及教程具体查看 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 项目

#### 本地部署
1. 通过 git 下载源码
2. 执行 db/kapok.sql 文件，初始化数据
3. 修改 servers/.env 文件， 更改 mysql 账号和密码，库
4. 本地开启了 nestjs 静态服务，作为图片服务器，默认上传到总项目根目录 upload 目录下， 如使用 nginx 则需修改 servers/.env 文件 SYSTEM_WWW 值，
5. 分别在 client servers 目录下，执行 npm i 
6. 安装完依赖，servers 目录下执行 npm run start:dev； client 目录下执行 npm run serve 即可启动项目
7. 浏览器访问 http://localhost:9527 即可打开页面， swagger 文档地址 http://localhost:8080/docs
8. 可测试的账号密码： admin/admin   test/test

#### 项目演示
- 演示地址： https://nest-admin.wenqiyun.com
- 账号密码： admin/admin  test/test

#### 效果图

![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/user.png)


![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/dept.png)


![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/role.png)


![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/menu.png)


![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/oss.png)


如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励
![image](https://github.com/wenqiyun/nest-admin/blob/master/upload/pay.jpg)

