<template>
  <el-dialog title="角色编辑" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRule" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model.trim="roleForm.name" :maxlength="30" show-word-limit placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model.trim="roleForm.remark" :maxlength="100" show-word-limit placeholder="角色备注"></el-input>
      </el-form-item>
      <el-form-item label="资源授权" prop="">
        <role-menu-tree v-model="currRolePermMenus"></role-menu-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { createRole, getRolePerms, ICreateOrUpdateRole, updateRole } from '@/api/role'
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { ElMessage } from 'element-plus'
import { defineComponent, PropType, Ref, ref, watch } from 'vue'
import RoleMenuTree from './RoleMenuTree.vue'

export default defineComponent({
  components: { RoleMenuTree },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currRole: {
      type: Object as PropType<ICreateOrUpdateRole>,
      default: () => {
        return {}
      }
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup (props, { emit }) {
    // dialog
    const visible = ref<boolean>(false)
    const currRolePermMenus = ref<Array<string>>([])
    const getRolePermsFn = async (id: string) => {
      const res = await getRolePerms(id)
      if (res.code === 200) {
        currRolePermMenus.value = res.data as string[]
      }
    }

    // 表单
    const roleForm = ref<ICreateOrUpdateRole>({
      name: '',
      remark: ''
    })

    watch(() => props.modelValue, (val) => {
      visible.value = val
      if (val) {
        roleForm.value = { ...props.currRole }
        props.currRole?.id && getRolePermsFn(props.currRole.id)
      } else {
        //
      }
    })

    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }

    const roleFormRef = ref()
    const roleFormRule = {
      name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 30, message: '角色名称长度在 2 ~ 30 个字符', trigger: 'blur' }
      ]
    }

    const createOrUpdateFn = async () => {
      let res
      const req: ICreateOrUpdateRole = { menuIds: currRolePermMenus.value, ...roleForm.value }
      if (req.id) {
        res = await updateRole(req)
      } else {
        res = await createRole(req)
      }
      if (res.code === 200) {
        ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
        emit('change')
        handleClose()
      } else {
        ElMessage({ message: res.msg, type: 'error' })
      }
    }

    const confirmEvent = () => {
      roleFormRef.value.validate((valid: boolean) => {
        valid && createOrUpdateFn()
      })
    }

    return {
      visible,
      handleClose,
      confirmEvent,
      // 表单
      roleForm,
      roleFormRef,
      roleFormRule,
      currRolePermMenus
    }
  }
})
</script>
