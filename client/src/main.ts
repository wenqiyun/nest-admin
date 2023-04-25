import { createApp } from 'vue'

// load
import { loadSvg } from './icons'
import { loadDirectives } from './directive'

import App from './App.vue'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css'
import './styles/index.scss'

import './perm'

// 自己封装的一些组件
import KUI from './plugins/k-ui'

const app = createApp(App)
/** 加载全局 SVG */
loadSvg(app)
/** 挂载自定义指令 */
loadDirectives(app)

// 封装的一些组件，扩展 element-plus 等
app.use(KUI)

app.use(store).use(router).mount('#app')
