import { shallowRef } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Layout from '../layout/index.vue'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  }
]

/** 使用 shallowRef 消除 警告 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: shallowRef(Layout),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/perm',
    component: shallowRef(Layout),
    name: 'perm',
    redirect: '/perm/users',
    meta: { title: '权限管理', icon: 'permission' },
    children: [
      {
        path: 'users',
        component: () => import('@/views/permission/users/index.vue'),
        name: 'perm_users',
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        component: () => import('@/views/permission/roles/index.vue'),
        name: 'perm_roles',
        meta: { title: '角色管理' }
      },
      {
        path: 'depts',
        component: () => import('@/views/permission/depts/index.vue'),
        name: 'perm_depts',
        meta: { title: '部门管理' }
      },
      {
        path: 'posts',
        component: () => import('@/views/permission/posts/index.vue'),
        name: 'perm_posts',
        meta: { title: '岗位管理' }
      }
    ]
  },
  {
    path: '/system',
    component: shallowRef(Layout),
    meta: { title: '系统设置', icon: 'system' },
    name: 'system',
    redirect: '/system/menus',
    children: [
      {
        path: 'menus',
        component: () => import('@/views/system/menus/index.vue'),
        name: 'system_menus',
        meta: { title: '资源管理' }
      },
      {
        path: 'oss',
        component: () => import('@/views/system/oss/index.vue'),
        name: 'system_oss',
        meta: { title: '文件列表' }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
