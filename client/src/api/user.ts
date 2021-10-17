import http from '@/utils/http/index'
import { ResultData, BaseResult, Pagination, ApiMethodContants } from '@/common/types/apiResult.type'

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
  account?: string
  status?: number | string
}

export interface UserLogin {
  account: string
  password: string
}

export function login (loginData: UserLogin): Promise<ResultData<string>> {
  return http.request<ResultData<string>>({
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

export function getUserList (params: QueryUserList): Promise<ResultData<UserApiResult>> {
  return http.request<ResultData<UserApiResult>>({
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
