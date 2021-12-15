<template>
  <el-dialog title="按钮编辑" v-model="visible" width="500px" top="10vh" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="btnFormRef" :model="btnForm" :rules="btnFormRules" label-width="80px" v-loading="loading">
      <el-form-item label="按钮名称" prop="name">
        <el-input v-model.trim="btnForm.name"></el-input>
      </el-form-item>
      <el-form-item label="唯一编码" prop="code">
        <el-input v-model.trim="btnForm.code"></el-input>
      </el-form-item>
      <el-form-item label="授权集合" prop="">
        <api-perms-select v-model="currApiPerms"></api-perms-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="btnForm.orderNum"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { createMenu, getOneMenuPerms, ICreateOrUpdateMenu, MenuPermApiResult, updateMenu } from '@/api/menu'
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { ElMessage } from 'element-plus'
import { defineComponent, PropType, ref, watch } from 'vue'
import ApiPermsSelect from './ApiPermsSelect.vue'

export default defineComponent({
  components: { ApiPermsSelect },
  props: {
    modelValue: {
      type: Boolean,
      defeault: false
    },
    parent: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currBtn: {
      type: Object as PropType<ICreateOrUpdateMenu>,
      default: () => null
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

    const loading = ref<boolean>(false)

    const currApiPerms = ref<Array<string>>([])
    const getOneMenuPermsFn = async (id: string) => {
      loading.value = true
      const res = await getOneMenuPerms(id)
      loading.value = false
      if (res.code === 200) {
        const permList = res.data as Array<MenuPermApiResult>
        currApiPerms.value = permList.map(perm => `${perm.apiMethod.toUpperCase()},${perm.apiUrl}`)
      }
    }

    // 表单相关
    const btnFormRef = ref()
    const btnForm = ref<ICreateOrUpdateMenu>({
      name: '',
      code: '',
      orderNum: 0
    })

    watch(() => props.modelValue, (val) => {
      if (val) {
        if (btnFormRef.value) {
          btnFormRef.value.clearValidate()
          btnFormRef.value.resetFields()
        }
        btnForm.value = props.currBtn || { name: '', code: '', orderNum: 0 }
        if (btnForm.value.id) {
          getOneMenuPermsFn(btnForm.value.id as string)
        } else {
          currApiPerms.value = []
        }
      }
    })

    const createOrUpdateBtnFn = async () => {
      const req: ICreateOrUpdateMenu = {
        ...btnForm.value,
        type: 3,
        parentId: props.parent.id || '0',
        orderNum: 0,
        menuPermList: currApiPerms.value.map(curr => {
          const permObjArr = curr.split(',')
          return { apiMethod: permObjArr[0], apiUrl: permObjArr[1] } as MenuPermApiResult
        })
      }
      req.parentId = req.parentId || '0'
      let res
      loading.value = true
      if (req.id) {
        res = await updateMenu(req)
      } else {
        res = await createMenu(req)
      }
      loading.value = false
      if (res.code === 200) {
        ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
        emit('change')
        handleClose()
      } else {
        ElMessage({ message: res.msg, type: 'error' })
      }
    }

    const confirmEvent = () => {
      btnFormRef.value.validate((valid: boolean) => {
        if (valid) createOrUpdateBtnFn()
      })
    }

    const btnFormRules = ref({
      name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入唯一编码', trigger: 'blur' }
      ]
    })

    return {
      visible,
      handleClose,
      btnFormRef,
      btnForm,
      currApiPerms,
      btnFormRules,
      confirmEvent,
      loading
    }
  }
})
</script>
