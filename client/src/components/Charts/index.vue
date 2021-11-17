<template>
  <div class="echart-container" :id="id" :style="styles"></div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

import debounce from 'debounce'

export default defineComponent({
  props: {
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
    }
  },
  setup (props) {
    const id = 'echarts_' + +Date.now() + Math.floor(Math.random() * 10000)

    const styles = computed<string>(() => {
      const width = typeof props.width === 'number' ? `${props.width}px` : props.width
      const height = typeof props.height === 'number' ? `${props.height}px` : props.height
      return `width: ${width};height: ${height}`
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
        chart = echarts.init(document.getElementById(id) as HTMLElement)
      }
      chart.clear()
      chart.setOption(props.options)
    }

    watch(() => props.options, () => {
      initChart()
    }, { deep: true })

    // 响应式
    const resize = debounce(() => {
      chart?.resize()
    }, 100)

    onMounted(() => {
      initChart()
      window.addEventListener('resize', resize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
      chart?.dispose()
    })

    return {
      id,
      styles
    }
  }
})
</script>

<style lang="scss" scoped>
.echart-container {
  background: #fff;
}
</style>
