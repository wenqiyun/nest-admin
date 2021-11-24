import http from '@/utils/request'
import config from '@/config/index'
import { ResultData, BaseResult, Pagination, ApiMethodContants, ListResultData } from '@/common/types/apiResult.type'
import { getRefreshToken } from '../utils/storage'

/** 返回用户类型 */
export interface UserApiResult extends BaseResult {
  /** 用户头像 */
  avatar?: string
  /** 账号 */
  account?: string
  /** 用户手机号 */
  phoneNum?: string
  /** 用户邮箱 */
  email?: string
  /** 用户状态 1-活动中 0-禁用 */
  status?: 0 | 1 | string
}

export interface ICreateOrUpdateUser extends UserApiResult {
  password?: string
}

export interface QueryUserList extends Pagination {
  /** 帐号，手机号，名称 */
  account?: string
  /** 用户是否可用 */
  status?: string | 0 | 1
  /** 角色id */
  roleId?: string
  /** 是否绑定当前角色 0-无， 1-绑定 */
  hasCurrRole?: 0 | 1
}

export interface UserLogin {
  account: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

export interface BindUserData {
  userIds: string[]
  roleId: string
  type: 'create' | 'cancel'
}

export function login (loginData: UserLogin): Promise<ResultData<LoginResult>> {
  return http.request<ResultData<LoginResult>>({
    url: `${config.api.baseUrl}/login`,
    method: ApiMethodContants.POST,
    data: loginData
  })
}

export function updateToken (): Promise<ResultData<LoginResult>> {
  return http.request({
    url: `${config.api.baseUrl}/update/token`,
    method: ApiMethodContants.POST,
    headers: { Authorization: 'Bearer ' + getRefreshToken() }
  })
}

export function getUserInfo (id?: string): Promise<ResultData<UserApiResult>> {
  return http.request<ResultData<UserApiResult>>({
    url: `${config.api.baseUrl}/user/one/info`,
    method: ApiMethodContants.GET,
    params: { id }
  })
}

export function getUserList (params: QueryUserList): Promise<ResultData<ListResultData<UserApiResult>>> {
  return http.request<ResultData<ListResultData<UserApiResult>>>({
    url: `${config.api.baseUrl}/user/list`,
    method: ApiMethodContants.GET,
    params
  })
}

export function updateUser (data: ICreateOrUpdateUser): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/user`,
    method: ApiMethodContants.PUT,
    data
  })
}

export function resetPassword (userId: string): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/user/password/reset/${userId}`,
    method: ApiMethodContants.PUT
  })
}

export function updateStatus (data: ICreateOrUpdateUser): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/user/status/change`,
    method: ApiMethodContants.PUT,
    data
  })
}

export function bindRoleUser (data: BindUserData): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/user/role/update`,
    method: ApiMethodContants.POST,
    data
  })
}

export function dowmloadUserTemplate () {
  return http.request({
    url: `${config.api.tmplDownloadUrl}/用户导入模板.xlsx`,
    method: ApiMethodContants.GET,
    responseType: 'blob'
  })
}
