<template>
  <div class="role-info-wrap box-bg-color">
    <h3 class="role__tip">
      <span>基础信息</span>
      <span>
        <el-button type="primary" size="small" @click="showEditEvent()" v-perm="'perm_roles:edit'">编辑</el-button>
        <el-button type="danger" size="small" @click="delRoleEvent" v-perm="'perm_roles:del'">删除</el-button>
      </span>
    </h3>
    <div class="role-info-content">
      <template v-if="props.currRole.name">
        <div class="role-info-item">
          <span class="role-info-item__label">角色名称：</span>
          <span class="role-info-item__content">{{ props.currRole.name }}</span>
        </div>
        <div class="role-info-item">
          <span class="role-info-item__label">创建时间：</span>
          <span class="role-info-item__content">{{ dateStrFormat(props.currRole.createDate as string) }}</span>
        </div>
        <div class="role-info-item">
          <span class="role-info-item__label">备注：</span>
          <span class="role-info-item__content">{{ props.currRole.remark }}</span>
        </div>
      </template>
      <el-skeleton v-else :rows="3" animated />
    </div>
    <Edit v-model="showEdit" :curr-role="editRole" @change="editChange"></Edit>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, type PropType } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import Edit from './Edit.vue'

import { dateStrFormat } from '@/utils/index'

import { delRoleInfo, type ICreateOrUpdateRole, type RoleApiResult } from '@/api/role'
import type { MenuApiResult } from '@/api/menu'
import { getCurrUserMenuPerms } from '@/api/perm'

const props = defineProps({
  currRole: {
    type: Object as PropType<RoleApiResult>,
    default: () => {
      return {
        name: '',
        createDate: '',
        remark: ''
      }
    }
  }
})

// 删除
const delRoleEvent = async () => {
  await ElMessageBox.confirm(`是否确认删除【${props.currRole.name}】角色？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const res = await delRoleInfo(props.currRole.id)
  if (res?.code === 200) {
    ElMessage({ type: 'success', message: '删除角色成功' })
  } else {
    ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
  }
}

// 编辑
const showEdit = ref<boolean>(false)
const editRole = ref<ICreateOrUpdateRole>({
  name: '',
  remark: ''
})
const showEditEvent = (newRole?: ICreateOrUpdateRole) => {
  editRole.value = newRole || (props.currRole as ICreateOrUpdateRole)
  showEdit.value = true
}
// 查询该角色下所拥有的菜单资源
const menuList = ref<MenuApiResult[]>([])
const getMenuListApi = async () => {
  const res = await getCurrUserMenuPerms()
  if (res?.code === 200) {
    menuList.value = res.data as MenuApiResult[]
  }
}
getMenuListApi()
provide('menus', menuList)

const emit = defineEmits(['change'])
const editChange = () => {
  emit('change', 'edit')
}

defineExpose({
  showEditEvent
})
</script>

<style lang="scss" scoped>
.role-info-wrap {
  width: 100%;
  height: 220px;
  .role-info-content {
    padding: 10px;
    .role-info-item {
      padding: 5px 10px;
      line-height: 1.5;

      &__label {
        display: inline-block;
        width: 80px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
      }
      &__content {
        line-height: 1.5;
      }
    }
  }
}
</style>
