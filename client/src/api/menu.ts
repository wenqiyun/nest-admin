import request from '@/utils/request'
import config from '@/config/index'
import { ApiMethodContants, type BaseResult, type ResultData } from './base'

export enum MenuTypeContants {
  MENU = 1,
  TAB = 2,
  BUTTON = 3
}

/** 接口返回菜单类型 */
export interface MenuApiResult extends BaseResult {
  /** 父级菜单id, 0 则表示是最上级菜单 */
  parentId: string
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
  menuId?: string
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
  children?: ICreateOrUpdateMenu[]
}

export function getAllMenu(hasBtn?: 0 | 1): Promise<ResultData<Array<MenuApiResult>>> {
  return request<ResultData<Array<MenuApiResult>>>({
    url: `${config.api.baseUrl}/menu/all`,
    method: ApiMethodContants.GET,
    params: { hasBtn: hasBtn || 0 }
  })
}

export function getMenuInfo(id: string): Promise<ResultData<MenuApiResult>> {
  return request<ResultData<MenuApiResult>>({
    url: `${config.api.baseUrl}/menu/one/${id}`,
    method: ApiMethodContants.GET
  })
}

export function getOneMenuBtns(id: string): Promise<ResultData<Array<MenuApiResult>>> {
  return request<ResultData<Array<MenuApiResult>>>({
    url: `${config.api.baseUrl}/menu/one/${id}/btns`,
    method: ApiMethodContants.GET
  })
}

export function getOneMenuPerms(id: string): Promise<ResultData<Array<MenuPermApiResult>>> {
  return request<ResultData<Array<MenuPermApiResult>>>({
    url: `${config.api.baseUrl}/menu/one/${id}/menu-perm`,
    method: ApiMethodContants.GET
  })
}

export function createMenu(data: ICreateOrUpdateMenu): Promise<ResultData<null>> {
  return request<ResultData<null>>({
    url: `${config.api.baseUrl}/menu`,
    method: ApiMethodContants.POST,
    data
  })
}

export function updateMenu(data: ICreateOrUpdateMenu): Promise<ResultData<null>> {
  return request<ResultData<null>>({
    url: `${config.api.baseUrl}/menu`,
    method: ApiMethodContants.PUT,
    data
  })
}

export function delMenu(id: string): Promise<ResultData<null>> {
  return request<ResultData<null>>({
    url: `${config.api.baseUrl}/menu/${id}`,
    method: ApiMethodContants.DELETE
  })
}
