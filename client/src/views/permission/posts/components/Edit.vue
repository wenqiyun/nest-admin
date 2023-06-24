<template>
  <el-dialog
    title="岗位编辑"
    v-model="visible"
    top="10vh"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="postFormRef" :model="postForm" v-loading="loading" :rules="postFormRule" label-width="80">
      <el-form-item prop="name" label="岗位名称">
        <el-input v-model.trim="postForm.name" placeholder="请输入岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="code" label="岗位编码">
        <el-input v-model.trim="postForm.code" placeholder="请输入岗位编码" clearable></el-input>
      </el-form-item>
      <el-form-item prop="status" label="岗位状态" v-if="props.currId">
        <el-select v-model="postForm.status" clearable style="width: 100px" placeholder="请选择">
          <el-option label="使用中" :value="1">
            <k-badge type="primary" content="使用中"></k-badge>
          </el-option>
          <el-option label="已禁用" :value="0">
            <k-badge type="danger" content="已禁用"></k-badge>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="orderNum" label="排序">
        <el-input-number
          v-model="postForm.orderNum"
          :min="0"
          :max="3000"
          :step="1"
          :precision="0"
          step-strictly
        ></el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { UPDATE_MODEL_EVENT } from 'cm/contants'
import { updatePost, getPostDetail, createPost, type ICreateOrUpdatePost, type PostApiResult } from '@/api/post'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  currId: {
    type: String,
    required: true,
    default: ''
  }
})

const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])
const visible = ref<boolean>(false)
const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}

const loading = ref<boolean>(false)
const postFormRef = ref()
const postForm = ref<ICreateOrUpdatePost>({
  name: '',
  code: '',
  remark: '',
  status: 1,
  orderNum: 0
})

const postFormRule = {
  name: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '岗位名称长度在 2 ~ 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入岗位编码', trigger: 'blur' },
    { max: 50, message: '岗位名称长度在 1 ~ 50 个字符', trigger: 'blur' }
  ]
}

const createOrUpdateApi = async () => {
  let res
  loading.value = true
  if (postForm.value.id) {
    res = await updatePost(postForm.value)
  } else {
    res = await createPost(postForm.value)
  }
  loading.value = false
  if (res?.code === 200) {
    ElMessage.success(`${postForm.value.id ? '更新' : '创建'}成功`)
    emit('change')
    handleClose()
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}
const confirmEvent = () => {
  postFormRef.value?.validate((valid: boolean) => {
    valid && createOrUpdateApi()
  })
}

const getPostDetailApi = async (id: string) => {
  const res = await getPostDetail(id)
  if (res?.code === 200) {
    postForm.value = res.data as PostApiResult
  } else {
    ElMessage.error(res?.msg || '网络异常，请稍后重试')
  }
}

watch(
  () => props.modelValue,
  () => {
    visible.value = props.modelValue
    if (props.modelValue) {
      postFormRef.value?.resetFields()
    }
    props.modelValue && props.currId && getPostDetailApi(props.currId)
  }
)
</script>
