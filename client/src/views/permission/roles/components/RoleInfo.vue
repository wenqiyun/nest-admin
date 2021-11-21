<template>
  <div class="role-info-wrapper">
    <h3 class="roles__tip clearfix">
      <span>基础信息</span>
      <span class="fr role-edit-action">
        <el-button type="primary" :disabled="!currRole.id" @click="() => showEditEvent()">编辑</el-button>
        <el-button type="danger" :disabled="!currRole.id" @click="delRoleFn">删除</el-button>
      </span>
    </h3>
    <div class="role-info-content">
      <div class="role-item">
        <span class="role-item__label">角色名称：</span>
        <span class="role-item__content">{{ currRole.name }}</span>
      </div>
      <div class="role-item">
        <span class="role-item__label">创建时间：</span>
        <span class="role-item__content">{{ jsonTimeFormatFn(currRole.createDate) }}</span>
      </div>
      <div class="role-item">
        <span class="role-item__label">备注：</span>
        <span class="role-item__content">{{ currRole.remark }}</span>
      </div>
    </div>
    <role-edit v-model="showEdit" :curr-role="editRole" @change="editChange"></role-edit>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { jsonTimeFormat } from '@/utils/index'
import RoleEdit from './RoleEdit.vue'
import { MenuApiResult } from '@/api/menu'
import { getCurrUserMenuPerms } from '@/api/perm'
import { ICreateOrUpdateRole, delRoleInfo } from '@/api/role'

export default defineComponent({
  components: { RoleEdit },
  props: {
    currRole: {
      type: Object,
      default: () => {
        return {
          name: '',
          createDate: '',
          remark: ''
        }
      }
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const showEdit = ref<boolean>(false)

    const editRole = ref<ICreateOrUpdateRole>({
      name: '',
      remark: ''
    })

    const showEditEvent = (newRole?: ICreateOrUpdateRole) => {
      editRole.value = newRole || props.currRole as ICreateOrUpdateRole
      showEdit.value = true
    }

    const jsonTimeFormatFn = (time: string) => {
      if (time) {
        return jsonTimeFormat(time, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    }

    const delRoleFn = async () => {
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

    // 查询所拥有的菜单资源
    const menuList = ref<Array<MenuApiResult>>([])

    const getMenuList = async () => {
      const res = await getCurrUserMenuPerms()
      if (res.code === 200) {
        menuList.value = res.data as MenuApiResult[]
      }
    }
    getMenuList()

    provide('menus', menuList)

    const editChange = () => {
      emit('change', 'edit')
    }

    return {
      jsonTimeFormatFn,
      showEdit,
      delRoleFn,
      showEditEvent,
      editChange,
      editRole
    }
  }
})
</script>

<style lang="scss" scoped>
.role-info-wrapper {
  width: 100%;
  height: 220px;
  background: #fff;

  .role-info-content {
    padding: 10px;
  }

  .role-edit-action {
    margin-right: 16px;
  }

  .role-item {
    padding: 5px 10px;
    line-height: 1.5;

    &__label {
      display: inline-block;
      width: 80px;
      text-align: right;
      font-weight: 700;
      font-size: 14px;
      white-space: nowrap;
    }
    &__content {
      line-height: 1.5;
    }
  }
}
</style>
