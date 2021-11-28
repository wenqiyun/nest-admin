#### 项目配置

本项目后端使用 yaml 作为配置文件

> [!WARNING]
> 如果是新建的项目不要忘记在 ```nest-cli.json``` 文件添加配置，代码如下：

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": ["**/*.yml"],
    "watchAssets": true
  }
}
```

#### 配置详情
```yaml
# 开发环境配置
app:
  prefix: '/api'
  port: 8081
  swagger: true
  logger:
    # 项目日志存储路径，相对路径（相对本项目根目录）或绝对路径
    dir: '../logs'
  # 文件相关
  file:
    # location 文件上传后存储目录，相对路径（相对本项目根目录）或绝对路径
    location: '../upload'
    # 文件服务器地址，开发环境
    domain: 'http://localhost:8081'
    # 文件虚拟路径, 必须以 / 开头， 如 http://localhost:8081/static/****.jpg  , 如果不需要则 设置 ''
    serveRoot: '/static'
# 数据库配置
db:
  mysql:
    host: 'localhost'
    username: 'root'
    password: 'root'
    database: 'kapok'
    port: 3306
    charser: 'utf8mb4'
    logger: 'advanced-console'
    logging: true
    multipleStatements: true
    dropSchema: false
    synchronize: true
    supportBigNumbers: true
    bigNumberStrings: true

# redis 配置
redis:
  host: 'localhost'
  port: 6379
  db: 0
  keyPrefix: 'nest:'

# jwt 配置
jwt:
  secretkey: 'zANDwNQVFzxlfG9myPxVWAkq4iXJEPhI'
  expiresin: '1h'
  refreshExpiresIn: '2h'
# 权限 白名单配置
perm:
  router:
    whitelist: [{ path: '/api/register', method: 'POST'  }, { path: '/api/login', method: 'POST' }, { path: '/api/perm/{id}', method: 'GET' }, { path: '/api/oss/upload', method: 'POST' }]

# 用户相关
# 初始密码， 重置密码
user:
  initialPassword: 'Q123456'
```


#### 区分环境
本项目根据 ```NODE_ENV``` 变量自动导入不同环境的配置

在 ```package.json``` 配置不同环境的启动命令，如下：

```json
{
  ...
  scripts: {
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:test": "cross-env NODE_ENV=test node dist/main",
    "start:prod": "cross-env NODE_ENV=production node dist/main"
  }
  ...
}
```

导入配置文件

```javascript
// src/config/index.ts
import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'

const configFileNameObj = {
  development :'dev',
  test: 'test',
  production: 'prod'
}

const env = process.env.NODE_ENV

export default () => {
  return yaml.load(readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8')) as Record<string, any>
}

```

> [!TIP]
> 如果需要其他环境，只需要安装以上代码配置添加即可。
