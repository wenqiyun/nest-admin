<template>
  <el-dialog title="选择用户" v-model="visible" top="10vh" width="400px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-empty description="暂无数据" v-if="!loading && userList.length === 0"></el-empty>
    <ul v-infinite-scroll="loadEvent" :infinite-scroll-disabled="loading"  class="bind-role-user-liet" v-else>
      <li v-for="user in userList" :key="user.id" :class="`role-user-item clearfix ${checked.includes(user.id) ? 'checked-user' : ''}`" @click="clickEvent(user.id)">
        <span class="bind-role-user-account">{{ user.account }}</span>
        <span>（{{ user.phoneNum }}）</span>
        <span class="fr" v-if="checked.includes(user.id)">
          <svg-icon icon-class="select"></svg-icon>
        </span>
      </li>
      <li class="bind-role-user-loading" v-if="loading">加载中...</li>
    </ul>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="comfirmBindUser">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { getUserList, QueryUserList, UserApiResult, BindUserData, bindRoleUser } from '@/api/user'
import { ListResultData, ResultData } from '@/common/types/apiResult.type'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currId: {
      type: String,
      default: null
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'success'],
  setup (props, { emit }) {
    const userList = ref<UserApiResult[]>([])
    const total = ref<number>(0)
    const loading = ref<boolean>(false)
    const searchReq = ref<QueryUserList>({ page: 1, size: 10 })
    const getNotCurrRoleUserList = async () => {
      loading.value = true
      const res: ResultData<ListResultData<UserApiResult>> = await getUserList({ ...searchReq.value, status: 1, roleId: props.currId, hasCurrRole: 0 } as QueryUserList)
      loading.value = false
      if (res?.code === 200) {
        userList.value.push(...res.data.list as UserApiResult[])
        total.value = res.data.total
      }
    }

    const loadEvent = async () => {
      if (userList.value.length < total.value) {
        searchReq.value.page += 1
        await getNotCurrRoleUserList()
      }
    }

    const checked = ref<string[]>([])
    const clickEvent = (userId: string) => {
      const i = checked.value.findIndex(id => id === userId)
      if (i > -1) checked.value.splice(i, 1)
      else checked.value.push(userId)
    }

    // dialog
    const visible = ref<boolean>(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
      if (val) {
        searchReq.value.page = 1
        getNotCurrRoleUserList()
      } else {
        checked.value = []
        userList.value = []
      }
    })

    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }

    const comfirmBindUser = async () => {
      if (checked.value.length === 0) {
        ElMessage({ type: 'error', message: '请至少选择一条数据' })
        return
      }
      const req: BindUserData = { roleId: props.currId, userIds: checked.value, type: 'create' }
      const res = await bindRoleUser(req)
      if (res?.code === 200) {
        ElMessage({ type: 'success', message: '关联用户成功' })
        emit('success')
        handleClose()
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试!' })
      }
    }

    return {
      visible,
      handleClose,
      userList,
      checked,
      clickEvent,
      loading,
      loadEvent,
      comfirmBindUser
    }
  }
})
</script>

<style lang="scss" scoped>
.bind-role-user-liet {
  min-height: 300px;
  .role-user-item {
    width: 360px;
    line-height: 36px;
    font-size: 16px;
    color: rgba(0, 0,0, .65);
    cursor: pointer;

    &.checked-user {
      color: #409EFF;
    }

    .bind-role-user-account {
      min-width: 50px;
      display: inline-block;
    }
  }
  .bind-role-user-loading {
    text-align: center;
    color: #999;
    height: 60px;
    line-height: 60px;
  }
}
</style>
