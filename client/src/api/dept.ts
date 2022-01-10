import http from '@/utils/request'
import config from '@/config/index'
import { BaseResult, ResultData, ApiMethodContants, Pagination } from '@/common/types/apiResult.type'

export const DeptTreeName = 'deptTree'

export interface DeptApiResult extends BaseResult {
  /** 父部门 id  */
  parentId: string
  /** 部门名称 */
  name: string
  /** 状态 */
  status: number
  /** 排序 */
  orderNum: number
  /** 部门负责人 */
  leader: string
  /** 备注 */
  remark: string,
  children?: DeptApiResult[]
}

export interface ICreateOrUpdateDept {
  id?: string
  parentId?: string
  name?: string
  status?: number
  orderNum?: number
  leader?: string
  remark?: string
  createDate?: Date | string
  children?: ICreateOrUpdateDept[]
}

/** 查询所有部门集合 */
export function getDeptList (): Promise<ResultData<DeptApiResult[]>> {
  return http.request<ResultData<DeptApiResult[]>>({
    url: `${config.api.baseUrl}/dept/list`,
    method: ApiMethodContants.GET
  })
}

/** 更新部门 */
export function updateDept (data: ICreateOrUpdateDept): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/dept`,
    method: ApiMethodContants.PUT,
    data
  })
}

/** 创建部门 */
export function createDept (data: ICreateOrUpdateDept): Promise<ResultData<DeptApiResult>> {
  return http.request<ResultData<DeptApiResult>>({
    url: `${config.api.baseUrl}/dept`,
    method: ApiMethodContants.POST,
    data
  })
}

/** 删除部门 */
export function deleteDept (id: string): Promise<ResultData<null>> {
  return http.request<ResultData<null>>({
    url: `${config.api.baseUrl}/dept/${id}`,
    method: ApiMethodContants.DELETE
  })
}
