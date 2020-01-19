<template>
  <div>
    <div class="main-header">
      <el-upload action="/api/oss/upload" :headers="uploadHeaders" :show-file-list="false" :on-success="uploadSuccess" >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <el-table :data="fileList" size="medium" v-loading="loading">
      <el-table-column label="文件" align="center">
        <template slot-scope="scope">
          <div style="height: 100px;">
            <img v-lazy="scope.row.url" style="width: auto;height: 100%;border-radius: 3px;" :alt="scope.row.oldName">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center"></el-table-column>
      <el-table-column label="原名称" prop="oldName" align="center"></el-table-column>
      <!-- <el-table-column label="存储位置" prop="location" align="center"></el-table-column> -->
      <el-table-column label="上传时间" align="center">
        <template slot-scope="scope">{{ scope.row.createDate | jsonTimeToDateString }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="perm.del">
        <template slot-scope="scope">
          <el-button type="danger" plain @click="delFileEvent(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background :current-page="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50]" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js'
import { getFileList, delFile } from '@/api/sys.js'

export default {
  data () {
    const perm = { del: this.hasPermission({ code: 'system_oss:del' }) }
    return {
      perm,
      uploadHeaders: { Authorization: getToken() },
      loading: false,
      fileList: [],
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created () {
    this.getFileListFn()
  },
  methods: {
    uploadSuccess () {
      this.page = { pageNum: 1, pageSize: 10 }
      this.getFileListFn()
    },
    delFileEvent (id) {
      this.$confirm('该文件删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delFileFn(id)
      }).catch(() => {})
    },
    async getFileListFn () {
      this.loading = true
      const req = Object.assign({}, this.page)
      const res = await getFileList(req)
      this.loading = false
      if (res.statusCode === 200) {
        this.fileList = res.data.list
        this.total = res.data.total
      } else {
        this.$message.info(res.message)
      }
    },
    async delFileFn (id) {
      this.loading = true
      const res = await delFile(id)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('删除文件成功')
        this.getFileListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    handleSizeChange (size) {
      this.page = { pageSize: size, pageNum: 1 }
      this.getFileListFn()
    },
    handleCurrentChange (current) {
      this.page.pageNum = current
      this.getFileListFn()
    }
  }
}
</script>
