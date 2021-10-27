<template>
  <el-dialog v-if="visible" title="用户信息编辑" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="userFormRef" :model="userForm" label-width="80px" :rules="userFormRules">
      <el-form-item label="帐号" prop="">
        <el-input v-model="userForm.account" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="">
        <el-avatar src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'></el-avatar>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNum">
        <el-input v-model.trim="userForm.phoneNum"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="userForm.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { ICreateOrUpdateUser, getUserInfo as getUserInfoApi } from '@/api/user'
import { validPhone, validEmail } from '../../../../utils/validate'

export default defineComponent({
  name: 'EditUser',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currId: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup (props, { emit }) {
    const userFormRef = ref()

    // dialog
    const visible = ref<boolean>(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })

    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }

    // 表单
    const userForm = ref<ICreateOrUpdateUser>({
      account: '',
      phoneNum: '',
      email: '',
      avatar: ''
    })

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
      phoneNum: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: validPhoneNum, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: validEmailFn, trigger: 'blur' }
      ]
    }

    const getUserInfo = async (currId: number) => {
      const res = await getUserInfoApi(currId)
      if (res?.code === 200) {
        userForm.value = res.data as ICreateOrUpdateUser
      }
    }

    watch(() => props.modelValue, (val: boolean) => {
      val && props.currId && getUserInfo(props.currId)
    })

    return {
      visible,
      handleClose,
      userForm,
      userFormRef,
      userFormRules
    }
  }
})
</script>
