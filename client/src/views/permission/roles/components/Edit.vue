<template>
  <el-dialog
    title="角色编辑"
    v-model="visible"
    top="10vh"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-loading="loading"
  >
    <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRule" label-width="90px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model.trim="roleForm.name" :maxlength="30" show-word-limit placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          v-model.trim="roleForm.remark"
          :maxlength="100"
          show-word-limit
          placeholder="角色备注"
        ></el-input>
      </el-form-item>
      <el-form-item label="资源授权" prop="">
        <template #label>
          <span>资源管理</span>
          <span style="margin-left: 7px; cursor: pointer">
            <el-tooltip content="勾选了按钮一定要把相应页面也勾选上" placement="top-start">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <RoleMenuTree v-model="currRolePermMenus"></RoleMenuTree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, type PropType, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

import RoleMenuTree from './RoleMenuTree.vue'

import { getRolePerms, updateRole, type ICreateOrUpdateRole, createRole } from '@/api/role'
import { UPDATE_MODEL_EVENT } from 'cm/contants'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currRole: {
    type: Object as PropType<ICreateOrUpdateRole>
  }
})

const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])

const visible = ref<boolean>(false)

const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}

//
const currRolePermMenus = ref<string[]>([])
const getRolePermListApi = async (id: string) => {
  const res = await getRolePerms(id)
  if (res?.code === 200) {
    currRolePermMenus.value = res.data as string[]
  }
}

const roleForm = ref<ICreateOrUpdateRole>({
  name: '',
  remark: ''
})
const roleFormRule = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名称长度在 2 ~ 30 个字符', trigger: 'blur' }
  ]
}
const roleFormRef = ref()
const loading = ref<boolean>(false)
const createOrUpdateFn = async () => {
  let res
  const req: ICreateOrUpdateRole = { menuIds: currRolePermMenus.value, ...roleForm.value }
  loading.value = true
  if (req.id) {
    res = await updateRole(req)
  } else {
    res = await createRole(req)
  }
  loading.value = false
  if (res?.code === 200) {
    ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
    emit('change')
    handleClose()
  } else {
    ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
  }
}
const confirmEvent = () => {
  roleFormRef.value.validate((valid: boolean) => {
    valid && createOrUpdateFn()
  })
}

watch(
  () => props.modelValue,
  () => {
    visible.value = props.modelValue
    if (props.modelValue) {
      roleForm.value = { ...props.currRole }
      props.currRole?.id && getRolePermListApi(props.currRole.id)
    } else {
      currRolePermMenus.value = []
    }
  }
)
</script>
