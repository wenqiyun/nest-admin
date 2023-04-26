<template>
  <el-dialog
    title="用户信息编辑"
    v-model="visible"
    top="10vh"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-loading="loading"
  >
    <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-position="left" label-width="80px">
      <el-form-item label="帐号" prop="account">
        <el-input v-model="userForm.account" disabled></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-avatar :src="userForm.avatar" style="cursor: pointer" @click="avatarClickEvent"></el-avatar>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNum">
        <el-input v-model="userForm.phoneNum" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds" v-if="userForm.type === 1">
        <el-select v-model="userForm.roleIds" v-if="visible" placeholder="请选择角色" multiple clearable>
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="updateOrCreate">确定</el-button>
    </template>

    <!-- 头像编辑 -->
    <AvatarCropper v-model="showAvatarCropper" :avatar-url="userForm.avatar" @change="uploadSuccess"></AvatarCropper>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue'
import { UPDATE_MODEL_EVENT } from 'cm/contants'

import AvatarCropper from './AvatarCropper.vue'

import { validEmail, validPhone } from '@/utils/validate'

import type { RoleApiResult } from '@/api/role'
import { getUserInfo, getUserRoleIds, updateUser, type ICreateOrUpdateUser } from '@/api/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  currId: {
    type: String,
    required: true,
    default: ''
  },
  roleList: {
    type: Array as PropType<RoleApiResult[]>,
    default: () => []
  }
})

const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])

const visible = ref<boolean>(false)

const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}

const defaultForm = {
  id: '',
  account: '',
  phoneNum: '',
  email: '',
  avatar: '',
  roleIds: []
}
// 表单逻辑
const userForm = ref<ICreateOrUpdateUser>({ ...defaultForm })

const validPhoneNum = (rule: any, value: string, callback: any) => {
  if (validPhone(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

const validEmailFn = (rule: any, value: string, callback: any) => {
  if (validEmail(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱'))
  }
}

const userFormRules = {
  account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  phoneNum: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validPhoneNum, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: validEmailFn, trigger: 'blur' }
  ],
  roleIds: [
    {
      required: true,
      type: 'array',
      message: '请至少选择一个角色',
      trigger: 'change'
    }
  ]
}
const loading = ref<boolean>(false)
// 查询用户详情
const getUserInfoApi = async (currId: string) => {
  loading.value = true
  const res = await getUserInfo(currId)
  loading.value = false
  if (res?.code === 200) {
    userForm.value = res.data as ICreateOrUpdateUser
  }
}
// 查询用户角色 id 集合
const getUserRoleIdsApi = async (currId: string) => {
  const res = await getUserRoleIds(currId)
  if (res?.code === 200) {
    userForm.value.roleIds = res.data as number[]
  }
}

// 头像编辑
const showAvatarCropper = ref<boolean>(false)
const avatarClickEvent = () => {
  showAvatarCropper.value = !showAvatarCropper.value
}
const uploadSuccess = (url: string) => {
  userForm.value.avatar = url
}

watch(
  () => props.modelValue,
  async () => {
    visible.value = props.modelValue
    if (props.modelValue && props.currId) {
      await getUserInfoApi(props.currId)
      getUserRoleIdsApi(props.currId)
    }
  }
)

const userFormRef = ref()
const updateOrCreate = async () => {
  userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const res = await updateUser(userForm.value)
      loading.value = false
      if (res?.code === 200) {
        ElMessage({ type: 'success', message: '更新成功' })
        emit('change')
        handleClose()
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试！' })
      }
    }
  })
}
</script>
