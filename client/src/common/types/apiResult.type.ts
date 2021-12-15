/** json 接口返回统一数据接口 */
export interface ListResultData<T> {
  list: Array<T>
  total: number
}

export interface ResultData<T> {
  code: number
  msg: string
  data: T | ListResultData<T>
}

export interface BaseResult {
  id?: string
  /** 创建时间 */
  createDate?: string | number
  /** 更新时间 */
  updateDate?: string | number
}

export interface Pagination {
  page: number
  size: number
}

export enum ApiMethodContants {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
