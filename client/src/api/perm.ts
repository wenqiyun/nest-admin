import http from '@/utils/request'
import config from '@/config/index'
import { ResultData, ApiMethodContants } from '@/common/types/apiResult.type'
import { MenuApiResult } from './menu'

export interface PermApiResult {
  /** 后端 api url */
  path: string
  /** api method */
  method: string
  /** 当前 api 描述 */
  desc: string
}

export function getAllApiPerms (): Promise<ResultData<Array<PermApiResult>>> {
  return http.request<ResultData<Array<PermApiResult>>>({
    url: `${config.api.baseUrl}/perm/all`,
    method: ApiMethodContants.GET
  })
}

export function getCurrUserMenuPerms (): Promise<ResultData<MenuApiResult[]>> {
  return http.request<ResultData<MenuApiResult[]>>({
    url: `${config.api.baseUrl}/perm/menu`,
    method: ApiMethodContants.GET
  })
}
