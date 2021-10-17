<template>
  <el-tree ref="roleMenuTreeRef" :data="menuTree" node-key="id" :props="{ label: 'name' }" @check-change="hanldCheckChange" show-checkbox check-strictly></el-tree>
</template>

<script lang="ts">
import { MenuApiResult } from '@/api/menu'
import { arrToTree } from '@/utils'
import { defineComponent, inject, Ref, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/common/contants'

interface IRoleMenuTreeCheckedKeys {
  checkedKeys: number[]
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: [UPDATE_MODEL_EVENT],
  setup (props, { emit }) {
    const menuTree = ref<Array<MenuApiResult>>([])
    // 从页面组件中拿取所拥有的菜单
    const menuList = inject<Ref<Array<MenuApiResult>>>('menus', ref([]))
    watch(() => menuList.value, (val) => {
      menuTree.value = arrToTree(val, { pidKey: 'parentId' }) as MenuApiResult[]
    }, { immediate: true })

    const roleMenuTreeRef = ref()
    watch(() => props.modelValue as number[], (val: number[]) => {
      roleMenuTreeRef.value && roleMenuTreeRef.value.setCheckedKeys(val, true)
    })

    const hanldCheckChange = () => {
      emit(UPDATE_MODEL_EVENT, roleMenuTreeRef.value.getCheckedKeys())
    }

    return {
      menuTree,
      roleMenuTreeRef,
      hanldCheckChange
    }
  }
})
</script>
