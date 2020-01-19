<template>
  <div>
    <el-table :data="userList" v-loading="loading">
      <el-table-column prop="account" label="账号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="dept.name" label="部门" align="center" v-if="!!reqObj.roleId"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="phoneNum" label="手机" align="center"></el-table-column>
      <el-table-column label="操作" align="center" v-if="!!reqObj.roleId && rolePerm.delUser">
        <template slot-scope="scope">
          <el-button type="danger" plain @click="cancelUserRoleRelationEvent(scope.row.id)">取消关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background :current-page="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50]" hide-on-single-page :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
import { getUserList, cancelUserRoleRelation } from '@/api/permission.js'

export default {
  props: {
    reqObj: {
      type: Object, // { deptId, roleId }
      required: true
    }
  },
  data () {
    const rolePerm = { delUser: this.hasPermission({ code: 'permission_roles:delUser' }) }
    return {
      rolePerm,
      loading: false,
      userList: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  watch: {
    reqObj (val) {
      this.userList = []
      this.page = { pageSize: 10, pageNum: 1 }
      this.total = 0
      val && (val.deptId || val.roleId) && this.getUserListFn()
    }
  },
  methods: {
    cancelUserRoleRelationEvent (id) {
      this.$confirm('是否确定取消当前用户关联?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelUserRoleRelationFn(id)
      }).catch(() => {})
    },
    async cancelUserRoleRelationFn (id) {
      const res = await cancelUserRoleRelation(id)
      if (res.statusCode === 200) {
        this.$message.success('取消成功')
        this.getUserListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    async getUserListFn () {
      this.loading = true
      const req = Object.assign({}, this.reqObj, this.page)
      const res = await getUserList(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.userList = res.data.list
        this.total = res.data.total
      } else {
        this.$message.info(res.message)
      }
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getUserListByDeptFn()
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.getUserListByDeptFn()
    }
  }
}
</script>
