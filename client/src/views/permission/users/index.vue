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
        <el-input v-model="searchReq.account" placeholder="用户帐号" style="width: 200px;margin-left: 10px;" clearable></el-input>
      </div>

      <div class="filter-action-wrapper filter-item">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button type="text" @click="loadingMoreEvent" style="margin-left: 20px;">{{ loadingMore ? '收起' : '更多' }}</el-button>
      </div>

    </div>
    <div class="filter-container" v-show="loadingMore">
      <div class="filter-item" >
        <el-upload style="display: inline-block;margin-right: 20px;" v-bind="uploadConfig" :show-file-list="false">
          <el-button type="primary">批量上传</el-button>
        </el-upload>
        <el-button @click="downloadEvent">下载模板</el-button>
      </div>
    </div>
    <k-table ref="userTableRef" v-bind="userData" :callback="getUserListFn" :loading="loading" border stripe current-row-key="id" style="width: 100%">
      <template #avatar="{row}">
        <el-avatar :src="row.avatar" shape="circle" :size="60"></el-avatar>
      </template>
      <template #status="{row}">
        <k-badge :type="row.status === 1 ? 'primary' : 'danger'" :content="row.status === 1 ? '使用中' : '已禁用'"></k-badge>
      </template>
      <template  #actions="{ row }">
        <el-button type="primary" plain @click="showUserEditEvent(row)" v-if="row.status === 1">编辑</el-button>
        <el-button :type="row.status ? 'danger' : 'success'" plain @click="forbiddenEvent(row)">{{ row.status ? '禁用' : '启用' }}</el-button>
        <el-button type="warning" plain @click="resetPasswordEvent(row)" v-if="row.status === 1">重置密码</el-button>
      </template>
    </k-table>

    <!-- 编辑用户 -->
    <edit-user v-model="showUserEdit" :curr-id="currId" @change="updateUserSuccess"></edit-user>
    <!-- 批量导入用户 有报错 -->
    <upload-err v-model="showUploadErr" v-bind="uploadErrData"></upload-err>
  </div>
</template>

<script lang="ts">
import EditUser from './components/Edit.vue'
import UploadErr from './components/UploadErr.vue'
import { defineComponent, ref } from 'vue'
import { getUserList, ICreateOrUpdateUser, QueryUserList, resetPassword, updateStatus, UserApiResult, dowmloadUserTemplate } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downLoad, jsonTimeFormat } from '@/utils/index'
import { ListResultData, Pagination } from '@/common/types/apiResult.type'
import { IKTableProps } from '@/plugins/k-ui/packages/table/src/Table.type'
import appConfig from '@/config/index'
import { getToken } from '@/utils/storage'

export default defineComponent({
  components: { EditUser, UploadErr },
  setup () {
    const userData = ref<IKTableProps<UserApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      auto: true,
      isPager: true,
      columns: [
        { label: '头像', prop: 'avatar', type: 'slot' },
        { label: '帐号', prop: 'account' },
        { label: '手机号', prop: 'phoneNum', default: '--' },
        { label: '邮箱', prop: 'email', default: '--' },
        { label: '状态', prop: 'status', type: 'slot', width: '90' },
        { label: '注册时间', prop: 'createDate', width: '90' },
        { label: '操作', prop: 'actions', type: 'slot', width: '250', fixed: 'right' }
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
        ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
      }
    }

    // 编辑用户相关
    const showUserEdit = ref<boolean>(false)
    const currId = ref<string>()
    const showUserEditEvent = (row: ICreateOrUpdateUser) => {
      currId.value = row.id
      showUserEdit.value = true
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

    const forbiddenEvent = async (row: UserApiResult) => {
      try {
        await ElMessageBox.confirm(`是否确认将用户【${row.account}】${row.status === 1 ? '禁用' : '恢复正常使用'}吗？`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
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

    const loadingMore = ref<boolean>(false)

    const loadingMoreEvent = () => {
      loadingMore.value = !loadingMore.value
    }

    const downloadEvent = async () => {
      loading.value = true
      const res = await dowmloadUserTemplate()
      loading.value = false
      downLoad(res, '用户批量导入模板.xlsx')
    }

    const showUploadErr = ref<boolean>(false)
    const uploadErrData = ref({})
    const acceptFileType = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const uploadConfig = {
      action: `${appConfig.api.baseUrl}/user/import`,
      headers: {
        Authorization: getToken()
      },
      accept: acceptFileType,
      beforeUpload: (file: any) => {
        if (acceptFileType.indexOf(file.type) === -1) {
          ElMessage({ type: 'error', message: '文件类型错误，请上传 .xlsx 或 .xls 文件' })
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          ElMessage({ type: 'error', message: '文件大小超过，最大支持 5M' })
        }
        return true
      },
      onSuccess: (res: any) => {
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
    }

    return {
      loading,
      searchReq,
      userData,
      searchEvent,
      getUserListFn,
      // 编辑用户相关
      currId,
      showUserEdit,
      showUserEditEvent,
      userTableRef,
      updateUserSuccess,
      resetPasswordEvent,
      forbiddenEvent,
      loadingMore,
      loadingMoreEvent,
      downloadEvent,
      uploadConfig,
      showUploadErr,
      uploadErrData
    }
  }
})
</script>
