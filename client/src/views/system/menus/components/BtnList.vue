<template>
  <div class="btn-list-wrapper">
    <div class="filter-container">
      <div class="filter-item">
        <el-button @click="addOrEditEvent('add')" :disabled="!currMenu?.id">添加</el-button>
      </div>
    </div>
    <k-table :data="{ list: btnList }" :loading="loading" :is-pager="false" mode="render" border stripe size="mini">
      <el-table-column label="按钮名称" prop="name" align="center"></el-table-column>
      <el-table-column label="唯一编码" prop="code" align="center"></el-table-column>
      <el-table-column label="排序" prop="orderNum" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button type="primary" plain size="mini" @click="addOrEditEvent('edit', row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delBtnFn(row)">删除</el-button>
        </template>
      </el-table-column>
    </k-table>

    <btn-edit v-model="showEdit" :parent="currMenu" :curr-btn="currBtn" @change="addOrEditSuccess"></btn-edit>
  </div>
</template>

<script lang="ts">
import { delMenu, getOneMenuBtns, MenuApiResult } from '@/api/menu'
import { defineComponent, ref, watch } from 'vue'
import BtnEdit from './BtnEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { BtnEdit },
  props: {
    currMenu: {
      type: Object,
      default: null
    }
  },
  setup (props, { emit }) {
    const btnList = ref<Array<MenuApiResult>>([])
    const loading = ref<boolean>(false)
    const getOneMenuBtnsFn = async (id: string) => {
      loading.value = true
      const res = await getOneMenuBtns(id)
      loading.value = false
      if (res.code === 200) {
        btnList.value = res.data as Array<MenuApiResult>
      }
    }
    watch(() => props.currMenu, (val) => {
      if (val?.id) {
        getOneMenuBtnsFn(val.id as string)
      }
    })

    const delBtnFn = async (row: MenuApiResult) => {
      try {
        await ElMessageBox.confirm(`此操作将会永久删除【${row.name}】按钮，是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        loading.value = true
        const res = await delMenu(row.id as string)
        loading.value = false
        if (res.code === 200) {
          ElMessage({ message: `按钮【${row.name}】删除成功`, type: 'success' })
          getOneMenuBtnsFn(props.currMenu.id)
        } else {
          ElMessage({ message: res.msg, type: 'error' })
        }
      } catch (error) {}
    }

    const currBtn = ref<MenuApiResult>()
    const showEdit = ref<boolean>(false)
    const addOrEditEvent = (type: 'add' | 'edit', row: MenuApiResult) => {
      if (type === 'add' && !props.currMenu?.id) {
        ElMessage({ message: '请先选择左侧菜单,再添加该菜单下的按钮', type: 'error' })
        return
      }
      currBtn.value = row
      showEdit.value = true
    }

    const addOrEditSuccess = () => {
      getOneMenuBtnsFn(props.currMenu.id as string)
    }
    return {
      loading,
      btnList,
      showEdit,
      addOrEditEvent,
      delBtnFn,
      currBtn,
      addOrEditSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-list-wrapper {
  width: 100%;
  height: calc(100% - 430px);
  margin-top: 10px;
  padding: 10px;
  background: #fff;
}
</style>
