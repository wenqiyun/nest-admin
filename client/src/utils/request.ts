import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessageBox } from 'element-plus'
import appConfig from '@/config/index'
import { getToken, setToken, getRTExp, clearAll } from './storage'
import { updateToken, LoginResult } from '../api/user'

let isRefreshing = false
const retryReqs: any[] = []

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
              for (let i = 0, len = retryReqs.length; i < len; i++) {
                retryReqs[i](data.accessToken)
              }
              config.headers = { ...config.headers, Authorization: data.accessToken }
              return await this.request(config)
            }
          } catch (error) {
            console.log(error)
          } finally {
            isRefreshing = false
          }
        } else {
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
