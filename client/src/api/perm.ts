import http from '@/utils/http/index'
import { ResultData, ApiMethodContants } from '@/common/types/apiResult.type'

export interface PermApiResult {
  /** 后端 api url */
  path: string
  /** api method */
  method: string
  /** 当前 api 描述 */
  desc: string
}

export function getCurrUserPerms (): Promise<ResultData<Array<PermApiResult>>> {
  return http.request<ResultData<Array<PermApiResult>>>({
    url: '/perm/all',
    method: ApiMethodContants.GET
  })
}
