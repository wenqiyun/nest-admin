import http from '@/utils/request'
import config from '@/config/index'
import { BaseResult, Pagination, ResultData, ApiMethodContants } from '../common/types/apiResult.type'

export interface OssApiResult extends BaseResult {
  // 文件路径
  url: string
  // 文件size
  size: string
  // 文件 mimetype
  type: string
  // 注释
  business: string

  userId: string

  userAccount: string

  createDate: string
}

export function getFileList (params: Pagination): Promise<ResultData<OssApiResult>> {
  return http.request<ResultData<OssApiResult>>({
    url: `${config.api.baseUrl}/oss/list`,
    method: ApiMethodContants.GET,
    params
  })
}

export function fileUpload (data: FormData): Promise<ResultData<OssApiResult[]>> {
  return http.request<ResultData<OssApiResult[]>>({
    url: `${config.api.baseUrl}/oss/upload`,
    method: ApiMethodContants.POST,
    data
  })
}
