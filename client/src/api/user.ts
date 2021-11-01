import http from '@/utils/http/index'
import { ResultData, BaseResult, Pagination, ApiMethodContants, ListResultData } from '@/common/types/apiResult.type'

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
  roleId?: number
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
  userIds: number[]
  roleId: number
  type: 'create' | 'cancel'
}

export function login (loginData: UserLogin): Promise<ResultData<LoginResult>> {
  return http.request<ResultData<LoginResult>>({
    url: '/login',
    method: ApiMethodContants.POST,
    data: loginData
  })
}

export function getUserInfo (id: number): Promise<ResultData<UserApiResult>> {
  return http.request<ResultData<UserApiResult>>({
    url: `/user/one/${id}`,
    method: ApiMethodContants.GET
  })
}

export function getUserList (params: QueryUserList): Promise<ResultData<ListResultData<UserApiResult>>> {
  return http.request<ResultData<ListResultData<UserApiResult>>>({
    url: '/user/list',
    method: ApiMethodContants.GET,
    params
  })
}

export function updateUser (data: ICreateOrUpdateUser): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: '/user',
    method: ApiMethodContants.PUT,
    data
  })
}

export function resetPassword (userId: number): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `/user/password/reset/${userId}`,
    method: ApiMethodContants.PUT
  })
}

export function updateStatus (data: ICreateOrUpdateUser): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: '/user/status/change',
    method: ApiMethodContants.PUT,
    data
  })
}

export function bindRoleUser (data: BindUserData): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: '/user/role/update',
    method: ApiMethodContants.POST,
    data
  })
}
