<template>
  <el-select v-model="currApiPerms" popper-class="menu-apiperms-select" multiple collapse-tags filterable :filter-method="filterApiPerms" @change="handleChange" style="width: 250px;">
    <el-option v-for="api in apiPerms" :label="`${api.method} + ${ api.path }`" :value="`${api.method},${api.path}`" :key="`${api.path}_${api.method}`" class="menu-apiperms-option">
      <div class="api-method-path">{{ api.method.toUpperCase() }} + {{ api.path }}</div>
      <div class="api-desc-content">{{ api.desc }}</div>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { PermApiResult } from '@/api/perm'
import { useStore } from '@/store'
import { UserActionContants } from '@/store/modules/user'
import { defineComponent, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/common/contants'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: [UPDATE_MODEL_EVENT],
  setup (props, { emit }) {
    // api perms
    const store = useStore()
    const apiPerms = ref<Array<PermApiResult>>()
    const apiPermsTmp: Array<PermApiResult> = []
    const getApiPerms = async () => {
      apiPerms.value = await store.dispatch(UserActionContants.GET_ALL_API_PERMS)
      apiPermsTmp.push(...(apiPerms.value as Array<PermApiResult>))
    }
    getApiPerms()
    // 输入过滤
    const filterApiPerms = (value = '') => {
      const val = value.trim().toUpperCase()
      if (!value) {
        apiPerms.value = JSON.parse(JSON.stringify(apiPermsTmp))
        return
      }
      apiPerms.value = apiPermsTmp.filter(api => {
        return `${api.method}_${api.path}_${api.desc}`.toUpperCase().indexOf(val) > -1
      })
    }

    const currApiPerms = ref<Array<string>>([])
    watch(() => props.modelValue as Array<string>, (val: Array<string> = []) => {
      currApiPerms.value = val
    })

    const handleChange = (val: Array<string> = []) => {
      emit(UPDATE_MODEL_EVENT, val)
    }

    return {
      currApiPerms,
      apiPerms,
      handleChange,
      filterApiPerms
    }
  }
})
</script>
