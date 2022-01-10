<template>
  <el-dialog title="岗位信息编辑" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <k-form v-if="visible" ref="postFormRef" v-bind="formOptions" v-model="postForm" v-loading="loading"></k-form>
    <template #footer>
      <el-button @click="handleClose" :loading="loading">取消</el-button>
      <el-button type="primary" @click="confirmEvent" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { createPost, ICreateOrUpdatePost, updatePost, getPostInfo as getPostInfoApi } from '@/api/post'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'EditPosts',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    curr: {
      type: String,
      default: ''
    }
  },
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup (props, { emit }) {
    const loading = ref<boolean>(false)
    const postFormDefault = {
      name: '',
      code: '',
      status: 1,
      orderNum: 0,
      remark: ''
    }
    const postForm = ref<ICreateOrUpdatePost>({ ...postFormDefault })

    const formOptions = ref({
      mode: 'config',
      labelWidth: '100px',
      formItems: [
        { label: '岗位名称：', prop: 'name', component: 'input', placeholder: '请输入岗位名称' },
        { label: '岗位编码：', prop: 'code', component: 'input', placeholder: '请输入岗位编码' },
        { label: '排序：', prop: 'orderNum', component: 'inputNumber', min: 0 },
        {
          label: '岗位状态：',
          prop: 'status',
          component: 'radio',
          options: [
            { label: 1, content: '正常' },
            { label: 0, content: '停用' }
          ]
        },
        { label: '备注：', prop: 'remark', component: 'input', type: 'textarea', rows: 4, placeholder: '请输入岗位备注' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择岗位状态', trigger: 'blur' }
        ]
      }
    })

    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }

    const postFormRef = ref()

    const createOrUpdate = async () => {
      let res
      const req: ICreateOrUpdatePost = { ...postForm.value }
      loading.value = true
      if (req.id) {
        // delete req.createDate
        res = await updatePost(req)
      } else {
        res = await createPost(req)
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
      postFormRef.value.elFormRef.validate((valid: boolean) => {
        valid && createOrUpdate()
      })
    }

    const getPostInfo = async () => {
      const res = await getPostInfoApi(props.curr)
      if (res?.code === 200) {
        postForm.value = res.data as ICreateOrUpdatePost
      }
    }

    // dialog
    const visible = ref<boolean>(false)
    watch(() => props.modelValue, (val: boolean) => {
      visible.value = val
      if (val) {
        postForm.value = { ...postFormDefault }
        props.curr && getPostInfo()
      }
    })

    return {
      visible,
      handleClose,
      loading,
      formOptions,
      postForm,
      postFormRef,
      confirmEvent
    }
  }
})
</script>
