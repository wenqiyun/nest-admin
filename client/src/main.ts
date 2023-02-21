import { createApp } from 'vue'
import { createPinia } from 'pinia'
// load
import { loadSvg } from './icons'

import App from './App.vue'
import router from './router'

import 'normalize.css/normalize.css'
import './assets/main.css'

const app = createApp(App)
/** 加载全局 SVG */
loadSvg(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
