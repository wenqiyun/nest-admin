// import Detail from './packages/detail/index.js'
import Badge from './packages/badge/index'
import Lazy from './packages/lazy/index'
import Table from './packages/table/index'
import Form from './packages/form/index'
import CountTo from './packages/count-to/index'
import type { App } from 'vue'

const components = [
  // Detail,
  Badge,
  Lazy,
  Table,
  Form,
  CountTo
]

const install = (app: App, opts = {}) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  version: '0.2.0',
  install,
  // Detail,
  Badge,
  Lazy,
  Table,
  Form,
  CountTo
}
