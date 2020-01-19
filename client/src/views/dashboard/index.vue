<template>
  <div>
    <br>
    <h3>项目介绍</h3>
    <ul>
      <li>k-admin权限管理系统，是基于nodejs打造出的一站式RBAC管理平台</li>
      <li>
        前端使用&nbsp;
        <a style="color: #0366d6;" target="_blank" href="https://github.com/PanJiaChen/vue-element-admin">vue-element-admin</a>
        &nbsp;模板开发,后端使用&nbsp;
        <a style="color: #0366d6;" target="_blank" href="https://nestjs.com/">nestjs</a>
        &nbsp;<a style="color: #0366d6;" target="_blank" href="https://typeorm.io/">typeorm</a>&nbsp;mysql 等开发
      </li>
      <li>优秀的菜单功能权限，前端可灵活控制页面及按钮展示，后端可对未授权的请求进行拦截</li>
      <li>当前已有功能：用户管理，角色管理，部门管理，菜单管理，文件管理</li>
    </ul>
    <br><br>
    <h3>下一步计划</h3>
    <ul>
      <li>更好的系统日志</li>
      <li>新增角色时，角色权限只能是创建者权限的子集，有效防止权限越权</li>
      <li>部门可选绑定角色</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
    padding: 10px 40px 10px;
}
li {
    list-style-type: decimal;
    padding-left: 2px;
    line-height: 1.6;
}
</style>
