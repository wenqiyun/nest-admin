<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup (props) {
    // computed
    const type = computed(() => isExternal(props.to) ? 'a' : 'router-link')

    // methods
    const linkProps = (to: string) => {
      return isExternal(props.to)
        ? {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
        : {
          to: to
        }
    }

    return {
      type,
      linkProps
    }
  }
})

</script>
