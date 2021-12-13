本项目侧边栏和路由是绑定的，所以你在 ```src/router/index.ts``` 配置了相关路由，侧边栏就能动态生成相应的菜单。

#### 配置
```javascript
// 当设置 true 的时候该路由不会出现在侧边栏，如 login 页面，或者是一些列表页附属的编辑页面
hidden: true

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwayShow: true

// 设置路由的名字，一定要填写且唯一，不填写使用 keep-alive 时会出现各种问题
// 建议规则，比如 父级路由是 perm ， 那自己路由 name 可设置为 perm_xxx
name: 'router-name'

meta: {
  title: 'title' // 侧边导航显示的名字
  icon: 'svg-name' // 设置该路由图标， 只支持 svg-class , 具体可查看 icons 文档
  activeMenu: 'router-path' // 当 打开某些编辑页需要高亮列表页时，使用该属性，如 打开文章编辑页，高亮文章列表页
}
```
#### 示例

```javascript
{
  path: '/perm',
  component: Layout,
  name: 'perm',
  meta: { title: '权限管理', icon: 'permission' },
  redirect: '/perm/users',
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
    }
  ]
}

```

> [!TIP]
> 其他配置和 [vue-router](https://router.vuejs.org/) 官方没什么区别，请自行查看文档


#### 路由
这里的路由分为以下两种：

* ```constantRoutes``` ： 代表不需要动态判断权限的路由，如 登录页。
* ```asyncRoutes``` ： 代表需要动态判断权限并通过 ```addRoute``` 动态添加的页面。

具体请查看 权限验证 页面

#### 侧边栏

侧边栏是使用 ```element-plus``` 的 ```el-menu``` 和 ```el-scrollbar``` 实现的

> [!TIP]
> 当 侧边栏需要跳转外链时，只需你在 ```path``` 中填写合法的 url 路径，当你点击侧边栏时就会新开浏览器标签页打开

例如：
```javascript
{
  path: 'external-link',
  component: Layout,
  children: [
    {
      path: 'https://github.com/wenqiyun/nest-admin',
      meta: { title: '外链', "icon": 'link' }
    }
  ]
}
```
