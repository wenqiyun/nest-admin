import http from '@/utils/request'
import config from '@/config/index'
import { BaseResult, ResultData, ApiMethodContants, Pagination } from '@/common/types/apiResult.type'

export interface PostApiResult extends BaseResult {
  /** 岗位编码 */
  code: string
  /** 岗位名称 */
  name: string
  /** 岗位状态 */
  status?: number
  /** 排序 */
  orderNum?: number
  /** 备注 */
  remark?: string
}

export interface ICreateOrUpdatePost {
  id?: string
  code: string
  name?: string
  status?: number
  orderNum?: number
  remark?: string
  createDate?: string | Date
}

export interface QueryPostList extends Pagination {
  code?: string
  name?: string
  status?: string
}

/** 获取岗位集合 */
export function getPostList (params: QueryPostList): Promise<ResultData<PostApiResult>> {
  return http.request<ResultData<PostApiResult>>({
    url: `${config.api.baseUrl}/post/list`,
    method: ApiMethodContants.GET,
    params
  })
}

/** 获取岗位详情 */
export function getPostInfo (id: string): Promise<ResultData<PostApiResult>> {
  return http.request<ResultData<PostApiResult>>({
    url: `${config.api.baseUrl}/post/${id}`,
    method: ApiMethodContants.GET
  })
}

/** 创建岗位 */
export function createPost (data: ICreateOrUpdatePost): Promise<ResultData<PostApiResult>> {
  return http.request<ResultData<PostApiResult>>({
    url: `${config.api.baseUrl}/post`,
    method: ApiMethodContants.POST,
    data
  })
}

/** 更新岗位 */
export function updatePost (data: ICreateOrUpdatePost): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/post`,
    method: ApiMethodContants.PUT,
    data
  })
}

/** 删除岗位 */
export function deletePost (id: string): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/post/${id}`,
    method: ApiMethodContants.DELETE
  })
}
