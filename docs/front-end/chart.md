#### 图表

管理后台图表是非常常见的需求，本项目的图表组件使用的是 ```echarts``` 。

本项目简单封装了 ```echarts``` ，大部分插件建议大家自己用 vue 封装，还是比较简单的。下面是一个封装的例子

> [!TIP]
> 因为 Echarts 初始化必须绑定 dom ，所以我们只能在 vue 的 mounted 生命周期里进行初始化

```javascript
<template>
  <div class="echart-container" :id="id" :style="styles"></div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, watch } from 'vue'
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

    // 响应式， 当前 窗口改变大小时， 图表跟着 自适应
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

```
> [!WARNING]
> Echarts 实例接收只能使用普通变量,不能使用 vue 实例属性，会导致部分 echarts 方法不可使用，属性不存在等问题。

#### 其他
当然社区里的其他图表如 [d3](https://d3js.org/) , [Chart.js](https://www.chartjs.org/) , [G2](https://antv.vision) 等封装方法都是大同小异差不多的，这里就不展开了。
