<template>
  <div class="role-user-list-wrap box-bg-color">
    <h3 class="role__tip">
      <span>关联用户</span>
      <span>
        <el-button size="small" @click="showBindUsers = true" :disabled="!props.currId" v-perm="'perm_roles:bind'">
          关联用户
        </el-button>
      </span>
    </h3>

    <!-- 拥有当前角色的用户 -->
    <div class="role-user-table">
      <k-table ref="tableRef" v-bind="tableData" :callback="getRoleUserListApi" :loading="loading">
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
          <el-button type="danger" size="small" plain @click="delBindUserEvent(row)"> 解除关联 </el-button>
        </template>
      </k-table>
    </div>
    <BindUsers v-model="showBindUsers" :curr-id="props.currId" @success="bindUserSuccess"></BindUsers>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import BindUsers from './BindUsers.vue'

import type { IKTableProps } from 'k-ui'

import { confirmElBox, dateStrFormat } from '@/utils'

import { getUserList, type BindUserData, type UserApiResult, bindRoleUser } from '@/api/user'
import type { ListResultData } from '@/api/base'
import { hasPerm } from '@/utils/perm'

const props = defineProps({
  currId: {
    type: String,
    default: ''
  }
})

const tableRef = ref()
const tableData = ref<IKTableProps<UserApiResult>>({
  mode: 'config',
  data: { list: [], total: 0 },
  isPager: true,
  columns: [
    { label: '帐号', prop: 'account', slot: true },
    { label: '手机号', prop: 'phoneNum' },
    { label: '邮箱', prop: 'email' },
    { label: '状态', prop: 'status', slot: true, width: 100 },
    {
      label: '注册时间',
      prop: 'createDate',
      width: 100,
      formatter: (row: UserApiResult) => dateStrFormat(row.createDate as string)
    }
  ]
})

hasPerm('perm_roles:bind') && tableData.value.columns.push({ label: '操作', prop: 'actions', slot: true, width: 129 })

const loading = ref<boolean>(false)
const getRoleUserListApi = async ({ page = 1, size = 10 }) => {
  loading.value = true
  const res = await getUserList({ page, size, roleId: props.currId, status: 1, hasCurrRole: 1 })
  loading.value = false
  if (res?.code === 200) {
    tableData.value.data = res.data as ListResultData<UserApiResult>
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}

watch(
  () => props.currId,
  () => {
    props.currId && getRoleUserListApi({ page: 1, size: 10 })
  }
)

// 解除关联关系
const delBindUserEvent = async (row: UserApiResult) => {
  confirmElBox(`是否确认取消用户【${row.account}】与当前角色关联`, async () => {
    loading.value = true
    const req: BindUserData = { roleId: props.currId, userIds: [row.id as string], type: 'cancel' }
    const res = await bindRoleUser(req)
    loading.value = false
    if (res?.code === 200) {
      ElMessage({ type: 'success', message: `用户【${row.account}】已取消与当前角色关联` })
      tableRef.value.refreshData()
    } else {
      ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试!' })
    }
  })
}

// 绑定关联关系
const showBindUsers = ref<boolean>(false)
// 绑定成功回调
const bindUserSuccess = () => {
  tableRef.value.refreshData({ page: 1, size: 10 })
}
</script>

<style lang="scss" scoped>
.role-user-list-wrap {
  height: calc(100% - 227px);
  margin-top: 7px;

  .role-user-table {
    padding-top: 1px;
  }
}

.user-account-wrap {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
