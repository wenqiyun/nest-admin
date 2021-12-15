<template>
  <div v-if="isExternalFlag" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"></div>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: '',
      required: false
    }
  },
  setup (props) {
    const { iconClass, className } = toRefs(props)
    const isExternalFlag = computed(() => isExternal(iconClass.value))
    const iconName = computed(() => `#icon-${iconClass.value}`)
    const svgClass = computed(() => className.value ? `svg-icon ${className.value}` : 'svg-icon')
    const styleExternalIcon = computed(() => {
      return {
        mask: `url(${iconClass.value}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${iconClass.value}) no-repeat 50% 50%`
      }
    })
    return {
      isExternalFlag,
      iconName,
      svgClass,
      styleExternalIcon
    }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
