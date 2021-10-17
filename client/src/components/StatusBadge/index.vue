<template>
  <div class="status-badge-wrapper">
    <span :class="`badge badge__${type} is-dot`"></span>
    <span class="status-badge__content">{{ content }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
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
  }
})
</script>

<style lang="scss" scoped>
$color-primary: #409EFF !default;
$color-success: #67C23A !default;
$color-warning: #E6A23C !default;
$color-danger: #F56C6C !default;
$color-info: #909399 !default;

.status-badge-wrapper {
  display: inline-block;
  line-height: 1.5;

  .badge {
    display: inline-block;

    &__primary {
      background-color: $color-primary;
    }
    &__success {
      background-color: $color-success;
    }
    &__warning {
      background-color: $color-warning;
    }
    &__danger {
      background-color: $color-danger;
    }
    &__info {
      background-color: $color-info;
    }
  }

  .is-dot {
    height: 10px;
    width: 10px;
    padding: 0;
    right: 0;
    border-radius: 50%;
  }

  .status-badge__content {
    margin-left: 8px;
  }
}
</style>
