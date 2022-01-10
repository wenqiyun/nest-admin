import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { AppRouteRecordRaw } from '@/common/types/appRoute.type'

export const constantRoutes: Array<AppRouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/views/user/login/index.vue'),
    meta: { title: '登录' }
  }
]

export const asyncRoutes: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
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
    component: Layout,
    name: 'perm',
    meta: { title: '权限管理', icon: 'permission' },
    redirect: '/perm/users',
    children: [
      { path: 'users', component: () => import('@/views/permission/users/index.vue'), name: 'perm_users', meta: { title: '用户管理' } },
      { path: 'roles', component: () => import('@/views/permission/roles/index.vue'), name: 'perm_roles', meta: { title: '角色管理' } },
      { path: 'depts', component: () => import('@/views/permission/depts/index.vue'), name: 'perm_posts', meta: { title: '部门管理' } },
      { path: 'posts', component: () => import('@/views/permission/posts/index.vue'), name: 'perm_posts', meta: { title: '岗位管理' } }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统设置', icon: 'system' },
    name: 'system',
    redirect: '/system/menus',
    children: [
      { path: 'menus', component: () => import('@/views/system/menus/index.vue'), name: 'system_menus', meta: { title: '资源管理' } },
      { path: 'oss', component: () => import('@/views/system/oss/index.vue'), name: 'system_oss', meta: { title: '文件列表' } }
    ]
  },
  {
    path: '/component',
    component: Layout,
    meta: { title: '组件', icon: 'component' },
    redirect: '/component/index',
    children: [
      { path: 'index', component: () => import('@/views/components-demo/index.vue'), name: 'component_index', meta: { title: '组件' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes
})

export default router
