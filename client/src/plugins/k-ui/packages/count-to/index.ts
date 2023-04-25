import CountTo from './src/index.vue'
import './src/index.scss'
import type { App } from 'vue'

CountTo.name = 'KCountTo'

CountTo.install = (app: App) => {
  app.component(CountTo.name, CountTo)
}

export default CountTo
