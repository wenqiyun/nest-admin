<template>
  <div class="k-table-container">
    <el-table ref="elTableRef" :data="list" v-bind="$attrs" style="width: 100%;" v-loading="loading">
      <slot></slot>
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
      @size-change="size => refreshData({ size, page: 1 })"
      @current-change="page => refreshData({ page })"
      class="k-pagination">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { Pagination } from '@/common/types/apiResult.type'
import { computed, defineComponent, nextTick, ref, watch, watchEffect } from 'vue'

const methodArr = [
  'clearSelection',
  'toggleRowSelection',
  'toggleAllSelection',
  'toggleRowExpansion',
  'setCurrentRow',
  'clearSort',
  'clearFilter',
  'doLayout',
  'sort'
]

export default defineComponent({
  name: 'KTable',
  props: {
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
    }
  },
  inheritAttrs: false,
  setup (props) {
    // 表格
    const list = computed(() => props.data.list)
    const total = computed(() => props.data.total)
    const elTableRef = ref()
    // 继承 el-table methods
    const methodObj = {} // 存储方法

    nextTick(() => {
      if (elTableRef.value) {
        methodArr.forEach(m => {
          methodObj[m] = (...args: any[]) => {
            elTableRef.value[m].apply(elTableRef, ...args)
          }
        })
      }
    })

    // 分页逻辑
    const pager = ref<Pagination>({ page: props.pageNum, size: props.pageSize })
    // 刷新， 用户分页 / 暴露给父组件
    const refreshData = (newPager?: Pagination): void => {
      if (props.auto) {
        pager.value = { ...pager.value, ...newPager }
        props.callback && props.callback(pager.value)
      }
    }

    // 初始化
    props.auto && props.callback && props.callback(pager.value)

    return {
      list,
      total,
      pager,
      elTableRef,
      ...methodObj,
      refreshData
    }
  }
})
</script>

<style lang="scss" scoped>
.k-table-container {
  position: relative;
  width: 100%;
}
.k-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
