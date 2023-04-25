<template>
  <div class="box-bg-color">
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabledDate="disabledDate"
          clearable
        ></el-date-picker>
      </div>
      <div class="filter-item filter-action-wrapper">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
      </div>
    </div>
    <k-table ref="tableRef" v-bind="tableData" :callback="getFileListApi" :loading="loading" stripe>
      <template #type="{ row }">
        <File :file="row"></File>
      </template>
    </k-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import File from './components/File.vue'

import type { IKTableProps } from 'k-ui'

import { dateStrFormat, tranFileSize } from '@/utils'

import { getFileList, type OssApiResult } from '@/api/oss'
import type { ListResultData } from '@/api/base'
import { useApiLock } from '_hooks'

const tableData = ref<IKTableProps<OssApiResult>>({
  mode: 'config',
  data: { list: [], total: 0 },
  auto: true,
  isPager: true,
  pageSize: 20,
  columns: [
    { label: '文件', prop: 'type', slot: true },
    { label: '链接', prop: 'url', headerAlign: 'center', align: 'left' },
    { label: '大小', prop: 'size', formatter: (row: OssApiResult) => tranFileSize(row.size) },
    { label: '备注', prop: 'business' },
    { label: '上传用户', prop: 'userAccount' },
    { label: '上传时间', prop: 'createDate', formatter: (row: OssApiResult) => dateStrFormat(row.createDate) }
  ],
  index: true
})

const loading = ref<boolean>(false)
const searchDate = ref<string>('')
const searchDateCache = ref<string[]>([])
const getFileListApi = async ({ page = 1, size = 20 }) => {
  loading.value = true
  const res = await useApiLock(
    async () =>
      await getFileList({
        page,
        size,
        ...(searchDateCache.value.length === 2
          ? { startDay: searchDateCache.value[0], endDay: searchDateCache.value[1] }
          : null)
      }),
    500
  )
  loading.value = false
  if (res?.code === 200) {
    tableData.value.data = res.data as ListResultData<OssApiResult>
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}

const nowDate = new Date().getTime()
// 日期范围
const disabledDate = (date: Date) => {
  return nowDate < date.getTime()
}

const tableRef = ref()
const searchEvent = () => {
  searchDateCache.value = JSON.parse(JSON.stringify(searchDate))
  tableRef.value.refreshData({ page: 1 })
}
</script>
