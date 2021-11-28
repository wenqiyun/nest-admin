#### 项目配置

用于修改项目 后端请求基础路径，接口超时时间等配置

> [!TIP]
> 项目的环境配置位于前端根目录下的 ```.env``` 、 ```.env.test``` 、 ```.env.production```

```sh
# 在所有环境中被载入
.env
# 在 test 环境中被载入
.env.test
# 在 生产 环境中被载入
.env.production
```

> [!WARNING]
> 只有 以 VUE_APP_ 开头的变量会被嵌入到客户端中，您可以这样使用
> ```console.log(process.env.VUE_APP_BASE_API_URL)```

本项目除了 ```vue.config.js``` 构建配置 直接使用 process.env.*** ，其他配置项使用：

```src/config/index,ts``` 接收配置变量， 在业务代码中引入 config 变量使用，代码如下

```javascript
// src/config/index.ts
const config = {
  api: {
    baseUrl: `${process.env.VUE_APP_BASE_API_URL}`,
    tmplDownloadUrl: `${process.env.VUE_APP_DOWNLOAD_URL}`
  },
  request: {
    timeout: `${process.env.VUE_APP_API_REQUEST_TIMEOUT}`
  }
}

export default config
```

```javascript
// 业务代码使用 src/api/user.ts
import config from '@/config/index'
...
export function login (loginData: UserLogin): Promise<ResultData<LoginResult>> {
  return http.request<ResultData<LoginResult>>({
    url: `${config.api.baseUrl}/login`,
    method: ApiMethodContants.POST,
    data: loginData
  })
}
```

> [!NOTE]
> 这样做的目的
>
> 为了减少在业务代码中大量使用丑陋的 ```process.env.VUE_APP_***```
