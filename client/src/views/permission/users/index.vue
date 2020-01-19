<template>
  <div>
    <div class="main-header">
      <el-select v-model="searchReqTemp.status" clearable style="width: 100px;">
        <el-option label="使用中" :value="1"></el-option>
        <el-option label="已禁用" :value="0"></el-option>
      </el-select>
      <el-input v-model="searchReqTemp.nickname" clearable style="width: 150px;margin-left: 10px;" placeholder="用户昵称"></el-input>
      <div class="fr">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button type="success" @click="reloadEvent">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :data="userList" size="medium" v-loading="loading">
      <el-table-column prop="account" label="账号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="dept.name" label="部门" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="phoneNum" label="手机" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-badge is-dot :type="scope.row.status ? 'primary' : 'danger'"></el-badge>
          <span style="margin-left: 8px;">{{ scope.row.status ? '使用中' : '已禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.row.createDate | jsonTimeToDateString }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新日期" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.row.updateDate | jsonTimeToDateString }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="perm.edit || perm.updateStatus">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="toEditEvent(scope.row.id)" :disabled="!scope.row.status" v-if="perm.edit">编辑</el-button>
          <el-button :type="scope.row.status ? 'danger' : 'warning'" plain @click="updateStatusEvent(scope.row.id, scope.row.status ? 0 : 1 )" v-if="perm.updateStatus">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background :current-page="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50]" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>

    <!-- 编辑等 -->
    <edit-user :visible.sync="isShowUserEdit" :userId="currentUserId"></edit-user>
  </div>
</template>

<script>
import EditUser from './components/EditUser'
import { getUserList, updateUserStatus } from '@/api/permission.js'

export default {
  components: { EditUser },
  data () {
    const perm = {
      edit: this.hasPermission({ code: 'permission_users:edit' }),
      updateStatus: this.hasPermission({ code: 'permission_users:updateStatus' })
    }
    return {
      perm,
      isShowUserEdit: false,
      currentUserId: '',
      searchReqTemp: { nickname: '', status: '' },
      searchReq: { },
      loading: false,
      userList: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0
    }
  },
  created () {
    this.getUserListFn()
  },
  methods: {
    updateStatusEvent (id, status) {
      this.$confirm(`${status ? '恢复启用后' : '禁用用户后，不可操作本站'}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateUserStatusFn(id, status)
      }).catch(() => {})
    },
    toEditEvent (id) {
      this.currentUserId = id
      this.isShowUserEdit = true
    },
    reloadEvent () {
      this.searchReqTemp = { nickname: '', status: '' }
      this.searchEvent()
    },
    searchEvent () {
      this.page.pageNum = 1
      this.searchReq = Object.assign({}, this.searchReqTemp)
      this.getUserListFn()
    },
    async getUserListFn () {
      this.loading = true
      const req = Object.assign({}, this.page, {
        ...(this.searchReq.nickname ? { nickname: this.searchReq.nickname } : null),
        ...(this.searchReq.status !== '' ? { status: this.searchReq.status } : null)
      })
      const res = await getUserList(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.userList = res.data.list
        this.total = res.data.total
      } else {
        this.$message.info(res.message)
      }
    },
    // status 修改后的状态、 0 1
    async updateUserStatusFn (id, status) {
      const res = await updateUserStatus(id, status)
      if (res.statusCode === 200) {
        this.$message.success(`${status ? '恢复启用' : '禁用'}用户成功`)
        this.getUserListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    handleSizeChange (size) {
      this.page = { pageSize: size, pageNum: 1 }
      this.getUserListFn()
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.getUserListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-badge__content {
  position: initial;
  border: 0;
}
/deep/ .el-badge {
  vertical-align: initial;
}
</style>
