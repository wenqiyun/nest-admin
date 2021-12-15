#### 环境准备
> [!WARNING]
> 本项目依赖 [mysql](https://www.mysql.com/downloads)、[redis](https://redis.io/download) 开发前请先安装它们

#### 工具配置
如果您使用的代码编辑器是 vscode （推荐），可以安装以下工具提高开发效率及代码格式化
* Volar - vue 开发必备
* ESLint - 脚本代码检查
* Prettier - 代码格式化
* DotENV - .env 文件高亮
* Path Intellisense - 自动补全引入路径
* inline Parameters - 参数注释
* tabnine - ai智能补全

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

