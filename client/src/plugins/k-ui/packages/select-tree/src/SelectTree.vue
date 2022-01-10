<template>
  <el-select ref="selectRef" v-model="componentLabel" clearable @clear="handleClear">
    <el-option :value="componentValue" style="height: auto;padding: 0;">
      <el-tree
        ref="selectTreeRef"
        highlight-current
        :data="treeData"
        v-bind="treeOptions"
        @node-click="handleCheckChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'

export default defineComponent({
  name: 'KSelectTree',
  props: {
    modelValue: {
      type: [Number, String],
      required: true
    },
    treeData: {
      type: Array,
      default: () => [],
      required: true
    },
    treeOptions: {
      type: Object,
      default: () => ({ nodeKey: 'id', defaultExpandAll: true }),
      validate: (val: any) => {
        return !!val.nodeKey
      }
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // 下拉框绑定值（选中值的名字）
    const componentLabel = ref<any>('')
    // 实际选中的值
    const componentValue = ref<any>('')

    // 选择框清空事件
    const handleClear = () => {
      componentValue.value = ''
      componentLabel.value = ''
    }

    const selectTreeRef = ref()
    const selectRef = ref()
    const handleCheckChange = (data: any, node: any) => {
      const curr = data[props.treeOptions.nodeKey]
      if (componentValue.value === curr) {
        handleClear()
      } else {
        componentValue.value = curr
        componentLabel.value = node.label
      }
      emit('update:modelValue', componentValue.value)
      selectRef.value.blur()
    }
    // 设定初始值，如果存在
    watch(() => props.modelValue, (val: number | string) => {
      if (val !== componentValue.value) {
        nextTick(() => {
          const currNode = selectTreeRef.value.getNode(val)
          if (currNode) {
            componentValue.value = val
            selectTreeRef.value.setCurrentKey(val)
            componentLabel.value = currNode.label
          }
        })
      }
    }, { immediate: true })

    return {
      componentValue,
      componentLabel,
      selectTreeRef,
      selectRef,
      handleClear,
      handleCheckChange
    }
  }
})
</script>
