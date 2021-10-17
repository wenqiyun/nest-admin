<template>
  <div class="user-layout-wrapper">
    <div class="login-container">
      <div class="login-container__content">
        <div class="login-form-wrapper">
          <header class="system_label">
            <svg-icon icon-class="logo-small"></svg-icon>
            <h1>Nest Admin</h1>
          </header>
          <el-form ref="loginFormRef" :model="formData" :rules="loginFormRules" class="login-form">
            <el-form-item prop="account">
              <el-input v-model.trim="formData.account" placeholder="帐号/邮箱/手机号"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" v-model="formData.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="display: flex; justify-content: space-between;">
                <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
                <el-button type="text">忘记密码</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="loginEvent">登&nbsp;&nbsp;&nbsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="right-img"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserLogin } from '@/api/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const formData = ref<UserLogin>({ account: '', password: '' })
    const autoLogin = ref<boolean>(false)

    const loginFormRules = ref({
      account: [
        { required: true, message: '请输入帐号/邮箱/手机号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })

    const router = useRouter()
    const loginFormRef = ref()
    // 登录事件
    const loginEvent = () => {
      if (loginFormRef.value) {
        loginFormRef.value.validate((valid: boolean) => {
          if (valid) router.replace('/')
          else {
            return false
          }
        })
      }
    }

    return {
      autoLogin,
      formData,
      loginFormRef,
      loginFormRules,
      loginEvent
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-wrapper {
  position: relative;
  height: 100%;
  background: url(~@/assets/login-bg.png) no-repeat;
  background-size: 100% 100%;

  .login-container {
    height: 100%;
    max-width: 1500px;
    min-width: 1300px;
    margin: 0 auto;

    .login-container__content {
      display: flex;
      height: 100%;
      padding: 0 30px;
      align-items: center;
      justify-content: space-between;
      .right-img {
        width: 800px;
        height: 700px;
        margin-top: 60px;
        background: url(~@/assets/slack-login.png);
        background-size: 100% 100%;
      }
    }
  }
}
.login-form-wrapper {
  height: 400px;
  width: 400px;
  padding: 60px 0 40px 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .system_label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;

    h1 {
      margin-left: 16px;
      margin-bottom: 0;
      font-size: 24px;
      text-align: center;
    }
  }

  .login-form {
    width: 350px;
    margin: 30px auto 0;
  }
}
</style>
