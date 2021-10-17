import http from '@/utils/http/index'
import { BaseResult, Pagination, ResultData, ApiMethodContants } from '@/common/types/apiResult.type'

export interface QueryRoleList extends Pagination {
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
  id?: number
  // 角色名称
  name?: string
  // 角色备注
  remark?: string
  // 菜单id
  menuIds?: number[]
}

export function getRoleList (params: QueryRoleList): Promise<ResultData<RoleApiResult>> {
  return http.request<ResultData<RoleApiResult>>({
    url: '/role/list',
    method: ApiMethodContants.GET,
    params
  })
}

export function getRolePerms (id: number): Promise<ResultData<Array<number>>> {
  return http.request<ResultData<Array<number>>>({
    url: `/role/one/${id}/perms`,
    method: ApiMethodContants.GET
  })
}

export function createRole (data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return http.request<ResultData<RoleApiResult>>({
    url: '/role',
    method: ApiMethodContants.POST,
    data
  })
}

export function updateRole (data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return http.request<ResultData<RoleApiResult>>({
    url: '/role',
    method: ApiMethodContants.PUT,
    data
  })
}

export function delRoleInfo (id: number): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `/role/${id}`,
    method: ApiMethodContants.DELETE
  })
}
