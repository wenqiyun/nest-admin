<template>
  <el-dialog title="角色编辑" top="5vh" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="role_form" :model="role" :rules="rules" label-width="100px" style="min-height: 500px;" v-loading="loading">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model.trim="role.roleName" show-word-limit :maxlength="30" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色备注：" prop="remark">
        <el-input type="textarea" v-model.trim="role.remark" show-word-limit :maxlength="100" :rows="4" placeholder="角色备注"></el-input>
      </el-form-item>
      <el-form-item label="菜单授权：">
        <el-tree ref="role_menu_tree" :data="menuTree" highlight-current default-expand-all show-checkbox check-strictly node-key="menuId" :props="{ label: 'name' }"></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { arrToTree } from '@/utils/index.js'
import { createRole, getRoleInfo, updateRole } from '@/api/permission.js'
import { getMenuList } from '@/api/sys.js'

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
      role: {
        roleName: '',
        remark: ''
      },
      menuTree: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMenuListFn()
  },
  watch: {
    visible (val) {
      this.$nextTick(() => {
        !this.roleId && this.$refs['role_menu_tree'] && this.$refs['role_menu_tree'].setCheckedKeys([])
        val && this.roleId && this.getRoleInfoFn()
      })
    }
  },
  methods: {
    confirmEvent () {
      this.$refs['role_form'].validate((valid) => {
        if (valid) {
          this.createOrUpdateRoleFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getRoleInfoFn () {
      this.loading = true
      const res = await getRoleInfo(this.roleId)
      this.loading = false
      if (res.statusCode === 200) {
        this.role = res.data
        this.$refs['role_menu_tree'] && this.$refs['role_menu_tree'].setCheckedKeys(this.role.roleMenus.map(v => v.menuId))
      } else {
        this.$message.info(res.message)
      }
    },
    async createOrUpdateRoleFn () {
      this.loading = true
      // 更新多了 createDate 属性，后端报错
      const req = { roleName: this.role.roleName, remark: this.role.remark, deptId: this.role.deptId } // Object.assign()
      req['roleMenus'] = this.$refs['role_menu_tree'].getCheckedNodes().map(v => { return { menuId: v.menuId } })
      let res
      if (this.role.roleId) {
        req['roleId'] = this.role.roleId
        res = await updateRole(req)
      } else {
        res = await createRole(req)
      }
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success(req.roleId ? '更新角色成功' : '创建角色成功')
        this.$parent.getRoleListFn()
        this.handleClose()
      } else {
        this.$message.info(res.message)
      }
    },
    async getMenuListFn () {
      this.loading = true
      const res = await getMenuList()
      this.loading = false
      if (res.statusCode === 200) {
        this.menuTree = arrToTree(res.data, { idKey: 'menuId', pidKey: 'parentId' })
      } else {
        this.$message.info(res.message)
      }
    },
    handleClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
