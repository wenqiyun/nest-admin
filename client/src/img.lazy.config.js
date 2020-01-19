import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

import loading from '@/assets/img-loading.png'
import error from '@/assets/img-load-error.png'

// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error,
  loading,
  attempt: 1
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  // listenEvents: [ 'scroll' ]
})

export default VueLazyload
