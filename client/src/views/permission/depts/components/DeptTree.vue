<template>
  <div class="dept-tree-wrapper">
    <el-scrollbar>
      <el-tree
        v-if="(deptTree || []).length > 0"
        highlight-current
        default-expand-all
        node-key="id"
        :data="deptTree"
        :props="{ label: 'name', children: 'children', disabled: 'disabled'}"
        @node-click="nodeClickEvent"
      ></el-tree>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import { DeptApiResult, DeptTreeName } from '@/api/dept'

export default defineComponent({
  emits: ['node-click'],
  setup (props, { emit }) {
    const deptTree = inject<Ref<DeptApiResult[]>>(DeptTreeName)

    const nodeClickEvent = (data: DeptApiResult) => {
      emit('node-click', data)
    }
    return {
      deptTree,
      nodeClickEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.dept-tree-wrapper {
  width: 200px;
  height: 100%;
  padding-bottom: 20px;
  background: #fff;
  overflow: hidden;
}
</style>
