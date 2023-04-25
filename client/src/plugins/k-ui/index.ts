import type { App } from 'vue'

import Badge from './packages/badge/index'
import CountTo from './packages/count-to/index'
import Table from './packages/table/index'

const components = [CountTo, Table, Badge]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export default {
  version: '0.2.0',
  install,
  Badge,
  CountTo,
  Table
}

export type { IKTableProps, IKTableColumn, IIndexMethod, ITableCallBack } from './packages/table/index'
