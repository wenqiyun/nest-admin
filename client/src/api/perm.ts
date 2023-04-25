import request from '@/utils/request'
import config from '@/config/index'
import { ApiMethodContants, type ResultData } from './base'
import type { MenuApiResult } from './menu'

export interface PermApiResult {
  /** 后端 api url */
  path: string
  /** api method */
  method: string
  /** 当前 api 描述 */
  desc: string
}
/** 获取 app 所有路由  */
export function getAllApiPerms(): Promise<ResultData<PermApiResult[]>> {
  return request<ResultData<PermApiResult[]>>({
    url: `${config.api.baseUrl}/perm/all`,
    method: ApiMethodContants.GET
  })
}

/** 获取当前用户权限菜单 */
export function getCurrUserMenuPerms(): Promise<ResultData<MenuApiResult[]>> {
  return request<ResultData<MenuApiResult[]>>({
    url: `${config.api.baseUrl}/perm/menu`,
    method: ApiMethodContants.GET
  })
}
