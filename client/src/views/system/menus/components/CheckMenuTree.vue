<template>
  <el-dialog title="选择上级菜单" v-model="visible" top="5vh" width="350px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tree :data="menuTree" highlight-current default-expand-all node-key="id" :props="{ label: 'name' }" @node-click="checkedParent"></el-tree>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { MenuApiResult } from '@/api/menu'

export default defineComponent({
  name: 'CheckMenuTree',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup (props, { emit }) {
    // dialog 组件相关
    const visible = ref<boolean>(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })
    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }
    const children = inject<Ref<MenuApiResult>>('menuTree')
    const menuTree = ref([{ id: 0, name: '顶级菜单（无上级）', children: children }])
    const menuId = ref<number | string>('')
    const checkedParent = (data: MenuApiResult) => {
      menuId.value = data.id as number
    }

    const confirmEvent = () => {
      emit('change', menuId.value)
      handleClose()
    }

    return {
      visible,
      handleClose,
      menuTree,
      checkedParent,
      confirmEvent
    }
  }
})
</script>
