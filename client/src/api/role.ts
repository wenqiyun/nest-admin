import request from '@/utils/request'
import { ApiMethodContants, type BaseResult, type ResultData } from './base'

import config from '@/config/index'

export interface QueryRoleList {
  name?: string
}

export interface RoleApiResult extends BaseResult {
  /** 角色名称 */
  name: string
  /** 角色备注信息 */
  remark: string
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

export function getRoleList(params?: QueryRoleList): Promise<ResultData<RoleApiResult[]>> {
  return request({
    url: `${config.api.baseUrl}/role/list`,
    method: ApiMethodContants.GET,
    ...{ params }
  })
}

export function getRolePerms(id: string): Promise<ResultData<string[]>> {
  return request({
    url: `${config.api.baseUrl}/role/one/${id}/perms`,
    method: ApiMethodContants.GET
  })
}

export function createRole(data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return request({
    url: `${config.api.baseUrl}/role`,
    method: ApiMethodContants.POST,
    data
  })
}

export function updateRole(data: ICreateOrUpdateRole): Promise<ResultData<RoleApiResult>> {
  return request({
    url: `${config.api.baseUrl}/role`,
    method: ApiMethodContants.PUT,
    data
  })
}

export function delRoleInfo(id: string): Promise<ResultData<null>> {
  return request({
    url: `${config.api.baseUrl}/role/${id}`,
    method: ApiMethodContants.DELETE
  })
}
