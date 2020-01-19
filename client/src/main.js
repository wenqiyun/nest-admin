import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'

import App from './App.vue'

import router from './router'
import store from './store'

import './icons' // icon
import './permission'

import './directive'
import * as filters from './filters'

import './img.lazy.config.js' // 懒加载
import hasPermission from './utils/permission-check.js'

Vue.prototype.hasPermission = hasPermission // 使用权限判断

Vue.use(Element, {
  size: sessionStorage.getItem('size') || 'small' // set element-ui default size
}) // 懒加载

// 注册全局 filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
