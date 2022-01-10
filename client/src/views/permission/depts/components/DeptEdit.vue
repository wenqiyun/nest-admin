<template>
  <div class="dept-form-wrapper" v-loading="loading">
    <div class="dept-action">
      <el-button :disabled="isEdit || !deptForm.id" type="primary" @click="isEdit = true">编辑</el-button>
      <el-button :disabled="isEdit || !deptForm.id" type="danger" @click="delDept">删除</el-button>
      <el-button :disabled="isEdit" @click="addEvent">新增</el-button>
    </div>
    <k-form ref="deptFormRef" class="dept-form" v-bind="formOptions" :disabled="!isEdit" v-model="deptForm">
      <template #parentId>
        <k-select-tree
          v-model="deptForm.parentId"
          :tree-data="deptTree"
          :tree-options="{ nodeKey: 'id', defaultExpandAll: true, props: { label: 'name' }  }"
        ></k-select-tree>
      </template>
      <template #footer v-if="isEdit">
        <div class="dept-form-action">
          <el-button @click="cancelEidt">取消</el-button>
          <el-button type="primary" @click="confirmEvent">确认</el-button>
        </div>
      </template>
    </k-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, inject, Ref, watch } from 'vue'
import { createDept, deleteDept, DeptApiResult, DeptTreeName, ICreateOrUpdateDept, updateDept } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'DeptEdit',
  props: {
    curr: {
      type: Object as PropType<ICreateOrUpdateDept>,
      required: true
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const deptFormDefault = {
      name: '',
      parentId: '0',
      status: 1,
      orderNum: 0,
      leader: '',
      remark: ''
    }
    const deptForm = ref<ICreateOrUpdateDept>({ ...deptFormDefault })

    // 缓存
    const deptFormTmp = ref<ICreateOrUpdateDept>({ ...deptFormDefault })
    watch(() => props.curr, (val: ICreateOrUpdateDept) => {
      deptForm.value = val
      deptFormTmp.value = { ...val }
    })

    // 编辑
    const isEdit = ref<boolean>(false)
    const cancelEidt = () => {
      deptForm.value = { ...deptFormTmp.value }
      isEdit.value = false
    }
    // 新增
    const addEvent = () => {
      deptForm.value = { ...deptFormDefault, parentId: deptFormTmp.value.id }
      isEdit.value = true
    }

    const formOptions = ref({
      mode: 'config',
      labelWidth: '120px',
      formItems: [
        { label: '部门名称：', prop: 'name', component: 'input', placeholder: '请输入部门名称' },
        { label: '上级部门：', prop: 'parentId', slot: true },
        { label: '部门负责人：', prop: 'leader', component: 'input', placeholder: '请输入部门负责人' },
        { label: '排序：', prop: 'orderNum', component: 'inputNumber', min: 0 },
        {
          label: '部门状态：',
          prop: 'status',
          component: 'radio',
          options: [
            { label: 1, content: '正常' },
            { label: 0, content: '停用' }
          ]
        },
        { label: '备注：', prop: 'remark', component: 'input', type: 'textarea', rows: 2, placeholder: '请输入部门备注' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { type: 'string', min: 2, max: 20, message: '部门名称仅支持2~20个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级部门', trigger: 'blur' }
        ],
        leader: [
          { required: true, message: '请输入部门负责人', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '部门负责人仅支持2~10个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择部门状态', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    })

    const deptTree = ref<DeptApiResult[]>([])
    const deptTreeInject = inject<Ref<DeptApiResult[]>>(DeptTreeName, deptTree)
    watch(() => deptTreeInject.value, (val: DeptApiResult[]) => {
      deptTree.value = [
        {
          name: '无上级部门',
          id: '0',
          parentId: '-1',
          orderNum: 0,
          status: 1,
          remark: '',
          leader: '',
          children: val
        }
      ]
    }, { deep: true, immediate: true })

    const loading = ref<boolean>(false)
    const createOrUpdateEvent = async () => {
      let res
      const req = { ...deptForm.value }
      loading.value = true
      if (req.id) {
        res = await updateDept(req)
      } else {
        res = await createDept(req)
      }
      loading.value = false
      if (res?.code === 200) {
        ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
        emit('change')
        isEdit.value = false
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
      }
    }

    const delDept = async () => {
      await ElMessageBox.confirm(`是否确认删除【${deptForm.value.name}】部门？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
      loading.value = true
      const res = await deleteDept(deptForm.value.id as string)
      loading.value = false
      if (res?.code === 200) {
        ElMessage({ type: 'success', message: '删除部门成功' })
        emit('change')
        isEdit.value = false
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
      }
    }

    const deptFormRef = ref()
    const confirmEvent = () => {
      deptFormRef.value.elFormRef.validate((valid: boolean) => {
        valid && createOrUpdateEvent()
      })
    }

    return {
      loading,
      isEdit,
      deptForm,
      deptFormRef,
      formOptions,
      deptTree,
      addEvent,
      cancelEidt,
      delDept,
      confirmEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.dept-form-wrapper {
  width: 100%;
  height: 430px;
  background: #fff;

  .dept-action {
    padding: 10px 20px;
  }
  .dept-form-action {
    text-align: right;
  }
}
:deep(.dept-form) {
  width: 400px;
  margin-top: 10px;
}
</style>
