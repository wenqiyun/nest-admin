import Table from './src/Table.vue'
import './src/index.scss'
import type { App } from 'vue'

Table.install = (app: App): void => {
  app.component(Table.name, Table)
}

export default Table
