<template>
  <div class="echart-container" :class="classes" :id="id" :style="styles"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { computed, onBeforeUnmount, onMounted, watch, type HTMLAttributes, type PropType } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '400px'
  },
  options: {
    type: Object,
    required: true
  },
  classes: {
    type: [String, Object, Array] as PropType<HTMLAttributes>,
    default: ''
  }
})

const id = 'echarts_' + +Date.now() + Math.floor(Math.random() * 10000)

const styles = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return { height, width }
})
// echarts 实例接收只能使用 普通变量
// 不能使用 vue 实例属性 如
// const chart = ref<echarts.ECharts>()
// chart.value = echarts.init(document.getElementById(id) as HTMLElement)
// 这样会导致 部分 echarts 方法 不可使用，属性不存在等问题
let chart: echarts.ECharts
const initChart = () => {
  if (!props.options) return
  if (!chart) {
    chart = echarts.init(document.getElementById(id) as HTMLElement, undefined, {
      renderer: 'svg',
      useDirtyRect: true
    })
  }
  chart.clear()
  chart.setOption(props.options, false, true)
}

watch(
  () => props.options,
  () => {
    initChart()
  },
  { deep: true }
)

// 响应式
const resize = useDebounceFn(() => {
  chart?.resize()
}, 500)

onMounted(() => {
  // 增加延时器，解决切换页面时 echarts 图 width 没有占满的 bug
  const timeout = setTimeout(() => {
    initChart()
    window.addEventListener('resize', resize)
    clearTimeout(timeout)
  }, 500)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>
