import http from '@/utils/http/index'
import { BaseResult, ResultData, ApiMethodContants } from '@/common/types/apiResult.type'

export enum MenuTypeContants {
  MENU = 1,
  TAB = 2,
  BUTTON = 3
}

/** 接口返回菜单类型 */
export interface MenuApiResult extends BaseResult {
  /** 父级菜单id, 0 则表示是最上级菜单 */
  parentId: string | number
  /** 菜单名称 */
  name: string
  /** 菜单唯一标识，与前端 路由标识 name 保持一致， 做权限对比用 */
  code: string
  /** 菜单类型 1-菜单 2-tabs 3-按钮 */
  type: string | 1 | 2 | 3
  /** 排序，只涉及到后端菜单排序，与前端路由无关 */
  orderNum?: string | number
  /** 子级菜单集合 */
  children?: Array<MenuApiResult>
}

export interface MenuPermApiResult extends BaseResult {
  menuId?: number
  apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  apiUrl: string
}

export interface ICreateOrUpdateMenu {
  id?: string | number
  parentId?: string | number
  name?: string
  code?: string
  type?: string | 1 | 2 | 3
  orderNum?: string | number
  menuPermList?: Array<MenuPermApiResult>
}

export function getAllMenu (hasBtn?: 0 | 1): Promise<ResultData<Array<MenuApiResult>>> {
  return http.request<ResultData<Array<MenuApiResult>>>({
    url: '/menu/all',
    method: ApiMethodContants.GET,
    params: { hasBtn: hasBtn || 0 }
  })
}

export function getMenuInfo (id: number): Promise<ResultData<MenuApiResult>> {
  return http.request<ResultData<MenuApiResult>>({
    url: `/menu/one/${id}`,
    method: ApiMethodContants.GET
  })
}

export function getOneMenuBtns (id: number): Promise<ResultData<Array<MenuApiResult>>> {
  return http.request<ResultData<Array<MenuApiResult>>>({
    url: `/menu/one/${id}/btns`,
    method: ApiMethodContants.GET
  })
}

export function getOneMenuPerms (id: number): Promise<ResultData<Array<MenuPermApiResult>>> {
  return http.request<ResultData<Array<MenuPermApiResult>>>({
    url: `/menu/one/${id}/menu-perm`
  })
}

export function createMenu (data: ICreateOrUpdateMenu): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: '/menu',
    method: ApiMethodContants.POST,
    data
  })
}

export function updateMenu (data: ICreateOrUpdateMenu): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: '/menu',
    method: ApiMethodContants.PUT,
    data
  })
}

export function delMenu (id: number): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `/menu/${id}`,
    method: ApiMethodContants.DELETE
  })
}
