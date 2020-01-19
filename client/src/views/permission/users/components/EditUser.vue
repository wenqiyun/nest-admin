<template>
  <el-dialog title="用户信息" top="10vh" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
    <el-form ref="edit_user_Form" :model="user" :rules="rules" label-position="right" label-width="80px">
      <el-form-item label="账户：" prop="account">
        <el-input v-model="user.account" clearable placeholder="账户"></el-input>
      </el-form-item>
      <el-form-item label="头像：">
        <div class="avatar" v-lazy:background-image="user.avatar" @click="showAvatarUpload = true">
        </div>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="user.nickname" clearable placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="user.email" clearable placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="phoneNum">
        <el-input v-model="user.phoneNum" clearable placeholder="手机"></el-input>
      </el-form-item>
      <el-form-item label="部门：">
        <el-button type="text" @click="isSelectedDept = true">{{ user.dept.name }}</el-button>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="userRoles" multiple placeholder="用户拥有的角色（多选）">
          <el-option v-for="item in roleList" :label="item.roleName" :value="item.roleId" :key="item.roleId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 头像上传 -->
    <avatar-upload v-model="showAvatarUpload" :width="100" :height="100" url="/api/oss/upload" field="file" :headers="uploadHeaders" @crop-upload-success="uploadSuccessEvent"></avatar-upload>
    <!-- 部门树 -->
    <dept-tree :visible.sync="isSelectedDept" :deptTree="deptTree" @checked-success="checkedDeptSuccessEvent"></dept-tree>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DeptTree from '@/components/DeptTree'
import AvatarUpload from 'vue-image-crop-upload'
import { arrToTree } from '@/utils/index.js'
import { getToken } from '@/utils/auth.js'
import { getUserInfo, updateUserInfo, getRoleAllList, getDeptList } from '@/api/permission.js'

export default {
  components: { AvatarUpload, DeptTree },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    userId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    // ^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[01356789]\d{2}|6[2567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$
    const validatePhoneNum = (rule, value, callback) => {
      if (!/^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[01356789]\d{2}|6[2567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      isSelectedDept: false,
      showAvatarUpload: false,
      uploadHeaders: { Authorization: getToken() },
      loading: false,
      roleList: [],
      user: {
        account: '',
        avatar: '',
        deptId: 0,
        email: '',
        nickname: '',
        phoneNum: '',
        status: true,
        dept: { name: '' }
      },
      userRoles: [],
      deptTree: [],
      deptsObj: {},
      rules: {
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }

        ],
        phoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        // 重置数据
        this.user = {
          account: '',
          avatar: '',
          deptId: 0,
          email: '',
          nickname: '',
          phoneNum: '',
          status: true,
          dept: { name: '' }
        }
        this.$nextTick(() => { this.$refs['edit_user_Form'] && this.$refs['edit_user_Form'].clearValidate() })
        this.userId && this.init()
      }
    }
  },
  created () {

  },
  methods: {
    confirmEvent () {
      this.$refs['edit_user_Form'].validate((valid) => {
        if (valid) {
          this.saveOrUpdateFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadSuccessEvent (res) {
      if (res.statusCode === 200) {
        this.user.avatar = res.data
        setTimeout(() => {
          this.showAvatarUpload = false
        }, 500)
      } else {
        this.$message.info(res.message)
      }
    },
    checkedDeptSuccessEvent (dept) {
      const userDept = Object.assign(dept)
      delete dept.children
      this.user.dept = userDept
    },
    // 初始化
    async init () {
      this.loading = true
      if (this.roleList.length === 0) await this.getRoleAllListFn()
      if (this.deptTree.length === 0) await this.getDeptListFn()
      this.loading = false
      await this.getUserInfoFn()
    },
    async saveOrUpdateFn () {
      // 编辑从数据库查询出来多了一些字段，createDate, updateDate, 而这些是不需要传给后端
      const req = {
        id: this.userId,
        account: this.user.account,
        avatar: this.user.avatar,
        deptId: this.user.dept.deptId,
        email: this.user.email,
        nickname: this.user.nickname,
        phoneNum: this.user.phoneNum,
        status: true,
        userRoles: this.userRoles.map(v => { return { roleId: v, userId: this.userId } })
      }
      const res = await updateUserInfo(req)
      if (res.statusCode === 200) {
        this.$message.success(res.message)
        this.$parent.getUserListFn()
        this.handleClose()
      } else {
        this.$message.info(res.message)
      }
    },
    async getUserInfoFn () {
      this.loading = true
      const res = await getUserInfo(this.userId)
      this.loading = false
      if (res.statusCode === 200) {
        this.user = res.data
        this.userRoles = this.user.userRoles.map(v => v.roleId)
      } else {
        this.$message.info(res.message)
      }
    },
    async getDeptListFn () {
      // 查询
      const res = await getDeptList()
      this.loading = false
      if (res.statusCode === 200) {
        this.deptTree = arrToTree(res.data, { idKey: 'deptId', pidKey: 'parentId' })
        const deptObj = {}
        res.data.forEach(v => {
          deptObj[v.deptId] = v
        })
        this.deptsObj = deptObj
      } else {
        this.$message.info(res.message)
      }
    },
    async getRoleAllListFn () {
      const res = await getRoleAllList()
      if (res.statusCode === 200) {
        this.roleList = res.data
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

<style lang="scss" scoped>
.avatar {
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-color: #F6F8F9;
}
</style>
