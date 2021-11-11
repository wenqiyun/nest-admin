import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import appConfig from '@/config/index'
import { getToken } from './storage'

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
      if (token) {
        config.headers = { ...config.headers, Authorization: token }
      }
      return config
    }, (err) => { console.log(err) })

    this.instance.interceptors.response.use((response: AxiosResponse<any>) => {
      const res = response?.data
      if (res || response.config?.responseType === 'blob') {
        return res
      }
      return null
    }, (error: AxiosError<any>) => {
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
