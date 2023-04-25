import request from '@/utils/request'
import config from '@/config/index'
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
    url: `${config.api.baseUrl}/oss/list`,
    method: ApiMethodContants.GET,
    params
  })
}

export function fileUpload(data: FormData): Promise<ResultData<OssApiResult[]>> {
  return request({
    url: `${config.api.baseUrl}/oss/upload`,
    method: ApiMethodContants.POST,
    data
  })
}
