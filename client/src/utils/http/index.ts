import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class HttpService {
  private instance: AxiosInstance

  constructor (options: AxiosRequestConfig) {
    this.instance = this.createAxiosInstance(options)
    this.setupInterceptors()
  }

  private createAxiosInstance (config: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      timeout: 3000,
      ...config
    })
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
      return config
    }, (err) => { console.log(err) })

    this.instance.interceptors.response.use((response: AxiosResponse<any>) => {
      const res = response?.data
      if (response.config?.responseType === 'blob' || res.code === 200) {
        return res
      }
      return response
    }, (error: AxiosError<any>) => {
      console.log(error)
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
  baseURL: process.env.VUE_APP_BASE_API_URL as string | '/api',
  timeout: 60 * 1000
})

export default service
