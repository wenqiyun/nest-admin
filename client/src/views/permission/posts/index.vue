<template>
  <div class="box-bg-color">
    <div class="filter-container">
      <div class="filter-item">
        <el-select v-model="searchReq.status" clearable style="width: 100px" placeholder="请选择">
          <el-option label="使用中" :value="1">
            <k-badge type="primary" content="使用中"></k-badge>
          </el-option>
          <el-option label="已禁用" :value="0">
            <k-badge type="danger" content="已禁用"></k-badge>
          </el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-input v-model.trim="searchReq.code" placeholder="岗位编码" style="width: 200px"></el-input>
      </div>
      <div class="filter-item">
        <el-input v-model.trim="searchReq.name" placeholder="岗位名称" style="width: 200px"></el-input>
      </div>
      <div class="filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
      </div>
      <div class="filter-item filter-action-wrapper" v-perm="'perm_posts:create'">
        <el-button @click="showEditChange()">新增</el-button>
      </div>
    </div>
    <k-table
      ref="tableRef"
      v-bind="tableData"
      :callback="getPostListApi"
      :loading="loading"
      stripe
      current-row-key="id"
    >
      <template #status="{ row }">
        <k-badge
          :type="row.status === 1 ? 'primary' : 'danger'"
          :content="row.status === 1 ? '使用中' : '已禁用'"
        ></k-badge>
      </template>
      <template #actions="{ row }">
        <el-button size="small" type="primary" plain v-perm="'perm_posts:edit'" @click="showEditChange(row.id)"
          >编辑</el-button
        >
        <el-button size="small" type="danger" plain v-perm="'perm_posts:del'" @click="delEvent(row)">删除</el-button>
      </template>
    </k-table>

    <Edit v-model="showEdit" :curr-id="currId" @change="updateSuccess()"></Edit>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { IKTableProps } from 'k-ui'

import { confirmElBox, dateStrFormat } from '@/utils'
import { hasPerms } from '@/utils/perm'

import { getPostList, deletePost, type PostApiResult, type QueryPostList } from '@/api/post'
import type { ListResultData } from '@/api/base'

import Edit from './components/Edit.vue'

const tableRef = ref()
const tableData = ref<IKTableProps<PostApiResult>>({
  mode: 'config',
  data: { list: [], total: 0 },
  auto: true,
  isPager: true,
  pageSize: 20,
  columns: [
    { label: '岗位编码', prop: 'code' },
    { label: '岗位名称', prop: 'name' },
    { label: '排序', prop: 'orderNum' },
    { label: '岗位状态', prop: 'status', slot: true },
    {
      label: '创建时间',
      prop: 'createDate',
      formatter: (row: PostApiResult) => dateStrFormat(row.createDate as string),
      width: 100
    }
  ]
})

const hasActionPerm = hasPerms(['perm_posts:edit', 'perm_posts:del'])
hasActionPerm && tableData.value.columns.push({ label: '操作', prop: 'actions', slot: true })

const searchReq = ref<QueryPostList>({
  page: 1,
  size: 20,
  name: '',
  code: '',
  status: ''
})
const queryReq = ref<QueryPostList>({
  page: 1,
  size: 20,
  name: '',
  code: '',
  status: ''
})
const loading = ref<boolean>(false)
const getPostListApi = async ({ page = 1, size = 20 }) => {
  loading.value = true
  const res = await getPostList({
    ...searchReq.value,
    status: searchReq.value.status === '' ? undefined : searchReq.value.status,
    page,
    size
  })
  loading.value = false
  if (res?.code === 200) {
    tableData.value.data = res.data as ListResultData<PostApiResult>
  }
}

const updateSuccess = (newPage = {}) => {
  // 在当前页 重新加载数据
  tableRef.value.refreshData(newPage)
}

// 搜索事件
const searchEvent = () => {
  queryReq.value = Object.assign({}, searchReq.value)
  updateSuccess({ page: 1 })
}

// 删除事件
const delEvent = async (row: PostApiResult) => {
  await confirmElBox(`是否确认删除【${row.name}】岗位`, async () => {
    const res = await deletePost(row.id)
    if (res?.code) {
      ElMessage.success(`岗位【$${row.name}】删除成功`)
      updateSuccess({ page: 1 })
    }
  })
}

// 编辑
const showEdit = ref<boolean>(false)
const currId = ref<string>('')
const showEditChange = (id?: string) => {
  currId.value = id || ''
  showEdit.value = true
}
</script>
