import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { AppRouteRecordRaw } from '@/common/types/appRoute.type'

export const constantRoutes: Array<AppRouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/perm',
    component: Layout,
    meta: { title: '权限管理', icon: 'permission' },
    redirect: '/perm/users',
    children: [
      { path: 'users', component: () => import(/* webpackChunkName: "perm_users" */ '@/views/permission/users/index.vue'), name: 'perm_users', meta: { title: '用户管理' } },
      { path: 'roles', component: () => import(/* webpackChunkName: "perm_roles" */ '@/views/permission/roles/index.vue'), name: 'perm_roles', meta: { title: '角色管理' } }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统设置', icon: 'system' },
    redirect: '/system/menus',
    children: [
      { path: 'menus', component: () => import(/* webpackChunkName: "system_menus" */ '@/views/system/menus/index.vue'), name: 'system_menus', meta: { title: '资源管理' } },
      { path: 'oss', component: () => import(/* webpackChunkName: "system_oss" */ '@/views/system/oss/index.vue'), name: 'system_oss', meta: { title: '文件上传' } }
    ]
  }
]

export const asyncRoutes: Array<AppRouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes
})

export default router
