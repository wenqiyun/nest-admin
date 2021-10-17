<template>
  <transition-group tag="div" :class="classes" :name="name">
    <div v-if="isInit" class="k-lazy__componet" key="component">
      <slot></slot>
    </div>
    <div v-else class="k-lazy__skeleton" key="skeleton">
      <slot name="skeleton"></slot>
    </div>
  </transition-group>
</template>

<script>
import { defineComponent } from 'vue'
// 组件依赖 IntersectionObserver API, 在较低版本的浏览器运行，需引入 IntersectionObserver API polyfill
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  require('intersection-observer')
}
export default defineComponent({
  name: 'KLazy',
  props: {
    // transition名称，用来定制动画
    name: {
      type: String,
      default: 'k-lazy'
    },
    // 适配父容器
    fit: Boolean,
    // 等待时间，如果指定了时间，不论可见与否，在指定时间之后自动加载
    timeout: Number,
    // 组件所在的视口，如果组件是在页面容器内滚动，视口就是该容器
    viewport: {
      type: typeof window !== 'undefined' ? window.HTMLElement : Object,
      default: () => {
        return null
      }
    },
    // 预加载阈值
    threshold: {
      type: [String, Number],
      default: 0
    },
    // 视口的滚动方向， vertical 代表垂直方向， horizontal 代表水平方向
    direction: {
      type: String,
      default: 'vertical',
      validator (val) {
        return ['vertical', 'horizontal'].includes(val)
      }
    },
    maxWaittingTime: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      isInit: false,
      io: null,
      timer: null
    }
  },
  computed: {
    classes () {
      return {
        'k-lazy': true,
        'is-fit': this.fit
      }
    }
  },
  created () {
    // 如果指定 timeout 则无论可见与否都是在 timeout 之后初始化
    if (this.timeout) {
      this.timer = setTimeout(() => {
        this.init()
      }, this.timeout)
    }
  },
  mounted () {
    if (this.timeout) return
    // 根据滚动方向来构造视口外边距，用于提前加载
    let rootMargin
    switch (this.direction) {
      case 'vertical':
        rootMargin = `${parseInt(this.threshold)}px 0px`
        break
      case 'horizontal':
        rootMargin = `0px ${parseInt(this.threshold)}px`
        break
    }
    try {
      // 观察视口与组件容器交叉情况
      this.io = new window.IntersectionObserver(this.intersectionHandler, {
        rootMargin,
        root: this.viewport,
        threshold: [0, Number.MIN_VALUE, 0.01]
      })
      this.io.observe(this.$el)
    } catch (e) {
      this.init()
    }
  },
  beforeUnmount () {
    // 在组件销毁前取消观察
    this.io && this.io.unobserve(this.$el)
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    // 交叉情况变化处理函数
    intersectionHandler (entries) {
      // 正在交叉 || 交叉率大于0
      if (entries[0].isIntersecting || entries[0].intersectionRatio > 0) {
        this.init()
        this.io.unobserve(this.$el)
      }
    },
    // 组件和骨架屏切换
    init () {
      // 由于函数会在主线程执行，加载懒加载组件非常耗时，容易卡顿
      // 所以在 requestAnimationFrame 回调中 延后执行
      this.requestAnimationFrame(() => {
        this.isInit = true
        // 开始加载懒加载模块，此时骨架屏开始消失
        this.$emit('init')
      })
    },
    requestAnimationFrame (callback) {
      // 防止等待台阶没有执行回调
      // 设置最大等待时间
      setTimeout(() => {
        if (this.isInit) return
        callback()
      }, this.maxWaittingTime)
      // 兼容不支持 requestAnimationFrame 的浏览器
      return (window.requestAnimationFrame || ((callback) => setTimeout(callback, 1000 / 60)))(callback)
    }
  }
})
</script>
