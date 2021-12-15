<template>
  <el-table-column :label="label" :prop="prop" :align="$attrs.align || 'center'" v-bind="$attrs">
    <template #default="{ row }">
      <div v-if="children.length === 0">{{ row[prop] || $attrs.default || '' }}</div>
      <TableColumn v-for="(child, i) in children" :key="`${child.label}_${i}`" v-bind="child"></TableColumn>
    </template>
  </el-table-column>
</template>

<script>
// 没用，封装后，在 el-table 中 使用 KTableColumn 非 props 属性 不生效
// 之后再找下原因，不使用这个，json 配置模式 不能使用多级表头
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TableColumn',
  props: {
    label: String,
    prop: String,
    children: {
      type: Array,
      default: () => []
    }
  }
})
</script>
