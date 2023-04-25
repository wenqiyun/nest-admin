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
        <el-input v-model="searchReq.account" placeholder="用户帐号" style="width: 200px" clearable></el-input>
      </div>
      <div class="filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
      </div>
      <div class="filter-action-wrapper upload-wrap" v-perm="'perm_users:createMultUser'">
        <div class="filter-item">
          <el-upload
            :action="`${appConfig.api.baseUrl}/user/import`"
            :headers="{ Authorization: getToken() }"
            :showFileList="false"
            :acceptFileType="acceptFileType"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            style="display: inline-block; margin-right: 20px"
          >
            <el-button type="primary">批量上传</el-button>
          </el-upload>
        </div>
        <div class="filter-item">
          <el-button @click="downloadEvent">下载模板</el-button>
        </div>
      </div>
    </div>

    <k-table
      ref="tableRef"
      v-bind="tableData"
      :callback="getUserListApi"
      :loading="loading"
      stripe
      current-row-key="id"
    >
      <template #account="{ row }">
        <div class="user-account-wrap">
          <el-avatar :src="row.avatar" shape="square" :size="40"></el-avatar>
          <div style="margin-left: 10px">{{ row.account }}</div>
        </div>
      </template>
      <template #status="{ row }">
        <k-badge
          :type="row.status === 1 ? 'primary' : 'danger'"
          :content="row.status === 1 ? '使用中' : '已禁用'"
        ></k-badge>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" plain size="small" @click="clickEditEvent(row.id)" v-perm="'perm_users:edit'"
          >编辑</el-button
        >
        <el-button
          :type="row.status ? 'danger' : 'success'"
          plain
          size="small"
          @click="forbiddenEvent(row)"
          v-perm="'perm_users:updateStatus'"
        >
          {{ row.status ? '禁用' : '启用' }}
        </el-button>
        <el-button type="warning" plain size="small" @click="resetPasswordEvent(row)" v-perm="'perm_users:resetPw'"
          >重置密码</el-button
        >
      </template>
    </k-table>

    <!-- 用户编辑 -->
    <Edit v-model="showEdit" :curr-id="currId" :role-list="roleList" @change="updateUserSuccess"></Edit>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox, type UploadRawFile } from 'element-plus'
import type { IKTableProps } from 'k-ui'

import appConfig from '@/config/index'
import { getToken } from '@/utils/cache'
import { dateStrFormat, downLoad } from '@/utils'

import {
  dowmloadUserTemplate,
  getUserList,
  updateStatus,
  type QueryUserList,
  type UserApiResult,
  resetPassword
} from '@/api/user'
import type { ListResultData, Pagination } from '@/api/base'
import { type RoleApiResult, getRoleList } from '@/api/role'

import Edit from './components/Edit.vue'
import { hasPerms } from '@/utils/perm'
import { useApiLock } from '_hooks'

const tableRef = ref()
const tableData = ref<IKTableProps<UserApiResult>>({
  mode: 'config',
  data: { list: [], total: 0 },
  auto: true,
  isPager: true,
  pageSize: 20,
  index: true,
  columns: [
    { label: '帐号', prop: 'account', slot: true },
    { label: '手机号', prop: 'phoneNum', default: '--' },
    { label: '邮箱', prop: 'email', default: '--' },
    { label: '状态', prop: 'status', slot: true, width: 100 },
    {
      label: '注册时间',
      prop: 'createDate',
      formatter: (row: UserApiResult) => dateStrFormat(row.createDate as string),
      width: 100
    }
  ]
})

/* 这里判断是否有整个操作列的权限；如果没有则不显示整列 */
const hasActionPerm = hasPerms(['perm_users:edit', 'perm_users:updateStatus', 'perm_users:resetPw'])
hasActionPerm && tableData.value.columns.push({ label: '操作', prop: 'actions', slot: true, width: 240 })

const loading = ref<boolean>(false)

const searchReq = ref<QueryUserList>({
  page: 1,
  size: 20,
  status: '',
  account: ''
})
// 查询表格事件
const queryReq = ref<QueryUserList>({ page: 1, size: 20 })

const getUserListApi = async ({ page, size }: Pagination) => {
  loading.value = true
  const res = await useApiLock(() => getUserList({ ...queryReq.value, page, size } as QueryUserList), 500)
  loading.value = false
  if (res?.code === 200) {
    const data = res.data as ListResultData<UserApiResult>
    tableData.value.data = data
  } else {
    ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
  }
}

const updateUserSuccess = (newPage = {}) => {
  // 在当前页 重新加载数据
  tableRef.value.refreshData(newPage)
}

const searchEvent = () => {
  queryReq.value = Object.assign({}, searchReq.value)
  updateUserSuccess({ page: 1, size: 10 })
}

// 查询当前所有角色
const roleList = ref<RoleApiResult[]>([])
const getRoleListApi = async () => {
  const res = await getRoleList()
  if (res?.code === 200) {
    roleList.value = res.data as RoleApiResult[]
  }
}
getRoleListApi()

// 用户编辑
const showEdit = ref<boolean>(false)
const currId = ref<string | undefined>(undefined)
const clickEditEvent = (id: string) => {
  currId.value = id
  showEdit.value = true
}

// 禁用 or 启用 逻辑
const forbiddenEvent = async (row: UserApiResult) => {
  try {
    await ElMessageBox.confirm(
      `是否确认将用户【${row.account}】${row.status === 1 ? '禁用' : '恢复正常使用'}吗？`,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    loading.value = true
    const res = await updateStatus({ id: row.id, status: row.status === 1 ? 0 : 1 })
    loading.value = false
    if (res?.code === 200) {
      ElMessage({ type: 'success', message: `${row.status === 1 ? '禁用' : '启用'}成功` })
      updateUserSuccess()
    } else {
      ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试！' })
    }
  } catch (error) {}
}

// 重置密码
const resetPasswordEvent = async (row: UserApiResult) => {
  try {
    await ElMessageBox.confirm(`是否确认重置用户【${row.account}】密码？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await resetPassword(row.id as string)
    if (res?.code === 200) {
      ElMessage({ type: 'success', message: `重置用户【${row.account}】密码成功` })
    } else {
      ElMessage({ type: 'error', message: res?.msg || '重置密码失败，请稍后尝试！' })
    }
  } catch (error) {}
}

// 导入用户
const downloadEvent = async () => {
  loading.value = true
  const res = await dowmloadUserTemplate()
  loading.value = false
  downLoad(res, '用户批量导入模板.xlsx')
}
const showUploadErr = ref<boolean>(false)
const uploadErrData = ref({})
const acceptFileType = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const beforeUpload = (file: UploadRawFile) => {
  if (acceptFileType.indexOf(file.type) === -1) {
    ElMessage({ type: 'error', message: '文件类型错误，请上传 .xlsx 或 .xls 文件' })
    return false
  }
  if ((file.size as number) > 5 * 1024 * 1024) {
    ElMessage({ type: 'error', message: '文件大小超过，最大支持 5M' })
  }
  return true
}

const uploadSuccess = (res: any) => {
  if (res?.code === 200) {
    ElMessage({ type: 'success', message: '导入成功' })
  } else {
    if (res?.data) {
      uploadErrData.value = { errMsg: res.msg, errData: res.data }
      showUploadErr.value = true
    } else {
      ElMessage({ type: 'error', message: res.msg || '网络异常，请稍后重试' })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-account-wrap {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.upload-wrap {
  display: flex;
}
</style>
