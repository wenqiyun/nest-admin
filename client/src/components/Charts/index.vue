<template>
  <div class="echart-container" :id="id" :style="styles"></div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

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
    const chart = ref()
    const initChart = () => {
      if (!props.options) return
      if (!chart.value) {
        chart.value = echarts.init(document.getElementById(id) as HTMLElement)
      }
      chart.value.setOption(props.options)
    }

    onMounted(() => {
      initChart()
    })

    onBeforeUnmount(() => {
      chart.value?.dispose()
    })

    return {
      id,
      styles
    }
  }
})
</script>
