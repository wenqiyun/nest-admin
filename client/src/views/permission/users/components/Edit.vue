<template>
  <el-dialog title="用户信息编辑" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="userFormRef" :model="userForm" label-width="80px">
      <el-form-item label="帐号" prop="">
        <el-input v-model="userForm.account" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="">
        <el-input v-model.trim="userForm.avatar"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="">
        <el-input v-model.trim="userForm.phoneNum"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="">
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
import { ICreateOrUpdateUser } from '@/api/user'

export default defineComponent({
  name: 'EditUser',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currUser: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup (props, { emit }) {
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

    watch(() => props.modelValue, (val: boolean) => {
      if (val) {
        userForm.value = props.currUser
      }
    })
    const userFormRef = ref()
    return {
      visible,
      handleClose,
      userForm,
      userFormRef
    }
  }
})
</script>
