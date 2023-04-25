<template>
  <section class="k-table-container" v-loading="loading">
    <el-table ref="elTableRef" :data="list" v-bind="$attrs" style="width: 100%">
      <slot v-if="mode === 'render'"></slot>
      <template v-if="mode === 'config'">
        <!-- 多选列 -->
        <el-table-column type="selection" align="center" width="55" v-if="selection"></el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          :label="indexLabel"
          align="center"
          width="80"
          v-if="index"
          :index="indexMethodFn"
        ></el-table-column>
        <el-table-column
          v-bind="column"
          v-for="(column, index) in columns"
          :align="column.align || 'center'"
          :key="`${column.label}_${index}`"
        >
          <template #default="scope" v-if="!!column.slot">
            <slot :name="column.prop" v-bind="{ ...(scope as any), $index: indexMethodFn(index) }">{{
              (scope as any).row[column.prop]
            }}</slot>
          </template>
        </el-table-column>
      </template>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>

    <el-pagination
      v-if="isPager"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50, 100]"
      :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
      :total="total"
      background
      v-bind="pagination"
      @size-change="(size: number) => refreshData({ size, page: 1 })"
      @current-change="(page: number) => refreshData({ page })"
      class="k-pagination"
    >
    </el-pagination>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType } from 'vue'
// const methodArr = [
//   'clearSelection',
//   'toggleRowSelection',
//   'toggleAllSelection',
//   'toggleRowExpansion',
//   'setCurrentRow',
//   'clearSort',
//   'clearFilter',
//   'doLayout',
//   'sort'
// ]
export default defineComponent({
  name: 'KTable',
  // components: { TableColumn },
  props: {
    // 模式配置  render element 表格模式，封装了 分页组件
    // config data配置模式
    mode: {
      type: String,
      default: 'config',
      validator: (val: any) => {
        return ['config', 'render'].includes(val)
      }
    },
    auto: Boolean,
    callback: Function,
    loading: Boolean,
    data: {
      type: Object,
      default: () => {
        return {
          list: [],
          total: 0
        }
      }
    },
    isPager: {
      type: Boolean,
      default: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    selection: Boolean,
    index: Boolean,
    continuousIndex: {
      type: Boolean,
      default: true
    },
    indexMethod: Function,
    indexLabel: {
      type: String,
      default: '序号'
    }
  },
  inheritAttrs: false,
  setup(props) {
    // 默认值
    const list = computed(() =>
      props.data.list.map((v: any) => {
        if (props.mode === 'config') {
          props.columns.forEach((column) => {
            if ([null, undefined, ''].includes(v[column.prop])) {
              v[column.prop] = column.default || ''
            }
          })
        }
        return v
      })
    )
    const total = computed(() => props.data.total)
    const elTableRef = ref()
    // 分页逻辑
    const pager = ref({ page: props.pageNum, size: props.pageSize })
    // 刷新， 用户分页 / 暴露给父组件
    const refreshData = (newPager = {}) => {
      pager.value = { ...pager.value, ...newPager }
      props.callback && props.callback(pager.value)
    }
    // 初始化
    props.auto && props.callback && props.callback(pager.value)
    const indexMethodFn = (index: number) => {
      if (props.indexMethod) return props.indexMethod(index)
      if (!props.continuousIndex) return index + 1
      return (pager.value.page - 1) * pager.value.size + index + 1
    }

    return {
      list,
      total,
      pager,
      elTableRef,
      indexMethodFn,
      refreshData
    }
  }
})
</script>
