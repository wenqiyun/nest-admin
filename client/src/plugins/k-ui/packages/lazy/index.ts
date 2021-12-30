import Lazy from './src/index.vue'
import './src/index.scss'
import type { App } from 'vue'

Lazy.install = (app: App): void => {
  app.component(Lazy.name, Lazy)
}

export default Lazy
