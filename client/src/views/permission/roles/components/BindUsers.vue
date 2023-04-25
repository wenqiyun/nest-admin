<template>
  <el-dialog
    title="选择用户"
    v-model="visible"
    top="10vh"
    width="400px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-empty v-if="userList.length === 0 && !hasMore"></el-empty>
    <!-- 用户列表 -->
    <ul
      v-infinite-scroll="getNotCurrRoleUserListApi"
      :infinite-scroll-disabled="loading && !hasMore"
      :infinite-scroll-delay="600"
      class="bind-role-user-list"
    >
      <li class="role-user-item" v-for="user in userList" :key="user.id" @click="clickEvent(user.id)">
        <div class="role-user-item__info">
          <el-avatar :src="user.avatar" shape="square" :size="30"></el-avatar>
          <span style="margin-left: 7px">{{ user.account }}</span>
          <span>（{{ user.phoneNum }}）</span>
        </div>
        <div v-if="checked.includes(user.id)">
          <svg-icon name="select"></svg-icon>
        </div>
      </li>
      <template v-if="loading">
        <li class="role-user-item" style="margin-top: 7px">
          <el-skeleton :rows="1" animated />
        </li>
        <li class="role-user-item">
          <el-skeleton :rows="1" animated />
        </li>
        <li class="role-user-item">
          <el-skeleton :rows="1" animated />
        </li>
      </template>
    </ul>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="comfirmBindUser">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import { UPDATE_MODEL_EVENT } from 'cm/contants'
import { type QueryUserList, type UserApiResult, getUserList, bindRoleUser, type BindUserData } from '@/api/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currId: {
    type: String,
    default: ''
  }
})

const visible = ref<boolean>(false)
const emit = defineEmits([UPDATE_MODEL_EVENT, 'success'])
const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}

// 查询用户
const userList = ref<UserApiResult[]>([])
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const searchReq = ref<QueryUserList>({ page: 0, size: 20 })
const getNotCurrRoleUserListApi = async () => {
  if (!hasMore.value || loading.value) {
    return
  }
  if (searchReq.value.page === 0) {
    userList.value = []
  }
  searchReq.value.page += 1
  loading.value = true
  const res = await getUserList({ ...searchReq.value, status: 1, roleId: props.currId, hasCurrRole: 0 })
  loading.value = false
  if (res?.code === 200) {
    userList.value.push(...(res.data.list as UserApiResult[]))
    hasMore.value = userList.value.length < res.data.total
  }
}

// 点击事件
const checked = ref<string[]>([])
const clickEvent = (userId: string) => {
  const i = checked.value.findIndex((id) => id === userId)
  if (i > -1) checked.value.splice(i, 1)
  else checked.value.push(userId)
}

// 确认
const comfirmBindUser = async () => {
  if (checked.value.length === 0) {
    ElMessage.error('请至少选择一条数据')
    return
  }
  const req: BindUserData = { roleId: props.currId, userIds: checked.value, type: 'create' }
  const res = await bindRoleUser(req)
  if (res?.code === 200) {
    ElMessage.success('关联用户成功')
    emit('success')
    handleClose()
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}

watch(
  () => props.modelValue,
  () => {
    visible.value = props.modelValue
    if (props.modelValue) {
      hasMore.value = true
      searchReq.value.page = 0
      getNotCurrRoleUserListApi()
    } else {
      checked.value = []
    }
  }
)
</script>

<style lang="scss" scoped>
.bind-role-user-list {
  min-height: 300px;
  .role-user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 360px;
    font-size: 16px;
    cursor: pointer;

    &__info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
