import { ref, type Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'

import store from '@/store'

import type { MenuApiResult } from '@/api/menu'
import { asyncRoutes, constantRoutes } from '@/router/index'

/** 判断对比 路由 name 与 后端返回的菜单唯一表示是否一致 */
const hasPermission = (route: RouteRecordRaw, menus: MenuApiResult[]): boolean => {
  let hasPerm = false
  if (route.name && !route.meta?.hidden) {
    hasPerm = menus.some((menu) => menu.code === route.name)
  }
  // route 设置了 hidden 隐藏的 不需要判断权限
  if (route.meta?.hidden) return true
  // 当父级路由不匹配，但该路由子级路由有权限时 父级路由自动拥有权限
  if (route.children && route.children.length > 0) return hasPermission(route.children[0], menus)
  return hasPerm
}

/** 递归遍历路由权限 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], menus: MenuApiResult[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(tmp, menus)) {
      if (tmp.children && tmp.children.length > 0) tmp.children = filterAsyncRoutes(tmp.children, menus)
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const routes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
  const dynamicRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
  const setRoutes = (menus: MenuApiResult[]) => {
    dynamicRoutes.value = filterAsyncRoutes(asyncRoutes, menus)
    routes.value = constantRoutes.concat(dynamicRoutes.value)
    return dynamicRoutes.value
  }
  return { routes, dynamicRoutes, setRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
