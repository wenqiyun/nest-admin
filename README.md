<div align="center">
<br/>
<br/>
  <h1 algin="center">
    Nest Admin
  </h1>
</div>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/Nest%20Admin-v2.0.0-green">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/nestjs-v8.x-green.svg" >
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/vue-v3.x-green.svg">
  </a>
</p>

#### 项目说明
```Nest Admin``` 管理系统，是基于 ```Nestjs```，```Vue``` 打造出的一站式 RBAC 管理平台。

核心模块包括： 用户、角色、菜单、日志、文件管理等功能。


#### 本地开发

下载源码

```sh
git clone https://github.com/wenqiyun/nest-admin.git
# 或
git clone https://gitee.com/wenqiyun/nest-admin.git
```

前端

```sh
# 打开前端根目录
cd nest-admin/client
# 安装依赖包
npm i
# 本地运行开发
npm run serve
```

后端

本项目使用 ```TypeOrm``` 连接 ```MySql``` 数据库， 运行前请在 ```servers/src/config/dev.yml``` 文件中配置好数据库连接

```MySql``` 数据库文件在 ```nest-admin/db/kapok.sql``` ，可以通过 ```MySQL WorkBench``` 或 ``` Navicat``` 等工具软件导入。

```sh
# 打开后端根目录
cd nest-admin/servers
# 如果 安装不成功，建议使用 pnpm i
npm i
# 本地运行开发
npm run start:dev
```

启动好前、后端后，浏览器访问 http://localhost:9540 即可打开页面， swagger 文档地址 http://localhost:8081/api/docs

测试帐号密码： admin/admin

#### 效果图

![image](./upload/user.png)


![image](./upload/dept.png)


![image](./upload/role.png)


![image](./upload/menu.png)


![image](./upload//oss.png)


如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励

![image](./upload/pay.jpg)

