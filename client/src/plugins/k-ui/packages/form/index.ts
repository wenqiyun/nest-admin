import Form from './src/index.vue'
import type { App } from 'vue'

Form.install = (app: App): void => {
  app.component(Form.name, Form)
}

export default Form
