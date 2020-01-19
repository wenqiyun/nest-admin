import request from '@/utils/request.js'

// ------------------------    用户管理     ------------------------------ //

/** 查询用户列表 */
export function getUserList (params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/** 查询用户详情 */
export function getUserInfo (id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

/** 更新用户信息 */
export function updateUserInfo (data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

/** 禁用用户， 伪删除 */
export function updateUserStatus (id, status) {
  return request({
    url: `/user/${id}/${status}`,
    method: 'put'
  })
}

/** 查询当前角色没有关联的用户列表 */
export function getUserListNotInRoleId (params) {
  return request({
    url: '/user/list/notRole',
    method: 'get',
    params
  })
}

/** 创建用户角色关联 */
export function createUserRoleRelation (data) {
  return request({
    url: '/user/role',
    method: 'post',
    data
  })
}

/** 取消角色用户关联 */
export function cancelUserRoleRelation (id) {
  return request({
    url: `/user/role/${id}`,
    method: 'delete'
  })
}

// ------------------------    部门管理     ------------------------------ //
/** 查询所有部门 */
export function getDeptList () {
  return request({
    url: '/dept/list',
    method: 'get'
  })
}

/** 添加部门/ 更新部门 */
export function createDept (data) {
  return request({
    url: '/dept',
    method: 'post',
    data
  })
}

/** 更新部门 */
export function updateDept (data) {
  return request({
    url: '/dept',
    method: 'put',
    data
  })
}

/** 删除部门 */
export function delDept (id) {
  return request({
    url: `/dept/${id}`,
    method: 'delete'
  })
}

// ------------------------    角色管理     ------------------------------ //
/** 查询角色列表 */
export function getRoleList (params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

/** 查询所有角色 */
export function getRoleAllList () {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

/** 查询角色详情 */
export function getRoleInfo (id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

/** 创建角色 */
export function createRole (data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

/** 更新角色 */
export function updateRole (data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

/** 删除角色 */
export function delRole (id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
