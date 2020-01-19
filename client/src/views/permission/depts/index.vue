<template>
  <div class="dept-container" v-loading="loading">
    <div class="dept-tree-wrapper">
      <el-tree ref="dept_tree" :data="deptTree" highlight-current default-expand-all node-key="id" :props="deptProps" @node-click="treeNodeClickEvent"></el-tree>
    </div>
    <!-- 基础信息，和关联下的用户 -->
    <div class="dept-main">
      <!-- 基础信息 -->
      <div class="dept-form-wapper">
        <div class="dept-action">
          <el-button type="primary" @click="formType = 'edit'" :disabled="currentDept.deptId === '' || formType === 'create'" v-perm="{ code: 'permission_depts:edit' }">编辑</el-button>
          <el-button type="danger" @click="delDeptEvent" :disabled="currentDept.deptId === ''" v-perm="{ code: 'permission_depts:del' }">删除</el-button>
          <el-button @click="createDeptEvent" :disabled="currentDept.deptId === '' || formType === 'edit'" v-perm="{ code: 'permission_depts:create' }">添加</el-button>
        </div>
        <el-form ref="dept_form" :model="currentDept" :rules="rules" :disabled="formType === 'preview'" label-width="100px" style="width: 400px;margin-top:20px;">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model.trim="currentDept.name" placeholder="部门名称"></el-input>
          </el-form-item>
          <el-form-item label="上级部门：">
            <el-button type="text" @click="isSelectedDept = true" :disabled="formType !== 'edit'">{{ this.deptsObj[currentDept.parentId] }}</el-button>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input v-model.number="currentDept.orderNum" placeholder="排序,越大越靠前"></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 400px;" v-show="formType !== 'preview'">
          <el-button type="primary" class="fr" @click="confirmEvent">确认提交</el-button>
          <el-button @click="handleCancelEvent" class="fr" style="margin-right: 10px;">取消</el-button>
        </div>
      </div>
      <!-- 关联用户 -->
      <dept-user-list class="dept-user-list" :reqObj="currentDept"></dept-user-list>
    </div>
    <!-- 选择部门弹窗 -->
    <dept-tree v-model="currentDept.parentId" :visible.sync="isSelectedDept" :deptTree="deptTree"></dept-tree>
  </div>
</template>

<script>
import DeptUserList from '@/components/UserListInRoleOrDept'
import DeptTree from '@/components/DeptTree'
import { arrToTree } from '@/utils/index.js'
import { getDeptList, createDept, updateDept, delDept } from '@/api/permission.js'

export default {
  components: { DeptUserList, DeptTree },
  data () {
    return {
      loading: false,
      deptTree: [],
      deptProps: { label: 'name' },
      deptsObj: { 0: '无' }, // key: deptId value: dept.name
      currentDept: { deptId: '', parentId: 0, name: '', orderNum: '' },
      formType: 'preview', // create, edit
      isSelectedDept: false,
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getDeptListFn()
  },
  methods: {
    treeNodeClickEvent (data) {
      this.currentDept = Object.assign({}, data)
      this.formType = 'preview'
    },
    handleCancelEvent () {
      this.$refs['dept_form'].clearValidate()
      this.currentDept = Object.assign({}, this.$refs['dept_tree'].getCurrentNode())
      this.formType = 'preview'
    },
    createDeptEvent () {
      this.currentDept = { deptId: '', parentId: this.currentDept.deptId, name: '', orderNum: 1 }
      this.formType = 'create'
    },
    confirmEvent () {
      this.$refs['dept_form'].validate((valid) => {
        if (valid) {
          this.createOrUpdateDeptFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delDeptEvent () {
      this.$confirm('删除部门后，该部门下的用户都不可用，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDeptFn()
      }).catch(() => {})
    },
    async getDeptListFn () {
      this.loading = true
      // 重置数据
      this.currentDept = { deptId: '', parentId: 0, name: '', orderNum: '' }
      this.formType = 'preview'
      // 查询
      const res = await getDeptList()
      this.loading = false
      if (res.statusCode === 200) {
        this.deptTree = arrToTree(res.data, { idKey: 'deptId', pidKey: 'parentId' })
        res.data.forEach(v => {
          this.deptsObj[v.deptId] = v.name
        })
      } else {
        this.$message.info(res.message)
      }
    },
    async createOrUpdateDeptFn () {
      this.loading = true
      const req = Object.assign({}, this.currentDept)
      let res
      if (this.formType === 'create') {
        delete req.deptId
        req['delFlag'] = true
        res = await createDept(req)
      } else {
        res = await updateDept(req)
      }
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success(res.message)
        this.getDeptListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    async delDeptFn () {
      const res = await delDept(this.currentDept.deptId)
      if (res.statusCode === 200) {
        this.$message.success('删除成功')
        this.getDeptListFn()
      } else {
        this.$message.info(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dept-container {
  display: flex;
  flex-wrap: nowrap;
}
.dept-tree-wrapper {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}
.dept-main {
  width: calc(100% - 215px);
  margin-left: 15px;
  height: 100%;
}
.dept-form-wapper {
  width: 100%;
  height: 300px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
  .dept-action {
    padding: 10px 20px;
  }
}
.dept-user-list {
  margin-top: 15px;
  height: calc(100% - 315px);
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}
</style>
