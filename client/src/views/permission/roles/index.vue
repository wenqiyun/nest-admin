<template>
  <div class="">
    <!-- 左侧角色列表 -->
    <div class="role-list-wrap box-bg-color">
      <h3 class="role__tip">
        <span>全部角色</span>
        <span class="clearfix tip-action">
          <el-button size="small" @click="addRoleEvent" v-perm="'perm_roles:create'">新增</el-button>
        </span>
      </h3>
      <el-scrollbar wrap-class="scrollbar-list">
        <ul>
          <li
            :class="{ 'role-item': true, 'is-active': currRole.id === role.id }"
            v-for="role in roleList"
            :key="role.id"
            @click="roleClickEvent(role)"
          >
            {{ role.name }}
          </li>
          <template v-if="loading">
            <li class="role-item">
              <el-skeleton :rows="1" animated />
            </li>
            <li class="role-item">
              <el-skeleton :rows="1" animated />
            </li>
            <li class="role-item">
              <el-skeleton :rows="1" animated />
            </li>
          </template>
        </ul>
      </el-scrollbar>
    </div>

    <!-- 右侧详情，及绑定的用户列表 -->
    <div class="right-content">
      <RoleInfo ref="roleInfoRef" :curr-role="currRole" @change="roleChange"></RoleInfo>
      <RoleUserList :curr-id="currRole.id"></RoleUserList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import RoleInfo from './components/RoleInfo.vue'
import RoleUserList from './components/RoleUserList.vue'

import { useApiLock } from '_hooks'

import { getRoleList, type QueryRoleList, type RoleApiResult } from '@/api/role'

const loading = ref<boolean>(false)
const currRole = ref<RoleApiResult>({ id: '', name: '', remark: '' })
const roleClickEvent = (role: RoleApiResult) => {
  currRole.value = role
}
const roleList = ref<RoleApiResult[]>([])
const getRoleListApi = async (req: QueryRoleList) => {
  loading.value = true
  const res = await useApiLock(async () => await getRoleList(req), 500)
  loading.value = false
  if (res?.code === 200) {
    roleList.value = res.data as RoleApiResult[]
    if (roleList.value?.length > 0) {
      // currRole.value && roleList.value.findIndex((v) => v.id === currRole.value.id) > -1
      if (!currRole.value || roleList.value.findIndex((v) => v.id === currRole.value.id) === -1) {
        roleClickEvent(roleList.value[0])
      }
    }
  }
}
getRoleListApi({})

// 新增
const roleInfoRef = ref()
const addRoleEvent = () => {
  console.log(roleInfoRef.value)
  roleInfoRef.value.showEditEvent({ name: '', remark: '' })
}
const roleChange = () => {
  getRoleListApi({})
}
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  padding: 0 !important;
  justify-content: space-between;
}
:deep(.role__tip) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 1px 1px 0 0 var(--line-color);
  // 阴影部分显示
  margin-bottom: 1px;
}
.role-list-wrap {
  overflow: hidden;
  width: 200px;

  :deep(.scrollbar-list) {
    height: calc(100% - 51px);
  }

  .role-item {
    padding: 7px 16px;
    line-height: 1.5;
    cursor: pointer;

    &:hover {
      color: var(--el-menu-active-color);
    }

    &.is-active {
      background-color: var(--el-menu-active-bg-color);
      color: var(--el-menu-active-color);
    }
  }
}

.right-content {
  width: calc(100% - 207px);
  margin-left: 7px;
}
</style>
