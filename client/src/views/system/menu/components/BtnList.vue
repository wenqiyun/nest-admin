<template>
  <div>
    <div style="padding: 10px 20px;">
      <el-button @click="editBtnEvent()" v-if="perm.create"> 添加</el-button>
    </div>
    <el-table :data="btnList" v-loading="loading" >
      <el-table-column label="按钮名称" prop="name" align="center"></el-table-column>
      <el-table-column label="标识" prop="code" align="center"></el-table-column>
      <el-table-column label="权限集合" prop="perms" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" v-if="perm.edit || perm.del">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="editBtnEvent(scope.row.menuId)" v-if="perm.edit">编辑</el-button>
          <el-button type="danger" plain @click="delBtnEvent(scope.row.menuId)" v-if="perm.del">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 or 新增 -->
    <edit-btn :visible.sync="isShowEditBtn" :idObj="{ menuId, btnId: currentBtnId }"></edit-btn>
  </div>
</template>

<script>
import EditBtn from './EditBtn'
import { getBtnList, delMenu } from '@/api/sys.js'

export default {
  components: { EditBtn },
  props: {
    menuId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    const perm = {
      edit: this.hasPermission({ code: 'system_menu:edit' }),
      del: this.hasPermission({ code: 'system_menu:del' }),
      create: this.hasPermission({ code: 'system_menu:create' })
    }
    return {
      perm,
      currentBtnId: '',
      isShowEditBtn: false,
      loading: false,
      btnList: []
    }
  },
  watch: {
    menuId (val) {
      this.menuList = []
      val && this.getBtnListFn()
    }
  },
  methods: {
    editBtnEvent (id) {
      this.currentBtnId = ''
      this.isShowEditBtn = true
      this.$nextTick(() => {
        this.currentBtnId = id
      })
    },
    delBtnEvent (id) {
      this.$confirm('删除按钮后，权限可能需要重新配置，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBtnFn(id)
      }).catch(() => {})
    },
    async getBtnListFn () {
      this.loading = true
      const res = await getBtnList(this.menuId)
      this.loading = false
      if (res.statusCode === 200) {
        this.btnList = res.data
      } else {
        this.$message.info(res.message)
      }
    },
    async delBtnFn (id) {
      this.loading = true
      const res = await delMenu(id)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('删除成功')
        this.getBtnList()
      } else {
        this.$message.info(res.message)
      }
    }
  }
}
</script>
