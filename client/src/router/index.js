import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  { path: '/login', name: 'login', component: () => import('@/views/user/login/index'), hidden: true, meta: { title: '登录' } },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: { title: '权限管理', icon: 'permission' },
    redirect: '/permission/users',
    children: [
      { path: 'users', component: () => import('@/views/permission/users/index'), name: 'permission_users', meta: { title: '用户管理' } },
      { path: 'depts', component: () => import('@/views/permission/depts/index'), name: 'permission_depts', meta: { title: '部门管理' } },
      { path: 'roles', component: () => import('@/views/permission/roles/index'), name: 'permission_roles', meta: { title: '角色管理' } }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: { title: '系统设置', icon: 'system' },
    redirect: '/system',
    children: [
      { path: 'menu', component: () => import('@/views/system/menu/index'), name: 'system_menu', meta: { title: '菜单管理' } },
      { path: 'oss', component: () => import('@/views/system/oss/index'), name: 'system_oss', meta: { title: '文件上传' } }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
