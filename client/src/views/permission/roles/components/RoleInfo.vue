<template>
  <div class="role-info-wrapper">
    <h3 class="roles__tip clearfix">
      <span>基础信息</span>
      <span class="fr role-edit-action">
        <el-button type="primary" @click="showEditEvent">编辑</el-button>
        <el-button type="danger" @click="delRoleFn">删除</el-button>
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
    <role-edit v-model="showEdit" :curr-role="currRole"></role-edit>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { jsonTimeFormat } from '@/utils/index'
import RoleEdit from './RoleEdit.vue'
import { getAllMenu, MenuApiResult } from '@/api/menu'
import { ICreateOrUpdateRole } from '@/api/role'

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
  setup (props) {
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
      console.log(1)
    }

    // 查询所拥有的菜单资源
    const menuList = ref<Array<MenuApiResult>>([])

    const getMenuList = async () => {
      const res = await getAllMenu()
      if (res.code === 200) {
        menuList.value = res.data as MenuApiResult[]
      }
    }
    getMenuList()

    provide('menus', menuList)

    return {
      jsonTimeFormatFn,
      showEdit,
      delRoleFn,
      showEditEvent
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
