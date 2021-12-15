import { defineComponent } from "vue";

<template>
  <div>
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker v-model="searchDate" type="daterange" value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :disabledDate="disabledDate" clearable></el-date-picker>
      </div>
      <div class="filter-action-wrapper filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
      </div>
    </div>
    <k-table ref="ossTableRef" v-bind="fileData" :callback="getFileList" :loading="loading"  border stripe current-row-key="id" style="width: 100%"></k-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { IKTableProps } from '@/plugins/k-ui/packages/table/src/Table.type'
import { ListResultData, Pagination } from '@/common/types/apiResult.type'
import { getFileList as getFileListApi, OssApiResult } from '@/api/oss'
import { jsonTimeFormat, tranFileSize } from '@/utils/index'

export default defineComponent({
  setup () {
    const fileData = ref<IKTableProps<OssApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      auto: true,
      isPager: true,
      columns: [
        { label: '文件', prop: 'url' },
        { label: '大小', prop: 'size', formatter: (row: OssApiResult) => tranFileSize(row.size) },
        { label: '上传用户', prop: 'userAccount' },
        { label: '上传时间', prop: 'createDate', formatter: (row: OssApiResult) => jsonTimeFormat(row.createDate) }
      ],
      index: true
    })

    const ossTableRef = ref()

    const loading = ref<boolean>(false)
    const searchDate = ref<string[]>([])
    let searchDateTmp: string[] = []
    const getFileList = async ({ page, size }: Pagination) => {
      loading.value = true
      const res = await getFileListApi({ page, size, ...searchDateTmp.length === 2 ? { startDay: searchDateTmp[0], endDay: searchDateTmp[1] } : null })
      loading.value = false
      if (res?.code === 200) {
        const data = res.data as ListResultData<OssApiResult>
        fileData.value.data = data
      } else {
        ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
      }
    }

    const searchEvent = () => {
      searchDateTmp = searchDate.value ? [...searchDate.value] : []
      ossTableRef.value.refreshData({ page: 1, size: 10 })
    }

    const nowDate = new Date().getTime()

    // 日期范围
    const disabledDate = (date: Date) => {
      return nowDate < date.getTime()
    }

    return {
      loading,
      fileData,
      getFileList,
      searchDate,
      searchEvent,
      ossTableRef,
      disabledDate
    }
  }
})
</script>
