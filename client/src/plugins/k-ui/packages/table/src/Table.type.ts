import { PaginationProps } from 'element-plus'

export interface IPager {
  page: number,
  size: number
}

export interface ITableCallBack {
  (pager: IPager): unknown
}

export interface IIndexMethod {
  (index: number): number
}

// import type { ExtractPropTypes } from 'vue'

export interface IKTableProps<T> {
  mode?: 'config' | 'render',
  auto?: boolean,
  callack?: ITableCallBack,
  loading?: boolean,
  data?: {
    list: Array<T>,
    total: number
  },
  isPager?: boolean,
  pageNum?: number,
  pageSize?: number,
  pagination?: PaginationProps,
  columns?: Array<unknown>,
  selection?: boolean,
  index?: boolean,
  indexMethod?: IIndexMethod,
  indexLabel?: string
}
