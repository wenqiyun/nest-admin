<template>
  <div class="k-badge">
    <span :class="`badge badge__${props.type} is-dot`"></span>
    <span class="k-badge__content">
      <slot>{{ content }}</slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (val: string) => {
      return ['primary', 'success', 'warning', 'info', 'danger'].includes(val)
    }
  },
  content: {
    type: String,
    default: ''
  }
})
</script>
