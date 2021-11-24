import { createApp } from 'vue'
import './registerServiceWorker'
import router from './router'

import ELementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// import * as ElIconModules from '@element-plus/icons'

import SvgIcon from '_c/SvgIcon/index.vue'

import './styles/index.scss'

import permDirective from './directive/perm'

import { store, key } from './store'
import App from './App.vue'

import './icons/index'
import './perm'
// 自己封装的一些组件
import KUI from './plugins/k-ui'

const app = createApp(App)

app.directive('perm', permDirective)

app.component('svg-icon', SvgIcon)

app.use(ELementPlus, {
  locale: zhCn,
  size: 'small'
}).use(store, key).use(router)

// for (const iconName in ElIconModules) {
//   app.component(`${iconName}`, ElIconModules[iconName])
// }

app.use(KUI)

app.mount('#app')
