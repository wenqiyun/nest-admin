#### 菜单权限
本项目菜单权限主要针对于 ```asyncRoutes``` 通过获取当前用户的权限做对比，生成当前用户具有的权限可访问的路由表，再通过 ```router.addRoute``` 动态挂载到 ```router``` 上

```javascript
// src/store/permission.ts 实现

/**
 * 判断对比 路由 name 与 后端返回的 菜单唯一标识是否一致
 * route name 未设置且 hidden = true 时，表示不需要判断权限
 * 当父级路由不匹配，但该路由子级路由有权限时 父级路由自动拥有权限
 */
const hasPermission = (route: AppRouteRecordRaw, menus: MenuApiResult[]): boolean => {
  if (route.name) {
    return menus.some(menu => menu.code === route.name)
  }
  if (route.hidden) return true
  if (route.children && route.children.length > 0) return hasPermission(route.children[0], menus)
  return false
}

/**
 * 递归遍历路由权限, 生成当前用户具有权限访问的路由表
 */
const filterAsyncRoutes = (routes: AppRouteRecordRaw[], menus: MenuApiResult[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, menus)) {
      if (tmp.children && tmp.children.length > 0) tmp.children = filterAsyncRoutes(tmp.children, menus)
      res.push(tmp)
    }
  })
  return res
}


// src/perm.ts 监听路由，初始化系统的时候，校验用户权限
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}-Nest Admin`
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else if (!store.state.permission.isReqPerm) { // 这里主要是判断 是否已经执行过 权限校验，防止死循环
      store.dispatch(UserActionContants.GET_USER_INFO, true)
      // 接口请求获取 用户权限
      const menuPerms = await store.dispatch(UserActionContants.GET_USER_MENU_PERM)
      // 将 获取的用户权限 交给上面 src/store/permission.ts 实现返回 当前用户可访问的 路由表
      const accessRoutes: Array<AppRouteRecordRaw> = await store.dispatch(PermissionActionContants.GENRATERROUTES, menuPerms)
      // 动态添加路由
      accessRoutes.forEach(route => router.addRoute(route))
      next({ ...to, replace: true })
    } else next()
  } else if (whiteList.indexOf(to.path) !== -1) next()
  else {
    next(`/login${['', '/'].includes(to.path) ? '' : ('?redirect=' + to.path)}`)
  }
})
```

#### 按钮权限（tabs页权限）

本项目封装了一个指令权限，能够快速的实现按钮级别的权限判断。

使用

```javascript
// 用户管理编辑按钮
<el-button v-perm="perm_user:edit">编辑</el-button>

// 角色管理新增按钮
<el-button v-perm="'perm_roles:create'">新增</el-button>
```

大多数场景使用指令权限可满足需求，本项目还提供了一个权限判断函数。

使用
```javascript
<template>
  <el-table>
    ...

    <el-table-column label="操作" v-if="hasActionPerms">
      <el-button v-perm="perm_user:edit">编辑</el-button>
      <el-button v-perm="perm_user:del">删除</el-button>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import hasPerm from '@/utils/perm'

  ...

  // 当表格操作列有多个按钮权限且当前用户 没有操作权限时，可使用 权限判断函数
  const hasActionPerm = hasPerm('perm_users:edit') || hasPerm('perm_user:del')
</script>

```

> [!TIP]
> 当然 按钮也可以不使用 指令，直接使用 ```v-if``` 结合权限函数
