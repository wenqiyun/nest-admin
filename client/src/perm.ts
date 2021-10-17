import router from './router'
import { store } from './store/index'
import { AppRouteRecordRaw } from './common/types/appRoute.type'
import { PermissionActionContants } from './store/modules/permission'

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}-Nest Admin`

  if (!store.state.permission.isReqPerm) {
    const accessRoutes: Array<AppRouteRecordRaw> = await store.dispatch(PermissionActionContants.GENRATERROUTES, [])
    accessRoutes.forEach(route => router.addRoute(route))
    next({ ...to, replace: true })
  } else {
    next()
  }
})
