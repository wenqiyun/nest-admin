<template>
  <div class="k-count-to">
    <slot name="left"></slot>
    <div class="k-count-to__outer">
      <span :class="['k-count-to__text', props.countClass]" :id="counterId">{{ init }}</span>
      <i :class="['k-count-to__unit—text', unitClass]">{{ unitText }}</i>
    </div>
    <slot name="right"></slot>
  </div>
</template>

<script lang="ts" setup>
import { CountUp } from 'countup.js'
import { ref, type PropType, onMounted, watch } from 'vue'

const props = defineProps({
  init: {
    type: Number,
    default: 0
  },
  /**
   * @description 起始值，即动画开始前显示的数值
   */
  startVal: {
    type: Number,
    default: 0
  },
  /**
   * @description 结束值，即动画结束后显示的数值
   */
  end: {
    type: Number,
    required: true
  },
  /**
   * @description 保留几位小数
   */
  decimals: {
    type: Number,
    default: 0
  },
  /**
   * @description 分隔整数和小数的符号，默认是小数点
   */
  decimal: {
    type: String,
    default: '.'
  },
  /**
   * @description 动画持续的时间，单位是秒
   */
  duration: {
    type: Number,
    default: 2
  },
  /**
   * @description 动画延迟开始的时间，单位是秒
   */
  delay: {
    type: Number,
    default: 0
  },
  /**
   * @description 是否禁用easing动画效果
   */
  uneasing: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否使用分组，分组后每三位会用一个符号分隔
   */
  usegroup: {
    type: Boolean,
    default: false
  },
  /**
   * @description 用于分组(usegroup)的符号
   */
  separator: {
    type: String,
    default: ','
  },
  // /**
  //  * @description 是否简化显示，设为true后会使用unit单位来做相关省略
  //  */
  simplify: {
    type: Boolean,
    default: false
  },
  /**
   * @description 自定义单位，如[3, 'K+'], [6, 'M+']即大于3位数小于6位数的用k+来做省略
   *              1000即显示为1K+
   */
  unit: {
    type: Array as PropType<Array<Array<number | string>>>,
    default: () => [
      [3, 'K+'],
      [6, 'M+'],
      [9, 'B+']
    ]
  },
  countClass: {
    type: String,
    default: ''
  },
  unitClass: {
    type: String,
    default: ''
  }
})

const counterId = ref<string>('count_to_' + +new Date() + Math.random())
const counter = ref()
const unitText = ref('')
const getHandleVal = (val: number, len: number) => {
  return {
    endVal: parseInt(String(val / Math.pow(10, props.unit[len - 1][0] as number))),
    unitText: props.unit[len - 1][1] as string
  }
}

const transformValue = (val: number) => {
  const len = props.unit.length
  let res = {
    endVal: 0,
    unitText: ''
  }
  if (val < Math.pow(10, props.unit[0][0] as number)) res.endVal = val
  else {
    for (let i = 1; i < len; i++) {
      if (val >= Math.pow(10, props.unit[i - 1][0] as number) && val < Math.pow(10, props.unit[i][0] as number)) res = getHandleVal(val, i)
    }
  }
  if (val > Math.pow(10, props.unit[len - 1][0] as number)) res = getHandleVal(val, len)
  return res
}

const getValue = (val: number) => {
  let res = 0
  if (props.simplify) {
    const endValAndunitText = transformValue(val)
    unitText.value = endValAndunitText.unitText
    res = endValAndunitText.endVal
  } else {
    res = val
  }
  return res
}

onMounted(() => {
  const endVal = getValue(props.end)
  counter.value = new CountUp(counterId.value, endVal, {
    decimalPlaces: props.decimals,
    duration: props.duration,
    startVal: props.startVal,
    useEasing: !props.uneasing,
    useGrouping: props.usegroup,
    separator: props.separator,
    decimal: props.decimal
  })
  setTimeout(() => {
    if (!counter.value.error) counter.value.start()
  }, props.delay)
})

watch(
  () => props.end,
  (val) => {
    const endVal = getValue(val)
    counter.value.update(endVal)
  }
)
</script>
