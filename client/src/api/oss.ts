import http from '@/utils/http/index'
import { BaseResult, Pagination, ResultData, ApiMethodContants } from '../common/types/apiResult.type'

export interface OssApiResult extends BaseResult {
  // 文件路径
  url: string
  // 文件size
  size: string
  // 文件 mimetype
  type: string

  createDate: string
}

export function getFileList (params: Pagination): Promise<ResultData<OssApiResult>> {
  return http.request<ResultData<OssApiResult>>({
    url: '/oss/list',
    method: ApiMethodContants.GET,
    params
  })
}
