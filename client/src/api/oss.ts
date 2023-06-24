import request from '@/utils/request'
import { type BaseResult, type Pagination, type ResultData, ApiMethodContants } from './base'

export interface OssApiResult extends BaseResult {
  // 文件路径
  url: string
  // 文件size
  size: number
  // 文件 mimetype
  type: string
  // 注释
  business: string

  userId: string

  userAccount: string

  createDate: string
}

export interface findOssList extends Pagination {
  startDay?: string

  endDay?: string
}

export function getFileList(params: findOssList): Promise<ResultData<OssApiResult>> {
  return request({
    url: '/oss/list',
    method: ApiMethodContants.GET,
    params
  })
}

export function fileUpload(data: FormData): Promise<ResultData<OssApiResult[]>> {
  return request({
    url: '/oss/upload',
    method: ApiMethodContants.POST,
    data
  })
}
