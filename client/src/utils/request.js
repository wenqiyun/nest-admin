import axios from 'axios'
import { MessageBox } from 'element-ui'
import { getToken, removeToken, getRefreshToken, setToken } from '@/utils/auth.js'

const pendingReqs = []
const FAST_CLICK_MSG = '数据请求中，请稍后'
const CancelToken = axios.CancelToken

const removePendingReq = (config, c) => {
  const url = config.url.indexOf('/api') > -1 ? config.url : `/api${config.url}`
  const index = pendingReqs.findIndex(v => v === url)
  if (index > -1) {
    c ? c(FAST_CLICK_MSG) : pendingReqs.splice(index, 1)
  } else {
    c && pendingReqs.push(url)
  }
}

// create an axios instance
const service = axios.create({
  baseURL: '/api',
  timeout: 60000
})

// request interceptors
service.interceptors.request.use(config => {
  // 配置防止当前重复请求
  config.cancelToken = new CancelToken(c => {
    removePendingReq(config, c)
  })
  if (getToken()) {
	config.headers['Authorization'] = getToken()
	config.headers['refreshToken'] = getRefreshToken()
  }

  return config
}, error => {
  console.log('reqErr', error)
  Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(response => {
  removePendingReq(response.config)
  if (response.header['Authorization']) {
	  const { Authorization, refreshToken } = response.header
	  setToken(Authorization, refreshToken)
  }
  return response.data
}, error => {
  const res = error.response.data
  if (res.statusCode === 401) {
    removePendingReq(error.response.config)
    MessageBox.alert('当前登录已过期，请重新登录', '提示', {
      confirmButtonText: '确定',
      callback: action => {
        removeToken()
        location.reload()
      }
    })
  }
  if (error.message === FAST_CLICK_MSG) {
    pendingReqs.splice(0, pendingReqs.length)
    return Promise.reject(error)
  }

  removePendingReq(error.response.config)
  // 无权限
  return res

  //  console.log('res', error.response.data.statusCode)
})

export default service
