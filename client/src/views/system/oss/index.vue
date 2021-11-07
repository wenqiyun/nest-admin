import { defineComponent } from "vue";

<template>
  <div>
    <k-table v-bind="fileData" :callback="getFileList" :loading="loading"  border stripe current-row-key="id" style="width: 100%"></k-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { IKTableProps } from '../../../plugins/k-ui/packages/table/src/Table.type'
import { ListResultData, Pagination } from '../../../common/types/apiResult.type'
import { getFileList as getFileListApi, OssApiResult } from '../../../api/oss'
import { jsonTimeFormat } from '../../../utils/index'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup () {
    const fileData = ref<IKTableProps<OssApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      auto: true,
      isPager: true,
      columns: [
        { label: '文件', prop: 'url' },
        { label: '大小', prop: 'size' },
        { label: '上传时间', prop: 'createDate' }
      ],
      index: true
    })

    const loading = ref<boolean>(false)
    const getFileList = async ({ page, size }: Pagination) => {
      loading.value = true
      const res = await getFileListApi({ page, size })
      loading.value = false
      if (res?.code === 200) {
        const data = res.data as ListResultData<OssApiResult>
        data.list = data.list.map(v => {
          v.createDate = jsonTimeFormat(v.createDate)
          return v
        })
        fileData.value.data = data
      } else {
        ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
      }
    }

    return {
      loading,
      fileData,
      getFileList
    }
  }
})
</script>
