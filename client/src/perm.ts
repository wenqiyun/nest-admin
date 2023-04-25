import router from './router'
import { getToken } from './utils/cache'
import { useUserStoreHook } from './store/modules/user'
import { usePermissionStoreHook } from './store/modules/permission'

import NProgress from 'nprogress' // progress bar

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单
const whiteList = ['/login']

let isReqPerm = false

const { getUserInfo, getCurrUserMenuPerms } = useUserStoreHook()
const { setRoutes } = usePermissionStoreHook()

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  const toMetaTitle = to.meta?.title || ''
  document.title = `${toMetaTitle ? toMetaTitle + '-' : ''}Nest Admin`

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (!isReqPerm) {
      getUserInfo()
      // 请求菜单接口权限
      isReqPerm = true
      const menuPerms = await getCurrUserMenuPerms()
      const dynamicRoutes = await setRoutes(menuPerms)
      dynamicRoutes.forEach((route) => router.addRoute(route))
      next({ ...to, replace: true })
    } else next()
  } else if (whiteList.indexOf(to.path) !== -1) next()
  else {
    next(`/login${['', '/'].includes(to.path) ? '' : '?redirect=' + to.path}`)
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
