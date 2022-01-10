import Badge from './packages/badge/index'
import CountTo from './packages/count-to/index'
import Form from './packages/form/index'
import Lazy from './packages/lazy/index'
import SelectTree from './packages/select-tree/index'
import Table from './packages/table/index'
import type { App } from 'vue'

const components = [
  Badge,
  CountTo,
  Form,
  Lazy,
  SelectTree,
  Table
]

const install = (app: App, opts = {}) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  version: '0.2.0',
  install,
  Badge,
  CountTo,
  Form,
  Lazy,
  SelectTree,
  Table
}
