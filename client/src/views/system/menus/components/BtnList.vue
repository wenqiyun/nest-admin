<template>
  <div class="menu-btn-list-wrap box-bg-color">
    <h3 class="menu__tip">
      <span>当前菜单页面按钮列表</span>
      <span>
        <el-button size="small" :disabled="!currMenu?.id" @click="addOrEditEvent('add')" v-perm="'system_menus:create'">
          添加
        </el-button>
      </span>
    </h3>
    <k-table :data="{ list: btnList }" :loading="loading" :is-pager="false" mode="render" stripe>
      <el-table-column label="按钮名称" prop="name" align="center"></el-table-column>
      <el-table-column label="唯一编码" prop="code" align="left" header-align="center"></el-table-column>
      <el-table-column label="排序" prop="orderNum" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200" v-if="hasActions">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            plain
            @click="addOrEditEvent('edit', row)"
            v-perm="'system_menus:edit'"
          >
            编辑
          </el-button>
          <el-button type="danger" size="small" plain @click="delBtnEvent(row)" v-perm="'system_menus:del'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </k-table>

    <el-dialog
      title="按钮编辑"
      v-model="showEdit"
      width="500px"
      top="10vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <Edit ref="editRef" :curr-menu="currBtn" :is-button-edit="true" @change="addEditSuccess"></Edit>

      <template #footer>
        <el-button @click="showEdit = false">取消</el-button>
        <el-button type="primary" @click="confirmEvent">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import Edit from './Edit.vue'

import { getOneMenuBtns, type MenuApiResult, type ICreateOrUpdateMenu, delMenu } from '@/api/menu'
import { hasPerms } from '@/utils/perm'

const props = defineProps({
  currMenu: {
    type: Object as PropType<MenuApiResult | ICreateOrUpdateMenu>,
    default: null
  }
})

const btnList = ref<MenuApiResult[]>([])
const loading = ref<boolean>(false)
const getCurrMenuBtnList = async (id: string) => {
  loading.value = true
  const res = await getOneMenuBtns(id)
  loading.value = false
  if (res?.code === 200) {
    btnList.value = res.data as MenuApiResult[]
  }
}
// 是否有操作列权限
const hasActions = hasPerms(['system_menus:del', 'system_menus:edit'])

watch(
  () => props.currMenu,
  () => {
    if (props.currMenu?.id) {
      getCurrMenuBtnList(props.currMenu.id as string)
    }
  }
)

// 删除
const delBtnEvent = async (row: MenuApiResult) => {
  await ElMessageBox.confirm(`此操作将会永久删除【${row.name}】按钮，是否继续`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  loading.value = true
  const res = await delMenu(row.id as string)
  loading.value = false
  if (res?.code === 200) {
    ElMessage({ message: `按钮【${row.name}】删除成功`, type: 'success' })
    getCurrMenuBtnList(props.currMenu.id as string)
  } else {
    ElMessage({ message: res.msg, type: 'error' })
  }
}

// 编辑 ，添加
const showEdit = ref<boolean>(false)
const editRef = ref()
const currBtn = ref<ICreateOrUpdateMenu>({
  parentId: ''
})
const addOrEditEvent = (type: 'edit' | 'add', row?: MenuApiResult) => {
  currBtn.value = row || { parentId: props.currMenu.id }
  showEdit.value = true
}
// 确认添加
const confirmEvent = () => {
  editRef.value?.createOrUpdateMenuApi()
}
const addEditSuccess = () => {
  showEdit.value = false
  getCurrMenuBtnList(props.currMenu.id as string)
}
</script>

<style lang="scss" scoped>
.menu-btn-list-wrap {
  margin-top: 7px;
  height: calc(100% - 417px);
}
</style>
