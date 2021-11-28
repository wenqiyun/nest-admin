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

#### 本地开发
1. 通过 git 下载源码
2. 执行 db/kapok.sql 文件，初始化数据
3. 修改 config/dev.yml 文件， 更改 mysql 账号和密码
4. 本地开启了 nestjs 静态服务，作为图片服务器，默认上传到根目录 upload 文件夹,
5. 分别在 client、servers 目录下，执行 ```npm i``` （如果 servers 端 npm i 安装不成功， 请使用 pnpm）
6. 安装完依赖，servers 目录下执行 ```npm run start:dev```； client 目录下执行 ```npm run serve``` 即可启动项目
7. 浏览器访问 http://localhost:9540 即可打开页面， swagger 文档地址 http://localhost:8081/api/docs
8. 可测试的帐号密码： admin/admin


