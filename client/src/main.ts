import { createApp } from 'vue'
import './registerServiceWorker'
import router from './router'

import ELementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import SvgIcon from '_c/SvgIcon/index.vue'

import './styles/index.scss'

import { store, key } from './store'
import App from './App.vue'

import './icons/index'
import './perm'

import KUI from './plugins/k-ui'

const app = createApp(App)

app.component('svg-icon', SvgIcon)

app.use(ELementPlus, {
  locale: zhCn,
  size: 'small'
}).use(store, key).use(router)

app.use(KUI)

app.mount('#app')
