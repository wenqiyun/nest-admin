<template>
  <div>
    <div class="main-header">
      <el-input v-model="searchReqTemp.roleName" clearable style="width: 200px;" placeholder="角色名称"></el-input>
      <div class="fr">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button @click="toEditEvent(null)" v-perm="{ code: 'permission_roles:create' }">添加</el-button>
      </div>
    </div>
    <div class="roles-container">
      <div class="roles-list-wrapper">
        <h3 class="roles-tip">全部角色</h3>
        <ul>
          <li class="roles-list-item" v-for="item in roleList" :class="{ 'active': currentItem.roleId === item.roleId }" :key="item.roleId" @click="checkedRoleEvent(item)">{{ item.roleName }}</li>
        </ul>
        <el-pagination hide-on-single-page background small :current-page="page.pageNum" :page-size="page.pageSize" layout="prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      </div>
      <div class="roles-main">
        <div class="roles-info-wrapper">
          <h3 class="roles-tip">
            <span>基础信息</span>
            <div class="fr" style="margin-right: 16px;">
              <el-button type="primary" @click="toEditEvent(currentItem.roleId)" size="mini" v-perm="{ code: 'permission_roles:edit' }" >编辑</el-button>
              <el-button type="danger" @click="delEvent(currentItem.roleId)" size="mini" v-perm="{ code: 'permission_roles:del' }">删除</el-button>
            </div>
          </h3>
          <div class="roles-item">
            <span class="roles-item-label">角色名称：</span>
            <span>{{ currentItem.roleName }}</span>
          </div>
          <div class="roles-item">
            <span class="roles-item-label">创建时间：</span>
            <span>{{ currentItem.createDate | jsonTimeToDateString }}</span>
          </div>
          <div class="roles-item">
            <span class="roles-item-label">备注：</span>
            <span>{{ currentItem.remark }}</span>
          </div>
        </div>
        <div class="roles-user-wrapper">
          <h3 class="roles-tip">
            <span>关联用户</span>
            <el-button type="primary" size="mini" @click="isShwoCheckUser = true" class="fr" style="margin: 11px 16px 0 0;" v-perm="{ code: 'permission_roles:addUser' }">添加用户</el-button>
          </h3>
          <role-user-list ref="role_user_list" :reqObj="currentItem"></role-user-list>
        </div>
      </div>
    </div>
    <!-- 新增、编辑 -->
    <edit-role :visible.sync="isShowEdit" :roleId="currentId"></edit-role>

    <!-- 添加关联用户 -->
    <check-user-list :visible.sync="isShwoCheckUser" :roleId="currentItem.roleId"></check-user-list>
  </div>
</template>

<script>
import RoleUserList from '@/components/UserListInRoleOrDept'
import EditRole from './components/EditRole'
import CheckUserList from './components/CheckUserList'
import { getRoleList, delRole } from '@/api/permission.js'

export default {
  components: { EditRole, RoleUserList, CheckUserList },
  data () {
    return {
      isShwoCheckUser: false,
      isShowEdit: false,
      currentItem: { roleId: '', roleName: '暂无', remark: '暂无', createDate: new Date() },
      currentId: '',
      searchReqTemp: { roleName: '' },
      searchReq: { },
      loading: false,
      roleList: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created () {
    this.getRoleListFn()
  },
  methods: {
    checkedRoleEvent (item) {
      this.currentItem = Object.assign({}, item)
    },
    toEditEvent (id) {
      this.currentId = ''
      this.$nextTick(() => {
        this.isShowEdit = true
        this.currentId = id
      })
    },
    delEvent (id) {
      this.$confirm('删除角色，也会取消当前角色所关联的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRoleFn(id)
      }).catch(() => {})
    },
    searchEvent () {
      this.page.pageNum = 1
      this.searchReq = Object.assign({}, this.searchReqTemp)
      this.getRoleListFn()
    },
    searchUserList () {
      this.$refs['role_user_list'].getUserListFn()
    },
    async getRoleListFn () {
      this.loading = true
      const req = Object.assign({
        ...(this.searchReq.roleName ? { roleName: this.searchReq.roleName } : null)
      }, this.page)
      const res = await getRoleList(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.roleList = res.data.list
        if (this.roleList.length > 0) this.currentItem = Object.assign({}, this.roleList[0])
        this.total = res.data.total
      } else {
        this.$message.info(res.message)
      }
    },
    async delRoleFn (id) {
      this.loading = true
      const res = await delRole(id)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('删除角色成功')
        this.getRoleListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    handleSizeChange (size) {
      this.page = { pageSize: size, pageNum: 1 }
      this.getRoleListFn()
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.getRoleListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.roles-container {
  display: flex;
  flex-wrap: nowrap;
}
.roles-list-wrapper {
  width: 200px;
  height: calc(100vh - 170px);
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1);
  .roles-list-item {
    padding: 7px 16px;
    line-height: 1.5;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    &:hover {
      background: #f5f6f8;
      color: #008fe4;
    }
  }
}
.active {
  background: #f5f6f8;
  color: #008fe4;
}
.roles-tip {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  font-weight: 700;
  padding-left: 16px;
  background: #f9f9f9;
}
.roles-main {
  width: calc(100% - 215px);
  margin-left: 15px;
  height: calc(100vh - 170px);
}
.roles-info-wrapper {
  height: 230px;
  font-size: 14px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1);
  .roles-item {
    padding: 5px 10px;
  }
  .roles-item-label {
    display: inline-block;
    width: 80px;
    line-height: 1.5;
    text-align: right;
    color: #333;
    font-weight: 600;
    white-space: nowrap;
  }
  .roles-item-content {
    color: #666;
    line-height: 1.5;
  }
}
.roles-user-wrapper{
  margin-top: 15px;
  height: calc(100% - 245px);
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}
</style>
