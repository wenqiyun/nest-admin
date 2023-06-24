import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { ElMessageBox, ElNotification } from 'element-plus'
import appConfig from '@/config/index'

import { clearLocalStorage, getRTExp, getToken, setToken } from './cache'
import { updateToken, type LoginResult } from '@/api/user'

let isRefreshing = false
let retryReqs: any[] = []

function createService() {
  const service = axios.create()

  service.interceptors.request.use((config) => {
    const token = getToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = token
    }
    return config
  })

  service.interceptors.response.use(
    (response) => {
      const res = response?.data
      // res 有值
      if (res || response.config?.responseType === 'blob') {
        return res
      }
      return null
    },
    async (error: AxiosError<any>) => {
      const response = error.response
      const config = response?.config as AxiosRequestConfig
      if (response?.status === 401) {
        if (getRTExp() <= Date.now()) {
          // 刷新token 过期了
          ElMessageBox.alert('您的登录已过期，点击跳转登录', '提示', {
            confirmButtonText: 'OK',
            callback: () => {
              clearLocalStorage()
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
              return await request(config)
            }
          } catch (error) {
            console.log(error)
          } finally {
            isRefreshing = false
          }
        } else {
          // 刷新 token 期间，将其他请求存入队列，刷新成功之后重新请求一次
          return new Promise((resolve) => {
            retryReqs.push((token: string) => {
              config.headers = { ...config.headers, Authorization: token }
              resolve(request(config))
            })
          })
        }
      } else {
        ElNotification({
          title: '服务端错误',
          dangerouslyUseHTMLString: true,
          message: `<div style="color: var(--el-color-error, red);">${response?.data?.msg || error.message}</div>`,
          position: 'bottom-right',
          duration: 3000
        })
      }
    }
  )

  return service
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const defaultConfig = {
    timeout: Number(appConfig.request.timeout || '0'),
    baseURL: appConfig.api.baseUrl
  }
  const service = createService()
  const res = await service({ ...defaultConfig, ...config })
  return res as unknown as Promise<T>
}

export default request
