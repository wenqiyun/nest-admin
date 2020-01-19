import request from '@/utils/request.js'

// ---------------   菜单管理   ---------------------- //
/**  得到所有菜单 */
export function getMenuList () {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

export function getMenuNoBtnsList () {
  return request({
    url: '/menu/list/nobtns',
    method: 'get'
  })
}

/** 查询菜单下所有按钮 */
export function getBtnList (menuId) {
  return request({
    url: `/menu/${menuId}/btns`,
    method: 'get'
  })
}

/** 查询按钮详情 */
export function getBtnInfo (btnId) {
  return request({
    url: `/menu/${btnId}`,
    method: 'get'
  })
}

/** 更新菜单 */
export function updateMenu (data) {
  return request({
    url: '/menu',
    method: 'put',
    data
  })
}

/** 创建菜单 or 按钮 */
export function createMenu (data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

/** 删除菜单 or 按钮 */
export function delMenu (id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

// ------------------ 文件管理 oss ------------------------- //
export function getFileList (params) {
  return request({
    url: '/oss/list',
    method: 'get',
    params
  })
}

export function delFile (id) {
  return request({
    url: `/oss/${id}`,
    method: 'delete'
  })
}
