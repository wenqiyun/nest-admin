<template>
  <div class="role-menu-tree-wrap">
    <el-scrollbar style="height: 100%">
      <el-tree
        ref="roleMenuTreeRef"
        :data="menuTree"
        :props="{ label: 'name' }"
        node-key="id"
        @check-change="hanldCheckChange"
        show-checkbox
        check-strictly
        default-expand-all
      ></el-tree>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType, watch, inject, type Ref } from 'vue'

import { UPDATE_MODEL_EVENT } from 'cm/contants'

import type { MenuApiResult } from '@/api/menu'
import { listToTree } from '@/utils/index'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => []
  }
})

const menuTree = ref<MenuApiResult[]>([])
const menuList = inject<Ref<MenuApiResult[]>>('menus', ref([]))
const roleMenuTreeRef = ref()

watch(
  () => menuList.value,
  () => {
    menuTree.value = listToTree(menuList.value, { root: '0', pidKey: 'parentId' })
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  () => {
    roleMenuTreeRef.value?.setCheckedKeys(props.modelValue, true)
  }
)

const emit = defineEmits([UPDATE_MODEL_EVENT])

const hanldCheckChange = () => {
  emit(UPDATE_MODEL_EVENT, roleMenuTreeRef.value.getCheckedKeys())
}
</script>

<style lang="scss" scoped>
.role-menu-tree-wrap {
  width: 320px;
  height: 500px;
  background: var(--el-fill-color-blank);
}
</style>
