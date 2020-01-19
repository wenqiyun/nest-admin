<template>
  <el-dialog title="选择用户" top="10vh" width="400px" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" >
    <ul style="height: 400px;overflow-y: auto;" v-loading="loading">
      <div class="no-data" v-show="userList.length === 0">暂无可配置的用户</div>
      <li v-for="item in userList" @click="checkedUserEvent(item)" :key="item.id" :class="{ 'check-li-active': isChecked(item.id) }" class="check-li">
        <span v-show="isChecked(item.id)"><i class="el-icon-check" ></i></span>
        <span>{{ item.nickname }}</span>
      </li>
    </ul>
    <!-- 分页 -->
    <el-pagination background small :current-page="page.pageNum" :page-size="page.pageSize" layout="total, prev, pager, next" hide-on-single-page :total="total" @current-change="handleCurrentChange"></el-pagination>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserListNotInRoleId, createUserRoleRelation } from '@/api/permission.js'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      loading: false,
      userList: [],
      checkedUserList: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  watch: {
    visible (val) {
      // 重置数据
      this.page = { pageSize: 10, pageNum: 1 }
      this.userList = []
      this.checkedUserList = []
      val && this.roleId && this.getUserListNotInRoleIdFn()
    }
  },
  methods: {
    checkedUserEvent (item) {
      const index = this.checkedUserList.findIndex(v => item.id === v.id)
      index > -1 ? this.checkedUserList.splice(index, 1) : this.checkedUserList.push(item)
    },
    confirmEvent () {
      if (this.checkedUserList.length === 0) {
        this.$message.error('请至少选中一个用户')
        return
      }
      this.$confirm('确定将选中用户关联到当前角色吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.createUserRoleRelationFn()
      }).catch(() => {})
    },
    async createUserRoleRelationFn () {
      this.loading = true
      const req = this.checkedUserList.map(v => { return { roleId: this.roleId, userId: v.id } })
      const res = await createUserRoleRelation(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('关联用户成功')
        this.$parent.searchUserList()
        this.handleClose()
      } else {
        this.$message.info(res.message)
      }
    },
    async getUserListNotInRoleIdFn () {
      this.loading = true
      const req = Object.assign({ roleId: this.roleId }, this.page)
      const res = await getUserListNotInRoleId(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.userList = res.data.list
        this.total = res.data.total
      }
    },
    isChecked (id) {
      return this.checkedUserList.some(v => v.id === id)
    },
    handleClose () {
      this.$emit('update:visible', false)
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.getUserListNotInRoleIdFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.check-li {
  position: relative;
  height: 36px;
  line-height: 35px;
  padding: 0 7px;
  // border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &::before {
    content: " ";
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    height: 1px;
    background: #eee;
  }
  &:first-child::before {
    visibility: hidden;
  }
  &-active {
    background: #e8f4d9;
    /deep/ .el-icon-check {
      color: #39b54a;
      font-weight: 700;
    }
  }
}
.no-data {
width: 100%;
  color: #aaa;
  text-align: center;
}
</style>
