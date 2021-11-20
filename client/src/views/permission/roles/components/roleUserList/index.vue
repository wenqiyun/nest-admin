<template>
  <div class="role-user-list-wrapper">
    <h3 class="roles__tip clearfix">
      <span>关联用户</span>
      <span class="fr role-user-add">
        <el-button @click="bindUserEvent" :disabled="!currId">关联用户</el-button>
      </span>
    </h3>
    <!-- 当前角色关联的用户 -->
    <k-table ref="bindRoleUserTableRef" v-bind="userData" :callback="getRoleUserList" :loading="loading"  stripe>
      <template #avatar="{row}">
        <el-avatar :src="row.avatar" shape="square"></el-avatar>
      </template>
       <template #status="{row}">
        <k-badge :type="row.status === 1 ? 'primary' : 'danger'" :content="row.status === 1 ? '使用中' : '已禁用'"></k-badge>
      </template>
      <template #actions={row} >
        <el-button type="danger" plain @click="cancelBindUserEvent(row)">解除关联</el-button>
      </template>
    </k-table>

    <bind-user v-model="showbindUser" :curr-id="currId" @success="bindUserSuccess"></bind-user>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { IKTableProps } from '../../../../../plugins/k-ui/packages/table/src/Table.type'
import { ListResultData, Pagination } from '../../../../../common/types/apiResult.type'

import { jsonTimeFormat } from '../../../../../utils/index'
import { bindRoleUser, BindUserData, getUserList, QueryUserList, UserApiResult } from '../../../../../api/user'

import BindUser from './BindUserCmp.vue'

export default defineComponent({
  components: { BindUser },
  props: {
    currId: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const userData = ref<IKTableProps<UserApiResult>>({
      mode: 'config',
      data: { list: [], total: 0 },
      isPager: true,
      columns: [
        { label: '头像', prop: 'avatar', type: 'slot' },
        { label: '帐号', prop: 'account' },
        { label: '手机号', prop: 'phoneNum' },
        { label: '邮箱', prop: 'email' },
        { label: '状态', prop: 'status', type: 'slot', width: '90' },
        { label: '注册时间', prop: 'createDate', width: '90' },
        { label: '操作', prop: 'actions', type: 'slot', width: '120' }
      ],
      index: true
    })
    const loading = ref<boolean>(false)

    // 查询用户 list
    const queryReq = ref<QueryUserList>({ page: 1, size: 10 })
    const getRoleUserList = async ({ page, size }: Pagination) => {
      loading.value = true
      const res = await getUserList({ ...queryReq.value, page, size, roleId: props.currId, status: 1, hasCurrRole: 1 } as QueryUserList)
      loading.value = false
      if (res.code === 200) {
        const data = res.data as ListResultData<UserApiResult>
        data.list = data.list.map((v
        ) => {
          v.createDate = jsonTimeFormat(v.createDate as string)
          return v
        })
        userData.value.data = data
      } else {
        ElMessage({ message: res.msg, type: 'error' })
      }
    }

    // 添加用户关联
    const showbindUser = ref<boolean>(false)
    const bindUserEvent = async () => {
      showbindUser.value = true
    }

    const bindRoleUserTableRef = ref()

    watch(() => props.currId, (val) => {
      if (val) {
        queryReq.value = { page: 1, size: 10, roleId: val }
        getRoleUserList({ page: 1, size: 10 })
      }
    })
    // 绑定成功回调
    const bindUserSuccess = () => {
      bindRoleUserTableRef.value.refreshData({ page: 1, size: 10 })
    }

    const cancelBindUserEvent = async (row: UserApiResult) => {
      try {
        await ElMessageBox.confirm(
          `是否确认取消用户【${row.account}】与当前角色关联`,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        loading.value = true
        const req: BindUserData = { roleId: props.currId, userIds: [row.id as string], type: 'cancel' }
        const res = await bindRoleUser(req)
        loading.value = false
        if (res?.code === 200) {
          ElMessage({ type: 'success', message: `用户【${row.account}】已取消与当前角色关联` })
          bindRoleUserTableRef.value.refreshData()
        } else {
          ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试!' })
        }
      } catch (error) {}
    }

    return {
      loading,
      userData,
      bindRoleUserTableRef,
      getRoleUserList,
      showbindUser,
      bindUserEvent,
      bindUserSuccess,
      cancelBindUserEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.role-user-list-wrapper {
  width: 100%;
  height: calc(100% - 230px);
  margin-top: 10px;
  background: #fff;

  .role-user-add {
    margin-right: 16px;
  }
}
</style>
