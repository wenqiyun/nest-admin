import http from '@/utils/request'
import config from '@/config/index'
import { BaseResult, Pagination, ResultData, ApiMethodContants } from '@/common/types/apiResult.type'

export interface QueryRoleList {
 name?: string
}

export interface RoleApiResult extends BaseResult {
  /** 角色名称 */
  name: string
  /** 角色备注信息 */
  remark: string,
  roleMenuList?: []
}

export interface ICreateOrUpdateRole {
  id?: string
  // 角色名称
  name?: string
  // 角色备注
  remark?: string
  // 菜单id
  menuIds?: string[]
}

export function getRoleList (params?: QueryRoleList): Promise<ResultData<RoleApiResult[]>> {
  return http.request<ResultData<RoleApiResult[]>>({
    url: `${config.api.baseUrl}/role/list`,
    method: ApiMethodContants.GET,
    ...{ params }
  })
}

export function getRolePerms (id: string): Promise<ResultData<Array<string>>> {
  return http.request<ResultData<Array<string>>>({
    url: `${config.api.baseUrl}/role/one/${id}/perms`,
    method: ApiMethodContants.GET
  })
}

export function createRole (data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return http.request<ResultData<RoleApiResult>>({
    url: `${config.api.baseUrl}/role`,
    method: ApiMethodContants.POST,
    data
  })
}

export function updateRole (data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return http.request<ResultData<RoleApiResult>>({
    url: `${config.api.baseUrl}/role`,
    method: ApiMethodContants.PUT,
    data
  })
}

export function delRoleInfo (id: string): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/role/${id}`,
    method: ApiMethodContants.DELETE
  })
}
