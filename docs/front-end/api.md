为了方便管理维护，统一的请求处理都放在 ```src/api``` 文件夹中，并且按照 model 维度进行拆分文件，如：

```javascript
api/
  menu.ts
  oss.ts
  perm.ts
  role.ts
  user.ts
```

#### request.ts
其中， ```src/utils/request.ts``` 是基于 axios 的封装，便于统一处理 POST、GET 等请求参数，请求头，以及错误处理等，它封装了全局 ```request 拦截器```、```response 拦截器```、```统一做了超时处理```、```token刷新策略``` 等。具体查看以下代码：

```javascript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessageBox } from 'element-plus'
import appConfig from '@/config/index'
import { getToken, setToken, getRTExp, clearAll } from './storage'
import { updateToken, LoginResult } from '../api/user'

let isRefreshing = false
let retryReqs: any[] = []

class HttpService {
  private instance: AxiosInstance

  constructor (options: AxiosRequestConfig) {
    this.instance = this.createAxiosInstance(options)
    this.setupInterceptors()
  }

  private createAxiosInstance (config: AxiosRequestConfig): AxiosInstance {
    return axios.create(config)
  }

  private filterGetRequestParams (config: AxiosRequestConfig): AxiosRequestConfig {
    const paramsTmp = {}
    if (config.params && typeof config.params === 'object') {
      Object.keys(config.params).forEach(key => {
        if (config.params[key] !== '') paramsTmp[key] = config.params[key]
      })
    }
    config.params = paramsTmp
    return config
  }

  /** 拦截器 */
  private setupInterceptors () {
    // const axiosCance
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = getToken()
      if (token && !config.headers?.Authorization) {
        config.headers = { ...config.headers, Authorization: token }
      }
      return config
    }, (err) => { console.log(err) })
    this.instance.interceptors.response.use(async (response: AxiosResponse<any>) => {
      const res = response?.data
      if (res || response.config?.responseType === 'blob') {
        return res
      }
      return null
    }, async (error: AxiosError<any>) => {
      const response = error.response
      const config = response?.config as AxiosRequestConfig
      // 拦截 401， 刷新 token
      if (response?.status === 401) {
        if (getRTExp() <= Date.now()) {
          // 刷新token 过期了
          ElMessageBox.alert('您的登录已过期，点击跳转登录', '提示', {
            confirmButtonText: 'OK',
            callback: () => {
              clearAll()
              window.location.reload()
            }
          })
        } else if (!isRefreshing) {
          try {
            isRefreshing = true
            const res = await updateToken()
            if (res?.code === 200) {
              const data = res.data as LoginResult
              setToken(data.accessToken, data.refreshToken)
              // 队列中的请求刷新成功后，再请求一次
              for (let i = 0, len = retryReqs.length; i < len; i++) {
                retryReqs[i](data.accessToken)
              }
              // 队列请求完成，清空
              retryReqs = []
              // 返回触发 401 接口正常结果
              config.headers = { ...config.headers, Authorization: data.accessToken }
              return await this.request(config)
            }
          } catch (error) {
            console.log(error)
          } finally {
            isRefreshing = false
          }
        } else {
          // 刷新 token 期间，将其他请求存入队列，刷新成功之后重新请求一次
          return new Promise((resolve, reject) => {
            retryReqs.push((token: string) => {
              config.headers = { ...config.headers, Authorization: token }
              resolve(this.request(config))
            })
          })
        }
      }
      return error.response?.data || null
    })
  }

  getInstance (): AxiosInstance {
    return this.instance
  }

  async request<T = any> (config: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.request<AxiosResponse<T>>(this.filterGetRequestParams(config))
    return (res as unknown) as Promise<T>
  }
}

const service = new HttpService({
  timeout: Number(appConfig.request.timeout || '0')
})

export default service

```
