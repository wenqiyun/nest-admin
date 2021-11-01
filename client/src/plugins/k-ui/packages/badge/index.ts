import Badge from './src/index.vue'
import './src/index.scss'
import type { App } from 'vue'

Badge.install = (app: App): void => {
  app.component(Badge.name, Badge)
}

export default Badge
