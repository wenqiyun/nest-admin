// import Detail from './packages/detail/index.js'
import Badge from './packages/badge/index'
// import Lazy from './packages/lazy/index.js'
import Table from './packages/table/index'
import type { App } from 'vue'

// import Form from './packages/form/index.js'

const components = [
  // Detail,
  Badge,
  // Lazy,
  Table
  // Form
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
  // Lazy,
  Table
  // Form
}
