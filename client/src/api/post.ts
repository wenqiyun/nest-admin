import request from '@/utils/request'
import { ApiMethodContants, type BaseResult, type Pagination, type ResultData } from './base'

export interface QueryPostList extends Pagination {
  name?: string
  code?: string
  status?: string | 0 | 1
}

export interface ICreateOrUpdatePost {
  id?: string
  name: string
  code?: string
  remark: string
  status?: 1 | 0
  orderNum: number
}

export interface PostApiResult extends BaseResult {
  code: string
  name: string
  status: 0 | 1
  remark: string
  orderNum: number
  createDate: string
}

/** 查询岗位列表 */
export function getPostList(params: QueryPostList): Promise<ResultData<PostApiResult>> {
  return request({
    url: '/post/list',
    method: ApiMethodContants.GET,
    params
  })
}

/** 创建岗位 */
export function createPost(data: ICreateOrUpdatePost): Promise<ResultData<null>> {
  return request({
    url: '/post',
    method: ApiMethodContants.POST,
    data
  })
}

/** 更新岗位 */
export function updatePost(data: ICreateOrUpdatePost): Promise<ResultData<null>> {
  return request({
    url: '/post',
    method: ApiMethodContants.PUT,
    data
  })
}

/** 删除岗位 */
export function deletePost(id: string): Promise<ResultData<null>> {
  return request({
    url: `/post/${id}`,
    method: ApiMethodContants.DELETE
  })
}

export function getPostDetail(id: string): Promise<ResultData<PostApiResult>> {
  return request({
    url: `/post/${id}`,
    method: ApiMethodContants.GET
  })
}
