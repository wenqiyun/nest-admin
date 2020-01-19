<template>
  <el-dialog title="密码修改" top="15vh" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" v-loading.fullscreen.lock="loading">
    <el-form ref="updatePwForm" :model="passwordObj" label-width="100px" :rules="updatePwRules">
      <el-form-item label="旧密码：" prop="oldPassword">
        <el-input type="password" v-model="passwordObj.oldPassword"  placeholder="请输入原密码" ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input type="password" v-model="passwordObj.newPassword"  placeholder="请输入新密码，6~20位字符" ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input type="password" v-model="passwordObj.confirmPassword"  placeholder="请输入新密码" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="comfirmUpdatePw">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { removeToken } from '@/utils/auth.js'
import { updatepassword } from '@/api/login.js'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (this.passwordObj.newPassword === '') {
        callback(new Error('请输入密码'))
      } else if (this.passwordObj.newPassword.length > 20 || this.passwordObj.newPassword.length < 6) {
        callback(new Error('请输入6-20个字符'))
      // } else if (!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{9,20}$/.test(this.passwordObj.newPassword)) {
      //   callback(new Error('请输入字母和数字的组合'))
      } else if (this.passwordObj.newPassword === this.passwordObj.oldPassword) {
        callback(new Error('新密码不能与旧密码一致'))
      } else {
        callback()
      }
    }
    const validatePasswordsure = (rule, value, callback) => {
      if (this.passwordObj.confirmPassword === '') {
        callback(new Error('请输入确认密码'))
      } else if (this.passwordObj.newPassword !== this.passwordObj.confirmPassword) {
        callback(new Error('两次新密码输入不一致，请核对'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      passwordObj: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      updatePwRules: {
        oldPassword: [
          { required: true, trigger: 'blur', message: '请输入当前密码' }
        ],
        newPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validatePasswordsure }
        ]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        // 重置数据
        this.passwordObj = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        this.$nextTick(() => {
          this.$refs['updatePwForm'] && this.$refs['updatePwForm'].resetFields()
        })
      }
    }
  },
  methods: {
    comfirmUpdatePw () {
      this.$refs['updatePwForm'].validate((valid) => {
        if (valid) {
          this.updatepasswordFn()
        }
      })
    },
    async updatepasswordFn () {
      this.loading = true
      const res = await updatepassword(this.passwordObj)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('密码修改成功')
        this.dialogFormVisible = false
        removeToken()
        location.reload()
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
