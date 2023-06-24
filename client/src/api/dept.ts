import request from '@/utils/request'
import { ApiMethodContants, type BaseResult, type ResultData } from './base'

export interface ICreateOrUpdateDept {
  id?: string
  parentId: string
  name: string
  leader: string
  remark: string
  orderNum: number
}

export interface DeptApiResult extends BaseResult {
  name: string
  parentId: string
  status: 0 | 1
  leader: string
  remark: string
  orderNum: number
}

export function getDeptList(): Promise<ResultData<DeptApiResult[]>> {
  return request({
    url: '/dept/list',
    method: ApiMethodContants.GET
  })
}

export function createDept(data: ICreateOrUpdateDept): Promise<ResultData<null>> {
  return request({
    url: '/dept',
    method: ApiMethodContants.POST,
    data
  })
}

export function updateDept(data: ICreateOrUpdateDept): Promise<ResultData<null>> {
  return request({
    url: '/dept',
    method: ApiMethodContants.PUT,
    data
  })
}

export function deleteDept(id: string): Promise<ResultData<null>> {
  return request({
    url: `/dept/${id}`,
    method: ApiMethodContants.DELETE
  })
}
