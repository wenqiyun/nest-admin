<template>
  <el-dialog
    title="部门编辑"
    v-model="visible"
    top="10vh"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRule" v-loading="loading">
      <el-form-item label="名称" prop="name">
        <el-input v-model="deptForm.name" clearable placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId">
        <el-tree-select
          v-model="deptForm.parentId"
          :data="deptData"
          check-strictly
          node-key="id"
          :props="{ label: 'name' }"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="deptForm.orderNum" :min="0" :max="3000" :step="1" :precision="0" step-strictly />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, type PropType, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { updateDept, type DeptApiResult, type ICreateOrUpdateDept, createDept } from '@/api/dept'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true
  },
  deptList: {
    type: Array as PropType<DeptApiResult[]>,
    default: () => []
  },
  currDept: {
    type: Object as PropType<DeptApiResult>,
    default: () => null
  },
  deptMap: {
    type: Object,
    default: () => ({})
  }
})

const deptData = computed(() => {
  return [
    {
      id: '0',
      parentId: '',
      name: '无',
      children: props.deptList
    }
  ]
})

const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])

const visible = ref<boolean>(false)

const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}

const loading = ref<boolean>(false)
const deptForm = ref<ICreateOrUpdateDept>({
  parentId: '',
  name: '',
  leader: '',
  remark: '',
  orderNum: 0
})
const deptFormRule = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '部门名称长度在 2 ~ 50 个字符', trigger: 'blur' }
  ]
}
const createOrUpdateApi = async () => {
  let res
  loading.value = true
  if (deptForm.value.id) {
    res = await updateDept(deptForm.value)
  } else {
    res = await createDept(deptForm.value)
  }
  loading.value = false
  if (res?.code === 200) {
    ElMessage.success(`${deptForm.value.id ? '更新' : '创建'}成功`)
    emit('change')
    handleClose()
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}
const deptFormRef = ref()
const confirmEvent = () => {
  deptFormRef.value?.validate((valid: boolean) => {
    valid && createOrUpdateApi()
  })
}

watch(
  () => props.modelValue,
  () => {
    visible.value = props.modelValue
    deptForm.value = { ...props.currDept }
    deptFormRef.value?.clearValidate()
  }
)
</script>
