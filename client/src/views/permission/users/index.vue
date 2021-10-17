<template>
  <div>
    <div class="filter-container">
     <div class="filter-item">
        <el-select v-model="searchReq.status" clearable style="width: 100px;" placeholder="请选择">
          <el-option label="使用中" :value="1">
            <status-badge type="primary" content="使用中"></status-badge>
          </el-option>
          <el-option label="已禁用" :value="0">
            <status-badge type="danger" content="已禁用"></status-badge>
          </el-option>
        </el-select>
     </div>
      <div class="filter-item">
        <el-input v-model="searchReq.account" placeholder="用户帐号" style="width: 200px;margin-left: 10px;" clearable></el-input>
      </div>

      <div class="filter-action-wrapper filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
      </div>
    </div>
    <k-table ref="userTableRef" v-bind="userData" :callback="getUserListFn" :loading="loading"  border stripe current-row-key="id" style="width: 100%">
      <template #status="{row}">
        <status-badge :type="row.status === 1 ? 'primary' : 'danger'" :content="row.status === 1 ? '使用中' : '已禁用'"></status-badge>
      </template>
      <template  #actions="{ row }">
        <el-button type="primary" plain @click="showUserEditEvent(row)">编辑</el-button>
        <el-button type="danger" plain>禁用</el-button>
      </template>
    </k-table>

    <!-- 编辑用户 -->
    <edit-user v-model="showUserEdit" :curr-user="currUser" @change="updateUserSuccess"></edit-user>
  </div>
</template>

<script lang="ts">
import StatusBadge from '_c/StatusBadge/index.vue'
// import KTable from '_c/Table/index.vue'
import EditUser from './components/Edit.vue'
import { defineComponent, ref } from 'vue'
import { getUserList, ICreateOrUpdateUser, QueryUserList, updateUser, UserApiResult } from '@/api/user'
import { ElMessage } from 'element-plus'
import { jsonTimeFormat } from '@/utils/index'
import { ListResultData, Pagination } from '../../../common/types/apiResult.type'
import { IKTableProps } from '../../../plugins/k-ui/packages/table/src/Table.type'

export default defineComponent({
  components: { StatusBadge, EditUser },
  setup () {
    const userData = ref<IKTableProps<UserApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      auto: true,
      isPager: true,
      columns: [
        { label: '帐号', prop: 'account' },
        { label: '头像', prop: 'avatar' },
        { label: '手机号', prop: 'phoneNum' },
        { label: '邮箱', prop: 'email' },
        { label: '状态', prop: 'status', type: 'slot', width: '90' },
        { label: '注册时间', prop: 'createDate', width: '90' },
        { label: '操作', prop: 'actions', type: 'slot', width: '200' }
      ],
      index: true
    })
    const loading = ref<boolean>(false)

    const searchReq = ref<QueryUserList>({
      page: 1,
      size: 10,
      status: '',
      account: ''
    })
    // 查询表格事件
    const queryReq = ref<QueryUserList>({ page: 1, size: 10 })
    const getUserListFn = async ({ page, size }: Pagination) => {
      loading.value = true
      const res = await getUserList({ ...queryReq.value, page, size } as QueryUserList)
      loading.value = false
      if (res.code === 200) {
        const data = res.data as ListResultData<UserApiResult>
        data.list = data.list.map((v) => {
          v.createDate = jsonTimeFormat(v.createDate as string)
          return v
        })
        userData.value.data = data
      } else {
        ElMessage({ message: res.msg, type: 'error' })
      }
    }

    // 编辑用户相关
    const showUserEdit = ref<boolean>(false)
    const currUser = ref<ICreateOrUpdateUser>({})
    const showUserEditEvent = (row: ICreateOrUpdateUser) => {
      currUser.value = row
      showUserEdit.value = true
    }

    // 更新用户 、 禁用
    const updateUserFn = async (req: ICreateOrUpdateUser, type: 'disable' | 'update') => {
      const res = await updateUser(req)
      if (res.code === 200) {
        ElMessage({ message: `${type === 'update'} ? '更新' ： '禁用成功'`, type: 'success' })
      }
    }

    const userTableRef = ref()
    const updateUserSuccess = (newPage = {}) => {
      // 在当前页 重新加载数据
      userTableRef.value.refreshData(newPage)
    }

    const searchEvent = () => {
      queryReq.value = Object.assign({}, searchReq.value)
      updateUserSuccess({ page: 1, size: 10 })
    }

    return {
      loading,
      searchReq,
      userData,
      searchEvent,
      getUserListFn,
      // 编辑用户相关
      currUser,
      showUserEdit,
      showUserEditEvent,
      userTableRef,
      updateUserSuccess
    }
  }
})
</script>
