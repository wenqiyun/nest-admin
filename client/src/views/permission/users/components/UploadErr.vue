<template>
  <el-dialog title="批量上传" v-model="visible" top="10vh" width="600px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-alert :title="errMsg" type="error" style="margin-bottom: 16px;" />
    <k-table v-bind="tableData" border></k-table>
    <template #footer>
      <el-button type="primary" @click="handleClose">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { UPDATE_MODEL_EVENT } from '@/common/contants'
import { IKTableProps } from '@/plugins/k-ui/packages/table/src/Table.type'
import { defineComponent, ref, watch } from 'vue'

interface IUploadError {
  attr: string,
  key: string,
  val: string
}

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    errMsg: {
      type: String,
      default: ''
    },
    errData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [UPDATE_MODEL_EVENT],
  setup (props, { emit }) {
    // dialog
    const visible = ref<boolean>(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })

    const handleClose = () => {
      emit(UPDATE_MODEL_EVENT, false)
    }

    const tableData = ref<IKTableProps<IUploadError>>({
      mode: 'config',
      data: { list: [] },
      auto: false,
      isPager: false,
      columns: [
        { label: '错误字段', prop: 'attr' },
        { label: '错误值', prop: 'key' },
        { label: '具体位置', prop: 'val' }
      ]
    })

    watch(() => props.errData, (val) => {
      const errArr: IUploadError[] = []
      if (val.account?.length > 0) {
        errArr.push(...val.account.map((v: any) => ({ ...v, attr: '帐号', val: `第 ${v.val.join(',')} 行` })))
      }
      if (val.phone?.length > 0) {
        errArr.push(...val.phone.map((v: any) => ({ ...v, attr: '手机号', val: `第 ${v.val.join(',')} 行` })))
      }
      if (val.email?.length > 0) {
        errArr.push(...val.email.map((v: any) => ({ ...v, attr: '邮箱', val: `第 ${v.val.join(',')} 行` })))
      }
      tableData.value.data.list = errArr
    })

    return {
      visible,
      handleClose,
      tableData
    }
  }
})
</script>
