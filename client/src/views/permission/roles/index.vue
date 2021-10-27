<template>
  <div class="roles-container">
    <div class="roles-list-wrapper">
      <h3 class="roles__tip">
        <span>全部角色</span>
        <span class="fr clearfix tip-action">
          <el-button size="mini" @click="addRoleEvent">新增</el-button>
        </span>
      </h3>
      <ul>
        <li
          class="roles-item"
          :class="{ 'role-item': true, 'is-active': currRole.id === role.id }"
          v-for="role in roleData.list"
          :key="role.id"
          @click="roleClickEvent(role)"
          >
          {{ role.name }}
        </li>
      </ul>
    </div>
    <!-- 右侧 -->
    <div class="role-content">
      <role-info ref="roleInfoRef" :curr-role="currRole"></role-info>
      <role-user-list></role-user-list>
    </div>
  </div>
</template>

<script lang="ts">
import { getRoleList, QueryRoleList, RoleApiResult } from '@/api/role'
import { ListResultData } from '@/common/types/apiResult.type'
import { defineComponent, ref } from 'vue'
import RoleInfo from './components/RoleInfo.vue'
import RoleUserList from './components/RoleUserList.vue'

export default defineComponent({
  components: { RoleInfo, RoleUserList },
  setup () {
    const roleData = ref<ListResultData<RoleApiResult>>({ list: [], total: 0 })
    const currRole = ref<RoleApiResult>()
    const getRoleListFn = async (req: QueryRoleList) => {
      const res = await getRoleList(req)
      if (res.code === 200) {
        roleData.value = res.data as ListResultData<RoleApiResult>
        if (req.page === 1 && roleData.value.list?.length > 0) {
          currRole.value = roleData.value.list[0]
        }
      }
    }

    const roleClickEvent = (role: RoleApiResult) => {
      currRole.value = role
    }

    getRoleListFn({ size: 10, page: 1 })

    // 新增
    const roleInfoRef = ref()
    const addRoleEvent = () => {
      roleInfoRef.value.showEditEvent({ name: '', remark: '' })
    }

    return {
      roleInfoRef,
      roleData,
      currRole,
      roleClickEvent,
      addRoleEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.roles-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  background: rgba(245, 245, 245, .6);
}

:deep(.roles__tip) {
  vertical-align: middle;
  line-height: 50px;
  padding-left: 16px;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid #eee;

  .tip-action {
    margin-right: 16px;
  }
}

.roles-list-wrapper {
  width: 200px;
  height: 100%;
  padding-bottom: 20px;
  background: #fff;
  overflow: hidden;

  .roles-item {
    padding: 7px 16px;
    line-height: 1.5;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: #F5F7FA;
    }

    &.is-active {
      background-color: #f0f7ff;
      color: #008fe4;
    }
  }
}

.role-content {
  width: calc(100% - 200px);
  margin-left: 10px;
  height: 100%;
}
</style>
