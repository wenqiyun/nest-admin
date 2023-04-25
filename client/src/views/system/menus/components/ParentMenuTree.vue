<template>
  <el-dialog
    title="选择上级菜单"
    v-model="visible"
    top="5vh"
    width="350px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="box-bg-color" style="height: 70vh">
      <el-scrollbar>
        <el-tree
          :data="menuTree"
          highlight-current
          default-expand-all
          node-key="id"
          :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
          @node-click="checkedParent"
        >
          <template v-slot="{ data }">
            <el-radio :label="data.id" v-model="menuId">
              {{ data.name }}
            </el-radio>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, type Ref, inject, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from 'cm/contants'
import type { MenuApiResult } from '@/api/menu'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currParentId: {
    type: String,
    default: ''
  }
})

const children = inject<Ref<MenuApiResult[]>>('menuTree')
const menuTree = ref([{ id: '0', name: '顶级菜单（无上级）', children }])

const menuId = ref<string>('')
const checkedParent = (data: MenuApiResult) => {
  menuId.value = data.id as string
}

const confirmEvent = () => {
  emit('change', menuId.value)
  handleClose()
}

const visible = ref<boolean>(false)
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      menuId.value = props.currParentId || '0'
    }
  }
)
const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])
const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}
</script>

<style lang="scss" scoped></style>
