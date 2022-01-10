<template>
  <div>
    <div class="filter-container">
      <div class="filter-item">
        <el-select v-model="searchReq.status" clearable style="width: 100px;" placeholder="请选择">
          <el-option label="使用中" :value="1">
            <k-badge type="primary" content="使用中"></k-badge>
          </el-option>
          <el-option label="已禁用" :value="0">
            <k-badge type="danger" content="已禁用"></k-badge>
          </el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-input v-model="searchReq.name" placeholder="岗位名称" style="width: 200px;margin-left: 10px;" clearable></el-input>
      </div>
      <div class="filter-item">
        <el-input v-model="searchReq.code" placeholder="岗位编码" style="width: 200px;margin-left: 10px;" clearable></el-input>
      </div>
       <div class="filter-action-wrapper filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button @click="editEvent('')">新增</el-button>
      </div>
    </div>
    <k-table ref="postTableRef" v-bind="postData" :loading="loading" :callback="getPostList"  border stripe current-row-key="id">
      <template #status="{row}">
        <k-badge :type="row.status === 1 ? 'primary' : 'danger'" :content="row.status === 1 ? '使用中' : '已禁用'"></k-badge>
      </template>
      <template #actions="{row}">
        <el-button type="primary" plain @click="editEvent(row.id)">编辑</el-button>
        <el-button type="danger" plain @click="delPostEvent(row)">删除</el-button>
      </template>
    </k-table>

    <Edit v-model="showEdit" :curr="currId"  @change="editSuccess"></Edit>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import Edit from './components/Edit.vue'

import { IKTableProps } from '@/plugins/k-ui/packages/table/src/Table.type'
import { Pagination, ListResultData } from '@/common/types/apiResult.type'

import { deletePost, getPostList as getPostListApi, PostApiResult, QueryPostList } from '@/api/post'
import { jsonTimeFormat } from '@/utils'

export default defineComponent({
  components: { Edit },
  setup () {
    const postData = ref<IKTableProps<PostApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      auto: true,
      isPager: true,
      index: true,
      columns: [
        { label: '岗位编码', prop: 'code' },
        { label: '岗位名称', prop: 'name' },
        { label: '排序', prop: 'orderNum' },
        { label: '状态', prop: 'status', slot: true, width: '90' },
        { label: '创建时间', prop: 'createDate', width: '100', formatter: (row: PostApiResult) => jsonTimeFormat(row.createDate as string) },
        { label: '操作', prop: 'actions', slot: true, width: '200' }
      ]
    })

    const searchReq = ref<QueryPostList>({
      page: 1,
      size: 10,
      status: '',
      name: '',
      code: ''
    })
    const loading = ref<boolean>(false)
    const queryReq = ref<QueryPostList>({ page: 1, size: 10 })
    const getPostList = async ({ page, size }: Pagination) => {
      loading.value = true
      const res = await getPostListApi({ ...queryReq.value, page, size } as QueryPostList)
      loading.value = false
      if (res?.code === 200) {
        postData.value.data = res.data as ListResultData<PostApiResult>
      } else {
        ElMessage({ message: res?.msg || '网络异常，请稍后尝试', type: 'error' })
      }
    }

    const postTableRef = ref()
    const refreshData = (newPage = {}) => {
      postTableRef.value.refreshData(newPage)
    }
    const searchEvent = () => {
      queryReq.value = {
        page: 1,
        size: 10,
        ...searchReq.value.name ? { name: searchReq.value.name } : null,
        ...searchReq.value.status !== '' ? { status: searchReq.value.status } : null,
        ...searchReq.value.code ? { code: searchReq.value.code } : null

      }
      refreshData({ page: 1, size: 10 })
    }

    const showEdit = ref<boolean>(false)
    const currId = ref<string>('')
    const editEvent = (id: string) => {
      currId.value = id
      showEdit.value = true
    }

    const editSuccess = (type: 'create' | 'update') => {
      refreshData(type === 'create' ? { page: 1, size: 10 } : {})
    }

    const delPostEvent = async (post: PostApiResult) => {
      await ElMessageBox.confirm(`是否确认删除【${post.name}】岗位？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const res = await deletePost(post.id)
      if (res?.code === 200) {
        ElMessage({ type: 'success', message: '删除岗位成功' })
        refreshData()
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
      }
    }

    return {
      searchReq,
      loading,
      getPostList,
      postData,
      searchEvent,
      postTableRef,
      showEdit,
      currId,
      editEvent,
      editSuccess,
      delPostEvent
    }
  }
})
</script>
