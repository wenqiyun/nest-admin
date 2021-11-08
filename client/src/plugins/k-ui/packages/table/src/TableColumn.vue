<template>
  <el-table-column :label="label" :prop="prop" :align="$attrs.align || 'center'" v-bind="$attrs">
    <template #default="{ row }">
      <div v-if="children.length === 0">{{ row[prop] || $attrs.default || '' }}</div>
      <TableColumn v-for="(child, i) in children" :key="`${child.label}_${i}`" v-bind="child"></TableColumn>
    </template>
  </el-table-column>
</template>

<script>
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
