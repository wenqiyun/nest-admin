import type { PaginationProps } from 'element-plus'

// import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

export interface IPager {
  page: number
  size: number
}

export interface ITableCallBack {
  (pager: IPager): unknown
}

export interface IIndexMethod {
  (index: number): number
}

export interface IKTableColumn {
  label?: string
  align?: 'left' | 'right' | 'center'
  headerAlign?: 'left' | 'right' | 'center'
  prop?: string
  columnKey?: string
  width?: string | number
  minWidth?: string | number
  fixed?: true | 'left' | 'right'
  renderHeader?: any
  sortable?: boolean | 'custom'
  sortMethod?: any
  sortBy?: any
  sortOrders?: Array<any>
  resizable?: boolean
  formatter?: any
  className?: string
  labelClassName?: string
  selectable?: any
  reseveSelection?: boolean
  filters?: Array<any>
  filterPlacement?: string
  filterMultiple?: boolean
  filterMethod?: any
  filteredValue?: Array<any>
  slot?: boolean
  default?: string
  [prop: string]: any
}

export interface IKTableColumnSlot {
  row: any
  [prop: string]: any
}

export interface IKTableProps<T> {
  mode?: 'config' | 'render'
  auto?: boolean
  callack?: ITableCallBack
  loading?: boolean
  data: {
    list: Array<T>
    total?: number
  }
  isPager?: boolean
  pageNum?: number
  pageSize?: number
  pagination?: PaginationProps
  columns: IKTableColumn[]
  selection?: boolean
  index?: boolean
  indexMethod?: IIndexMethod
  indexLabel?: string
  [prop: string]: any
}
