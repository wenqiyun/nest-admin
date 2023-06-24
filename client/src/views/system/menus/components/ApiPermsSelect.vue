<template>
  <el-select
    v-model="currApiPerms"
    multiple
    collapse-tags
    clearable
    filterable
    :filter-method="filterEvent"
    popper-class="menu-apiperms-select"
    style="width: 250px"
    @change="handleChange"
  >
    <el-option
      v-for="api in apiPermList"
      :label="`${api.method} + ${api.path}`"
      :value="`${api.method},${api.path}`"
      :key="`${api.path}_${api.method}`"
      class="menu-apiperms-option"
    >
      <div>
        <div class="api-method-path">{{ api.method.toUpperCase() }} + {{ api.path }}</div>
        <div class="api-desc-content">{{ api.desc }}</div>
      </div>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue'

import { useUserStore } from '@/store/modules/user'
import { UPDATE_MODEL_EVENT } from 'cm/contants'

import type { PermApiResult } from '@/api/perm'

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const emit = defineEmits([UPDATE_MODEL_EVENT])
const apiPermList = ref<PermApiResult[]>([])
const filterEvent = (val: string) => {
  apiPermList.value = userStore.allApiPerms.filter((api) => {
    if (!val?.trim()) return true
    return `${api.path}_${api.method}_${api.desc}`.indexOf(val.trim()) > -1
  })
}
const userStore = useUserStore()
const getApiPermList = async () => {
  apiPermList.value = await userStore.getAllApiPerms()
}
getApiPermList()

const currApiPerms = ref<string[]>([])
watch(
  () => props.modelValue,
  () => {
    currApiPerms.value = JSON.parse(JSON.stringify(props.modelValue))
  }
)
const handleChange = (val: Array<string> = []) => {
  emit(UPDATE_MODEL_EVENT, val)
}
</script>

<style lang="scss" scoped>
.menu-apiperms-select {
  .api-method-path {
    color: #666;
  }

  .menu-apiperms-option {
    height: auto;

    &.selected .api-method-path {
      color: var(--el-color-primary);
    }
  }

  .api-desc-content {
    color: #999;
  }
}
</style>
