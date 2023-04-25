<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <div class="login-title">
        <div class="nest-logo">
          <svg-icon name="nest-logo"></svg-icon>
        </div>
        <div>Nest-Admin</div>
      </div>
      <div class="login-content">
        <el-form ref="loginFormRef" :disabled="loading" :model="formData" :rules="loginFormRules">
          <el-form-item prop="account">
            <el-input v-model.trim="formData.account" size="large" placeholder="帐号/邮箱/手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              size="large"
              v-model="formData.password"
              placeholder="密码"
              @keyup.enter="loginEvent"
            ></el-input>
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="loginEvent"> 登录 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import { login, type LoginResult } from '@/api/user'
import { setToken } from '@/utils/cache'

const formData = ref({
  account: '',
  password: ''
})
const loginFormRules = {
  account: [{ required: true, message: '请输入帐号/邮箱/手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const loginFormRef = ref()
const loading = ref<boolean>(false)

const router = useRouter()
const route = useRoute()

const loginEvent = () => {
  if (loginFormRef.value) {
    loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        const res = await login(formData.value)
        loading.value = false
        if (res?.code === 200) {
          const data = res.data as LoginResult
          setToken(data.accessToken, data.refreshToken)
          router.replace((route.query?.redirect || '/') as string)
        } else {
          ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }

  .login-card {
    width: 420px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;

    .login-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50px;
      font-family: 'app-name-font';
      height: 88px;

      .nest-logo {
        margin: 24px 16px 0 0;
      }
    }
    .login-content {
      padding: 20px 50px 50px 50px;
    }

    .el-button {
      width: 100%;
      margin-top: 5px;
    }
  }
}
</style>
