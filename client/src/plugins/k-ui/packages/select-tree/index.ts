import SelectTree from './src/SelectTree.vue'
import type { App } from 'vue'

SelectTree.install = (app: App): void => {
  app.component(SelectTree.name, SelectTree)
}

export default SelectTree
