<template>
  <div class="box-bg-color">
    <div class="filter-container">
      <div class="filter-item" v-perm="'perm_depts:create'">
        <el-button @click="showEditEvent()">新增</el-button>
      </div>
    </div>
    <k-table v-bind="tableData" :loading="loading">
      <template #parentId="{ row }">{{ deptMap[row.parentId] }}</template>
      <template #actions="{ row }">
        <el-button type="primary" plain size="small" v-perm="'perm-depts:edit'" @click="showEditEvent(row)"
          >编辑</el-button
        >
        <el-button type="danger" plain size="small" v-perm="'perm_depts:del'" @click="delEvent(row)">删除</el-button>
      </template>
    </k-table>

    <Edit
      v-model="showEdit"
      :dept-list="tableData.data.list"
      :dept-map="deptMap"
      :curr-dept="curr"
      @change="updateSuccess"
    ></Edit>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { IKTableProps } from 'k-ui'

import { dateStrFormat, listToTree, confirmElBox } from '@/utils'
import { hasPerms } from '@/utils/perm'
import { deleteDept, getDeptList, type DeptApiResult } from '@/api/dept'

import Edit from './components/Edit.vue'

const tableData = ref<IKTableProps<DeptApiResult>>({
  mode: 'config',
  data: { list: [] },
  isPager: false,
  rowKey: 'id',
  columns: [
    { label: '名称', prop: 'name' },
    { label: '上级部门', prop: 'parentId', slot: true },
    { label: '负责人', prop: 'leader' },
    { label: '排序', prop: 'orderNum' },
    {
      label: '创建时间',
      prop: 'createDate',
      formatter: (row: DeptApiResult) => dateStrFormat(row.createDate as string),
      width: 100
    }
  ]
})

const hasActionPerm = hasPerms(['perm_depts:edit', 'perm_depts:del'])
hasActionPerm && tableData.value.columns.push({ label: '操作', prop: 'actions', slot: true })

const deptMap = ref<Record<string, string>>({
  '': ''
})
const loading = ref<boolean>(false)
const getDeptListApi = async () => {
  loading.value = true
  const res = await getDeptList()
  loading.value = false
  if (res?.code === 200) {
    const data = res.data as DeptApiResult[]
    data.forEach((v) => {
      deptMap.value[v.id] = v.name
    })
    tableData.value.data.list = listToTree(data, { root: '0', pidKey: 'parentId' })
  }
}
getDeptListApi()

// 删除
const delEvent = (row: DeptApiResult) => {
  confirmElBox(`此操作将会永久删除【${row.name}】菜单，是否继续`, async () => {
    const res = await deleteDept(row.id)
    if (res?.code === 200) {
      ElMessage.success('删除成功')
      getDeptListApi()
    } else {
      ElMessage.error(res?.msg || '网络异常，请稍后重试')
    }
  })
}

const showEdit = ref<boolean>(false)
const curr = ref<DeptApiResult>()
const showEditEvent = (row?: DeptApiResult) => {
  showEdit.value = true
  curr.value = row
}
const updateSuccess = () => {
  getDeptListApi()
}
</script>
